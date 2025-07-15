export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryRequest {
  nombre: string;
  descripcion: string;
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

export interface SearchCategoryParams {
  texto?: string;
  ordenAscendente?: boolean;
  ordenarPor?: 'nombre' | 'descripcion';
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
}
