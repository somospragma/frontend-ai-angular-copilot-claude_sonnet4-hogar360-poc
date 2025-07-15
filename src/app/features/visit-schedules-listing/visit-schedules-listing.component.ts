import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { VisitService } from '../../core/services/visit.service';
import { UbicacionService } from '../../core/services/ubicacion.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { VisitSchedule, UserRole } from '../../core/interfaces';
import { Ubicacion } from '../../core/interfaces/ubicacion.interface';

@Component({
  selector: 'app-visit-schedules-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            Horarios de Visitas Disponibles - HU #10
          </h1>
          <p class="text-gray-600 mb-6">
            Todos los roles pueden ver y filtrar horarios de visitas disponibles
          </p>
          
          <!-- Filtros de búsqueda - HU #10 -->
          <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="mb-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label for="fechaInicio" class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="datetime-local"
                  id="fechaInicio"
                  formControlName="fechaInicio"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label for="fechaFin" class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="datetime-local"
                  id="fechaFin"
                  formControlName="fechaFin"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label for="ubicacionId" class="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <select
                  id="ubicacionId"
                  formControlName="ubicacionId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las ubicaciones</option>
                  @for (ubicacion of ubicaciones(); track ubicacion.id) {
                    <option [value]="ubicacion.id">{{ ubicacion.ciudad }}, {{ ubicacion.departamento }}</option>
                  }
                </select>
              </div>
              
              <div class="flex items-end">
                <button
                  type="submit"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
          
          <!-- Lista de horarios disponibles -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (schedule of paginatedSchedules(); track schedule.id) {
              <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{ schedule.casa.nombre }}</h3>
                  <span class="text-sm text-gray-500">{{ schedule.espaciosDisponibles }} espacios</span>
                </div>
                
                <div class="space-y-2 text-sm text-gray-600">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ schedule.casa.ubicacion.ciudad }}, {{ schedule.casa.ubicacion.departamento }}
                  </div>
                  
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDateTime(schedule.fechaHoraInicio) }}
                  </div>
                  
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDateTime(schedule.fechaHoraFin) }}
                  </div>
                  
                  <div class="text-lg font-semibold text-green-600">
                    {{ formatPrice(schedule.casa.precio) }}
                  </div>
                </div>
                
                @if (schedule.espaciosDisponibles > 0) {
                  <button
                    (click)="goToScheduleVisit(schedule.id)"
                    class="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Agendar Visita
                  </button>
                } @else {
                  <button
                    disabled
                    class="w-full mt-4 bg-gray-400 text-white py-2 px-4 rounded-md cursor-not-allowed"
                  >
                    Sin espacios disponibles
                  </button>
                }
              </div>
            } @empty {
              <div class="col-span-full text-center py-8">
                <p class="text-gray-500">No hay horarios disponibles con los filtros seleccionados.</p>
              </div>
            }
          </div>
          
          <!-- Paginación -->
          @if (totalPages() > 1) {
            <div class="mt-8 flex justify-center">
              <nav class="flex space-x-2">
                <button
                  (click)="goToPage(currentPage() - 1)"
                  [disabled]="currentPage() === 1"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                @for (page of getPages(); track page) {
                  <button
                    (click)="goToPage(page)"
                    [class]="page === currentPage() ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                    class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  >
                    {{ page }}
                  </button>
                }
                
                <button
                  (click)="goToPage(currentPage() + 1)"
                  [disabled]="currentPage() === totalPages()"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class VisitSchedulesListingComponent implements OnInit {
  private readonly visitService = inject(VisitService);
  private readonly ubicacionService = inject(UbicacionService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);

  schedules = signal<VisitSchedule[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  pageSize = signal(9);

  filterForm: FormGroup = this.formBuilder.group({
    fechaInicio: [''],
    fechaFin: [''],
    ubicacionId: ['']
  });

  // Computed values para paginación - HU #10
  totalPages = computed(() => Math.ceil(this.schedules().length / this.pageSize()));
  
  paginatedSchedules = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.schedules().slice(start, end);
  });

  ngOnInit(): void {
    this.loadUbicaciones();
    this.loadAvailableSchedules();
  }

  // HU #10: Verificar roles - todos los roles pueden ver horarios
  isAdmin(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  isVendedor(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.VENDEDOR;
  }

  isComprador(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.COMPRADOR;
  }

  private loadUbicaciones(): void {
    this.ubicacionService.searchUbicaciones().subscribe({
      next: (response: any) => this.ubicaciones.set(response.data || []),
      error: (error: any) => console.error('Error loading ubicaciones:', error)
    });
  }

  private loadAvailableSchedules(): void {
    this.loading.set(true);
    const filters = this.filterForm.value;
    
    this.visitService.getAvailableSchedules(filters).subscribe({
      next: (schedules) => {
        // HU #10: Solo horarios con fecha futura y espacios disponibles
        const availableSchedules = schedules.filter(schedule => 
          new Date(schedule.fechaHoraInicio) > new Date() && 
          schedule.espaciosDisponibles > 0
        );
        this.schedules.set(availableSchedules);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadAvailableSchedules();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getPages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '$0';
    return `$${price.toLocaleString('es-CO')}`;
  }

  goToScheduleVisit(scheduleId: number): void {
    // Redirigir a la página de agendar visita con el ID del horario
    window.location.href = `/comprador/agendar-visita?scheduleId=${scheduleId}`;
  }
}
