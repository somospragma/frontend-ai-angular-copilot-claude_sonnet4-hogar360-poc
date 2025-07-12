import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
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
  private readonly http = inject(HttpClient);
  
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

    return this.http.post<Property>(`${API_ENDPOINTS.PROPERTIES}`, property);
  }

  /**
   * HU #7: Listar casas (todos los roles)
   * Obtiene la lista paginada de propiedades con filtros
   */
  getProperties(filters: PropertySearchParams = {}): Observable<PropertyResponse> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.ubicacion_id) params = params.set('ubicacion_id', filters.ubicacion_id.toString());
    if (filters.categoria_id) params = params.set('categoria_id', filters.categoria_id.toString());
    if (filters.cantidad_cuartos) params = params.set('cantidad_cuartos', filters.cantidad_cuartos.toString());
    if (filters.cantidad_banos) params = params.set('cantidad_banos', filters.cantidad_banos.toString());
    if (filters.precio_minimo) params = params.set('precio_minimo', filters.precio_minimo.toString());
    if (filters.precio_maximo) params = params.set('precio_maximo', filters.precio_maximo.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<PropertyResponse>(`${API_ENDPOINTS.PROPERTIES}`, { params });
  }

  /**
   * Obtener propiedad por ID
   */
  getPropertyById(id: number): Observable<Property> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Property>(`${API_ENDPOINTS.PROPERTIES}/${id}`);
  }

  /**
   * Actualizar propiedad (solo vendedor propietario)
   */
  updateProperty(id: number, property: PropertyRequest): Observable<Property> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Property>(`${API_ENDPOINTS.PROPERTIES}/${id}`, property);
  }

  /**
   * Eliminar propiedad (solo vendedor propietario)
   */
  deleteProperty(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${API_ENDPOINTS.PROPERTIES}/${id}`);
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
