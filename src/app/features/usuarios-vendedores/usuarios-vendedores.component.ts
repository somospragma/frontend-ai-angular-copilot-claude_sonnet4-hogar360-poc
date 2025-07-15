import { Component, signal, inject, ViewContainerRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { InputComponent } from '../../shared/components/atoms/input/input.component';
import { AlertService } from '../../shared/services/alert.service';

interface UsuarioVendedor {
  id?: number;
  nombre: string;
  apellido: string;
  documento: string;
  celular: string;
  fechaNacimiento: string;
  correo: string;
  clave: string;
  rol: 'VENDEDOR';
  fechaCreacion?: string;
}

@Component({
  selector: 'app-usuarios-vendedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  template: `
    <div class="usuarios-vendedores-page">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">Gestión de Usuarios Vendedores</h1>
        <button 
          (click)="toggleForm()"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          @if (showForm()) {
            Cancelar
          } @else {
            Nuevo Vendedor
          }
        </button>
      </div>

      <!-- Form Section -->
      @if (showForm()) {
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-secondary-900 mb-4">
            @if (editingVendedor()) {
              Editar Vendedor
            } @else {
              Nuevo Usuario Vendedor
            }
          </h2>
          
          <form [formGroup]="vendedorForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre -->
              <app-input
                label="Nombre"
                type="text"
                placeholder="Nombre del vendedor"
                formControlName="nombre"
                [required]="true"
                helperText="Nombre completo"
              />

              <!-- Apellido -->
              <app-input
                label="Apellido"
                type="text"
                placeholder="Apellido del vendedor"
                formControlName="apellido"
                [required]="true"
                helperText="Apellido completo"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Documento -->
              <app-input
                label="Documento de Identidad"
                type="text"
                placeholder="Número de documento"
                formControlName="documento"
                [required]="true"
                helperText="Solo números, sin puntos ni espacios"
              />

              <!-- Celular -->
              <app-input
                label="Celular"
                type="tel"
                placeholder="+573001234567"
                formControlName="celular"
                [required]="true"
                [maxlength]="13"
                helperText="Máximo 13 caracteres, solo números y símbolo +"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Fecha de Nacimiento -->
              <app-input
                label="Fecha de Nacimiento"
                type="date"
                formControlName="fechaNacimiento"
                [required]="true"
                helperText="Debe ser mayor de edad"
              />

              <!-- Correo -->
              <app-input
                label="Correo Electrónico"
                type="email"
                placeholder="vendedor@email.com"
                formControlName="correo"
                [required]="true"
                helperText="Formato de email válido"
              />
            </div>

            @if (!editingVendedor()) {
              <!-- Clave (solo para nuevos usuarios) -->
              <app-input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                formControlName="clave"
                [required]="true"
                helperText="Mínimo 8 caracteres, debe incluir: mayúscula, minúscula, número y carácter especial"
              />
            }

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
                [disabled]="vendedorForm.invalid || isSubmitting()"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                @if (isSubmitting()) {
                  Guardando...
                } @else if (editingVendedor()) {
                  Actualizar
                } @else {
                  Crear Vendedor
                }
              </button>
            </div>
          </form>

          <!-- Form Validation Errors -->
          @if (vendedorForm.invalid && vendedorForm.touched) {
            <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 class="text-sm font-medium text-red-800 mb-2">Errores en el formulario:</h3>
              <ul class="text-sm text-red-700 space-y-1">
                @if (vendedorForm.get('nombre')?.errors?.['required']) {
                  <li>• El nombre es requerido</li>
                }
                @if (vendedorForm.get('apellido')?.errors?.['required']) {
                  <li>• El apellido es requerido</li>
                }
                @if (vendedorForm.get('documento')?.errors?.['required']) {
                  <li>• El documento de identidad es requerido</li>
                }
                @if (vendedorForm.get('documento')?.errors?.['pattern']) {
                  <li>• El documento debe contener solo números</li>
                }
                @if (vendedorForm.get('celular')?.errors?.['required']) {
                  <li>• El celular es requerido</li>
                }
                @if (vendedorForm.get('celular')?.errors?.['phoneLength']) {
                  <li>• El celular debe tener máximo 13 caracteres</li>
                }
                @if (vendedorForm.get('celular')?.errors?.['phoneFormat']) {
                  <li>• El celular solo puede contener números y opcionalmente el símbolo + al inicio</li>
                }
                @if (vendedorForm.get('celular')?.errors?.['phoneMinLength']) {
                  <li>• Si incluye +, debe tener al menos 10 dígitos después</li>
                }
                @if (vendedorForm.get('fechaNacimiento')?.errors?.['required']) {
                  <li>• La fecha de nacimiento es requerida</li>
                }
                @if (vendedorForm.get('fechaNacimiento')?.errors?.['age']) {
                  <li>• El vendedor debe ser mayor de edad (18 años)</li>
                }
                @if (vendedorForm.get('correo')?.errors?.['required']) {
                  <li>• El correo electrónico es requerido</li>
                }
                @if (vendedorForm.get('correo')?.errors?.['email']) {
                  <li>• El formato del correo electrónico no es válido</li>
                }
                @if (vendedorForm.get('clave')?.errors?.['required']) {
                  <li>• La contraseña es requerida</li>
                }
                @if (vendedorForm.get('clave')?.errors?.['minlength']) {
                  <li>• La contraseña debe tener mínimo 8 caracteres</li>
                }
                @if (vendedorForm.get('clave')?.errors?.['uppercase']) {
                  <li>• Debe incluir al menos una letra mayúscula</li>
                }
                @if (vendedorForm.get('clave')?.errors?.['lowercase']) {
                  <li>• Debe incluir al menos una letra minúscula</li>
                }
                @if (vendedorForm.get('clave')?.errors?.['number']) {
                  <li>• Debe incluir al menos un número</li>
                }
                @if (vendedorForm.get('clave')?.errors?.['special']) {
                  <li>• Debe incluir al menos un carácter especial (!&#64;#$%^&*)</li>
                }
              </ul>
            </div>
          }
        </div>
      }

      <!-- Vendors List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-secondary-200">
          <h2 class="text-lg font-semibold text-secondary-900">
            Vendedores Registrados ({{ vendedores().length }})
          </h2>
        </div>

        @if (vendedores().length === 0) {
          <div class="p-6 text-center text-secondary-600">
            No hay vendedores registrados.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Celular
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fecha Nacimiento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                @for (vendedor of vendedores(); track vendedor.id) {
                  <tr class="hover:bg-secondary-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      {{ vendedor.nombre }} {{ vendedor.apellido }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ vendedor.documento }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ vendedor.correo }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ vendedor.celular }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ vendedor.fechaNacimiento | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ vendedor.fechaCreacion | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        (click)="editVendedor(vendedor)"
                        class="text-primary-600 hover:text-primary-700 transition-colors">
                        Editar
                      </button>
                      <button 
                        (click)="deleteVendedor(vendedor.id!)"
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
    .usuarios-vendedores-page {
      @apply p-6 max-w-7xl mx-auto;
    }
  `]
})
export class UsuariosVendedoresComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  
  showForm = signal(false);
  isSubmitting = signal(false);
  editingVendedor = signal<UsuarioVendedor | null>(null);
  vendedores = signal<UsuarioVendedor[]>([
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '12345678',
      celular: '+573001234567',
      fechaNacimiento: '1985-05-15',
      correo: 'juan.perez@hogar360.com',
      clave: 'hashedpassword123',
      rol: 'VENDEDOR',
      fechaCreacion: '2025-01-15'
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'González',
      documento: '87654321',
      celular: '+573009876543',
      fechaNacimiento: '1990-08-22',
      correo: 'maria.gonzalez@hogar360.com',
      clave: 'hashedpassword456',
      rol: 'VENDEDOR',
      fechaCreacion: '2025-01-10'
    }
  ]);

  vendedorForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    documento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    celular: ['', [Validators.required, this.phoneValidator]],
    fechaNacimiento: ['', [Validators.required, this.ageValidator]],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]]
  });

  ngOnInit(): void {
    // Configure AlertService
    this.alertService.setViewContainerRef(this.viewContainerRef);
  }

  // Custom validator for age (must be 18 or older)
  ageValidator(control: any) {
    if (!control.value) return null;
    
    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age < 18 ? { age: true } : null;
  }

  // Custom validator for phone (max 13 characters, can contain +)
  phoneValidator(control: any) {
    if (!control.value) return null;
    
    const phone = control.value.toString();
    
    // Validar longitud máxima de 13 caracteres
    if (phone.length > 13) {
      return { phoneLength: true };
    }
    
    // Validar que solo contenga números y opcionalmente el símbolo +
    // El + solo puede estar al inicio
    const phonePattern = /^\+?\d+$/;
    if (!phonePattern.test(phone)) {
      return { phoneFormat: true };
    }
    
    // Si tiene +, debe tener al menos 10 dígitos después del +
    if (phone.startsWith('+') && phone.length < 11) {
      return { phoneMinLength: true };
    }
    
    return null;
  }

  // Custom validator for password strength
  passwordValidator(control: any) {
    if (!control.value) return null;
    
    const password = control.value;
    const errors: any = {};
    
    // Al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = true;
    }
    
    // Al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.lowercase = true;
    }
    
    // Al menos un número
    if (!/\d/.test(password)) {
      errors.number = true;
    }
    
    // Al menos un carácter especial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.special = true;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  toggleForm(): void {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.vendedorForm.reset();
    this.editingVendedor.set(null);
    
    // Update form validators based on whether we're editing or creating
    if (this.editingVendedor()) {
      this.vendedorForm.get('clave')?.setValidators([]);
    } else {
      this.vendedorForm.get('clave')?.setValidators([
        Validators.required, 
        Validators.minLength(8), 
        this.passwordValidator
      ]);
    }
    this.vendedorForm.get('clave')?.updateValueAndValidity();
  }

  async onSubmit(): Promise<void> {
    if (this.vendedorForm.valid) {
      this.isSubmitting.set(true);
      
      const formData = this.vendedorForm.value;
      
      // Check for duplicate documento
      const isDuplicateDoc = this.vendedores().some(vendedor => 
        vendedor.documento === formData.documento &&
        vendedor.id !== this.editingVendedor()?.id
      );
      
      if (isDuplicateDoc) {
        await this.alertService.error(
          'Error de validación',
          'Ya existe un vendedor con ese número de documento.'
        );
        this.isSubmitting.set(false);
        return;
      }

      // Check for duplicate correo
      const isDuplicateEmail = this.vendedores().some(vendedor => 
        vendedor.correo.toLowerCase() === formData.correo.toLowerCase() &&
        vendedor.id !== this.editingVendedor()?.id
      );
      
      if (isDuplicateEmail) {
        await this.alertService.error(
          'Error de validación',
          'Ya existe un vendedor con ese correo electrónico.'
        );
        this.isSubmitting.set(false);
        return;
      }

      setTimeout(async () => {
        try {
          if (this.editingVendedor()) {
            // Update existing vendedor (excluding password)
            const { clave, ...updateData } = formData;
            const updatedVendedores = this.vendedores().map(vendedor =>
              vendedor.id === this.editingVendedor()!.id
                ? { ...vendedor, ...updateData }
                : vendedor
            );
            this.vendedores.set(updatedVendedores);
            
            await this.alertService.success(
              'Éxito',
              `Vendedor "${updateData.nombre} ${updateData.apellido}" actualizado exitosamente`
            );
          } else {
            // Create new vendedor
            // Encriptar la contraseña con bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(formData.clave, saltRounds);
            
            const newVendedor: UsuarioVendedor = {
              id: Math.max(...this.vendedores().map(v => v.id!)) + 1,
              ...formData,
              rol: 'VENDEDOR' as const,
              fechaCreacion: new Date().toISOString().split('T')[0],
              clave: hashedPassword // Contraseña encriptada con bcrypt
            };
            this.vendedores.set([...this.vendedores(), newVendedor]);
            
            await this.alertService.success(
              'Éxito',
              `Vendedor "${formData.nombre} ${formData.apellido}" creado exitosamente`
            );
          }
          
          this.resetForm();
          this.showForm.set(false);
        } catch (error) {
          console.error('Error managing vendedor:', error);
          await this.alertService.error(
            'Error',
            'Error al procesar la información del vendedor. Por favor intenta nuevamente.'
          );
        } finally {
          this.isSubmitting.set(false);
        }
      }, 1000);
    }
  }

  editVendedor(vendedor: UsuarioVendedor): void {
    this.editingVendedor.set(vendedor);
    const { clave, ...formData } = vendedor;
    this.vendedorForm.patchValue(formData);
    
    // Remove password requirement for editing
    this.vendedorForm.get('clave')?.setValidators([]);
    this.vendedorForm.get('clave')?.updateValueAndValidity();
    
    this.showForm.set(true);
  }

  async deleteVendedor(id: number): Promise<void> {
    const vendedor = this.vendedores().find(v => v.id === id);
    if (!vendedor) return;

    const confirmed = await this.alertService.confirm(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar al vendedor "${vendedor.nombre} ${vendedor.apellido}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );

    if (confirmed) {
      try {
        const updatedVendedores = this.vendedores().filter(vendedor => vendedor.id !== id);
        this.vendedores.set(updatedVendedores);
        
        await this.alertService.success(
          'Éxito',
          `Vendedor "${vendedor.nombre} ${vendedor.apellido}" eliminado exitosamente`
        );
      } catch (error) {
        console.error('Error deleting vendedor:', error);
        await this.alertService.error(
          'Error',
          'Error al eliminar el vendedor. Por favor intenta nuevamente.'
        );
      }
    }
  }
}
