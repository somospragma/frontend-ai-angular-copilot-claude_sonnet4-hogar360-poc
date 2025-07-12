export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryRequest {
  nombre: string;
  descripcion: string;
}

export interface CategoryResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
}
