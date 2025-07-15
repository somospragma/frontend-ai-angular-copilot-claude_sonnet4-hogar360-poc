import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectComponent, SelectOption } from '../../atoms/select/select.component';
import { DateTimeInputComponent } from '../../atoms/datetime-input/datetime-input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { Property } from '../../../../core/interfaces/property.interface';
import { VisitSchedule, VisitScheduleRequest } from '../../../../core/interfaces/visit.interface';

@Component({
  selector: 'app-visit-schedule-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    SelectComponent, 
    DateTimeInputComponent, 
    ButtonComponent
  ],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold text-secondary-900 mb-4">
        {{ editingSchedule ? 'Editar Horario' : 'Nuevo Horario' }}
      </h2>
      
      <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Propiedad -->
        <app-select
          label="Propiedad"
          placeholder="Selecciona una propiedad"
          [options]="propertyOptions"
          [required]="true"
          formControlName="casaId"
          [errorMessage]="getFieldError('casaId')"
        />

        <!-- Fecha y Hora de Inicio -->
        <app-datetime-input
          label="Fecha y Hora de Inicio"
          type="datetime-local"
          [required]="true"
          [min]="minDateTime"
          [max]="maxDateTime"
          formControlName="fechaHoraInicio"
          [errorMessage]="getFieldError('fechaHoraInicio')"
        />

        <!-- Fecha y Hora de Fin -->
        <app-datetime-input
          label="Fecha y Hora de Fin"
          type="datetime-local"
          [required]="true"
          [min]="scheduleForm.get('fechaHoraInicio')?.value"
          [max]="maxDateTime"
          formControlName="fechaHoraFin"
          [errorMessage]="getFieldError('fechaHoraFin')"
        />

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-4">
          <app-button
            type="button"
            variant="outline"
            size="md"
            (click)="onReset()"
          >
            Limpiar
          </app-button>
          
          <app-button
            type="submit"
            variant="primary"
            size="md"
            [disabled]="scheduleForm.invalid || isSubmitting"
            [loading]="isSubmitting"
          >
            {{ editingSchedule ? 'Actualizar' : 'Crear' }}
          </app-button>
        </div>
      </form>
    </div>
  `
})
export class VisitScheduleFormComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() properties: Property[] = [];
  @Input() editingSchedule: VisitSchedule | null = null;
  @Input() isSubmitting: boolean = false;
  @Input() minDateTime!: string;
  @Input() maxDateTime!: string;

  @Output() scheduleSubmit = new EventEmitter<VisitScheduleRequest>();
  @Output() formReset = new EventEmitter<void>();

  scheduleForm!: FormGroup;
  propertyOptions: SelectOption[] = [];

  ngOnInit() {
    this.initForm();
    this.updatePropertyOptions();
    
    if (this.editingSchedule) {
      this.loadEditingData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['properties'] && this.properties) {
      this.updatePropertyOptions();
    }
    
    if (changes['editingSchedule'] && this.editingSchedule) {
      this.loadEditingData();
    }
  }

  private initForm() {
    this.scheduleForm = this.fb.group({
      casaId: ['', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      fechaHoraFin: ['', Validators.required]
    });
  }

  private updatePropertyOptions() {
    this.propertyOptions = this.properties.map(property => ({
      value: property.id,
      label: property.nombre || 'Propiedad sin nombre'
    }));
  }

  private loadEditingData() {
    if (this.editingSchedule && this.scheduleForm) {
      this.scheduleForm.patchValue({
        casaId: this.editingSchedule.casaId,
        fechaHoraInicio: this.formatDateForInput(new Date(this.editingSchedule.fechaHoraInicio)),
        fechaHoraFin: this.formatDateForInput(new Date(this.editingSchedule.fechaHoraFin))
      });
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      const formData = this.scheduleForm.value;
      const scheduleRequest: VisitScheduleRequest = {
        vendedorId: 0, // Será asignado por el componente padre
        casaId: parseInt(formData.casaId),
        fechaHoraInicio: formData.fechaHoraInicio,
        fechaHoraFin: formData.fechaHoraFin
      };
      
      this.scheduleSubmit.emit(scheduleRequest);
    }
  }

  onReset() {
    this.scheduleForm.reset();
    this.formReset.emit();
  }

  getFieldError(fieldName: string): string | undefined {
    const field = this.scheduleForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        const fieldLabels: { [key: string]: string } = {
          casaId: 'La propiedad',
          fechaHoraInicio: 'La fecha y hora de inicio',
          fechaHoraFin: 'La fecha y hora de fin'
        };
        return `${fieldLabels[fieldName]} es requerida`;
      }
    }
    return undefined;
  }
}
