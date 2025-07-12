import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
import { 
  Categoria, 
  CreateCategoriaRequest, 
  UpdateCategoriaRequest, 
  CategoriaResponse, 
  CategoriaFilters 
} from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly http = inject(HttpClient);
  
  // Signals para el estado reactivo
  readonly categorias = signal<Categoria[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * HU #2: Listar categorías de inmuebles
   * Obtiene la lista paginada de categorías
   */
  getCategorias(filters: CategoriaFilters = {}): Observable<CategoriaResponse> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<CategoriaResponse>(`${API_ENDPOINTS.CATEGORIES}`, { params });
  }

  /**
   * HU #1: Crear categoría de inmuebles  
   * Crea una nueva categoría (solo admin)
   */
  createCategoria(categoria: CreateCategoriaRequest): Observable<Categoria> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Categoria>(`${API_ENDPOINTS.CATEGORIES}`, categoria);
  }

  /**
   * Obtener categoría por ID
   */
  getCategoriaById(id: number): Observable<Categoria> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Categoria>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  }

  /**
   * Actualizar categoría (solo admin)
   */
  updateCategoria(id: number, categoria: UpdateCategoriaRequest): Observable<Categoria> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<Categoria>(`${API_ENDPOINTS.CATEGORIES}/${id}`, categoria);
  }

  /**
   * Eliminar categoría (solo admin)
   */
  deleteCategoria(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  }

  /**
   * Actualiza el estado local de categorías
   */
  setCategorias(categorias: Categoria[]): void {
    this.categorias.set(categorias);
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
