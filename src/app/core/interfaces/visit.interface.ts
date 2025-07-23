import { Property } from './property.interface';
import { User } from './user.interface';

export interface VisitSchedule {
  id: number;
  vendedorId: number;
  casaId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  espaciosDisponibles: number;
  vendedor: User;
  casa: Property;
  visitasAgendadas?: Visit[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Visit {
  id: number;
  horarioDisponibleId: number;
  compradorEmail: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  comentarios?: string;
  horarioDisponible: VisitSchedule;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VisitScheduleRequest {
  vendedorId: number;
  casaId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
}

export interface VisitRequest {
  compradorEmail: string;
  horarioDisponible?: VisitSchedule;
  comentarios?: string;
}

export interface VisitScheduleResponse {
  data: VisitSchedule[];
  total: number;
  page: number;
  limit: number;
}

export interface VisitScheduleSearchParams {
  fechaInicio?: string;
  fechaFin?: string;
  ubicacionId?: number;
  vendedorId?: number;
  availableOnly?: boolean;
  page?: number;
  limit?: number;
}