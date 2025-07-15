import { Component, signal, inject, OnInit, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PropertyService } from '../../core/services/property.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { UserRole } from '../../core/interfaces';
import { CategoryService } from '../../core/services/category.service';
import { UbicacionService } from '../../core/services/ubicacion.service';
import { AlertService } from '../../shared/services/alert.service';
import { Property, PropertyStatus, PropertyRequest } from '../../core/interfaces/property.interface';
import { Category } from '../../core/interfaces/category.interface';
import { Ubicacion } from '../../core/interfaces/ubicacion.interface';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="properties-page">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">
          @if (isVendedor()) {
            Gestión de Propiedades
          } @else {
            Propiedades Disponibles
          }
        </h1>
        <div class="flex gap-2">
          <button 
            (click)="reloadProperties()"
            class="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors font-medium">
            Recargar
          </button>
          @if (isVendedor()) {
            <button 
              (click)="toggleForm()"
              class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              @if (showForm()) {
                Cancelar
              } @else {
                Nueva Propiedad
              }
            </button>
          }
        </div>
      </div>

      <!-- Form Section - HU #6: Solo Vendedor puede publicar casa -->
      @if (showForm() && isVendedor()) {
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-lg font-semibold text-secondary-900 mb-4">
            @if (editingProperty()) {
              Editar Propiedad
            } @else {
              Publicar Nueva Propiedad - HU #6
            }
          </h2>
          
          <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre de la Propiedad <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="nombre"
                  placeholder="Casa en barrio residencial"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <!-- Categoría -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Categoría <span class="text-red-500">*</span>
                </label>
                <select
                  formControlName="categoria_id"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Selecciona una categoría</option>
                  @for (categoria of categorias(); track categoria.id) {
                    <option [value]="categoria.id">{{ categoria.nombre }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Descripción -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Descripción <span class="text-red-500">*</span>
              </label>
              <textarea
                formControlName="descripcion"
                rows="3"
                placeholder="Describe las características principales de la propiedad..."
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none">
              </textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Cuartos -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Número de Cuartos <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  formControlName="cantidad_cuartos"
                  min="1"
                  max="20"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <!-- Baños -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Número de Baños <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  formControlName="cantidad_banos"
                  min="1"
                  max="10"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <!-- Precio -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Precio (COP) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  formControlName="precio"
                  min="1"
                  placeholder="350000000"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Ubicación -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Ubicación <span class="text-red-500">*</span>
                </label>
                <select
                  formControlName="ubicacion_id"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Selecciona una ubicación</option>
                  @for (ubicacion of ubicaciones(); track ubicacion.id) {
                    <option [value]="ubicacion.id">{{ ubicacion.ciudad }}, {{ ubicacion.departamento }}</option>
                  }
                </select>
              </div>

              <!-- Fecha de Publicación Activa -->
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Fecha de Publicación Activa <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  formControlName="fecha_publicacion_activa"
                  [min]="today"
                  [max]="maxDate"
                  class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p class="text-xs text-secondary-600 mt-1">Máximo 1 mes desde hoy</p>
              </div>
            </div>

            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">
                Estado de Publicación <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="estado_publicacion"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="PUBLICADA">Publicada</option>
                <option value="PUBLICACION_PAUSADA">Publicación Pausada</option>
                <option value="TRANSACCION_CURSO">Transacción en Curso</option>
                <option value="TRANSACCION_FINALIZADA">Transacción Finalizada</option>
              </select>
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
                [disabled]="propertyForm.invalid || isSubmitting()"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                @if (isSubmitting()) {
                  Guardando...
                } @else if (editingProperty()) {
                  Actualizar
                } @else {
                  Crear Propiedad
                }
              </button>
            </div>
          </form>

          <!-- Form Validation Errors -->
          @if (propertyForm.invalid && propertyForm.touched) {
            <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 class="text-sm font-medium text-red-800 mb-2">Errores en el formulario:</h3>
              <ul class="text-sm text-red-700 space-y-1">
                @if (propertyForm.get('nombre')?.errors?.['required']) {
                  <li>• El nombre es requerido</li>
                }
                @if (propertyForm.get('descripcion')?.errors?.['required']) {
                  <li>• La descripción es requerida</li>
                }
                @if (propertyForm.get('categoria_id')?.errors?.['required']) {
                  <li>• La categoría es requerida</li>
                }
                @if (propertyForm.get('ubicacion_id')?.errors?.['required']) {
                  <li>• La ubicación es requerida</li>
                }
                @if (propertyForm.get('precio')?.errors?.['required']) {
                  <li>• El precio es requerido</li>
                }
                @if (propertyForm.get('fecha_publicacion_activa')?.errors?.['required']) {
                  <li>• La fecha de publicación activa es requerida</li>
                }
              </ul>
            </div>
          }
        </div>
      }

      <!-- Properties List - HU #7: Todos los roles pueden listar casas -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-secondary-200">
          <h2 class="text-lg font-semibold text-secondary-900">
            @if (isVendedor()) {
              Mis Propiedades ({{ properties().length }})
            } @else {
              Propiedades Disponibles - HU #7 ({{ properties().length }})
            }
          </h2>
        </div>

        @if (isLoading()) {
          <div class="p-6 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p class="mt-2 text-secondary-600">Cargando propiedades...</p>
          </div>
        } @else if (properties().length === 0) {
          <div class="p-6 text-center text-secondary-600">
            @if (isVendedor()) {
              No tienes propiedades registradas.
            } @else {
              No hay propiedades disponibles en este momento.
            }
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                @for (property of properties(); track property.id) {
                  <tr class="hover:bg-secondary-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-secondary-900">{{ property.nombre }}</div>
                        <div class="text-sm text-secondary-700">{{ property.cantidad_cuartos }} cuartos, {{ property.cantidad_banos }} baños</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ property.categoria.nombre }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ property.ubicacion.ciudad }}, {{ property.ubicacion.departamento }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {{ property.precio | currency:'COP':'symbol':'1.0-0' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getStatusClass(property.estado_publicacion)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusText(property.estado_publicacion) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      @if (isVendedor()) {
                        <button 
                          (click)="editProperty(property)"
                          class="text-primary-600 hover:text-primary-700 transition-colors">
                          Editar
                        </button>
                        <button 
                          (click)="deleteProperty(property.id)"
                          class="text-red-600 hover:text-red-700 transition-colors ml-2">
                          Eliminar
                        </button>
                      } @else {
                        <button 
                          class="text-primary-600 hover:text-primary-700 transition-colors">
                          Ver Detalles
                        </button>
                        <button 
                          class="text-green-600 hover:text-green-700 transition-colors ml-2">
                          Agendar Visita
                        </button>
                      }
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
    .properties-page {
      @apply p-6 max-w-7xl mx-auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertiesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly propertyService = inject(PropertyService);
  private readonly categoryService = inject(CategoryService);
  private readonly ubicacionService = inject(UbicacionService);
  private readonly alertService = inject(AlertService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly authFacade = inject(AuthFacade);
  
  showForm = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(false);
  editingProperty = signal<Property | null>(null);
  properties = signal<Property[]>([]);
  categorias = signal<Category[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);

  today = new Date().toISOString().slice(0, 16);
  maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  propertyForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoria_id: ['', [Validators.required]],
    cantidad_cuartos: [1, [Validators.required, Validators.min(1)]],
    cantidad_banos: [1, [Validators.required, Validators.min(1)]],
    precio: ['', [Validators.required, Validators.min(1)]],
    ubicacion_id: ['', [Validators.required]],
    fecha_publicacion_activa: ['', [Validators.required]],
    estado_publicacion: ['PUBLICADA', [Validators.required]]
  });

  ngOnInit(): void {
    // Configure AlertService
    this.alertService.setViewContainerRef(this.viewContainerRef);
    
    this.loadCategorias();
    this.loadUbicaciones();
    
    // Add a fallback to ensure we have ubicaciones loaded
    setTimeout(() => {
      if (this.ubicaciones().length === 0) {
        console.warn('No ubicaciones loaded from service, loading directly...');
        this.loadUbicacionesDirectly();
      }
    }, 1000);
    
    this.loadProperties();
    console.log('Properties loaded:', this.properties());
  }

  // HU #6 y #7: Métodos para verificar roles
  isVendedor(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.VENDEDOR;
  }

  isAdmin(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  isComprador(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.COMPRADOR;
  }

  loadCategorias(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categorias.set(categories);
        console.log('Categories loaded from API:', categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback to mock data
        this.categorias.set([
          { 
            id: 1, 
            nombre: 'Casa', 
            descripcion: 'Casas residenciales',
            activo: true,
            fechaCreacion: new Date().toISOString()
          },
          { 
            id: 2, 
            nombre: 'Apartamento', 
            descripcion: 'Apartamentos urbanos',
            activo: true,
            fechaCreacion: new Date().toISOString()
          },
          { 
            id: 3, 
            nombre: 'Casa de lujo', 
            descripcion: 'Propiedades premium',
            activo: true,
            fechaCreacion: new Date().toISOString()
          }
        ]);
      }
    });
  }

  loadUbicaciones(): void {
    this.ubicacionService.searchUbicaciones({}).subscribe({
      next: (response) => {
        // Convert the ubicacion interface to the one used in properties
        const ubicaciones = response.ubicaciones.map(ub => ({
          id: ub.id,
          ciudad: ub.ciudad,
          departamento: ub.departamento,
          descripcionCiudad: ub.descripcionCiudad,
          descripcionDepartamento: ub.descripcionDepartamento,
          fechaCreacion: ub.fechaCreacion,
          activo: ub.activo
        }));
        this.ubicaciones.set(ubicaciones);
        console.log('Locations loaded from API:', ubicaciones);
      },
      error: (error) => {
        console.error('Error loading locations:', error);
        // Fallback to mock data
        this.loadUbicacionesDirectly();
      }
    });
  }

  private loadUbicacionesDirectly(): void {
    // Fallback method to load ubicaciones directly from localStorage
    console.log('Loading ubicaciones directly from localStorage...');
    this.ubicaciones.set([
      { 
        id: 1, 
        ciudad: 'Medellín',
        departamento: 'Antioquia',
        descripcionCiudad: 'Ciudad de la eterna primavera',
        descripcionDepartamento: 'Departamento de Antioquia',
        fechaCreacion: new Date(),
        activo: true
      },
      { 
        id: 2, 
        ciudad: 'Bogotá',
        departamento: 'Cundinamarca',
        descripcionCiudad: 'Capital de Colombia',
        descripcionDepartamento: 'Departamento de Cundinamarca',
        fechaCreacion: new Date(),
        activo: true
      },
      { 
        id: 3, 
        ciudad: 'Cali',
        departamento: 'Valle del Cauca',
        descripcionCiudad: 'Capital del Valle',
        descripcionDepartamento: 'Departamento del suroccidente',
        fechaCreacion: new Date(),
        activo: true
      },
      { 
        id: 4, 
        ciudad: 'Cartagena',
        departamento: 'Bolívar',
        descripcionCiudad: 'Ciudad histórica',
        descripcionDepartamento: 'Departamento caribeño',
        fechaCreacion: new Date(),
        activo: true
      }
    ]);
    console.log('Direct ubicaciones loaded:', this.ubicaciones());
  }

  loadProperties(): void {
    this.isLoading.set(true);
    
    this.propertyService.getProperties().subscribe({
      next: (response) => {
        console.log('Properties response from service:', response);
        this.properties.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.isLoading.set(false);
      }
    });
  }


  reloadProperties(): void {
    console.log('Reloading properties...');
    this.loadProperties();
  }

  toggleForm(): void {
    // HU #6: Solo vendedor puede crear/editar propiedades
    if (!this.isVendedor()) {
      console.warn('Solo vendedores pueden crear propiedades - HU #6');
      return;
    }
    
    this.showForm.set(!this.showForm());
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.propertyForm.reset({
      cantidad_cuartos: 1,
      cantidad_banos: 1,
      estado_publicacion: 'PUBLICADA'
    });
    this.editingProperty.set(null);
  }

  onSubmit(): void {
    // HU #6: Solo vendedor puede publicar casas
    if (!this.isVendedor()) {
      console.error('Error HU #6: Solo vendedores pueden publicar propiedades');
      return;
    }

    if (this.propertyForm.valid) {
      this.isSubmitting.set(true);
      
      const formData = this.propertyForm.value as PropertyRequest;
      
      console.log('Submitting form data:', formData);

      // Use PropertyService to create/update property
      if (this.editingProperty()) {
        // Update functionality will be implemented in future iterations
        console.log('Update property functionality to be implemented');
        this.isSubmitting.set(false);
      } else {
        // Create new property using PropertyService
        this.propertyService.createProperty(formData).subscribe({
          next: (newProperty) => {
            console.log('Property created successfully:', newProperty);
            this.alertService.success('Éxito', 'Propiedad creada exitosamente');
            this.resetForm();
            this.showForm.set(false);
            this.loadProperties(); // Reload properties from service
            this.isSubmitting.set(false);
          },
          error: (error) => {
            console.error('Error creating property:', error);
            this.alertService.error('Error', `Error al crear la propiedad: ${error.message}`);
            this.isSubmitting.set(false);
          }
        });
      }
    }
  }

  editProperty(property: Property): void {
    // HU #6: Solo vendedor puede editar propiedades
    if (!this.isVendedor()) {
      console.warn('Solo vendedores pueden editar propiedades - HU #6');
      return;
    }

    this.editingProperty.set(property);
    this.propertyForm.patchValue({
      nombre: property.nombre,
      descripcion: property.descripcion,
      categoria_id: property.categoria.id,
      cantidad_cuartos: property.cantidad_cuartos,
      cantidad_banos: property.cantidad_banos,
      precio: property.precio,
      ubicacion_id: property.ubicacion.id,
      fecha_publicacion_activa: property.fecha_publicacion_activa.toString().slice(0, 16),
      estado_publicacion: property.estado_publicacion
    });
    this.showForm.set(true);
  }

  async deleteProperty(id: number): Promise<void> {
    // HU #6: Solo vendedor puede eliminar propiedades
    if (!this.isVendedor()) {
      console.warn('Solo vendedores pueden eliminar propiedades - HU #6');
      return;
    }

    const property = this.properties().find(p => p.id === id);
    if (!property) return;

    const confirmed = await this.alertService.confirm(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar la propiedad "${property.nombre}"? Esta acción no se puede deshacer.`,
      'Eliminar',
      'Cancelar'
    );

    if (confirmed) {
      try {
        // Use PropertyService to delete
        this.propertyService.deleteProperty(id).subscribe({
          next: () => {
            this.alertService.success(
              'Éxito',
              `Propiedad "${property.nombre}" eliminada exitosamente`
            );
            this.loadProperties(); // Reload from service
          },
          error: (error) => {
            console.error('Error deleting property:', error);
            this.alertService.error(
              'Error',
              'Error al eliminar la propiedad. Por favor intenta nuevamente.'
            );
          }
        });
      } catch (error) {
        console.error('Error deleting property:', error);
        await this.alertService.error(
          'Error',
          'Error al eliminar la propiedad. Por favor intenta nuevamente.'
        );
      }
    }
  }

  getStatusClass(status: PropertyStatus): string {
    switch (status) {
      case PropertyStatus.PUBLICADA:
        return 'bg-green-100 text-green-800';
      case PropertyStatus.PUBLICACION_PAUSADA:
        return 'bg-yellow-100 text-yellow-800';
      case PropertyStatus.TRANSACCION_CURSO:
        return 'bg-blue-100 text-blue-800';
      case PropertyStatus.TRANSACCION_FINALIZADA:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: PropertyStatus): string {
    switch (status) {
      case PropertyStatus.PUBLICADA:
        return 'Publicada';
      case PropertyStatus.PUBLICACION_PAUSADA:
        return 'Pausada';
      case PropertyStatus.TRANSACCION_CURSO:
        return 'En Transacción';
      case PropertyStatus.TRANSACCION_FINALIZADA:
        return 'Finalizada';
      default:
        return status;
    }
  }
}
