import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Category {
  id: string;
  nombre: string; // HU #1 especifica "nombre"
  descripcion: string; // HU #1 especifica "descripcion"
  fechaCreacion: Date;
  activo: boolean;
}

export interface CreateCategoryRequest {
  nombre: string;
  descripcion: string;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category?: Category;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categories = signal<Category[]>([
    {
      id: '#CAT-2025001',
      nombre: 'Casas de lujo',
      descripcion: 'Propiedades residenciales con acabados de lujo y amenidades exclusivas',
      fechaCreacion: new Date('2025-01-01'),
      activo: true
    },
    {
      id: '#CAT-2025002',
      nombre: 'Apartamentos',
      descripcion: 'Espacios modernos y urbanos ideales para la vida en la ciudad',
      fechaCreacion: new Date('2025-01-02'),
      activo: true
    },
    {
      id: '#CAT-2025003',
      nombre: 'Casas campestres',
      descripcion: 'Propiedades rurales con amplio terreno y tranquilidad natural',
      fechaCreacion: new Date('2025-01-03'),
      activo: true
    }
  ]);

  // Exponer categorías como readonly
  public readonly categoriesList = this.categories.asReadonly();

  /**
   * HU #1: Validar que el nombre de la categoría sea único
   * Esta validación debe ejecutarse antes de crear una nueva categoría
   */
  isNameUnique(nombre: string, excludeId?: string): Observable<boolean> {
    // Simular llamada a API con delay
    return of(this.checkNameUniqueness(nombre, excludeId)).pipe(delay(300));
  }

  /**
   * HU #1: Verificación interna de unicidad de nombres
   * Compara el nombre ignorando mayúsculas/minúsculas y espacios extras
   */
  private checkNameUniqueness(nombre: string, excludeId?: string): boolean {
    const normalizedName = this.normalizeName(nombre);
    const currentCategories = this.categories();
    
    return !currentCategories.some(category => {
      // Excluir la categoría que se está editando
      if (excludeId && category.id === excludeId) {
        return false;
      }
      
      return this.normalizeName(category.nombre) === normalizedName;
    });
  }

  /**
   * Normalizar nombre para comparación de unicidad
   * Convierte a minúsculas y elimina espacios extra
   */
  private normalizeName(nombre: string): string {
    return nombre.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * HU #1: Crear nueva categoría con validación de unicidad
   */
  createCategory(request: CreateCategoryRequest): Observable<CategoryResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validar unicidad del nombre
        if (!this.checkNameUniqueness(request.nombre)) {
          observer.next({
            success: false,
            message: 'El nombre de la categoría ya existe. Por favor, ingrese un nombre único.'
          });
          observer.complete();
          return;
        }

        // Crear nueva categoría
        const newCategory: Category = {
          id: this.generateCategoryId(),
          nombre: request.nombre.trim(),
          descripcion: request.descripcion.trim(),
          fechaCreacion: new Date(),
          activo: true
        };

        // Actualizar lista de categorías
        const currentCategories = this.categories();
        this.categories.set([newCategory, ...currentCategories]);

        observer.next({
          success: true,
          message: 'Categoría creada exitosamente',
          category: newCategory
        });
        observer.complete();
      }, 500); // Simular latencia de red
    });
  }

  /**
   * Obtener todas las categorías activas
   */
  getCategories(): Observable<Category[]> {
    return of(this.categories().filter(cat => cat.activo)).pipe(delay(200));
  }

  /**
   * Obtener categoría por ID
   */
  getCategoryById(id: string): Observable<Category | null> {
    const category = this.categories().find(cat => cat.id === id && cat.activo);
    return of(category || null).pipe(delay(200));
  }

  /**
   * Actualizar categoría existente con validación de unicidad
   */
  updateCategory(id: string, request: CreateCategoryRequest): Observable<CategoryResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validar que la categoría existe
        const categories = this.categories();
        const categoryIndex = categories.findIndex(cat => cat.id === id);
        
        if (categoryIndex === -1) {
          observer.next({
            success: false,
            message: 'Categoría no encontrada'
          });
          observer.complete();
          return;
        }

        // Validar unicidad del nombre (excluyendo la categoría actual)
        if (!this.checkNameUniqueness(request.nombre, id)) {
          observer.next({
            success: false,
            message: 'El nombre de la categoría ya existe. Por favor, ingrese un nombre único.'
          });
          observer.complete();
          return;
        }

        // Actualizar categoría
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          nombre: request.nombre.trim(),
          descripcion: request.descripcion.trim()
        };
        
        this.categories.set(updatedCategories);

        observer.next({
          success: true,
          message: 'Categoría actualizada exitosamente',
          category: updatedCategories[categoryIndex]
        });
        observer.complete();
      }, 500);
    });
  }

  /**
   * Eliminar categoría (soft delete)
   */
  deleteCategory(id: string): Observable<CategoryResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const categories = this.categories();
        const categoryIndex = categories.findIndex(cat => cat.id === id);
        
        if (categoryIndex === -1) {
          observer.next({
            success: false,
            message: 'Categoría no encontrada'
          });
          observer.complete();
          return;
        }

        // Marcar como inactiva
        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          activo: false
        };
        
        this.categories.set(updatedCategories);

        observer.next({
          success: true,
          message: 'Categoría eliminada exitosamente'
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * Generar ID único para nueva categoría
   */
  private generateCategoryId(): string {
    const year = new Date().getFullYear();
    const categories = this.categories();
    const maxNumber = categories.reduce((max, cat) => {
      const match = cat.id.match(/#CAT-(\d{4})(\d{3})/);
      if (match && match[1] === year.toString()) {
        return Math.max(max, parseInt(match[2]));
      }
      return max;
    }, 0);
    
    return `#CAT-${year}${String(maxNumber + 1).padStart(3, '0')}`;
  }
}
