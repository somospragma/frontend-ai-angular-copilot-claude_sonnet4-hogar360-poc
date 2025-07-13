import { Component, Output, EventEmitter, signal, ViewContainerRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InputFieldComponent } from '../../atoms/input-field/input-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { AlertService } from '../../../services/alert.service';
import { CategoryService } from '../../../../core/services/category.service';
import { createUniqueCategoryNameValidator } from '../../../../core/validators/category.validators';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, ButtonComponent],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Crear Categoría</h2>
      
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <!-- Category Name -->
        <app-input-field
          label="Nombre de la Categoría"
          type="text"
          [value]="nameValue()"
          (valueChange)="updateName($event)"
          placeholder="Escribe el nombre de la categoría (máximo 50 caracteres)"
          [required]="true"
          [maxLength]="50"
          [errors]="getFieldErrors('name')"
          [loading]="isValidatingName()"
        ></app-input-field>

        <!-- Description -->
        <app-input-field
          label="Descripción"
          type="textarea"
          [value]="descriptionValue()"
          (valueChange)="updateDescription($event)"
          placeholder="Enter category description"
          [required]="true"
          [maxLength]="90"
          [rows]="5"
          [showCounter]="true"
          [errors]="getFieldErrors('description')"
        ></app-input-field>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <app-button
            variant="primary"
            type="submit"
            [disabled]="categoryForm.invalid || isSubmitting()"
            [loading]="isSubmitting()"
          >
            {{ isSubmitting() ? 'Creando...' : 'Crear' }}
          </app-button>
        </div>
      </form>
    </div>
  `
})
export class CategoryFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);
  private readonly alertService = inject(AlertService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  @Output() categoryCreated = new EventEmitter<void>();

  // Signals for form values
  nameValue = signal('');
  descriptionValue = signal('');
  isSubmitting = signal(false);
  isValidatingName = signal(false);

  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)], [createUniqueCategoryNameValidator(this.categoryService)]],
      description: ['', [Validators.required, Validators.maxLength(90)]]
    });

    // Set up alert service
    this.alertService.setViewContainerRef(this.viewContainerRef);
  }

  updateName(value: string) {
    this.nameValue.set(value);
    
    // Mostrar loading cuando se inicia la validación
    const nameControl = this.categoryForm.get('name');
    if (nameControl) {
      this.isValidatingName.set(true);
      
      nameControl.setValue(value);
      nameControl.markAsTouched();
      
      // Escuchar cuando termine la validación asíncrona
      nameControl.statusChanges.subscribe((status) => {
        if (status !== 'PENDING') {
          this.isValidatingName.set(false);
        }
      });
    }
  }

  updateDescription(value: string) {
    this.descriptionValue.set(value);
    this.categoryForm.get('description')?.setValue(value);
    this.categoryForm.get('description')?.markAsTouched();
  }

  getFieldErrors(fieldName: string): string[] {
    const field = this.categoryForm.get(fieldName);
    
    if (!field?.errors || !field?.touched) {
      return [];
    }

    return this.buildErrorMessages(fieldName, field.errors);
  }

  private buildErrorMessages(fieldName: string, errors: any): string[] {
    const messages: string[] = [];
    const isNameField = fieldName === 'name';
    const fieldDisplayName = isNameField ? 'El nombre de la categoría' : 'La descripción';
    const maxLength = isNameField ? 50 : 90;

    if (errors['required']) {
      messages.push(`${fieldDisplayName} es requerido`);
    }
    
    if (errors['maxlength']) {
      messages.push(`${isNameField ? 'El nombre' : 'La descripción'} no puede exceder ${maxLength} caracteres`);
    }
    
    if (errors['nameExists']) {
      messages.push('Ya existe una categoría con este nombre');
    }

    return messages;
  }

  async onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.categoryForm.value;
      const newCategory = {
        nombre: formValue.name.trim(), // Usar 'nombre' según la interfaz
        descripcion: formValue.description.trim() // Usar 'descripcion' según la interfaz
      };

      await firstValueFrom(this.categoryService.createCategory(newCategory));
      
      await this.alertService.success(
        'Éxito',
        `Categoría "${newCategory.nombre}" creada exitosamente`
      );

      this.resetForm();
      this.categoryCreated.emit();
    } catch (error) {
      console.error('Error creating category:', error);
      await this.alertService.error(
        'Error',
        'Error al crear la categoría. Por favor intenta nuevamente.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private resetForm() {
    this.categoryForm.reset();
    this.nameValue.set('');
    this.descriptionValue.set('');
  }
}
