import { Component, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CategoryService, Category } from '../../core/services/category.service';
import { AlertService } from '../../shared/services/alert.service';
import { AuthFacade } from '../../core/facades/auth.facade';
import { UserRole } from '../../core/interfaces';
import { CategoryFormComponent } from '../../shared/components/organisms/category-form/category-form.component';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/molecules/data-table/data-table.component';
import { PaginationComponent } from '../../shared/components/molecules/pagination/pagination.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CategoryFormComponent,
    DataTableComponent,
    PaginationComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Main Content -->
      <main class="p-6">
        <div class="max-w-7xl mx-auto">
          
          <!-- Page Header -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ isAdmin() ? 'Gestión de Categorías' : 'Categorías de Inmuebles' }}
            </h1>
            <p class="text-gray-600">
              {{ isAdmin() ? 'Crear y administrar categorías de inmuebles' : 'Consulta las categorías disponibles para propiedades' }}
            </p>
          </div>

          <!-- Category Form - Solo para Admin (HU #1) -->
          <div *ngIf="isAdmin()" class="mb-6">
            <app-category-form
              (categoryCreated)="onCategoryCreated()"
            ></app-category-form>
          </div>

          <!-- Categories List Section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ isAdmin() ? 'Categorías Registradas' : 'Categorías Disponibles' }}
                <span class="text-sm font-normal text-gray-500 ml-2">
                  ({{ getTotalFilteredItems() }} {{ getTotalFilteredItems() === 1 ? 'categoría' : 'categorías' }})
                </span>
              </h2>
              
              <!-- HU #2: Controles de filtro y búsqueda -->
              <div class="flex flex-wrap items-center gap-3">
                <!-- Search Input -->
                <div class="relative">
                  <input 
                    type="text"
                    [(ngModel)]="filterOptions.searchText"
                    (input)="onFilterChange()"
                    placeholder="Buscar categorías..."
                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                  >
                  <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>

                <!-- Status Filter - Solo para Admin -->
                <div *ngIf="isAdmin()" class="flex items-center gap-2">
                  <label for="status-filter" class="text-sm font-medium text-gray-700">Estado:</label>
                  <select 
                    id="status-filter"
                    [(ngModel)]="filterOptions.activeOnly"
                    (change)="onFilterChange()"
                    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option [value]="true">Solo activas</option>
                    <option [value]="false">Todas</option>
                  </select>
                </div>
                
                <!-- Sort By -->
                <div class="flex items-center gap-2">
                  <label for="sort-by" class="text-sm font-medium text-gray-700">Ordenar por:</label>
                  <select 
                    id="sort-by"
                    [(ngModel)]="filterOptions.sortBy"
                    (change)="onFilterChange()"
                    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nombre">Nombre</option>
                    <option value="descripcion">Descripción</option>
                    <option value="fechaCreacion">Fecha de creación</option>
                  </select>
                </div>

                <!-- Sort Order -->
                <div class="flex items-center gap-2">
                  <label for="sort-order" class="text-sm font-medium text-gray-700">Orden:</label>
                  <select 
                    id="sort-order"
                    [(ngModel)]="filterOptions.sortOrder"
                    (change)="onFilterChange()"
                    class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>

                <!-- Clear Filters -->
                <button
                  (click)="clearFilters()"
                  class="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading()" class="flex justify-center items-center py-12">
              <div class="flex items-center space-x-2">
                <svg class="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600">Cargando categorías...</span>
              </div>
            </div>

            <!-- Categories Table -->
            <div *ngIf="!isLoading()">
              <app-data-table
                [columns]="getTableColumns()"
                [data]="paginatedCategories()"
                [actions]="getTableActions()"
                [emptyMessage]="getEmptyMessage()"
                (actionClick)="onTableAction($event)"
              ></app-data-table>

              <!-- HU #2: Paginación completa -->
              <div class="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div class="text-sm text-gray-600">
                  Mostrando {{ getStartIndex() + 1 }} - {{ getEndIndex() }} de {{ getTotalFilteredItems() }} categorías
                  <span *ngIf="filterOptions.searchText" class="ml-2 text-blue-600">
                    • Filtradas por: "{{ filterOptions.searchText }}"
                  </span>
                </div>
                
                <app-pagination
                  [currentPage]="currentPage()"
                  [totalPages]="getTotalPages()"
                  [maxVisiblePages]="5"
                  (pageChange)="onPageChange($event)"
                ></app-pagination>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly alertService = inject(AlertService);
  private readonly authFacade = inject(AuthFacade);
  private readonly viewContainerRef = inject(ViewContainerRef);

  // Signals
  categories = signal<Category[]>([]);
  filteredCategories = signal<Category[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  isLoading = signal(false);
  itemsPerPage = 10;

  // HU #2: Filtros mejorados para parametrización de búsqueda
  filterOptions = {
    activeOnly: true,
    sortOrder: 'asc' as 'asc' | 'desc',
    sortBy: 'nombre' as 'nombre' | 'descripcion' | 'fechaCreacion',
    searchText: ''
  };

  // Table configuration - Dinámicas según el rol
  private readonly adminTableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: 'w-20' },
    { key: 'nombre', label: 'Nombre', width: 'w-48' },
    { key: 'descripcion', label: 'Descripción', width: 'flex-1' },
    { key: 'fechaCreacion', label: 'Fecha de creación', width: 'w-32' },
    { key: 'activo', label: 'Estado', width: 'w-20' }
  ];

  private readonly userTableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', width: 'w-48' },
    { key: 'descripcion', label: 'Descripción', width: 'flex-1' },
    { key: 'fechaCreacion', label: 'Fecha de creación', width: 'w-32' }
  ];

  private readonly adminTableActions: TableAction[] = [
    { icon: 'delete', label: 'Eliminar categoría', color: 'red', action: 'delete' }
  ];

  constructor() {
    // Set up alert service with view container
    this.alertService.setViewContainerRef(this.viewContainerRef);
  }

  ngOnInit() {
    this.loadCategories();
    this.setupFiltersForRole();
  }

  // HU #2: Verificar si el usuario es administrador
  isAdmin(): boolean {
    const user = this.authFacade.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }

  // Configurar filtros según el rol
  private setupFiltersForRole(): void {
    if (!this.isAdmin()) {
      // Para vendedores y compradores, solo mostrar categorías activas
      this.filterOptions.activeOnly = true;
    }
  }

  // Obtener columnas de tabla según el rol
  getTableColumns(): TableColumn[] {
    return this.isAdmin() ? this.adminTableColumns : this.userTableColumns;
  }

  // Obtener acciones de tabla según el rol
  getTableActions(): TableAction[] {
    return this.isAdmin() ? this.adminTableActions : [];
  }

  async loadCategories() {
    this.isLoading.set(true);
    try {
      const allCategories = await firstValueFrom(this.categoryService.getCategories());
      this.categories.set(allCategories);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading categories:', error);
      await this.alertService.error('Error', 'Error al cargar las categorías');
    } finally {
      this.isLoading.set(false);
    }
  }

  // HU #2: Aplicar filtros y ordenamiento mejorado
  applyFilters() {
    let filtered = [...this.categories()];

    // Para usuarios no admin, siempre filtrar solo activas
    if (!this.isAdmin() || this.filterOptions.activeOnly) {
      filtered = filtered.filter(cat => cat.activo);
    }

    // Filtrar por texto de búsqueda (nombre y descripción)
    if (this.filterOptions.searchText.trim()) {
      const searchTerm = this.filterOptions.searchText.toLowerCase().trim();
      filtered = filtered.filter(cat => 
        cat.nombre.toLowerCase().includes(searchTerm) ||
        cat.descripcion.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenar por el criterio seleccionado
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.filterOptions.sortBy) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'descripcion':
          comparison = a.descripcion.localeCompare(b.descripcion);
          break;
        case 'fechaCreacion':
          comparison = new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
          break;
      }
      
      return this.filterOptions.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredCategories.set(filtered);
    this.updatePagination();
  }

  onFilterChange() {
    this.currentPage.set(1); // Reset a la primera página
    this.applyFilters();
  }

  clearFilters() {
    this.filterOptions = {
      activeOnly: true, // Siempre true para usuarios no admin
      sortOrder: 'asc',
      sortBy: 'nombre',
      searchText: ''
    };
    this.onFilterChange();
  }

  onCategoryCreated() {
    this.loadCategories();
  }

  async onTableAction(event: {action: string, item: Category}) {
    // Solo permitir acciones para administradores
    if (!this.isAdmin()) {
      await this.alertService.warning(
        'Acceso denegado',
        'No tienes permisos para realizar esta acción'
      );
      return;
    }

    if (event.action === 'delete') {
      await this.deleteCategory(event.item);
    }
  }

  async deleteCategory(category: Category) {
    // Verificación adicional de permisos
    if (!this.isAdmin()) {
      await this.alertService.error(
        'Acceso denegado',
        'Solo los administradores pueden eliminar categorías'
      );
      return;
    }

    const confirmed = await this.alertService.confirm(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar la categoría "${category.nombre}"?`,
      'Eliminar',
      'Cancelar'
    );

    if (confirmed) {
      try {
        await firstValueFrom(this.categoryService.deleteCategory(category.id));
        
        await this.alertService.success(
          'Éxito',
          `Categoría "${category.nombre}" eliminada exitosamente`
        );

        await this.loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        await this.alertService.error(
          'Error',
          'Error al eliminar la categoría. Por favor intenta nuevamente.'
        );
      }
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  paginatedCategories() {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories().slice(startIndex, endIndex);
  }

  updatePagination() {
    const totalItems = this.filteredCategories().length;
    this.totalPages.set(Math.ceil(totalItems / this.itemsPerPage));
    
    // Reset to page 1 if current page is beyond available pages
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(1);
    }
  }

  // HU #2: Métodos auxiliares para la paginación
  getTotalPages(): number {
    return this.totalPages();
  }

  getTotalFilteredItems(): number {
    return this.filteredCategories().length;
  }

  getStartIndex(): number {
    return (this.currentPage() - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    const endIndex = this.getStartIndex() + this.itemsPerPage;
    return Math.min(endIndex, this.getTotalFilteredItems());
  }

  getEmptyMessage(): string {
    if (this.filterOptions.searchText.trim()) {
      return `No se encontraron categorías que coincidan con "${this.filterOptions.searchText}"`;
    }
    if (this.isAdmin() && !this.filterOptions.activeOnly) {
      return 'No hay categorías registradas en el sistema';
    }
    return this.isAdmin() ? 'No hay categorías activas registradas' : 'No hay categorías disponibles en este momento';
  }
}