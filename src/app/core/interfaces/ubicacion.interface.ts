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

export interface Ubicacion {
  id: number;
  ciudad: Ciudad;
  departamento: Departamento;
  ciudadId: number;
  departamentoId: number;
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

export interface CreateUbicacionRequest {
  ciudadId: number;
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
