import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VisitService } from '../../core/services/visit.service';
import { PropertyService } from '../../core/services/property.service';
import { VisitSchedule, VisitScheduleRequest } from '../../core/interfaces/visit.interface';
import { Property } from '../../core/interfaces/property.interface';

@Component({
  selector: 'app-visit-schedules',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="visit-schedules-page">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">Gestión de Horarios de Visitas</h1>
        <button 
          (click)="toggleForm()"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          @if (showForm()) {
            Cancelar
          } @else {
            Nuevo Horario
          }
        </button>
      </div>

      <!-- Form Section -->
      @if (showForm()) {
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-secondary-900 mb-4">
            @if (editingSchedule()) {
              Editar Horario de Visita
            } @else {
              Nuevo Horario de Visita
            }
          </h2>
          
          <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Propiedad -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Propiedad <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="casa_id"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">Selecciona una propiedad</option>
                @for (property of myProperties(); track property.id) {
                  <option [value]="property.id">{{ property.nombre }} - {{ property.ubicacion.ciudad }}</option>
                }
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Fecha y Hora de Inicio -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha y Hora de Inicio <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  formControlName="fecha_hora_inicio"
                  [min]="minDateTime"
                  [max]="maxDateTime"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p class="text-xs text-secondary-600 mt-1">Máximo 3 semanas desde hoy</p>
              </div>

              <!-- Fecha y Hora de Fin -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha y Hora de Fin <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  formControlName="fecha_hora_fin"
                  [min]="scheduleForm.get('fecha_hora_inicio')?.value"
                  [max]="maxDateTime"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p class="text-xs text-secondary-600 mt-1">Debe ser posterior al inicio</p>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button"
                (click)="resetForm()"
                class="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
                Limpiar
              </button>
              <button 
                type="submit"
                [disabled]="scheduleForm.invalid || isSubmitting()"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                @if (isSubmitting()) {
                  Guardando...
                } @else if (editingSchedule()) {
                  Actualizar
                } @else {
                  Crear Horario
                }
              </button>
            </div>
          </form>

          <!-- Form Validation Errors -->
          @if (scheduleForm.invalid && scheduleForm.touched) {
            <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 class="text-sm font-medium text-red-800 mb-2">Errores en el formulario:</h3>
              <ul class="text-sm text-red-700 space-y-1">
                @if (scheduleForm.get('casa_id')?.errors?.['required']) {
                  <li>• La propiedad es requerida</li>
                }
                @if (scheduleForm.get('fecha_hora_inicio')?.errors?.['required']) {
                  <li>• La fecha y hora de inicio es requerida</li>
                }
                @if (scheduleForm.get('fecha_hora_fin')?.errors?.['required']) {
                  <li>• La fecha y hora de fin es requerida</li>
                }
                @if (scheduleForm.errors?.['dateRange']) {
                  <li>• La fecha de fin debe ser posterior a la de inicio</li>
                }
                @if (scheduleForm.errors?.['conflictingSchedule']) {
                  <li>• Ya tienes un horario programado en esa fecha y hora</li>
                }
              </ul>
            </div>
          }
        </div>
      }

      <!-- Schedules List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-secondary-200">
          <h2 class="text-lg font-semibold text-secondary-900">
            Mis Horarios de Visitas ({{ visitSchedules().length }})
          </h2>
        </div>

        @if (visitSchedules().length === 0) {
          <div class="p-6 text-center text-secondary-600">
            No tienes horarios de visitas programados.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Visitas Agendadas
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                @for (schedule of visitSchedules(); track schedule.id) {
                  <tr class="hover:bg-secondary-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-secondary-900">{{ schedule.casa.nombre }}</div>
                        <div class="text-sm text-secondary-700">{{ schedule.casa.ubicacion.ciudad }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-secondary-900">
                          {{ schedule.fechaHoraInicio | date:'dd/MM/yyyy' }}
                        </div>
                        <div class="text-sm text-secondary-700">
                          {{ schedule.fechaHoraInicio | date:'HH:mm' }} - {{ schedule.fechaHoraFin | date:'HH:mm' }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ getDuration(schedule.fechaHoraInicio, schedule.fechaHoraFin) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-secondary-900">
                        {{ (schedule.visitasAgendadas?.length || 0) }}/2
                      </div>
                      @if (schedule.visitasAgendadas && schedule.visitasAgendadas.length > 0) {
                        <div class="text-xs text-secondary-600">
                          @for (visit of schedule.visitasAgendadas; track visit.id) {
                            <div>{{ visit.compradorEmail }}</div>
                          }
                        </div>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getAvailabilityClass(schedule.visitasAgendadas?.length || 0)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getAvailabilityText(schedule.visitasAgendadas?.length || 0) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        (click)="editSchedule(schedule)"
                        class="text-primary-600 hover:text-primary-700 transition-colors">
                        Editar
                      </button>
                      <button 
                        (click)="deleteSchedule(schedule.id)"
                        class="text-red-600 hover:text-red-700 transition-colors ml-2">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .visit-schedules-page {
      @apply p-6 max-w-7xl mx-auto;
    }
  `]
})
export class VisitSchedulesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly visitService = inject(VisitService);
  private readonly propertyService = inject(PropertyService);
  
  showForm = signal(false);
  isSubmitting = signal(false);
  editingSchedule = signal<VisitSchedule | null>(null);
  visitSchedules = signal<VisitSchedule[]>([]);
  myProperties = signal<Property[]>([]);

  minDateTime = new Date().toISOString().slice(0, 16);
  maxDateTime = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16); // 3 weeks

  scheduleForm: FormGroup = this.fb.group({
    casa_id: ['', [Validators.required]],
    fecha_hora_inicio: ['', [Validators.required]],
    fecha_hora_fin: ['', [Validators.required]]
  }, { validators: [this.dateRangeValidator, this.conflictValidator.bind(this)] });

  ngOnInit(): void {
    this.loadMyProperties();
    this.loadVisitSchedules();
  }

  loadMyProperties(): void {
    // Mock data - in real app would call propertyService.getMyProperties()
    this.myProperties.set([
      {
        id: 1,
        nombre: 'Casa en el Norte',
        ubicacion: { ciudad: 'Medellín' } as any
      } as Property,
      {
        id: 2,
        nombre: 'Apartamento Centro',
        ubicacion: { ciudad: 'Bogotá' } as any
      } as Property
    ]);
  }

  loadVisitSchedules(): void {
    // Mock data - in real app would call visitService.getVendorSchedules()
    this.visitSchedules.set([]);
  }

  dateRangeValidator(group: FormGroup) {
    const inicio = group.get('fecha_hora_inicio')?.value;
    const fin = group.get('fecha_hora_fin')?.value;
    
    if (inicio && fin && new Date(inicio) >= new Date(fin)) {
      return { dateRange: true };
    }
    return null;
  }

  conflictValidator(group: FormGroup) {
    const inicio = group.get('fecha_hora_inicio')?.value;
    const fin = group.get('fecha_hora_fin')?.value;
    
    if (!inicio || !fin) return null;

    const inicioDate = new Date(inicio);
    const finDate = new Date(fin);
    
    const hasConflict = this.visitSchedules().some(schedule => {
      if (this.editingSchedule() && schedule.id === this.editingSchedule()!.id) {
        return false; // Skip current schedule when editing
      }
      
      const scheduleInicio = new Date(schedule.fechaHoraInicio);
      const scheduleFin = new Date(schedule.fechaHoraFin);
      
      return (inicioDate < scheduleFin && finDate > scheduleInicio);
    });
    
    return hasConflict ? { conflictingSchedule: true } : null;
  }

  toggleForm(): void {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.scheduleForm.reset();
    this.editingSchedule.set(null);
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      this.isSubmitting.set(true);
      
      const formData = this.scheduleForm.value as VisitScheduleRequest;
      formData.vendedorId = 1; // Current vendor ID
      
      // Simulate API call
      setTimeout(() => {
        const property = this.myProperties().find(p => p.id === formData.casaId)!;
        const newSchedule: VisitSchedule = {
          id: Date.now(),
          vendedorId: formData.vendedorId,
          casaId: formData.casaId,
          fechaHoraInicio: formData.fechaHoraInicio,
          fechaHoraFin: formData.fechaHoraFin,
          espaciosDisponibles: 2,
          vendedor: { id: 1, nombre: 'Vendedor Actual' } as any,
          casa: property,
          visitasAgendadas: []
        };
        
        if (this.editingSchedule()) {
          // Update existing schedule
          const updated = this.visitSchedules().map(s => 
            s.id === this.editingSchedule()!.id ? { ...newSchedule, id: this.editingSchedule()!.id } : s
          );
          this.visitSchedules.set(updated);
        } else {
          // Add new schedule
          this.visitSchedules.set([...this.visitSchedules(), newSchedule]);
        }
        
        this.resetForm();
        this.showForm.set(false);
        this.isSubmitting.set(false);
      }, 1000);
    }
  }

  editSchedule(schedule: VisitSchedule): void {
    this.editingSchedule.set(schedule);
    this.scheduleForm.patchValue({
      casa_id: schedule.casa.id,
      fecha_hora_inicio: new Date(schedule.fechaHoraInicio).toISOString().slice(0, 16),
      fecha_hora_fin: new Date(schedule.fechaHoraFin).toISOString().slice(0, 16)
    });
    this.showForm.set(true);
  }

  deleteSchedule(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este horario de visita?')) {
      const updated = this.visitSchedules().filter(s => s.id !== id);
      this.visitSchedules.set(updated);
    }
  }

  getDuration(inicio: string, fin: string): string {
    const diff = new Date(fin).getTime() - new Date(inicio).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  getAvailabilityClass(visitCount: number): string {
    if (visitCount === 0) return 'bg-green-100 text-green-800';
    if (visitCount === 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getAvailabilityText(visitCount: number): string {
    if (visitCount === 0) return 'Disponible';
    if (visitCount === 1) return 'Parcialmente Ocupado';
    return 'Ocupado';
  }
}
