import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UbicacionService, Ubicacion, CreateUbicacionRequest, SearchUbicacionParams } from '../../core/services/ubicacion.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { UserRole } from '../../core/interfaces';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ubicaciones-page p-6 bg-gray-50 min-h-screen">
      <!-- Header -->
      <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ isAdmin() ? 'Gestión de Ubicaciones' : 'Ubicaciones Disponibles' }}
        </h1>
        <p class="text-gray-600">
          {{ isAdmin() ? 'Crear y administrar ubicaciones (ciudades y departamentos)' : 'Buscar y explorar ubicaciones disponibles' }}
        </p>
      </div>

      <div class="grid" [class.lg:grid-cols-2]="isAdmin()" [class.lg:grid-cols-1]="!isAdmin()" [class.gap-6]="isAdmin()">
        <!-- Formulario de Creación - HU #3 (Solo Admin) -->
        @if (isAdmin()) {
          <div class="bg-white shadow-sm rounded-lg p-6 mb-6 lg:mb-0">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              <i class="fas fa-plus-circle text-blue-500 mr-2"></i>
              Crear Nueva Ubicación
            </h2>

            <form (ngSubmit)="onSubmit()" #ubicacionForm="ngForm" class="space-y-4">
              <!-- Ciudad -->
              <div>
                <label for="ciudad" class="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  [(ngModel)]="formData.ciudad"
                  #ciudad="ngModel"
                  required
                  maxlength="50"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingrese el nombre de la ciudad"
                >
                <div class="text-xs text-gray-500 mt-1">
                  {{ formData.ciudad.length }}/50 caracteres
                </div>
                @if (ciudad.invalid && ciudad.touched) {
                  <div class="text-red-500 text-sm mt-1">
                    @if (ciudad.errors?.['required']) {
                      <p>La ciudad es obligatoria</p>
                    }
                    @if (ciudad.errors?.['maxlength']) {
                      <p>La ciudad no puede tener más de 50 caracteres</p>
                    }
                  </div>
                }
              </div>

              <!-- Departamento -->
              <div>
                <label for="departamento" class="block text-sm font-medium text-gray-700 mb-1">
                  Departamento *
                </label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  [(ngModel)]="formData.departamento"
                  #departamento="ngModel"
                  required
                  maxlength="50"
                  (blur)="validateDepartamentoUniqueness()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  [class.border-red-500]="departamentoExists()"
                  placeholder="Ingrese el nombre del departamento"
                >
                <div class="text-xs text-gray-500 mt-1">
                  {{ formData.departamento.length }}/50 caracteres
                </div>
                @if (departamento.invalid && departamento.touched) {
                  <div class="text-red-500 text-sm mt-1">
                    @if (departamento.errors?.['required']) {
                      <p>El departamento es obligatorio</p>
                    }
                    @if (departamento.errors?.['maxlength']) {
                      <p>El departamento no puede tener más de 50 caracteres</p>
                    }
                  </div>
                }
                @if (departamentoExists()) {
                  <div class="text-red-500 text-sm mt-1">
                    <p>Este departamento ya existe</p>
                  </div>
                }
              </div>

              <!-- Descripción Ciudad -->
              <div>
                <label for="descripcionCiudad" class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción de la Ciudad *
                </label>
                <textarea
                  id="descripcionCiudad"
                  name="descripcionCiudad"
                  [(ngModel)]="formData.descripcionCiudad"
                  #descripcionCiudad="ngModel"
                  required
                  maxlength="120"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe características importantes de la ciudad"
                ></textarea>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formData.descripcionCiudad.length }}/120 caracteres
                </div>
                @if (descripcionCiudad.invalid && descripcionCiudad.touched) {
                  <div class="text-red-500 text-sm mt-1">
                    @if (descripcionCiudad.errors?.['required']) {
                      <p>La descripción de la ciudad es obligatoria</p>
                    }
                    @if (descripcionCiudad.errors?.['maxlength']) {
                      <p>La descripción no puede tener más de 120 caracteres</p>
                    }
                  </div>
                }
              </div>

              <!-- Descripción Departamento -->
              <div>
                <label for="descripcionDepartamento" class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Departamento *
                </label>
                <textarea
                  id="descripcionDepartamento"
                  name="descripcionDepartamento"
                  [(ngModel)]="formData.descripcionDepartamento"
                  #descripcionDepartamento="ngModel"
                  required
                  maxlength="120"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe características importantes del departamento"
                ></textarea>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formData.descripcionDepartamento.length }}/120 caracteres
                </div>
                @if (descripcionDepartamento.invalid && descripcionDepartamento.touched) {
                  <div class="text-red-500 text-sm mt-1">
                    @if (descripcionDepartamento.errors?.['required']) {
                      <p>La descripción del departamento es obligatoria</p>
                    }
                    @if (descripcionDepartamento.errors?.['maxlength']) {
                      <p>La descripción no puede tener más de 120 caracteres</p>
                    }
                  </div>
                }
              </div>

              <!-- Botones -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  [disabled]="ubicacionForm.invalid || departamentoExists() || ubicacionService.loading()"
                  class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  @if (ubicacionService.loading()) {
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    Guardando...
                  } @else {
                    <i class="fas fa-save mr-2"></i>
                    Crear Ubicación
                  }
                </button>
                <button
                  type="button"
                  (click)="resetForm()"
                  class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <i class="fas fa-times mr-2"></i>
                  Limpiar
                </button>
              </div>
            </form>

            <!-- Mensaje de resultado -->
            @if (mensajeResultado()) {
              <div class="mt-4 p-3 rounded-md" 
                   [class]="esExito() ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'">
                <div class="flex">
                  @if (esExito()) {
                    <i class="fas fa-check-circle text-green-400 mr-2 mt-0.5"></i>
                  } @else {
                    <i class="fas fa-exclamation-circle text-red-400 mr-2 mt-0.5"></i>
                  }
                  <span>{{ mensajeResultado() }}</span>
                </div>
              </div>
            }
          </div>
        }

        <!-- Búsqueda y Lista - HU #4 (Todos los roles) -->
        <div class="bg-white shadow-sm rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            <i class="fas fa-search text-green-500 mr-2"></i>
            {{ isAdmin() ? 'Buscar Ubicaciones' : 'Explorar Ubicaciones' }}
          </h2>

          <!-- Filtros de búsqueda -->
          <div class="space-y-4 mb-6">
            <!-- Campo de búsqueda -->
            <div>
              <label for="textoBusqueda" class="block text-sm font-medium text-gray-700 mb-1">
                Buscar por ciudad o departamento
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="textoBusqueda"
                  [(ngModel)]="filtrosBusqueda.texto"
                  (input)="onBuscar()"
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Escribe para buscar..."
                >
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            <!-- Opciones de ordenamiento -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="ordenarPor" class="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  id="ordenarPor"
                  [(ngModel)]="filtrosBusqueda.ordenarPor"
                  (change)="onBuscar()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ciudad">Ciudad</option>
                  <option value="departamento">Departamento</option>
                </select>
              </div>
              <div>
                <label for="orden" class="block text-sm font-medium text-gray-700 mb-1">
                  Orden
                </label>
                <select
                  id="orden"
                  [(ngModel)]="filtrosBusqueda.ordenAscendente"
                  (change)="onBuscar()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option [value]="true">Ascendente</option>
                  <option [value]="false">Descendente</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Resultados de búsqueda -->
          @if (ubicacionService.loading()) {
            <div class="flex justify-center items-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-gray-400 mr-3"></i>
              <span class="text-gray-600">Buscando ubicaciones...</span>
            </div>
          } @else if (resultadosBusqueda().length === 0) {
            <div class="text-center py-8">
              <i class="fas fa-map-marker-alt text-4xl text-gray-300 mb-3"></i>
              <p class="text-gray-500">No se encontraron ubicaciones</p>
              @if (filtrosBusqueda.texto) {
                <p class="text-sm text-gray-400 mt-1">
                  Intenta con otros términos de búsqueda
                </p>
              }
            </div>
          } @else {
            <div class="space-y-3">
              @for (ubicacion of resultadosBusqueda(); track ubicacion.id) {
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center mb-2">
                        <i class="fas fa-city text-blue-500 mr-2"></i>
                        <h4 class="font-semibold text-gray-900">{{ ubicacion.ciudad }}</h4>
                        <span class="ml-2 text-sm text-gray-500">•</span>
                        <span class="ml-2 text-sm text-gray-600">{{ ubicacion.departamento }}</span>
                      </div>
                      <div class="text-sm text-gray-600 mb-1">
                        <strong>Ciudad:</strong> {{ ubicacion.descripcionCiudad }}
                      </div>
                      <div class="text-sm text-gray-600">
                        <strong>Departamento:</strong> {{ ubicacion.descripcionDepartamento }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                      <span class="text-xs text-gray-400">
                        {{ formatDate(ubicacion.fechaCreacion) }}
                      </span>
                      @if (isAdmin()) {
                        <button
                          (click)="eliminarUbicacion(ubicacion.id)"
                          class="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                          title="Eliminar ubicación"
                        >
                          <i class="fas fa-trash text-sm"></i>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Información de paginación -->
            @if (paginacion().totalPages > 1) {
              <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600">
                  Mostrando {{ (paginacion().page - 1) * paginacion().pageSize + 1 }} - 
                  {{ Math.min(paginacion().page * paginacion().pageSize, paginacion().total) }} 
                  de {{ paginacion().total }} ubicaciones
                </div>
                <div class="flex space-x-2">
                  <button
                    (click)="cambiarPagina(paginacion().page - 1)"
                    [disabled]="paginacion().page === 1"
                    class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <span class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md">
                    {{ paginacion().page }} / {{ paginacion().totalPages }}
                  </span>
                  <button
                    (click)="cambiarPagina(paginacion().page + 1)"
                    [disabled]="paginacion().page === paginacion().totalPages"
                    class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ubicaciones-page {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .transition-colors {
      transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }

    .border-red-500 {
      border-color: #ef4444 !important;
    }

    textarea::-webkit-scrollbar {
      width: 6px;
    }

    textarea::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    textarea::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    textarea::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class UbicacionesComponent implements OnInit {
  public readonly ubicacionService = inject(UbicacionService);
  private readonly authFacade = inject(AuthFacade);

  resultadosBusqueda = signal<Ubicacion[]>([]);
  paginacion = signal({
    page: 1,
    pageSize: 5,
    total: 0,
    totalPages: 0
  });
  mensajeResultado = signal<string>('');
  esExito = signal<boolean>(false);
  departamentoExists = signal<boolean>(false);

  formData: CreateUbicacionRequest = {
    ciudad: '',
    departamento: '',
    descripcionCiudad: '',
    descripcionDepartamento: ''
  };

  filtrosBusqueda: SearchUbicacionParams = {
    texto: '',
    ordenAscendente: true,
    ordenarPor: 'ciudad',
    page: 1,
    pageSize: 5
  };

  Math = Math;

  ngOnInit(): void {
    this.cargarUbicaciones();
  }

  isAdmin(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  onSubmit(): void {
    if (!this.isAdmin()) {
      this.mostrarMensaje('No tienes permisos para crear ubicaciones', false);
      return;
    }

    if (this.departamentoExists()) {
      this.mostrarMensaje('El departamento ya existe', false);
      return;
    }

    this.ubicacionService.createUbicacion(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.mostrarMensaje(response.message, true);
          this.resetForm();
          this.cargarUbicaciones();
        } else {
          this.mostrarMensaje(response.message, false);
        }
      },
      error: (error) => {
        this.mostrarMensaje('Error al crear la ubicación', false);
        console.error('Error:', error);
      }
    });
  }

  validateDepartamentoUniqueness(): void {
    if (this.formData.departamento.trim()) {
      const exists = this.ubicacionService.isDepartamentoExists(this.formData.departamento);
      this.departamentoExists.set(exists);
    } else {
      this.departamentoExists.set(false);
    }
  }

  onBuscar(): void {
    this.filtrosBusqueda.page = 1;
    this.realizarBusqueda();
  }

  private realizarBusqueda(): void {
    this.ubicacionService.searchUbicaciones(this.filtrosBusqueda).subscribe({
      next: (response) => {
        this.resultadosBusqueda.set(response.ubicaciones);
        this.paginacion.set({
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages
        });
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.resultadosBusqueda.set([]);
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.paginacion().totalPages) {
      this.filtrosBusqueda.page = nuevaPagina;
      this.realizarBusqueda();
    }
  }

  private cargarUbicaciones(): void {
    this.realizarBusqueda();
  }

  eliminarUbicacion(id: number): void {
    if (!this.isAdmin()) {
      this.mostrarMensaje('No tienes permisos para eliminar ubicaciones', false);
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar esta ubicación?')) {
      this.ubicacionService.deleteUbicacion(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.mostrarMensaje('Ubicación eliminada exitosamente', true);
            this.cargarUbicaciones();
          } else {
            this.mostrarMensaje(response.message, false);
          }
        },
        error: (error) => {
          this.mostrarMensaje('Error al eliminar la ubicación', false);
          console.error('Error:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.formData = {
      ciudad: '',
      departamento: '',
      descripcionCiudad: '',
      descripcionDepartamento: ''
    };
    this.departamentoExists.set(false);
    this.mensajeResultado.set('');
  }

  private mostrarMensaje(mensaje: string, exito: boolean): void {
    this.mensajeResultado.set(mensaje);
    this.esExito.set(exito);
    
    setTimeout(() => {
      this.mensajeResultado.set('');
    }, 5000);
  }

  formatDate(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}