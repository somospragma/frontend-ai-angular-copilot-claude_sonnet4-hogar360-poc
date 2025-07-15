import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VisitService } from '../../core/services/visit.service';
import { PropertyService } from '../../core/services/property.service';
import { AlertService } from '../../shared/services/alert.service';
import { VisitSchedule, VisitScheduleRequest } from '../../core/interfaces/visit.interface';
import { Property } from '../../core/interfaces/property.interface';

@Component({
  selector: 'app-visit-schedules',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header -->
      <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Horarios de Visitas</h1>
        <p class="text-gray-600">Configura los horarios disponibles para que los compradores puedan agendar visitas</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Formulario -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ editingSchedule() ? 'Editar Horario' : 'Nuevo Horario' }}
          </h2>
          
          <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Propiedad -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Propiedad *</label>
              <select formControlName="casaId" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Selecciona una propiedad</option>
                @for (property of myProperties(); track property.id) {
                  <option [value]="property.id">{{ property.nombre }}</option>
                }
              </select>
              @if (scheduleForm.get('casaId')?.invalid && scheduleForm.get('casaId')?.touched) {
                <div class="text-red-500 text-sm mt-1">La propiedad es requerida</div>
              }
            </div>

            <!-- Fecha y Hora de Inicio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de Inicio *</label>
              <input
                type="datetime-local"
                formControlName="fechaHoraInicio"
                [min]="minDateTime"
                [max]="maxDateTime"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              @if (scheduleForm.get('fechaHoraInicio')?.invalid && scheduleForm.get('fechaHoraInicio')?.touched) {
                <div class="text-red-500 text-sm mt-1">La fecha y hora de inicio es requerida</div>
              }
            </div>

            <!-- Fecha y Hora de Fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora de Fin *</label>
              <input
                type="datetime-local"
                formControlName="fechaHoraFin"
                [min]="scheduleForm.get('fechaHoraInicio')?.value"
                [max]="maxDateTime"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              @if (scheduleForm.get('fechaHoraFin')?.invalid && scheduleForm.get('fechaHoraFin')?.touched) {
                <div class="text-red-500 text-sm mt-1">La fecha y hora de fin es requerida</div>
              }
            </div>

            <!-- Botones -->
            <div class="flex gap-3 pt-4">
              <button
                type="submit"
                [disabled]="scheduleForm.invalid || isSubmitting()"
                class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ isSubmitting() ? 'Guardando...' : (editingSchedule() ? 'Actualizar' : 'Crear') }}
              </button>
              <button
                type="button"
                (click)="resetForm()"
                class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Horarios -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Mis Horarios de Visitas</h2>

          @if (visitSchedules().length === 0) {
            <div class="text-center py-8">
              <p class="text-gray-500">No tienes horarios programados</p>
            </div>
          } @else {
            <div class="space-y-3">
              @for (schedule of visitSchedules(); track schedule.id) {
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">{{ schedule.casa.nombre || 'Propiedad' }}</h4>
                      <div class="text-sm text-gray-600 mt-1">
                        <span>{{ schedule.fechaHoraInicio | date:'dd/MM/yyyy HH:mm' }}</span>
                        <span class="mx-2">-</span>
                        <span>{{ schedule.fechaHoraFin | date:'HH:mm' }}</span>
                      </div>
                      <div class="text-sm text-gray-500 mt-1">
                        Visitas agendadas: {{ schedule.visitasAgendadas?.length || 0 }}
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                      <button
                        (click)="editSchedule(schedule)"
                        class="text-blue-500 hover:text-blue-700 p-1"
                        title="Editar"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        (click)="deleteSchedule(schedule.id)"
                        class="text-red-500 hover:text-red-700 p-1"
                        title="Eliminar"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class VisitSchedulesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly visitService = inject(VisitService);
  private readonly propertyService = inject(PropertyService);
  private readonly alertService = inject(AlertService);

  scheduleForm!: FormGroup;
  visitSchedules = signal<VisitSchedule[]>([]);
  myProperties = signal<Property[]>([]);
  editingSchedule = signal<VisitSchedule | null>(null);
  isSubmitting = signal(false);

  minDateTime!: string;
  maxDateTime!: string;

  ngOnInit() {
    this.initForm();
    this.loadMyProperties();
    this.loadMySchedules();
    this.setDateTimeConstraints();
  }

  private initForm() {
    this.scheduleForm = this.fb.group({
      casaId: ['', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      fechaHoraFin: ['', Validators.required]
    });
  }

  private setDateTimeConstraints() {
    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 21); // 3 semanas

    this.minDateTime = this.formatDateForInput(now);
    this.maxDateTime = this.formatDateForInput(maxDate);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private loadMyProperties() {
    this.propertyService.getMyProperties().subscribe({
      next: (properties: Property[]) => {
        this.myProperties.set(properties);
      },
      error: (error: any) => {
        console.error('Error loading properties:', error);
      }
    });
  }

  private loadMySchedules() {
    this.visitService.getMySchedules().subscribe({
      next: (schedules: VisitSchedule[]) => {
        this.visitSchedules.set(schedules);
      },
      error: (error: any) => {
        console.error('Error loading schedules:', error);
      }
    });
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      this.isSubmitting.set(true);
      const formData = this.scheduleForm.value;
      
      const scheduleRequest: VisitScheduleRequest = {
        vendedorId: 1, // TODO: obtener del AuthService
        casaId: parseInt(formData.casaId),
        fechaHoraInicio: formData.fechaHoraInicio,
        fechaHoraFin: formData.fechaHoraFin
      };

      const operation = this.editingSchedule() 
        ? this.visitService.updateSchedule(this.editingSchedule()!.id, scheduleRequest)
        : this.visitService.createSchedule(scheduleRequest);

      operation.subscribe({
        next: (response: VisitSchedule) => {
          this.loadMySchedules();
          this.resetForm();
          this.isSubmitting.set(false);
          console.log('Horario guardado:', response);
        },
        error: (error: any) => {
          console.error('Error saving schedule:', error);
          this.isSubmitting.set(false);
        }
      });
    }
  }

  editSchedule(schedule: VisitSchedule) {
    this.editingSchedule.set(schedule);
    this.scheduleForm.patchValue({
      casaId: schedule.casaId,
      fechaHoraInicio: this.formatDateForInput(new Date(schedule.fechaHoraInicio)),
      fechaHoraFin: this.formatDateForInput(new Date(schedule.fechaHoraFin))
    });
  }

  deleteSchedule(scheduleId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      this.visitService.deleteSchedule(scheduleId).subscribe({
        next: () => {
          this.loadMySchedules();
          console.log('Horario eliminado');
        },
        error: (error: any) => {
          console.error('Error deleting schedule:', error);
        }
      });
    }
  }

  resetForm() {
    this.scheduleForm.reset();
    this.editingSchedule.set(null);
  }
}
