import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { PropertyService } from '../../core/services/property.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { UbicacionService } from '../../core/services/ubicacion.service';
import { Property } from '../../core/interfaces/property.interface';
import { Categoria } from '../../core/interfaces/categoria.interface';
import { Ubicacion } from '../../core/interfaces/ubicacion.interface';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="property-listing-page">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">Listado de Propiedades</h1>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-secondary-600">{{ filteredProperties().length }} propiedades encontradas</span>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold text-secondary-900 mb-4">Filtros de Búsqueda</h2>
        
        <form [formGroup]="filterForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Ubicación -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Ubicación</label>
              <select
                formControlName="ubicacion_id"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">Todas las ubicaciones</option>
                @for (ubicacion of ubicaciones(); track ubicacion.id) {
                  <option [value]="ubicacion.id">{{ ubicacion.ciudad.nombre }}, {{ ubicacion.departamento.nombre }}</option>
                }
              </select>
            </div>

            <!-- Categoría -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Categoría</label>
              <select
                formControlName="categoria_id"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">Todas las categorías</option>
                @for (categoria of categorias(); track categoria.id) {
                  <option [value]="categoria.id">{{ categoria.nombre }}</option>
                }
              </select>
            </div>

            <!-- Cuartos -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Número de Cuartos</label>
              <select
                formControlName="cantidad_cuartos"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">Cualquier cantidad</option>
                <option value="1">1 cuarto</option>
                <option value="2">2 cuartos</option>
                <option value="3">3 cuartos</option>
                <option value="4">4+ cuartos</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Baños -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Número de Baños</label>
              <select
                formControlName="cantidad_banos"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">Cualquier cantidad</option>
                <option value="1">1 baño</option>
                <option value="2">2 baños</option>
                <option value="3">3+ baños</option>
              </select>
            </div>

            <!-- Precio Mínimo -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Precio Mínimo</label>
              <input
                type="number"
                formControlName="precio_minimo"
                placeholder="100,000,000"
                min="0"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <!-- Precio Máximo -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Precio Máximo</label>
              <input
                type="number"
                formControlName="precio_maximo"
                placeholder="500,000,000"
                min="0"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Ordenar por -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Ordenar por</label>
              <select
                formControlName="sortBy"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="fecha_publicacion">Fecha de Publicación</option>
                <option value="precio">Precio</option>
                <option value="ubicacion">Ubicación</option>
                <option value="categoria">Categoría</option>
              </select>
            </div>

            <!-- Orden -->
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Orden</label>
              <select
                formControlName="sortOrder"
                class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              (click)="clearFilters()"
              class="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              Limpiar Filtros
            </button>
            <button 
              type="button"
              (click)="applyFilters()"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>

      <!-- Properties Grid -->
      @if (loading()) {
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-secondary-600">Cargando propiedades...</p>
        </div>
      } @else if (filteredProperties().length === 0) {
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <div class="text-4xl mb-4">🏠</div>
          <h3 class="text-lg font-medium text-secondary-900 mb-2">No se encontraron propiedades</h3>
          <p class="text-secondary-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (property of paginatedProperties(); track property.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <!-- Property Image -->
              <div class="h-48 bg-gray-200 relative">
                @if (property.images && property.images.length > 0) {
                  <img [src]="property.images[0]" [alt]="property.nombre" class="w-full h-full object-cover">
                } @else {
                  <div class="flex items-center justify-center h-full text-secondary-400">
                    <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                    </svg>
                  </div>
                }
                <!-- Status Badge -->
                <span [class]="getStatusClass(property.estado_publicacion)" class="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full">
                  {{ getStatusText(property.estado_publicacion) }}
                </span>
              </div>

              <!-- Property Info -->
              <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold text-secondary-900 truncate">{{ property.nombre }}</h3>
                  <span class="text-lg font-bold text-primary-600">
                    {{ property.precio | currency:'COP':'symbol':'1.0-0' }}
                  </span>
                </div>

                <p class="text-sm text-secondary-600 mb-3 line-clamp-2">{{ property.descripcion }}</p>

                <div class="flex items-center text-sm text-secondary-600 mb-3">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  {{ property.ubicacion.ciudad }}, {{ property.ubicacion.departamento }}
                </div>

                <div class="flex items-center justify-between text-sm text-secondary-600 mb-3">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    {{ property.cantidad_cuartos }} cuartos
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    {{ property.cantidad_banos }} baños
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-xs text-secondary-500">{{ property.categoria.nombre }}</span>
                  <button class="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="mt-8 flex justify-center">
            <nav class="flex space-x-2">
              <button 
                (click)="previousPage()"
                [disabled]="currentPage() === 1"
                class="px-3 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              
              @for (page of getVisiblePages(); track page) {
                @if (isNumber(page)) {
                  <button 
                    (click)="goToPage(page)"
                    [class]="page === currentPage() ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'"
                    class="px-3 py-2 rounded-lg transition-colors">
                    {{ page }}
                  </button>
                } @else {
                  <span class="px-3 py-2 text-secondary-400">{{ page }}</span>
                }
              }
              
              <button 
                (click)="nextPage()"
                [disabled]="currentPage() === totalPages()"
                class="px-3 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Siguiente
              </button>
            </nav>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .property-listing-page {
      @apply p-6 max-w-7xl mx-auto;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PropertyListingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly propertyService = inject(PropertyService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly ubicacionService = inject(UbicacionService);
  
  properties = signal<Property[]>([]);
  filteredProperties = signal<Property[]>([]);
  categorias = signal<Categoria[]>([]);
  ubicaciones = signal<Ubicacion[]>([]);
  loading = signal(false);
  
  // Pagination
  currentPage = signal(1);
  itemsPerPage = 9;
  totalPages = signal(1);
  
  filterForm: FormGroup = this.fb.group({
    ubicacion_id: [''],
    categoria_id: [''],
    cantidad_cuartos: [''],
    cantidad_banos: [''],
    precio_minimo: [''],
    precio_maximo: [''],
    sortBy: ['fecha_publicacion'],
    sortOrder: ['desc']
  });

  ngOnInit(): void {
    this.loadCategorias();
    this.loadUbicaciones();
    this.loadProperties();
    
    // Watch for filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadCategorias(): void {
    // Mock data - in real app would call categoriaService.getCategorias()
    this.categorias.set([
      { id: 1, nombre: 'Casa', descripcion: 'Casas residenciales' },
      { id: 2, nombre: 'Apartamento', descripcion: 'Apartamentos urbanos' },
      { id: 3, nombre: 'Casa de lujo', descripcion: 'Propiedades premium' }
    ]);
  }

  loadUbicaciones(): void {
    // Mock data - in real app would call ubicacionService.searchUbicaciones()
    this.ubicaciones.set([
      { 
        id: 1, 
        ciudad: { id: 1, nombre: 'Medellín' } as any,
        departamento: { id: 1, nombre: 'Antioquia' } as any,
        ciudadId: 1,
        departamentoId: 1
      },
      { 
        id: 2, 
        ciudad: { id: 2, nombre: 'Bogotá' } as any,
        departamento: { id: 2, nombre: 'Cundinamarca' } as any,
        ciudadId: 2,
        departamentoId: 2
      }
    ]);
  }

  loadProperties(): void {
    this.loading.set(true);
    
    // Mock data - in real app would call propertyService.getProperties()
    setTimeout(() => {
      const mockProperties: Property[] = [
        {
          id: 1,
          nombre: 'Casa Moderna en el Norte',
          descripcion: 'Hermosa casa con acabados modernos y amplios espacios',
          categoria: { id: 1, nombre: 'Casa' } as any,
          cantidad_cuartos: 4,
          cantidad_banos: 3,
          precio: 450000000,
          ubicacion: { ciudad: 'Medellín', departamento: 'Antioquia' } as any,
          fecha_publicacion_activa: new Date(),
          estado_publicacion: 'PUBLICADA' as any,
          fecha_publicacion: new Date(),
          vendedor: { id: 1, nombre: 'Juan Pérez' } as any,
          images: ['/assets/images/property-1.jpg']
        },
        {
          id: 2,
          nombre: 'Apartamento Centro',
          descripcion: 'Apartamento cómodo en zona céntrica con excelente ubicación',
          categoria: { id: 2, nombre: 'Apartamento' } as any,
          cantidad_cuartos: 2,
          cantidad_banos: 2,
          precio: 280000000,
          ubicacion: { ciudad: 'Bogotá', departamento: 'Cundinamarca' } as any,
          fecha_publicacion_activa: new Date(),
          estado_publicacion: 'PUBLICADA' as any,
          fecha_publicacion: new Date(),
          vendedor: { id: 2, nombre: 'María González' } as any,
          images: ['/assets/images/property-2.jpg']
        }
      ];
      
      // Filter only published properties with active publication date <= today
      const today = new Date();
      const publishedProperties = mockProperties.filter(
        p => p.estado_publicacion === 'PUBLICADA' && 
             new Date(p.fecha_publicacion_activa) <= today
      );
      
      this.properties.set(publishedProperties);
      this.filteredProperties.set(publishedProperties);
      this.updatePagination();
      this.loading.set(false);
    }, 1000);
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.properties()];
    
    // Apply filters
    if (filters.ubicacion_id) {
      filtered = filtered.filter(p => p.ubicacion.id === parseInt(filters.ubicacion_id));
    }
    
    if (filters.categoria_id) {
      filtered = filtered.filter(p => p.categoria.id === parseInt(filters.categoria_id));
    }
    
    if (filters.cantidad_cuartos) {
      if (filters.cantidad_cuartos === '4') {
        filtered = filtered.filter(p => p.cantidad_cuartos >= 4);
      } else {
        filtered = filtered.filter(p => p.cantidad_cuartos === parseInt(filters.cantidad_cuartos));
      }
    }
    
    if (filters.cantidad_banos) {
      if (filters.cantidad_banos === '3') {
        filtered = filtered.filter(p => p.cantidad_banos >= 3);
      } else {
        filtered = filtered.filter(p => p.cantidad_banos === parseInt(filters.cantidad_banos));
      }
    }
    
    if (filters.precio_minimo) {
      filtered = filtered.filter(p => p.precio >= parseInt(filters.precio_minimo));
    }
    
    if (filters.precio_maximo) {
      filtered = filtered.filter(p => p.precio <= parseInt(filters.precio_maximo));
    }
    
    // Apply sorting
    const sortBy = filters.sortBy;
    const sortOrder = filters.sortOrder;
    
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'precio':
          aValue = a.precio;
          bValue = b.precio;
          break;
        case 'ubicacion':
          aValue = a.ubicacion.ciudad;
          bValue = b.ubicacion.ciudad;
          break;
        case 'categoria':
          aValue = a.categoria.nombre;
          bValue = b.categoria.nombre;
          break;
        default: // fecha_publicacion
          aValue = new Date(a.fecha_publicacion);
          bValue = new Date(b.fecha_publicacion);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
    
    this.filteredProperties.set(filtered);
    this.currentPage.set(1);
    this.updatePagination();
  }

  clearFilters(): void {
    this.filterForm.reset({
      sortBy: 'fecha_publicacion',
      sortOrder: 'desc'
    });
    this.applyFilters();
  }

  updatePagination(): void {
    const total = Math.ceil(this.filteredProperties().length / this.itemsPerPage);
    this.totalPages.set(Math.max(1, total));
  }

  paginatedProperties(): Property[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProperties().slice(start, end);
  }

  getVisiblePages(): (number | string)[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    
    if (total <= 7) {
      // Si hay 7 o menos páginas, mostrar todas
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    
    // Calcular el rango alrededor de la página actual
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    
    // Agregar la primera página
    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }
    
    // Agregar el rango
    rangeWithDots.push(...range);
    
    // Agregar la última página
    if (current + delta < total - 1) {
      rangeWithDots.push('...', total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }
    
    // Filtrar duplicados manteniendo orden
    const seen = new Set<number | string>();
    return rangeWithDots.filter(item => {
      if (seen.has(item)) {
        return false;
      }
      seen.add(item);
      return true;
    });
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PUBLICADA':
        return 'bg-green-100 text-green-800';
      case 'PUBLICACION_PAUSADA':
        return 'bg-yellow-100 text-yellow-800';
      case 'TRANSACCION_CURSO':
        return 'bg-blue-100 text-blue-800';
      case 'TRANSACCION_FINALIZADA':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PUBLICADA':
        return 'Disponible';
      case 'PUBLICACION_PAUSADA':
        return 'Pausada';
      case 'TRANSACCION_CURSO':
        return 'En Transacción';
      case 'TRANSACCION_FINALIZADA':
        return 'Vendida';
      default:
        return status;
    }
  }

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }
}
