import { Property } from './property.interface';
import { User } from './user.interface';

export interface VisitSchedule {
  id: number;
  vendedor_id: number;
  casa_id: number;
  fecha_hora_inicio: Date;
  fecha_hora_fin: Date;
  vendedor: User;
  casa: Property;
  visitas_agendadas: ScheduledVisit[];
  created_at?: Date;
  updated_at?: Date;
}

export interface ScheduledVisit {
  id: number;
  horario_disponible_id: number;
  comprador_email: string;
  horario_disponible: VisitSchedule;
  created_at?: Date;
  updated_at?: Date;
}

export interface VisitScheduleRequest {
  vendedor_id: number;
  casa_id: number;
  fecha_hora_inicio: Date;
  fecha_hora_fin: Date;
}

export interface ScheduledVisitRequest {
  horario_disponible_id: number;
  comprador_email: string;
}

export interface VisitScheduleResponse {
  data: VisitSchedule[];
  total: number;
  page: number;
  limit: number;
}

export interface VisitScheduleSearchParams {
  fecha_inicio?: Date;
  fecha_fin?: Date;
  ubicacion_id?: number;
  available_only?: boolean;
  page?: number;
  limit?: number;
}
