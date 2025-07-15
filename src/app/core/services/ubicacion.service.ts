import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { LocalStorageService } from './local-storage.service';
import { Ubicacion, CreateUbicacionRequest, UbicacionResponse, SearchUbicacionParams, SearchUbicacionResponse } from '../interfaces/ubicacion.interface';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private readonly localStorageService = inject(LocalStorageService);
  
  // Signals para manejo de estado
  readonly ubicaciones = signal<Ubicacion[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    // Inicializar ubicaciones con datos del localStorage
    this.ubicaciones.set(this.localStorageService.getUbicaciones());
    
    // Suscribirse a cambios en el localStorage
    this.localStorageService.ubicaciones$.subscribe(ubicaciones => {
      this.ubicaciones.set(ubicaciones);
    });
  }

  /**
   * HU #3: Crear nueva ubicación con validación
   */
  createUbicacion(ubicacionData: CreateUbicacionRequest): Observable<UbicacionResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validaciones
        const validationErrors = this.validateUbicacion(ubicacionData);
        if (validationErrors.length > 0) {
          observer.next({
            success: false,
            message: validationErrors.join(', ')
          } as UbicacionResponse);
          observer.complete();
          return;
        }

        // Verificar que el departamento no se repita usando LocalStorageService
        if (this.isDepartamentoExists(ubicacionData.departamento)) {
          observer.next({
            success: false,
            message: 'El departamento ya existe'
          } as UbicacionResponse);
          observer.complete();
          return;
        }

        // Crear nueva ubicación usando LocalStorageService
        const nuevaUbicacion = this.localStorageService.addUbicacion(ubicacionData);

        observer.next({
          success: true,
          message: 'Ubicación creada exitosamente',
          ubicacion: nuevaUbicacion
        } as UbicacionResponse);
        observer.complete();
      }, 500);
    });
  }

  /**
   * HU #4: Obtener todas las ubicaciones
   */
  getUbicaciones(): Observable<Ubicacion[]> {
    return of(this.localStorageService.getUbicaciones()).pipe(
      delay(300)
    );
  }

  /**
   * HU #5: Buscar ubicaciones con parámetros
   */
  searchUbicaciones(params: SearchUbicacionParams = {}): Observable<SearchUbicacionResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const allUbicaciones = this.localStorageService.getUbicaciones();
        let filteredUbicaciones = allUbicaciones;

        // Aplicar filtros
        if (params.texto) {
          const searchText = params.texto.toLowerCase();
          filteredUbicaciones = filteredUbicaciones.filter(ubicacion =>
            ubicacion.ciudad.toLowerCase().includes(searchText) ||
            ubicacion.departamento.toLowerCase().includes(searchText) ||
            ubicacion.descripcionCiudad.toLowerCase().includes(searchText) ||
            ubicacion.descripcionDepartamento.toLowerCase().includes(searchText)
          );
        }

        // Aplicar ordenamiento
        if (params.ordenarPor) {
          filteredUbicaciones.sort((a, b) => {
            const aValue = a[params.ordenarPor!];
            const bValue = b[params.ordenarPor!];
            
            if (params.ordenAscendente === false) {
              return bValue.localeCompare(aValue);
            }
            return aValue.localeCompare(bValue);
          });
        }

        // Aplicar paginación
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUbicaciones = filteredUbicaciones.slice(startIndex, endIndex);

        observer.next({
          ubicaciones: paginatedUbicaciones,
          total: filteredUbicaciones.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(filteredUbicaciones.length / pageSize)
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * HU #6: Obtener ubicación por ID
   */
  getUbicacionById(id: number): Observable<Ubicacion | null> {
    return of(this.localStorageService.getUbicacionById(id)).pipe(
      delay(200)
    );
  }

  /**
   * HU #7: Actualizar ubicación existente
   */
  updateUbicacion(id: number, ubicacionData: CreateUbicacionRequest): Observable<UbicacionResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Validaciones
        const validationErrors = this.validateUbicacion(ubicacionData);
        if (validationErrors.length > 0) {
          observer.next({
            success: false,
            message: validationErrors.join(', ')
          } as UbicacionResponse);
          observer.complete();
          return;
        }

        // Verificar que el departamento no se repita (excluyendo el actual)
        if (this.isDepartamentoExists(ubicacionData.departamento, id)) {
          observer.next({
            success: false,
            message: 'El departamento ya existe'
          } as UbicacionResponse);
          observer.complete();
          return;
        }

        // Actualizar ubicación usando LocalStorageService
        const updatedUbicacion = this.localStorageService.updateUbicacion(id, ubicacionData);

        observer.next({
          success: true,
          message: 'Ubicación actualizada exitosamente',
          ubicacion: updatedUbicacion
        } as UbicacionResponse);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Eliminar ubicación (soft delete)
   */
  deleteUbicacion(id: number): Observable<UbicacionResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        try {
          this.localStorageService.deleteUbicacion(id);
          
          observer.next({
            success: true,
            message: 'Ubicación eliminada exitosamente'
          } as UbicacionResponse);
          observer.complete();
        } catch (error) {
          observer.next({
            success: false,
            message: 'Error al eliminar la ubicación'
          } as UbicacionResponse);
          observer.complete();
        }
      }, 500);
    });
  }

  /**
   * Verificar si un departamento ya existe
   */
  isDepartamentoExists(departamento: string, excludeId?: number): boolean {
    const ubicaciones = this.localStorageService.getUbicaciones();
    return ubicaciones.some(ubicacion => 
      ubicacion.departamento.toLowerCase() === departamento.toLowerCase() && 
      (!excludeId || ubicacion.id !== excludeId)
    );
  }

  /**
   * Validar datos de ubicación
   */
  private validateUbicacion(ubicacionData: CreateUbicacionRequest): string[] {
    const errors: string[] = [];

    // Validar ciudad
    if (!ubicacionData.ciudad || ubicacionData.ciudad.trim().length === 0) {
      errors.push('La ciudad es requerida');
    } else if (ubicacionData.ciudad.length > 50) {
      errors.push('La ciudad no puede exceder 50 caracteres');
    }

    // Validar departamento
    if (!ubicacionData.departamento || ubicacionData.departamento.trim().length === 0) {
      errors.push('El departamento es requerido');
    } else if (ubicacionData.departamento.length > 50) {
      errors.push('El departamento no puede exceder 50 caracteres');
    }

    // Validar descripción ciudad
    if (!ubicacionData.descripcionCiudad || ubicacionData.descripcionCiudad.trim().length === 0) {
      errors.push('La descripción de la ciudad es requerida');
    } else if (ubicacionData.descripcionCiudad.length > 200) {
      errors.push('La descripción de la ciudad no puede exceder 200 caracteres');
    }

    // Validar descripción departamento
    if (!ubicacionData.descripcionDepartamento || ubicacionData.descripcionDepartamento.trim().length === 0) {
      errors.push('La descripción del departamento es requerida');
    } else if (ubicacionData.descripcionDepartamento.length > 200) {
      errors.push('La descripción del departamento no puede exceder 200 caracteres');
    }

    return errors;
  }
}

export { Ubicacion, CreateUbicacionRequest, SearchUbicacionParams };
