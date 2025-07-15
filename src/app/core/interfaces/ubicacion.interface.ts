export interface Ubicacion {
  id: number;
  ciudad: string;
  departamento: string;
  descripcionCiudad: string;
  descripcionDepartamento: string;
  fechaCreacion: Date;
  activo: boolean;
}

export interface CreateUbicacionRequest {
  ciudad: string;
  departamento: string;
  descripcionCiudad: string;
  descripcionDepartamento: string;
}

export interface UbicacionResponse {
  success: boolean;
  message: string;
  ubicacion?: Ubicacion;
}

export interface SearchUbicacionParams {
  texto?: string;
  ordenAscendente?: boolean;
  ordenarPor?: 'ciudad' | 'departamento';
  page?: number;
  pageSize?: number;
}

export interface SearchUbicacionResponse {
  ubicaciones: Ubicacion[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Legacy interfaces for backward compatibility
export interface Departamento {
  id: number;
  nombre: string;
  descripcion: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface Ciudad {
  id: number;
  nombre: string;
  descripcion: string;
  departamento: Departamento;
  departamentoId: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// Request DTOs
export interface CreateDepartamentoRequest {
  nombre: string;
  descripcion: string;
}

export interface CreateCiudadRequest {
  nombre: string;
  descripcion: string;
  departamentoId: number;
}

// Response DTOs
export interface DepartamentoResponse {
  departamentos: Departamento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CiudadResponse {
  ciudades: Ciudad[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UbicacionResponse {
  ubicaciones: Ubicacion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filters
export interface UbicacionFilters {
  page?: number;
  limit?: number;
  search?: string; // Busca en nombre de ciudad o departamento
  departamentoId?: number;
  sortBy?: 'ciudad' | 'departamento' | 'fechaCreacion';
  sortOrder?: 'asc' | 'desc';
}

export interface DepartamentoFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'nombre' | 'fechaCreacion';
  sortOrder?: 'asc' | 'desc';
}

export interface CiudadFilters {
  page?: number;
  limit?: number;
  search?: string;
  departamentoId?: number;
  sortBy?: 'nombre' | 'fechaCreacion';
  sortOrder?: 'asc' | 'desc';
}
