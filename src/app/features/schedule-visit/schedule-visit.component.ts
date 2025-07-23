import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { VisitService } from '../../core/services/visit.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { VisitSchedule, VisitRequest } from '../../core/interfaces';

@Component({
  selector: 'app-schedule-visit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Agendar Visita</h1>
          
          @if (selectedSchedule()) {
            <!-- Información del horario seleccionado -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 class="text-lg font-semibold text-blue-900 mb-2">Detalles de la Visita</h2>
              <div class="space-y-2 text-sm text-blue-800">
                <div><strong>Propiedad:</strong> {{ selectedSchedule()?.casa?.nombre }}</div>
                <div><strong>Ubicación:</strong> {{ selectedSchedule()?.casa?.ubicacion?.ciudad }}, {{ selectedSchedule()?.casa?.ubicacion?.departamento }}</div>
                <div><strong>Fecha y Hora:</strong> {{ formatDateTime(selectedSchedule()?.fechaHoraInicio!) }} - {{ formatTime(selectedSchedule()?.fechaHoraFin!) }}</div>
                <div><strong>Precio:</strong> {{ formatPrice(selectedSchedule()?.casa?.precio) }}</div>
                <div><strong>Espacios Disponibles:</strong> {{ selectedSchedule()?.espaciosDisponibles }}</div>
              </div>
            </div>
            
            <!-- Formulario de agendamiento - HU #11 -->
            <form [formGroup]="visitForm" (ngSubmit)="scheduleVisit()" class="space-y-6">
              <div>
                <label for="compradorEmail" class="block text-sm font-medium text-gray-700 mb-1">
                  Email del Comprador *
                </label>
                <input
                  type="email"
                  id="compradorEmail"
                  formControlName="compradorEmail"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="visitForm.get('compradorEmail')?.invalid && visitForm.get('compradorEmail')?.touched"
                />
                @if (visitForm.get('compradorEmail')?.invalid && visitForm.get('compradorEmail')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    @if (visitForm.get('compradorEmail')?.errors?.['required']) {
                      El email es requerido
                    }
                    @if (visitForm.get('compradorEmail')?.errors?.['email']) {
                      Ingrese un email válido
                    }
                  </p>
                }
              </div>
              
              <div>
                <label for="comentarios" class="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios adicionales
                </label>
                <textarea
                  id="comentarios"
                  formControlName="comentarios"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escriba cualquier comentario o pregunta adicional..."
                ></textarea>
              </div>
              
              <!-- Términos y condiciones -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-2">Términos y Condiciones</h3>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li>• La visita está sujeta a confirmación por parte del vendedor</li>
                  <li>• Se recomienda llegar 5 minutos antes de la hora programada</li>
                  <li>• Máximo 2 compradores por horario (HU #11)</li>
                  <li>• La cancelación debe hacerse con al menos 2 horas de anticipación</li>
                </ul>
              </div>
              
              <div class="flex space-x-4">
                <button
                  type="button"
                  (click)="goBack()"
                  class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="visitForm.invalid || submitting()"
                  class="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (submitting()) {
                    Agendando...
                  } @else {
                    Confirmar Visita
                  }
                </button>
              </div>
            </form>
          } @else if (loading()) {
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Cargando información del horario...</p>
            </div>
          } @else {
            <div class="text-center py-8">
              <p class="text-red-600">No se pudo cargar la información del horario seleccionado.</p>
              <button
                (click)="goBack()"
                class="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Volver a Horarios
              </button>
            </div>
          }
          
          @if (successMessage()) {
            <div class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-green-800">{{ successMessage() }}</p>
              </div>
            </div>
          }
          
          @if (errorMessage()) {
            <div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-red-800">{{ errorMessage() }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ScheduleVisitComponent implements OnInit {
  private readonly visitService = inject(VisitService);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  selectedSchedule = signal<VisitSchedule | null>(null);
  loading = signal(false);
  submitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  visitForm: FormGroup = this.formBuilder.group({
    compradorEmail: ['', [Validators.required, Validators.email]],
    comentarios: ['']
  });

  ngOnInit(): void {
    const scheduleId = this.route.snapshot.queryParams['scheduleId'];
    if (scheduleId) {
      this.loadScheduleDetails(scheduleId);
    } else {
      this.errorMessage.set('No se especificó un horario para agendar');
    }

    // Pre-llenar el email si el usuario está autenticado
    const currentUser = this.authFacade.getCurrentUser();
    if (currentUser?.correo) {
      this.visitForm.patchValue({
        compradorEmail: currentUser.correo
      });
    }
  }

  private loadScheduleDetails(scheduleId: string): void {
    this.loading.set(true);
    this.visitService.getScheduleById(parseInt(scheduleId)).subscribe({
      next: (schedule) => {
        // Verificar que el horario esté disponible - HU #11
        if (schedule.espaciosDisponibles > 0 && new Date(schedule.fechaHoraInicio) > new Date()) {
          this.selectedSchedule.set(schedule);
        } else {
          this.errorMessage.set('Este horario ya no está disponible para agendar');
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading schedule details:', error);
        this.errorMessage.set('Error al cargar los detalles del horario');
        this.loading.set(false);
      }
    });
  }

  scheduleVisit(): void {
    if (this.visitForm.valid && this.selectedSchedule()) {
      this.submitting.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const visitRequest: VisitRequest = {
        horarioDisponible: this.selectedSchedule()!,
        compradorEmail: this.visitForm.value.compradorEmail,
        comentarios: this.visitForm.value.comentarios
      };

      this.visitService.scheduleVisit(visitRequest).subscribe({
        next: (visit) => {
          this.successMessage.set('¡Visita agendada exitosamente! El vendedor confirmará su visita pronto.');
          this.submitting.set(false);
          
          // Redirigir después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/comprador/visitas']);
          }, 3000);
        },
        error: (error) => {
          console.error('Error scheduling visit:', error);
          if (error.status === 400) {
            this.errorMessage.set('Ya existen 2 compradores agendados para este horario. Por favor, seleccione otro horario.');
          } else {
            this.errorMessage.set('Error al agendar la visita. Por favor, inténtelo nuevamente.');
          }
          this.submitting.set(false);
        }
      });
    }
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number | undefined): string {
    if (!price) return '$0';
    return `$${price.toLocaleString('es-CO')}`;
  }

  goBack(): void {
    this.router.navigate(['/horarios-disponibles']);
  }
}
