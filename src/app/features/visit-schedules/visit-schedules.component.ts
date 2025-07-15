import { Component, signal, inject, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitService } from '../../core/services/visit.service';
import { PropertyService } from '../../core/services/property.service';
import { AlertService } from '../../shared/services/alert.service';
import { VisitSchedule, VisitScheduleRequest } from '../../core/interfaces/visit.interface';
import { AuthFacade } from '../../core/facades/auth.facade';
import { Property } from '../../core/interfaces/property.interface';
import { VisitScheduleManagerComponent } from '../../shared/components/organisms/visit-schedule-manager/visit-schedule-manager.component';

@Component({
  selector: 'app-visit-schedules',
  standalone: true,
  imports: [CommonModule, VisitScheduleManagerComponent],
  template: `
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">Gestión de Horarios de Visitas</h1>
      </div>
      
      <div class="mb-6">
        <p class="text-secondary-600">Configura los horarios disponibles para que los compradores puedan agendar visitas</p>
      </div>

      <!-- Visit Schedule Manager Organism -->
      <app-visit-schedule-manager
        [properties]="myProperties()"
        [schedules]="visitSchedules()"
        [editingSchedule]="editingSchedule()"
        [isSubmitting]="isSubmitting()"
        [minDateTime]="minDateTime"
        [maxDateTime]="maxDateTime"
        (scheduleSubmit)="onScheduleSubmit($event)"
        (scheduleEdit)="editSchedule($event)"
        (scheduleDelete)="deleteSchedule($event)"
        (formReset)="resetForm()"
      />
    </div>
  `
})
export class VisitSchedulesComponent implements OnInit {
  private readonly visitService = inject(VisitService);
  private readonly propertyService = inject(PropertyService);
  private readonly alertService = inject(AlertService);
  private readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  visitSchedules = signal<VisitSchedule[]>([]);
  myProperties = signal<Property[]>([]);
  editingSchedule = signal<VisitSchedule | null>(null);
  isSubmitting = signal(false);

  minDateTime!: string;
  maxDateTime!: string;

  ngOnInit() {
    // Configurar AlertService para modales
    this.alertService.setViewContainerRef(this.viewContainerRef);
    this.loadMyProperties();
    this.loadMySchedules();
    this.setDateTimeConstraints();
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

  onScheduleSubmit(scheduleRequest: VisitScheduleRequest) {
    this.isSubmitting.set(true);
    const currentUser = this.authFacade.getCurrentUser() as { id: number } | null;
    
    // Asignar el vendedorId
    scheduleRequest.vendedorId = currentUser ? currentUser.id : 0;

    const operation = this.editingSchedule()
      ? this.visitService.updateSchedule(this.editingSchedule()!.id, scheduleRequest)
      : this.visitService.createSchedule(scheduleRequest);

    operation.subscribe({
      next: (response: VisitSchedule) => {
        this.loadMySchedules();
        this.resetForm();
        this.isSubmitting.set(false);
        this.alertService.success('Éxito', 'Horario guardado exitosamente');
        console.log('Horario guardado:', response);
      },
      error: (error: any) => {
        console.error('Error saving schedule:', error);
        this.alertService.error('Error', 'Error al guardar el horario');
        this.isSubmitting.set(false);
      }
    });
  }

  editSchedule(schedule: VisitSchedule) {
    this.editingSchedule.set(schedule);
  }

  // > Reemplazando el confirm nativo por AlertService.confirm modal
  async deleteSchedule(scheduleId: number): Promise<void> {
    // Mostrar modal de confirmación
    const confirmed = await this.alertService.confirm(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.',
      'Eliminar',
      'Cancelar'
    );
    if (confirmed) {
      this.visitService.deleteSchedule(scheduleId).subscribe({
        next: () => {
          this.loadMySchedules();
          console.log('Horario eliminado');
        },
        error: (error: any) => {
          console.error('Error deleting schedule:', error);
          this.alertService.error('Error', 'Error al eliminar el horario. Por favor intenta nuevamente.');
        }
      });
    }
  }

  resetForm() {
    this.editingSchedule.set(null);
  }
}
