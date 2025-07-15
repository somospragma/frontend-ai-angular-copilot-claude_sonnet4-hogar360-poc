import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LocalStorageService } from './local-storage.service';
import { Category, CreateCategoryRequest, CategoryResponse, SearchCategoryParams } from '../interfaces/category.interface';

export { Category, CreateCategoryRequest, SearchCategoryParams };

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly localStorageService = inject(LocalStorageService);
  
  // Signals para manejo de estado
  readonly categories = signal<Category[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    // Inicializar categorías con datos del localStorage
    this.categories.set(this.localStorageService.getCategories());
    
    // Suscribirse a cambios en el localStorage
    this.localStorageService.categories$.subscribe(categories => {
      this.categories.set(categories);
    });
  }

  /**
   * HU #1: Crear nueva categoría con validación
   */
  createCategory(categoryData: CreateCategoryRequest): Observable<CategoryResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validaciones
        const validationErrors = this.validateCategory(categoryData);
        if (validationErrors.length > 0) {
          observer.next({
            success: false,
            message: validationErrors.join(', ')
          });
          observer.complete();
          return;
        }

        // Verificar que el nombre no se repita
        if (this.isCategoryNameExists(categoryData.nombre)) {
          observer.next({
            success: false,
            message: 'El nombre de la categoría ya existe'
          });
          observer.complete();
          return;
        }

        // Crear nueva categoría usando LocalStorageService
        const newCategory = this.localStorageService.addCategory(categoryData);

        observer.next({
          success: true,
          message: 'Categoría creada exitosamente',
          category: newCategory
        });
        observer.complete();
      }, 500);
    });
  }

  /**
   * HU #2: Obtener todas las categorías
   */
  getCategories(): Observable<Category[]> {
    return of(this.localStorageService.getCategories()).pipe(
      delay(300)
    );
  }

  /**
   * HU #3: Buscar categorías con parámetros
   */
  searchCategories(params: SearchCategoryParams = {}): Observable<Category[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const allCategories = this.localStorageService.getCategories();
        let filteredCategories = allCategories;

        // Aplicar filtros
        if (params.texto) {
          const searchText = params.texto.toLowerCase();
          filteredCategories = filteredCategories.filter(category =>
            category.nombre.toLowerCase().includes(searchText) ||
            category.descripcion.toLowerCase().includes(searchText)
          );
        }

        // Aplicar ordenamiento
        if (params.ordenarPor) {
          filteredCategories.sort((a, b) => {
            const aValue = a[params.ordenarPor!];
            const bValue = b[params.ordenarPor!];
            
            if (params.ordenAscendente === false) {
              return bValue.localeCompare(aValue);
            }
            return aValue.localeCompare(bValue);
          });
        }

        observer.next(filteredCategories);
        observer.complete();
      }, 300);
    });
  }

  /**
   * HU #4: Obtener categoría por ID
   */
  getCategoryById(id: number): Observable<Category | null> {
    return of(this.localStorageService.getCategoryById(id)).pipe(
      delay(200)
    );
  }

  /**
   * HU #5: Actualizar categoría existente
   */
  updateCategory(id: number, categoryData: CreateCategoryRequest): Observable<CategoryResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validaciones
        const validationErrors = this.validateCategory(categoryData);
        if (validationErrors.length > 0) {
          observer.next({
            success: false,
            message: validationErrors.join(', ')
          });
          observer.complete();
          return;
        }

        // Verificar que el nombre no se repita (excluyendo el actual)
        if (this.isCategoryNameExists(categoryData.nombre, id)) {
          observer.next({
            success: false,
            message: 'El nombre de la categoría ya existe'
          });
          observer.complete();
          return;
        }

        // Actualizar categoría usando LocalStorageService
        const updatedCategory = this.localStorageService.updateCategory(id, categoryData);

        observer.next({
          success: true,
          message: 'Categoría actualizada exitosamente',
          category: updatedCategory
        });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Eliminar categoría (soft delete)
   */
  deleteCategory(id: number): Observable<CategoryResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          this.localStorageService.deleteCategory(id);
          
          observer.next({
            success: true,
            message: 'Categoría eliminada exitosamente'
          });
          observer.complete();
        } catch (error) {
          console.error('Error deleting category:', error);
          observer.next({
            success: false,
            message: error instanceof Error ? error.message : 'Error al eliminar la categoría'
          });
          observer.complete();
        }
      }, 500);
    });
  }

  /**
   * Validar datos de categoría
   */
  private validateCategory(categoryData: CreateCategoryRequest): string[] {
    const errors: string[] = [];

    // Validar nombre
    if (!categoryData.nombre || categoryData.nombre.trim().length === 0) {
      errors.push('El nombre es requerido');
    } else if (categoryData.nombre.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    // Validar descripción
    if (!categoryData.descripcion || categoryData.descripcion.trim().length === 0) {
      errors.push('La descripción es requerida');
    } else if (categoryData.descripcion.length > 200) {
      errors.push('La descripción no puede exceder 200 caracteres');
    }

    return errors;
  }

  /**
   * Verificar si un nombre de categoría ya existe
   */
  private isCategoryNameExists(nombre: string, excludeId?: number): boolean {
    const categories = this.localStorageService.getCategories();
    return categories.some(category => 
      category.nombre.toLowerCase() === nombre.toLowerCase() && 
      (!excludeId || category.id !== excludeId)
    );
  }

  /**
   * Verificar si un nombre de categoría es único (para validadores asíncronos)
   */
  isNameUnique(nombre: string, excludeId?: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const categories = this.localStorageService.getCategories();
        const excludeIdNumber = excludeId ? Number(excludeId) : undefined;
        
        const exists = categories.some(category => 
          category.nombre.toLowerCase() === nombre.toLowerCase() && 
          (!excludeIdNumber || category.id !== excludeIdNumber)
        );
        
        observer.next(!exists); // Retorna true si es único (no existe)
        observer.complete();
      }, 200);
    });
  }
}
