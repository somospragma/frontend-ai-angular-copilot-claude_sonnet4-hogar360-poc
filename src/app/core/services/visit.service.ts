import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

import { LocalStorageService } from './local-storage.service';
import { 
  VisitSchedule,
  Visit,
  VisitScheduleRequest,
  VisitRequest,
  VisitScheduleSearchParams
} from '../interfaces/visit.interface';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly localStorageService = inject(LocalStorageService);
  
  // Signals para el estado reactivo
  readonly visitSchedules = signal<VisitSchedule[]>([]);
  readonly visits = signal<Visit[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Inicializar con datos del localStorage
    this.visitSchedules.set(this.localStorageService.getVisitSchedules());
    this.visits.set(this.localStorageService.getVisits());
    
    // Suscribirse a cambios
    this.localStorageService.visitSchedules$.subscribe(schedules => {
      this.visitSchedules.set(schedules);
    });
    
    this.localStorageService.visits$.subscribe(visits => {
      this.visits.set(visits);
    });
  }

  /**
   * HU #9: Disponibilizar horarios de visitas (solo vendedor)
   * Crea un nuevo horario disponible para visitas
   */
  createVisitSchedule(schedule: VisitScheduleRequest): Observable<VisitSchedule> {
    this.loading.set(true);
    this.error.set(null);

    return of(schedule).pipe(
      delay(300),
      map(() => {
        const newSchedule = this.localStorageService.addVisitSchedule(schedule);
        this.loading.set(false);
        return newSchedule;
      })
    );
  }

  /**
   * Alias para createVisitSchedule para compatibilidad
   */
  createSchedule(schedule: VisitScheduleRequest): Observable<VisitSchedule> {
    return this.createVisitSchedule(schedule);
  }

  /**
   * HU #10: Listar horarios disponibles (todos los roles)
   * Obtiene horarios disponibles con filtros
   */
  getAvailableSchedules(filters: VisitScheduleSearchParams = {}): Observable<VisitSchedule[]> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(200),
      map(() => {
        let schedules = this.localStorageService.getVisitSchedules();
        
        // Aplicar filtros
        if (filters.fechaInicio) {
          schedules = schedules.filter(s => 
            new Date(s.fechaHoraInicio) >= new Date(filters.fechaInicio!)
          );
        }
        
        if (filters.fechaFin) {
          schedules = schedules.filter(s => 
            new Date(s.fechaHoraFin) <= new Date(filters.fechaFin!)
          );
        }
        
        if (filters.ubicacionId) {
          schedules = schedules.filter(s => 
            s.casa.ubicacion.id === filters.ubicacionId
          );
        }
        
        if (filters.vendedorId) {
          schedules = schedules.filter(s => 
            s.casa.vendedor_id === filters.vendedorId
          );
        }

        this.loading.set(false);
        return schedules;
      })
    );
  }

  /**
   * Obtener horario por ID
   */
  getScheduleById(id: number): Observable<VisitSchedule> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const schedule = this.localStorageService.getVisitSchedules().find(s => s.id === id);
        if (!schedule) {
          throw new Error('Horario no encontrado');
        }
        return schedule;
      })
    );
  }

  /**
   * Agendar visita a un horario
   */
  scheduleVisit(visit: VisitRequest): Observable<Visit> {
    this.loading.set(true);
    this.error.set(null);

    return of(visit).pipe(
      delay(300),
      map(() => {
        const newVisit = this.localStorageService.addVisit(visit);
        this.loading.set(false);
        return newVisit;
      })
    );
  }

  /**
   * Obtener horarios del vendedor
   */
  getSchedulesByVendor(vendorId: number): Observable<VisitSchedule[]> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const schedules = this.localStorageService.getVisitSchedules()
          .filter(s => s.casa.vendedor_id === vendorId);
        return schedules;
      })
    );
  }

  /**
   * Obtener mis horarios (para el vendedor actual)
   */
  getMySchedules(): Observable<VisitSchedule[]> {
    // Aquí deberías obtener el ID del vendedor actual del AuthService
    // Por ahora, devuelvo todos los horarios
    return of(null).pipe(
      delay(200),
      map(() => {
        const schedules = this.localStorageService.getVisitSchedules();
        return schedules;
      })
    );
  }

  /**
   * Obtener visitas por email de comprador
   */
  getVisitsByBuyer(email: string): Observable<Visit[]> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const visits = this.localStorageService.getVisits()
          .filter(v => v.compradorEmail === email);
        return visits;
      })
    );
  }

  /**
   * HU #12: Obtener visitas del usuario
   */
  getUserVisits(userEmail: string): Observable<Visit[]> {
    this.loading.set(true);
    this.error.set(null);

    return of(userEmail).pipe(
      delay(300),
      map(() => {
        const visits = this.localStorageService.getVisits();
        const userVisits = visits.filter(visit => visit.compradorEmail === userEmail);
        this.loading.set(false);
        return userVisits;
      })
    );
  }

  /**
   * Actualizar horario de visita
   */
  updateVisitSchedule(id: number, schedule: VisitScheduleRequest): Observable<VisitSchedule> {
    this.loading.set(true);
    this.error.set(null);

    return of(schedule).pipe(
      delay(300),
      map(() => {
        const updatedSchedule = this.localStorageService.updateVisitSchedule(id, schedule);
        this.loading.set(false);
        return updatedSchedule;
      })
    );
  }

  /**
   * Alias para updateVisitSchedule para compatibilidad
   */
  updateSchedule(id: number, schedule: VisitScheduleRequest): Observable<VisitSchedule> {
    return this.updateVisitSchedule(id, schedule);
  }

  /**
   * Eliminar horario de visita
   */
  deleteVisitSchedule(id: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(300),
      map(() => {
        this.localStorageService.deleteVisitSchedule(id);
        this.loading.set(false);
      })
    );
  }

  /**
   * Alias para deleteVisitSchedule para compatibilidad
   */
  deleteSchedule(id: number): Observable<void> {
    return this.deleteVisitSchedule(id);
  }

  /**
   * Cancelar visita
   */
  cancelVisit(visitId: number): Observable<void> {
    this.loading.set(true);
    this.error.set(null);

    return of(null).pipe(
      delay(300),
      map(() => {
        this.localStorageService.deleteVisit(visitId);
        this.loading.set(false);
      })
    );
  }

  /**
   * Actualizar estado de visita
   */
  updateVisitStatus(visitId: number, status: string): Observable<Visit> {
    this.loading.set(true);
    this.error.set(null);

    return of({ status } as any).pipe(
      delay(300),
      map(() => {
        const updatedVisit = this.localStorageService.updateVisit(visitId, { status });
        this.loading.set(false);
        return updatedVisit;
      })
    );
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
