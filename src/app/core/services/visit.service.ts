import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../constants/api.constants';
import { 
  VisitSchedule,
  Visit,
  VisitScheduleRequest,
  VisitRequest,
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
  readonly visits = signal<Visit[]>([]);
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
  getAvailableSchedules(filters: VisitScheduleSearchParams = {}): Observable<VisitSchedule[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    
    if (filters.fechaInicio) params = params.set('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params = params.set('fechaFin', filters.fechaFin);
    if (filters.ubicacionId) params = params.set('ubicacionId', filters.ubicacionId.toString());
    if (filters.availableOnly) params = params.set('availableOnly', filters.availableOnly.toString());
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<VisitSchedule[]>(`${API_ENDPOINTS.VISIT_SCHEDULES}`, { params });
  }

  /**
   * Obtener un horario específico por ID
   */
  getScheduleById(id: number): Observable<VisitSchedule> {
    return this.http.get<VisitSchedule>(`${API_ENDPOINTS.VISIT_SCHEDULES}/${id}`);
  }

  /**
   * HU #11: Agendar visitas (comprador)
   * Agenda una visita en un horario disponible
   */
  scheduleVisit(visit: VisitRequest): Observable<Visit> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.post<Visit>(`${API_ENDPOINTS.SCHEDULED_VISITS}`, visit);
  }

  /**
   * Obtener horarios del vendedor actual
   */
  getVendorSchedules(vendorId: number): Observable<VisitSchedule[]> {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams().set('vendedorId', vendorId.toString());
    return this.http.get<VisitSchedule[]>(`${API_ENDPOINTS.VISIT_SCHEDULES}`, { params });
  }

  /**
   * Obtener visitas agendadas del comprador
   */
  getUserVisits(email: string): Observable<Visit[]> {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams().set('compradorEmail', email);
    return this.http.get<Visit[]>(`${API_ENDPOINTS.SCHEDULED_VISITS}`, { params });
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
  cancelVisit(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.patch<void>(`${API_ENDPOINTS.SCHEDULED_VISITS}/${id}/cancel`, {});
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
  setVisits(visits: Visit[]): void {
    this.visits.set(visits);
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
