import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
import { 
  Ubicacion,
  Departamento,
  Ciudad,
  CreateDepartamentoRequest,
  CreateCiudadRequest,
  CreateUbicacionRequest,
  UbicacionResponse,
  DepartamentoResponse,
  CiudadResponse,
  UbicacionFilters,
  DepartamentoFilters,
  CiudadFilters
} from '../interfaces/ubicacion.interface';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private readonly http = inject(HttpClient);
  
  // Signals para el estado reactivo
  readonly ubicaciones = signal<Ubicacion[]>([]);
  readonly departamentos = signal<Departamento[]>([]);
  readonly ciudades = signal<Ciudad[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // ==================== DEPARTAMENTOS ====================

  /**
   * HU #3: Crear departamento (solo admin)
   */
  createDepartamento(departamento: CreateDepartamentoRequest): Observable<Departamento> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Departamento>(`${API_ENDPOINTS.DEPARTMENTS}`, departamento);
  }

  /**
   * Obtener todos los departamentos
   */
  getDepartamentos(filters: DepartamentoFilters = {}): Observable<DepartamentoResponse> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<DepartamentoResponse>(`${API_ENDPOINTS.DEPARTMENTS}`, { params });
  }

  /**
   * Actualizar departamento (solo admin)
   */
  updateDepartamento(id: number, departamento: CreateDepartamentoRequest): Observable<Departamento> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Departamento>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, departamento);
  }

  /**
   * Eliminar departamento (solo admin)
   */
  deleteDepartamento(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  }

  // ==================== CIUDADES ====================

  /**
   * HU #3: Crear ciudad (solo admin)
   */
  createCiudad(ciudad: CreateCiudadRequest): Observable<Ciudad> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Ciudad>(`${API_ENDPOINTS.CITIES}`, ciudad);
  }

  /**
   * Obtener ciudades con filtros
   */
  getCiudades(filters: CiudadFilters = {}): Observable<CiudadResponse> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.departamentoId) params = params.set('departamentoId', filters.departamentoId.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<CiudadResponse>(`${API_ENDPOINTS.CITIES}`, { params });
  }

  /**
   * Actualizar ciudad (solo admin)
   */
  updateCiudad(id: number, ciudad: CreateCiudadRequest): Observable<Ciudad> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Ciudad>(`${API_ENDPOINTS.CITIES}/${id}`, ciudad);
  }

  /**
   * Eliminar ciudad (solo admin)
   */
  deleteCiudad(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${API_ENDPOINTS.CITIES}/${id}`);
  }

  // ==================== UBICACIONES ====================

  /**
   * HU #4: Buscar ubicaciones (todos los roles)
   * Busca por nombre de ciudad o departamento
   */
  searchUbicaciones(filters: UbicacionFilters = {}): Observable<UbicacionResponse> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.search) params = params.set('search', filters.search);
    if (filters.departamentoId) params = params.set('departamentoId', filters.departamentoId.toString());
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http.get<UbicacionResponse>(`${API_ENDPOINTS.LOCATIONS}`, { params });
  }

  /**
   * Crear ubicación
   */
  createUbicacion(ubicacion: CreateUbicacionRequest): Observable<Ubicacion> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Ubicacion>(`${API_ENDPOINTS.LOCATIONS}`, ubicacion);
  }

  // ==================== ESTADO MANAGEMENT ====================

  /**
   * Actualiza el estado local de ubicaciones
   */
  setUbicaciones(ubicaciones: Ubicacion[]): void {
    this.ubicaciones.set(ubicaciones);
  }

  /**
   * Actualiza el estado local de departamentos
   */
  setDepartamentos(departamentos: Departamento[]): void {
    this.departamentos.set(departamentos);
  }

  /**
   * Actualiza el estado local de ciudades
   */
  setCiudades(ciudades: Ciudad[]): void {
    this.ciudades.set(ciudades);
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
