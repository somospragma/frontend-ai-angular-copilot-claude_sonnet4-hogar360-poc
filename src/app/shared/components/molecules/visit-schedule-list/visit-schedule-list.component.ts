import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../atoms/button/button.component';
import { VisitSchedule } from '../../../../core/interfaces/visit.interface';

@Component({
  selector: 'app-visit-schedule-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-secondary-200">
        <h2 class="text-lg font-semibold text-secondary-900">Mis Horarios de Visitas</h2>
      </div>

      <div *ngIf="schedules.length === 0" class="p-6 text-center text-secondary-600">
        <p>No tienes horarios programados</p>
      </div>

      <div *ngIf="schedules.length > 0" class="p-6">
        <div class="space-y-3">
          <div 
            *ngFor="let schedule of schedules; trackBy: trackByScheduleId" 
            class="border border-secondary-200 rounded-lg p-4"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-semibold text-secondary-900">
                  {{ schedule.casa.nombre || 'Propiedad' }}
                </h4>
                <div class="text-sm text-secondary-600 mt-1">
                  <span>{{ schedule.fechaHoraInicio | date:'dd/MM/yyyy HH:mm' }}</span>
                  <span class="mx-2">-</span>
                  <span>{{ schedule.fechaHoraFin | date:'HH:mm' }}</span>
                </div>
                <div class="text-sm text-secondary-600 mt-1">
                  Visitas agendadas: {{ schedule.visitasAgendadas?.length || 0 }}
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  (click)="onEdit(schedule)"
                  class="text-primary-600 hover:text-primary-700 transition-colors"
                  title="Editar"
                  [attr.aria-label]="'Editar horario de ' + (schedule.casa.nombre || 'propiedad')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                
                <button
                  (click)="onDelete(schedule.id)"
                  class="text-red-600 hover:text-red-700 transition-colors"
                  title="Eliminar"
                  [attr.aria-label]="'Eliminar horario de ' + (schedule.casa.nombre || 'propiedad')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VisitScheduleListComponent {
  @Input() schedules: VisitSchedule[] = [];
  
  @Output() edit = new EventEmitter<VisitSchedule>();
  @Output() delete = new EventEmitter<number>();

  trackByScheduleId(index: number, schedule: VisitSchedule): number {
    return schedule.id;
  }

  onEdit(schedule: VisitSchedule): void {
    this.edit.emit(schedule);
  }

  onDelete(scheduleId: number): void {
    this.delete.emit(scheduleId);
  }
}
