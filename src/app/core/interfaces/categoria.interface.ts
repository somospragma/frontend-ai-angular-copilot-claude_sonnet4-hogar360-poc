export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CreateCategoriaRequest {
  nombre: string;
  descripcion: string;
}

export interface UpdateCategoriaRequest {
  nombre?: string;
  descripcion?: string;
}

export interface CategoriaResponse {
  categorias: Categoria[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriaFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'nombre' | 'fechaCreacion';
  sortOrder?: 'asc' | 'desc';
}
