import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputComponent } from '../../shared/components/atoms/input/input.component';

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
                helperText="Máximo 13 caracteres, puede incluir +"
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
                helperText="Mínimo 6 caracteres"
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
                @if (vendedorForm.get('celular')?.errors?.['maxlength']) {
                  <li>• El celular debe tener máximo 13 caracteres</li>
                }
                @if (vendedorForm.get('celular')?.errors?.['pattern']) {
                  <li>• El formato del celular no es válido</li>
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
                  <li>• La contraseña debe tener mínimo 6 caracteres</li>
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
export class UsuariosVendedoresComponent {
  private readonly fb = inject(FormBuilder);
  
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
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    documento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    celular: ['', [Validators.required, Validators.maxLength(13), Validators.pattern(/^[+]?[\d\s-()]+$/)]],
    fechaNacimiento: ['', [Validators.required, this.ageValidator]],
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

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
      this.vendedorForm.get('clave')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.vendedorForm.get('clave')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.vendedorForm.valid) {
      this.isSubmitting.set(true);
      
      const formData = this.vendedorForm.value;
      
      // Check for duplicate documento
      const isDuplicateDoc = this.vendedores().some(vendedor => 
        vendedor.documento === formData.documento &&
        vendedor.id !== this.editingVendedor()?.id
      );
      
      if (isDuplicateDoc) {
        alert('Ya existe un vendedor con ese número de documento.');
        this.isSubmitting.set(false);
        return;
      }

      // Check for duplicate correo
      const isDuplicateEmail = this.vendedores().some(vendedor => 
        vendedor.correo.toLowerCase() === formData.correo.toLowerCase() &&
        vendedor.id !== this.editingVendedor()?.id
      );
      
      if (isDuplicateEmail) {
        alert('Ya existe un vendedor con ese correo electrónico.');
        this.isSubmitting.set(false);
        return;
      }

      setTimeout(() => {
        if (this.editingVendedor()) {
          // Update existing vendedor (excluding password)
          const { clave, ...updateData } = formData;
          const updatedVendedores = this.vendedores().map(vendedor =>
            vendedor.id === this.editingVendedor()!.id
              ? { ...vendedor, ...updateData }
              : vendedor
          );
          this.vendedores.set(updatedVendedores);
        } else {
          // Create new vendedor
          const newVendedor: UsuarioVendedor = {
            id: Math.max(...this.vendedores().map(v => v.id!)) + 1,
            ...formData,
            rol: 'VENDEDOR' as const,
            fechaCreacion: new Date().toISOString().split('T')[0],
            clave: 'hashed_' + formData.clave // In real app, this would be properly hashed
          };
          this.vendedores.set([...this.vendedores(), newVendedor]);
        }
        
        this.resetForm();
        this.showForm.set(false);
        this.isSubmitting.set(false);
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

  deleteVendedor(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este vendedor? Esta acción no se puede deshacer.')) {
      const updatedVendedores = this.vendedores().filter(vendedor => vendedor.id !== id);
      this.vendedores.set(updatedVendedores);
    }
  }
}
