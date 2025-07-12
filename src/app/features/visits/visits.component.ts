import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VisitService } from '../../core/services/visit.service';
import { AuthService } from '../../core/services/auth.service';
import { Visit } from '../../core/interfaces';

@Component({
  selector: 'app-visits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Mis Visitas Agendadas</h1>
          
          @if (loading()) {
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Cargando visitas...</p>
            </div>
          } @else {
            <!-- Tabs para filtrar visitas -->
            <div class="border-b border-gray-200 mb-6">
              <nav class="-mb-px flex space-x-8">
                <button
                  (click)="setActiveTab('upcoming')"
                  [class]="activeTab() === 'upcoming' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                >
                  Próximas ({{ upcomingVisits().length }})
                </button>
                <button
                  (click)="setActiveTab('past')"
                  [class]="activeTab() === 'past' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                >
                  Pasadas ({{ pastVisits().length }})
                </button>
              </nav>
            </div>
            
            <!-- Lista de visitas -->
            <div class="space-y-4">
              @for (visit of filteredVisits(); track visit.id) {
                <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        {{ visit.horarioDisponible.casa.nombre }}
                      </h3>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div class="space-y-2">
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{{ visit.horarioDisponible.casa.ubicacion.ciudad }}, {{ visit.horarioDisponible.casa.ubicacion.departamento }}</span>
                          </div>
                          
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{{ formatDateTime(visit.horarioDisponible.fechaHoraInicio) }}</span>
                          </div>
                          
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Vendedor: {{ visit.horarioDisponible.vendedor.nombre }} {{ visit.horarioDisponible.vendedor.apellido }}</span>
                          </div>
                        </div>
                        
                        <div class="space-y-2">
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span class="text-lg font-semibold text-green-600">{{ formatPrice(visit.horarioDisponible.casa.precio) }}</span>
                          </div>
                          
                          <div class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="capitalize" [class]="getStatusColor(visit.estado)">
                              {{ getStatusText(visit.estado) }}
                            </span>
                          </div>
                          
                          @if (visit.comentarios) {
                            <div class="flex items-start">
                              <svg class="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span class="text-xs">{{ visit.comentarios }}</span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                    
                    <!-- Acciones -->
                    <div class="ml-4 flex flex-col space-y-2">
                      @if (canCancelVisit(visit)) {
                        <button
                          (click)="cancelVisit(visit.id)"
                          class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Cancelar
                        </button>
                      }
                      
                      @if (visit.estado === 'CONFIRMADA' && isUpcoming(visit)) {
                        <a
                          [href]="getMapLink(visit.horarioDisponible.casa)"
                          target="_blank"
                          class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        >
                          Ver Mapa
                        </a>
                      }
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-12">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    {{ activeTab() === 'upcoming' ? 'No tienes visitas próximas' : 'No tienes visitas pasadas' }}
                  </h3>
                  <p class="text-gray-500 mb-4">
                    {{ activeTab() === 'upcoming' ? 'Explora las propiedades disponibles y agenda tu primera visita' : 'Las visitas que hayas realizado aparecerán aquí' }}
                  </p>
                  @if (activeTab() === 'upcoming') {
                    <a
                      routerLink="/propiedades"
                      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Explorar Propiedades
                    </a>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class VisitsComponent implements OnInit {
  private readonly visitService = inject(VisitService);
  private readonly authService = inject(AuthService);

  visits = signal<Visit[]>([]);
  loading = signal(false);
  activeTab = signal<'upcoming' | 'past'>('upcoming');

  // Computed values para filtrar visitas
  upcomingVisits = computed(() => 
    this.visits().filter(visit => this.isUpcoming(visit))
  );

  pastVisits = computed(() => 
    this.visits().filter(visit => !this.isUpcoming(visit))
  );

  filteredVisits = computed(() => 
    this.activeTab() === 'upcoming' ? this.upcomingVisits() : this.pastVisits()
  );

  ngOnInit(): void {
    this.loadUserVisits();
  }

  private loadUserVisits(): void {
    this.loading.set(true);
    const currentUser = this.authService.currentUser();
    
    if (currentUser?.correo) {
      this.visitService.getUserVisits(currentUser.correo).subscribe({
        next: (visits) => {
          this.visits.set(visits);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading user visits:', error);
          this.loading.set(false);
        }
      });
    }
  }

  setActiveTab(tab: 'upcoming' | 'past'): void {
    this.activeTab.set(tab);
  }

  isUpcoming(visit: Visit): boolean {
    return new Date(visit.horarioDisponible.fechaHoraInicio) > new Date();
  }

  canCancelVisit(visit: Visit): boolean {
    // Solo se puede cancelar si la visita es futura y está pendiente o confirmada
    const isUpcomingVisit = this.isUpcoming(visit);
    const canCancel = visit.estado === 'PENDIENTE' || visit.estado === 'CONFIRMADA';
    
    // Verificar que queden al menos 2 horas para la visita
    const visitTime = new Date(visit.horarioDisponible.fechaHoraInicio);
    const now = new Date();
    const hoursUntilVisit = (visitTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return isUpcomingVisit && canCancel && hoursUntilVisit >= 2;
  }

  cancelVisit(visitId: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta visita?')) {
      this.visitService.cancelVisit(visitId).subscribe({
        next: () => {
          // Actualizar la lista de visitas
          this.loadUserVisits();
        },
        error: (error) => {
          console.error('Error canceling visit:', error);
          alert('Error al cancelar la visita. Por favor, inténtelo nuevamente.');
        }
      });
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'CONFIRMADA': 'Confirmada',
      'CANCELADA': 'Cancelada',
      'COMPLETADA': 'Completada'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'PENDIENTE': 'text-yellow-600',
      'CONFIRMADA': 'text-green-600',
      'CANCELADA': 'text-red-600',
      'COMPLETADA': 'text-blue-600'
    };
    return colorMap[status] || 'text-gray-600';
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

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CO')}`;
  }

  getMapLink(casa: any): string {
    // Generar link de Google Maps basado en la ubicación
    const address = `${casa.ubicacion.ciudad}, ${casa.ubicacion.departamento}, Colombia`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
}
