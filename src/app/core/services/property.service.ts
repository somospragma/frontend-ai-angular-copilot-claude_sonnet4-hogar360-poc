import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { 
  Property, 
  PropertyRequest, 
  PropertyResponse, 
  PropertySearchParams
} from '../interfaces/property.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly localStorageService = inject(LocalStorageService);
  
  // Signals para el estado reactivo
  readonly properties = signal<Property[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * HU #6: Publicar casa (solo vendedor)
   * Crea una nueva propiedad
   */
  createProperty(property: PropertyRequest): Observable<Property> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const newProperty = this.localStorageService.addProperty(property);
      this.loading.set(false);
      
      // Actualizar el signal con todas las propiedades
      this.properties.set(this.localStorageService.getProperties());
      
      return of(newProperty).pipe(delay(300)); // Simular delay de API
    } catch (error) {
      this.setError('Error al crear la propiedad');
      // Retornar un observable vacío que falle
      return of().pipe(
        delay(300),
        map(() => { throw error; })
      );
    }
  }

  /**
   * HU #7: Listar casas (todos los roles)
   * Obtiene la lista paginada de propiedades con filtros
   */
  getProperties(filters: PropertySearchParams = {}): Observable<PropertyResponse> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(300), // Simular delay de API
      map(() => {
        let properties = this.localStorageService.getProperties();
        
        // Aplicar filtros
        if (filters.ubicacion_id) {
          properties = properties.filter(p => p.ubicacion_id === filters.ubicacion_id);
        }
        if (filters.categoria_id) {
          properties = properties.filter(p => p.categoria_id === filters.categoria_id);
        }
        if (filters.cantidad_cuartos) {
          properties = properties.filter(p => p.cantidad_cuartos >= filters.cantidad_cuartos!);
        }
        if (filters.cantidad_banos) {
          properties = properties.filter(p => p.cantidad_banos >= filters.cantidad_banos!);
        }
        if (filters.precio_minimo) {
          properties = properties.filter(p => p.precio >= filters.precio_minimo!);
        }
        if (filters.precio_maximo) {
          properties = properties.filter(p => p.precio <= filters.precio_maximo!);
        }

        // Ordenamiento
        if (filters.sortBy) {
          properties = properties.sort((a, b) => {
            const field = filters.sortBy as keyof Property;
            const aVal = a[field];
            const bVal = b[field];
            
            if (filters.sortOrder === 'desc') {
              if (aVal > bVal) return -1;
              if (aVal < bVal) return 1;
              return 0;
            }
            if (aVal > bVal) return 1;
            if (aVal < bVal) return -1;
            return 0;
          });
        }

        // Paginación
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProperties = properties.slice(startIndex, endIndex);

        this.loading.set(false);
        this.properties.set(paginatedProperties);

        return {
          data: paginatedProperties,
          total: properties.length,
          page,
          limit,
          totalPages: Math.ceil(properties.length / limit)
        };
      })
    );
  }

  /**
   * Obtener propiedad por ID
   */
  getPropertyById(id: number): Observable<Property> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(200),
      map(() => {
        const property = this.localStorageService.getPropertyById(id);
        this.loading.set(false);
        
        if (!property) {
          this.setError('Propiedad no encontrada');
          throw new Error('Propiedad no encontrada');
        }
        
        return property;
      })
    );
  }

  /**
   * Actualizar propiedad (solo vendedor propietario)
   */
  updateProperty(id: number, property: PropertyRequest): Observable<Property> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(300),
      map(() => {
        const updatedProperty = this.localStorageService.updateProperty(id, property);
        this.loading.set(false);
        
        // Actualizar el signal con todas las propiedades
        this.properties.set(this.localStorageService.getProperties());
        
        return updatedProperty;
      })
    );
  }

  /**
   * Eliminar propiedad (solo vendedor propietario)
   */
  deleteProperty(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(300),
      map(() => {
        this.localStorageService.deleteProperty(id);
        this.loading.set(false);
        
        // Actualizar el signal con todas las propiedades
        this.properties.set(this.localStorageService.getProperties());
      })
    );
  }

  /**
   * Obtener propiedades por vendedor
   */
  getPropertiesByVendedor(vendedorId: number): Observable<Property[]> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(200),
      map(() => {
        const properties = this.localStorageService.getProperties()
          .filter(p => p.vendedor_id === vendedorId);
        
        this.loading.set(false);
        return properties;
      })
    );
  }

  /**
   * Obtener propiedades del vendedor actual (para el componente de horarios)
   */
  getMyProperties(): Observable<Property[]> {
    // Aquí deberías obtener el ID del vendedor actual del AuthService
    // Por ahora, devuelvo todas las propiedades
    return of(null).pipe(
      delay(200),
      map(() => {
        const properties = this.localStorageService.getProperties();
        this.loading.set(false);
        return properties;
      })
    );
  }

  /**
   * Actualiza el estado local de propiedades
   */
  setProperties(properties: Property[]): void {
    this.properties.set(properties);
  }

  /**
   * Manejo de errores
   */
  setError(error: string): void {
    this.error.set(error);
    this.loading.set(false);
  }

  /**
   * Limpiar estado de loading
   */
  clearLoading(): void {
    this.loading.set(false);
  }
}
