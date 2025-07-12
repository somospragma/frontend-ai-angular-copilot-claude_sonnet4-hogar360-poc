import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Ubicacion {
  id?: number;
  ciudad: string;
  departamento: string;
  descripcionCiudad: string;
  descripcionDepartamento: string;
}

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="ubicaciones-page">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">Gestión de Ubicaciones</h1>
        <button 
          (click)="toggleForm()"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
          @if (showForm()) {
            Cancelar
          } @else {
            Nueva Ubicación
          }
        </button>
      </div>

      <!-- Form Section -->
      @if (showForm()) {
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-secondary-900 mb-4">
            @if (editingUbicacion()) {
              Editar Ubicación
            } @else {
              Nueva Ubicación
            }
          </h2>
          
          <form [formGroup]="ubicacionForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Ciudad -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Ciudad *</label>
                <input
                  type="text"
                  placeholder="Nombre de la ciudad"
                  formControlName="ciudad"
                  required
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p class="text-xs text-gray-500">Máximo 50 caracteres</p>
              </div>

              <!-- Departamento -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Departamento *</label>
                <input
                  type="text"
                  placeholder="Nombre del departamento"
                  formControlName="departamento"
                  required
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p class="text-xs text-gray-500">Máximo 50 caracteres</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Descripción Ciudad -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Descripción de la Ciudad *</label>
                <textarea
                  placeholder="Describe las características de la ciudad..."
                  formControlName="descripcionCiudad"
                  required
                  maxlength="120"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
                <p class="text-xs text-gray-500">Máximo 120 caracteres</p>
              </div>

              <!-- Descripción Departamento -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Descripción del Departamento *</label>
                <textarea
                  placeholder="Describe las características del departamento..."
                  formControlName="descripcionDepartamento"
                  required
                  maxlength="120"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
                <p class="text-xs text-gray-500">Máximo 120 caracteres</p>
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
                [disabled]="ubicacionForm.invalid || isSubmitting()"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                @if (isSubmitting()) {
                  Guardando...
                } @else if (editingUbicacion()) {
                  Actualizar
                } @else {
                  Crear Ubicación
                }
              </button>
            </div>
          </form>

          <!-- Form Validation Errors -->
          @if (ubicacionForm.invalid && ubicacionForm.touched) {
            <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 class="text-sm font-medium text-red-800 mb-2">Errores en el formulario:</h3>
              <ul class="text-sm text-red-700 space-y-1">
                @if (ubicacionForm.get('ciudad')?.errors?.['required']) {
                  <li>• El nombre de la ciudad es requerido</li>
                }
                @if (ubicacionForm.get('ciudad')?.errors?.['maxlength']) {
                  <li>• El nombre de la ciudad debe tener máximo 50 caracteres</li>
                }
                @if (ubicacionForm.get('departamento')?.errors?.['required']) {
                  <li>• El nombre del departamento es requerido</li>
                }
                @if (ubicacionForm.get('departamento')?.errors?.['maxlength']) {
                  <li>• El nombre del departamento debe tener máximo 50 caracteres</li>
                }
                @if (ubicacionForm.get('descripcionCiudad')?.errors?.['required']) {
                  <li>• La descripción de la ciudad es requerida</li>
                }
                @if (ubicacionForm.get('descripcionCiudad')?.errors?.['maxlength']) {
                  <li>• La descripción de la ciudad debe tener máximo 120 caracteres</li>
                }
                @if (ubicacionForm.get('descripcionDepartamento')?.errors?.['required']) {
                  <li>• La descripción del departamento es requerida</li>
                }
                @if (ubicacionForm.get('descripcionDepartamento')?.errors?.['maxlength']) {
                  <li>• La descripción del departamento debe tener máximo 120 caracteres</li>
                }
              </ul>
            </div>
          }
        </div>
      }

      <!-- Search Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-secondary-900 mb-4">Buscar Ubicaciones</h2>
        
        <form [formGroup]="searchForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Text -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Buscar</label>
              <input
                type="text"
                placeholder="Buscar por ciudad o departamento..."
                formControlName="searchText"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500">Busca por nombre de ciudad o departamento</p>
            </div>

            <!-- Sort By -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Ordenar por</label>
              <select 
                formControlName="sortBy"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="ciudad">Ciudad</option>
                <option value="departamento">Departamento</option>
              </select>
            </div>

            <!-- Sort Order -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Orden</label>
              <select 
                formControlName="sortOrder"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              (click)="clearSearch()"
              class="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              Limpiar
            </button>
            <button 
              type="button"
              (click)="searchUbicaciones()"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Buscar
            </button>
          </div>
        </form>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-secondary-200">
          <h2 class="text-lg font-semibold text-secondary-900">
            Ubicaciones ({{ filteredUbicaciones().length }})
          </h2>
        </div>

        @if (filteredUbicaciones().length === 0) {
          <div class="p-6 text-center text-secondary-600">
            @if (searchForm.get('searchText')?.value) {
              No se encontraron ubicaciones que coincidan con la búsqueda.
            } @else {
              No hay ubicaciones registradas.
            }
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ciudad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Descripción Ciudad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Descripción Departamento
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                @for (ubicacion of filteredUbicaciones(); track ubicacion.id) {
                  <tr class="hover:bg-secondary-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      {{ ubicacion.ciudad }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ ubicacion.departamento }}
                    </td>
                    <td class="px-6 py-4 text-sm text-secondary-700 max-w-xs truncate">
                      {{ ubicacion.descripcionCiudad }}
                    </td>
                    <td class="px-6 py-4 text-sm text-secondary-700 max-w-xs truncate">
                      {{ ubicacion.descripcionDepartamento }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        (click)="editUbicacion(ubicacion)"
                        class="text-primary-600 hover:text-primary-700 transition-colors">
                        Editar
                      </button>
                      <button 
                        (click)="deleteUbicacion(ubicacion.id!)"
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
    .ubicaciones-page {
      @apply p-6 max-w-7xl mx-auto;
    }
  `]
})
export class UbicacionesComponent {
  private fb = inject(FormBuilder);
  
  showForm = signal(false);
  isSubmitting = signal(false);
  editingUbicacion = signal<Ubicacion | null>(null);
  ubicaciones = signal<Ubicacion[]>([
    {
      id: 1,
      ciudad: 'Medellín',
      departamento: 'Antioquia',
      descripcionCiudad: 'Ciudad de la eterna primavera, conocida por su innovación y cultura.',
      descripcionDepartamento: 'Departamento ubicado en el noroeste de Colombia, importante centro económico.'
    },
    {
      id: 2,
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca',
      descripcionCiudad: 'Capital de Colombia, centro político y económico del país.',
      descripcionDepartamento: 'Departamento central de Colombia, corazón administrativo y económico.'
    },
    {
      id: 3,
      ciudad: 'Cali',
      departamento: 'Valle del Cauca',
      descripcionCiudad: 'Capital mundial de la salsa, importante centro industrial del suroccidente.',
      descripcionDepartamento: 'Departamento del suroccidente colombiano, conocido por su industria azucarera.'
    }
  ]);
  filteredUbicaciones = signal<Ubicacion[]>(this.ubicaciones());

  ubicacionForm: FormGroup = this.fb.group({
    ciudad: ['', [Validators.required, Validators.maxLength(50)]],
    departamento: ['', [Validators.required, Validators.maxLength(50)]],
    descripcionCiudad: ['', [Validators.required, Validators.maxLength(120)]],
    descripcionDepartamento: ['', [Validators.required, Validators.maxLength(120)]]
  });

  searchForm: FormGroup = this.fb.group({
    searchText: [''],
    sortBy: ['ciudad'],
    sortOrder: ['asc']
  });

  constructor() {
    // Watch for search form changes
    this.searchForm.valueChanges.subscribe(() => {
      this.searchUbicaciones();
    });
  }

  toggleForm(): void {
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.ubicacionForm.reset();
    this.editingUbicacion.set(null);
  }

  onSubmit(): void {
    if (this.ubicacionForm.valid) {
      this.isSubmitting.set(true);
      
      const formData = this.ubicacionForm.value;
      
      // Check for duplicate department names
      const isDuplicate = this.ubicaciones().some(ubicacion => 
        ubicacion.departamento.toLowerCase() === formData.departamento.toLowerCase() &&
        ubicacion.id !== this.editingUbicacion()?.id
      );
      
      if (isDuplicate) {
        alert('Ya existe una ubicación con ese nombre de departamento.');
        this.isSubmitting.set(false);
        return;
      }

      setTimeout(() => {
        if (this.editingUbicacion()) {
          // Update existing ubicacion
          const updatedUbicaciones = this.ubicaciones().map(ubicacion =>
            ubicacion.id === this.editingUbicacion()!.id
              ? { ...ubicacion, ...formData }
              : ubicacion
          );
          this.ubicaciones.set(updatedUbicaciones);
        } else {
          // Create new ubicacion
          const newUbicacion: Ubicacion = {
            id: Math.max(...this.ubicaciones().map(u => u.id!)) + 1,
            ...formData
          };
          this.ubicaciones.set([...this.ubicaciones(), newUbicacion]);
        }
        
        this.resetForm();
        this.showForm.set(false);
        this.isSubmitting.set(false);
        this.searchUbicaciones(); // Refresh filtered results
      }, 1000);
    }
  }

  editUbicacion(ubicacion: Ubicacion): void {
    this.editingUbicacion.set(ubicacion);
    this.ubicacionForm.patchValue(ubicacion);
    this.showForm.set(true);
  }

  deleteUbicacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      const updatedUbicaciones = this.ubicaciones().filter(ubicacion => ubicacion.id !== id);
      this.ubicaciones.set(updatedUbicaciones);
      this.searchUbicaciones(); // Refresh filtered results
    }
  }

  searchUbicaciones(): void {
    const { searchText, sortBy, sortOrder } = this.searchForm.value;
    let filtered = [...this.ubicaciones()];

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(ubicacion =>
        ubicacion.ciudad.toLowerCase().includes(searchLower) ||
        ubicacion.departamento.toLowerCase().includes(searchLower)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      if (sortBy === 'ciudad') {
        aValue = a.ciudad.toLowerCase();
        bValue = b.ciudad.toLowerCase();
      } else {
        aValue = a.departamento.toLowerCase();
        bValue = b.departamento.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    this.filteredUbicaciones.set(filtered);
  }

  clearSearch(): void {
    this.searchForm.reset({
      searchText: '',
      sortBy: 'ciudad',
      sortOrder: 'asc'
    });
  }
}
