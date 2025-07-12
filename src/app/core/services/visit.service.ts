import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
import { 
  VisitSchedule,
  ScheduledVisit,
  VisitScheduleRequest,
  ScheduledVisitRequest,
  VisitScheduleResponse,
  VisitScheduleSearchParams
} from '../interfaces/visit.interface';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly http = inject(HttpClient);
  
  // Signals para el estado reactivo
  readonly visitSchedules = signal<VisitSchedule[]>([]);
  readonly scheduledVisits = signal<ScheduledVisit[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * HU #9: Disponibilizar horarios de visitas (solo vendedor)
   * Crea un nuevo horario disponible para visitas
   */
  createVisitSchedule(schedule: VisitScheduleRequest): Observable<VisitSchedule> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<VisitSchedule>(`${API_ENDPOINTS.VISIT_SCHEDULES}`, schedule);
  }

  /**
   * HU #10: Listar horarios disponibles (todos los roles)
   * Obtiene horarios disponibles con filtros
   */
  getAvailableSchedules(filters: VisitScheduleSearchParams = {}): Observable<VisitScheduleResponse> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.fecha_inicio) params = params.set('fecha_inicio', filters.fecha_inicio.toISOString());
    if (filters.fecha_fin) params = params.set('fecha_fin', filters.fecha_fin.toISOString());
    if (filters.ubicacion_id) params = params.set('ubicacion_id', filters.ubicacion_id.toString());
    if (filters.available_only) params = params.set('available_only', filters.available_only.toString());
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<VisitScheduleResponse>(`${API_ENDPOINTS.VISIT_SCHEDULES}`, { params });
  }

  /**
   * HU #11: Agendar visitas (comprador)
   * Agenda una visita en un horario disponible
   */
  scheduleVisit(visit: ScheduledVisitRequest): Observable<ScheduledVisit> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<ScheduledVisit>(`${API_ENDPOINTS.SCHEDULED_VISITS}`, visit);
  }

  /**
   * Obtener horarios del vendedor actual
   */
  getVendorSchedules(vendorId: number): Observable<VisitScheduleResponse> {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams().set('vendedor_id', vendorId.toString());
    return this.http.get<VisitScheduleResponse>(`${API_ENDPOINTS.VISIT_SCHEDULES}`, { params });
  }

  /**
   * Obtener visitas agendadas del comprador
   */
  getBuyerVisits(email: string): Observable<ScheduledVisit[]> {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams().set('comprador_email', email);
    return this.http.get<ScheduledVisit[]>(`${API_ENDPOINTS.SCHEDULED_VISITS}`, { params });
  }

  /**
   * Actualizar horario de visita (solo vendedor propietario)
   */
  updateVisitSchedule(id: number, schedule: VisitScheduleRequest): Observable<VisitSchedule> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put<VisitSchedule>(`${API_ENDPOINTS.VISIT_SCHEDULES}/${id}`, schedule);
  }

  /**
   * Eliminar horario de visita (solo vendedor propietario)
   */
  deleteVisitSchedule(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${API_ENDPOINTS.VISIT_SCHEDULES}/${id}`);
  }

  /**
   * Cancelar visita agendada
   */
  cancelScheduledVisit(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete<void>(`${API_ENDPOINTS.SCHEDULED_VISITS}/${id}`);
  }

  /**
   * Actualiza el estado local de horarios
   */
  setVisitSchedules(schedules: VisitSchedule[]): void {
    this.visitSchedules.set(schedules);
  }

  /**
   * Actualiza el estado local de visitas agendadas
   */
  setScheduledVisits(visits: ScheduledVisit[]): void {
    this.scheduledVisits.set(visits);
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
