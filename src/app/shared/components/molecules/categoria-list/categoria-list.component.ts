import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../atoms/button/button.component';
import { Categoria } from '../../../../core/interfaces/categoria.interface';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="categoria-list">
      <div class="list-header">
        <h3 class="list-title">Categorías de Inmuebles</h3>
        <p class="list-description">
          Total: {{ categorias.length }} categoría{{ categorias.length !== 1 ? 's' : '' }}
        </p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>

      <div *ngIf="!loading && categorias.length === 0" class="empty-state">
        <div class="empty-icon">📁</div>
        <h4>No hay categorías disponibles</h4>
        <p>Crea la primera categoría para organizar los inmuebles</p>
        <app-button
          *ngIf="canCreate"
          variant="primary"
          (clicked)="onCreate()"
        >
          Crear Primera Categoría
        </app-button>
      </div>

      <div *ngIf="!loading && categorias.length > 0" class="categories-grid">
        <div 
          *ngFor="let categoria of categorias; trackBy: trackByCategoria"
          class="categoria-card"
        >
          <div class="card-header">
            <h4 class="categoria-nombre">{{ categoria.nombre }}</h4>
            <div class="card-actions" *ngIf="canEdit || canDelete">
              <app-button
                *ngIf="canEdit"
                variant="ghost"
                size="sm"
                (clicked)="onEdit(categoria)"
                ariaLabel="Editar categoría {{ categoria.nombre }}"
              >
                ✏️
              </app-button>
              <app-button
                *ngIf="canDelete"
                variant="danger"
                size="sm"
                (clicked)="onDelete(categoria)"
                ariaLabel="Eliminar categoría {{ categoria.nombre }}"
              >
                🗑️
              </app-button>
            </div>
          </div>

          <p class="categoria-descripcion">{{ categoria.descripcion }}</p>

          <div class="card-footer">
            <span class="categoria-id">ID: {{ categoria.id }}</span>
            <span 
              *ngIf="categoria.fechaCreacion" 
              class="fecha-creacion"
            >
              {{ categoria.fechaCreacion | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div 
        *ngIf="!loading && categorias.length > 0 && showPagination" 
        class="pagination-container"
      >
        <app-button
          variant="ghost"
          size="sm"
          [disabled]="currentPage <= 1"
          (clicked)="onPageChange(currentPage - 1)"
        >
          ← Anterior
        </app-button>

        <span class="pagination-info">
          Página {{ currentPage }} de {{ totalPages }}
        </span>

        <app-button
          variant="ghost"
          size="sm"
          [disabled]="currentPage >= totalPages"
          (clicked)="onPageChange(currentPage + 1)"
        >
          Siguiente →
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .categoria-list {
      @apply w-full;
    }

    .list-header {
      @apply mb-6;
    }

    .list-title {
      @apply text-lg font-semibold text-gray-900 mb-1;
    }

    .list-description {
      @apply text-gray-600 text-sm;
    }

    .loading-state {
      @apply flex flex-col items-center justify-center py-12 text-gray-500;
    }

    .loading-spinner {
      @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4;
    }

    .empty-state {
      @apply flex flex-col items-center justify-center py-12 text-center;
    }

    .empty-icon {
      @apply text-4xl mb-4;
    }

    .empty-state h4 {
      @apply text-lg font-medium text-gray-900 mb-2;
    }

    .empty-state p {
      @apply text-gray-600 mb-4;
    }

    .categories-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
    }

    .categoria-card {
      @apply bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow;
    }

    .card-header {
      @apply flex justify-between items-start mb-3;
    }

    .categoria-nombre {
      @apply font-medium text-gray-900 flex-1;
    }

    .card-actions {
      @apply flex gap-1 ml-2;
    }

    .categoria-descripcion {
      @apply text-gray-600 text-sm mb-4 line-clamp-3;
    }

    .card-footer {
      @apply flex justify-between items-center text-xs text-gray-500;
    }

    .categoria-id {
      @apply font-mono;
    }

    .fecha-creacion {
      @apply italic;
    }

    .pagination-container {
      @apply flex justify-center items-center gap-4 mt-6;
    }

    .pagination-info {
      @apply text-sm text-gray-600;
    }

    /* Mobile First */
    @media (max-width: 768px) {
      .categories-grid {
        @apply grid-cols-1;
      }

      .card-header {
        @apply flex-col items-start gap-2;
      }

      .card-actions {
        @apply ml-0;
      }

      .pagination-container {
        @apply flex-col gap-2;
      }
    }

    /* Utility for text truncation */
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriaListComponent {
  @Input() categorias: Categoria[] = [];
  @Input() loading = false;
  @Input() canEdit = false;
  @Input() canDelete = false;
  @Input() canCreate = false;
  @Input() showPagination = false;
  @Input() currentPage = 1;
  @Input() totalPages = 1;

  @Output() edit = new EventEmitter<Categoria>();
  @Output() delete = new EventEmitter<Categoria>();
  @Output() create = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  trackByCategoria(index: number, categoria: Categoria): number {
    return categoria.id;
  }

  onEdit(categoria: Categoria): void {
    this.edit.emit(categoria);
  }

  onDelete(categoria: Categoria): void {
    this.delete.emit(categoria);
  }

  onCreate(): void {
    this.create.emit();
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
