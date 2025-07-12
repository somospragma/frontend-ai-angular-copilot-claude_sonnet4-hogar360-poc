import { Category } from './category.interface';
import { Location } from './location.interface';
import { User } from './user.interface';

export interface Property {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: Category;
  cantidad_cuartos: number;
  cantidad_banos: number;
  precio: number;
  ubicacion: Location;
  fecha_publicacion_activa: Date;
  estado_publicacion: PropertyStatus;
  fecha_publicacion: Date;
  vendedor: User;
  images?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export enum PropertyStatus {
  PUBLICADA = 'PUBLICADA',
  PUBLICACION_PAUSADA = 'PUBLICACION_PAUSADA',
  TRANSACCION_CURSO = 'TRANSACCION_CURSO',
  TRANSACCION_FINALIZADA = 'TRANSACCION_FINALIZADA'
}

export interface PropertyRequest {
  nombre: string;
  descripcion: string;
  categoria_id: number;
  cantidad_cuartos: number;
  cantidad_banos: number;
  precio: number;
  ubicacion_id: number;
  fecha_publicacion_activa: Date;
  estado_publicacion: PropertyStatus;
  images?: File[];
}

export interface PropertyResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}

export interface PropertySearchParams {
  ubicacion_id?: number;
  categoria_id?: number;
  cantidad_cuartos?: number;
  cantidad_banos?: number;
  precio_minimo?: number;
  precio_maximo?: number;
  sortBy?: 'ubicacion' | 'categoria' | 'precio' | 'fecha_publicacion';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
