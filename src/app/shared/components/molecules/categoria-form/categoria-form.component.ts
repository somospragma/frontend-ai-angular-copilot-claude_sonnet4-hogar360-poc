import { Component, Output, EventEmitter, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from '../../atoms/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CreateCategoriaRequest, Categoria } from '../../../../core/interfaces/categoria.interface';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form [formGroup]="categoriaForm" (ngSubmit)="onSubmit()" class="categoria-form">
      <div class="form-header">
        <h2 class="form-title">
          {{ editMode ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h2>
        <p class="form-description">
          {{ editMode ? 'Actualiza los datos de la categoría' : 'Crea una nueva categoría de inmueble' }}
        </p>
      </div>

      <div class="form-fields">
        <app-input
          label="Nombre de la categoría"
          type="text"
          placeholder="Ej: Apartamentos, Casas, Oficinas..."
          formControlName="nombre"
          [required]="true"
          [maxlength]="50"
          [showCharacterCount]="true"
          helperText="Máximo 50 caracteres"
        />

        <app-input
          label="Descripción"
          type="textarea"
          placeholder="Describe las características principales de esta categoría..."
          formControlName="descripcion"
          [required]="true"
          [maxlength]="90"
          [rows]="3"
          [showCharacterCount]="true"
          helperText="Máximo 90 caracteres"
        />
      </div>

      <div class="form-actions">
        <app-button
          type="button"
          variant="ghost"
          (clicked)="onCancel()"
          [disabled]="loading"
        >
          Cancelar
        </app-button>
        
        <app-button
          type="submit"
          variant="primary"
          [loading]="loading"
          [disabled]="categoriaForm.invalid || loading"
        >
          {{ editMode ? 'Actualizar' : 'Crear' }} Categoría
        </app-button>
      </div>

      <!-- Validation Errors -->
      <div *ngIf="categoriaForm.invalid && categoriaForm.touched" class="validation-errors">
        <div *ngIf="categoriaForm.get('nombre')?.errors?.['required']" class="error-message">
          El nombre es obligatorio
        </div>
        <div *ngIf="categoriaForm.get('nombre')?.errors?.['maxlength']" class="error-message">
          El nombre no puede exceder 50 caracteres
        </div>
        <div *ngIf="categoriaForm.get('descripcion')?.errors?.['required']" class="error-message">
          La descripción es obligatoria
        </div>
        <div *ngIf="categoriaForm.get('descripcion')?.errors?.['maxlength']" class="error-message">
          La descripción no puede exceder 90 caracteres
        </div>
      </div>
    </form>
  `,
  styles: [`
    .categoria-form {
      @apply bg-white rounded-lg border border-gray-200 p-6;
    }

    .form-header {
      @apply mb-6;
    }

    .form-title {
      @apply text-xl font-semibold text-gray-900 mb-2;
    }

    .form-description {
      @apply text-gray-600 text-sm;
    }

    .form-fields {
      @apply space-y-4 mb-6;
    }

    .form-actions {
      @apply flex justify-end gap-3;
    }

    .validation-errors {
      @apply mt-4 space-y-2;
    }

    .error-message {
      @apply text-red-600 text-sm flex items-center gap-2;
    }

    .error-message::before {
      content: '⚠';
      @apply text-red-500;
    }

    /* Mobile First */
    @media (max-width: 640px) {
      .categoria-form {
        @apply p-4;
      }

      .form-actions {
        @apply flex-col-reverse gap-2;
      }

      .form-actions app-button {
        @apply w-full;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriaFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() loading = false;
  @Input() editMode = false;
  @Input() initialData: Categoria | null = null;

  @Output() formSubmit = new EventEmitter<CreateCategoriaRequest>();
  @Output() formCancel = new EventEmitter<void>();

  categoriaForm: FormGroup;

  constructor() {
    this.categoriaForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.editMode && this.initialData) {
      this.loadInitialData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/) // Solo letras y espacios
      ]],
      descripcion: ['', [
        Validators.required,
        Validators.maxLength(90)
      ]]
    });
  }

  private loadInitialData(): void {
    if (this.initialData) {
      this.categoriaForm.patchValue({
        nombre: this.initialData.nombre,
        descripcion: this.initialData.descripcion
      });
    }
  }

  onSubmit(): void {
    if (this.categoriaForm.valid && !this.loading) {
      const formValue = this.categoriaForm.value;
      this.formSubmit.emit({
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion.trim()
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  resetForm(): void {
    this.categoriaForm.reset();
  }
}
