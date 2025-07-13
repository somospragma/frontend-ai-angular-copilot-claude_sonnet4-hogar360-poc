import { Component, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CategoryService, Category } from '../../core/services/category.service';
import { AlertService } from '../../shared/services/alert.service';
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
      <main class="ml-64 pt-16 p-6">
        <div class="max-w-7xl mx-auto">
          
          <!-- Page Title -->
          <div class="mb-8">
            <h1 class="text-2xl font-semibold text-gray-900">Gestión de Categorías</h1>
            <p class="text-gray-600 mt-1">Crear y administrar categorías de inmuebles</p>
          </div>

          <!-- Category Form -->
          <div class="mb-8">
            <app-category-form
              (categoryCreated)="onCategoryCreated()"
            ></app-category-form>
          </div>

          <!-- Categories List Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900">Categorías existentes</h2>
              
              <!-- HU #2: Controles de filtro y búsqueda -->
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <label for="active-filter" class="text-sm text-gray-600">Estado:</label>
                  <select 
                    id="active-filter"
                    [(ngModel)]="filterOptions.activeOnly"
                    (change)="onFilterChange()"
                    class="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option [value]="true">Solo activas</option>
                    <option [value]="false">Todas</option>
                  </select>
                </div>
                
                <div class="flex items-center space-x-2">
                  <label for="sort-order" class="text-sm text-gray-600">Orden:</label>
                  <select 
                    id="sort-order"
                    [(ngModel)]="filterOptions.sortOrder"
                    (change)="onFilterChange()"
                    class="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                  </select>
                </div>
                
                <div>
                  <input 
                    type="text"
                    [(ngModel)]="filterOptions.searchText"
                    (input)="onFilterChange()"
                    placeholder="Buscar categorías..."
                    class="border border-gray-300 rounded-md px-3 py-1 text-sm w-48"
                  >
                </div>
              </div>
            </div>

            <!-- Categories Table -->
            <app-data-table
              [columns]="tableColumns"
              [data]="paginatedCategories()"
              [actions]="tableActions"
              [emptyMessage]="getEmptyMessage()"
              (actionClick)="onTableAction($event)"
            ></app-data-table>

            <!-- HU #2: Paginación completa -->
            <div class="mt-6 flex justify-between items-center">
              <div class="text-sm text-gray-600">
                Mostrando {{ getStartIndex() + 1 }} - {{ getEndIndex() }} de {{ getTotalFilteredItems() }} categorías
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
      </main>
    </div>
  `
})
export class CategoriasComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly alertService = inject(AlertService);
  private readonly viewContainerRef = inject(ViewContainerRef);

  // Signals
  categories = signal<Category[]>([]);
  filteredCategories = signal<Category[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  itemsPerPage = 10;

  // HU #2: Filtros para parametrización de búsqueda
  filterOptions = {
    activeOnly: true,
    sortOrder: 'asc' as 'asc' | 'desc',
    searchText: ''
  };

  // Table configuration
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: 'w-32' },
    { key: 'nombre', label: 'Name', width: 'w-48' },
    { key: 'descripcion', label: 'Description', width: 'flex-1' }
  ];

  tableActions: TableAction[] = [
    { icon: 'delete', label: 'Eliminar categoría', color: 'red', action: 'delete' }
  ];

  constructor() {
    // Set up alert service with view container
    this.alertService.setViewContainerRef(this.viewContainerRef);
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      const allCategories = await firstValueFrom(this.categoryService.getCategories());
      this.categories.set(allCategories);
      this.applyFilters();
    } catch (error) {
      console.error('Error loading categories:', error);
      await this.alertService.error('Error', 'Error al cargar las categorías');
    }
  }

  // HU #2: Aplicar filtros y ordenamiento
  applyFilters() {
    let filtered = [...this.categories()];

    // Filtrar por estado activo
    if (this.filterOptions.activeOnly) {
      filtered = filtered.filter(cat => cat.activo);
    }

    // Filtrar por texto de búsqueda
    if (this.filterOptions.searchText.trim()) {
      const searchTerm = this.filterOptions.searchText.toLowerCase().trim();
      filtered = filtered.filter(cat => 
        cat.nombre.toLowerCase().includes(searchTerm) ||
        cat.descripcion.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      const comparison = a.nombre.localeCompare(b.nombre);
      return this.filterOptions.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredCategories.set(filtered);
    this.updatePagination();
  }

  onFilterChange() {
    this.currentPage.set(1); // Reset a la primera página
    this.applyFilters();
  }

  onCategoryCreated() {
    this.loadCategories();
  }

  async onTableAction(event: {action: string, item: Category}) {
    if (event.action === 'delete') {
      await this.deleteCategory(event.item);
    }
  }

  async deleteCategory(category: Category) {
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
    if (!this.filterOptions.activeOnly) {
      return 'No hay categorías registradas';
    }
    return 'No hay categorías activas registradas';
  }
}