export interface Location {
  id: number;
  ciudad: string;
  departamento: string;
  descripcion_ciudad: string;
  descripcion_departamento: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LocationRequest {
  ciudad: string;
  departamento: string;
  descripcion_ciudad: string;
  descripcion_departamento: string;
}

export interface LocationResponse {
  data: Location[];
  total: number;
  page: number;
  limit: number;
}

export interface LocationSearchParams {
  query?: string;
  sortBy?: 'ciudad' | 'departamento';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
