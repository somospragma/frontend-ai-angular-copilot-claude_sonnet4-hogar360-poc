import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitScheduleFormComponent } from '../../molecules/visit-schedule-form/visit-schedule-form.component';
import { VisitScheduleListComponent } from '../../molecules/visit-schedule-list/visit-schedule-list.component';
import { Property } from '../../../../core/interfaces/property.interface';
import { VisitSchedule, VisitScheduleRequest } from '../../../../core/interfaces/visit.interface';

@Component({
  selector: 'app-visit-schedule-manager',
  standalone: true,
  imports: [
    CommonModule,
    VisitScheduleFormComponent,
    VisitScheduleListComponent
  ],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Formulario -->
      <div class="lg:order-1">
        <app-visit-schedule-form
          [properties]="properties"
          [editingSchedule]="editingSchedule"
          [isSubmitting]="isSubmitting"
          [minDateTime]="minDateTime"
          [maxDateTime]="maxDateTime"
          (scheduleSubmit)="onScheduleSubmit($event)"
          (formReset)="onFormReset()"
        />
      </div>

      <!-- Lista de Horarios -->
      <div class="lg:order-2">
        <app-visit-schedule-list
          [schedules]="schedules"
          (edit)="onEditSchedule($event)"
          (delete)="onDeleteSchedule($event)"
        />
      </div>
    </div>
  `
})
export class VisitScheduleManagerComponent {
  @Input() properties: Property[] = [];
  @Input() schedules: VisitSchedule[] = [];
  @Input() editingSchedule: VisitSchedule | null = null;
  @Input() isSubmitting: boolean = false;
  @Input() minDateTime!: string;
  @Input() maxDateTime!: string;

  @Output() scheduleSubmit = new EventEmitter<VisitScheduleRequest>();
  @Output() scheduleEdit = new EventEmitter<VisitSchedule>();
  @Output() scheduleDelete = new EventEmitter<number>();
  @Output() formReset = new EventEmitter<void>();

  onScheduleSubmit(scheduleRequest: VisitScheduleRequest): void {
    this.scheduleSubmit.emit(scheduleRequest);
  }

  onEditSchedule(schedule: VisitSchedule): void {
    this.scheduleEdit.emit(schedule);
  }

  onDeleteSchedule(scheduleId: number): void {
    this.scheduleDelete.emit(scheduleId);
  }

  onFormReset(): void {
    this.formReset.emit();
  }
}
