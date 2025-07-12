import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `    <!-- Contenido específico de categorías - sin layout duplicado -->
    <div class="categorias-content">
      <!-- Formulario de crear categoría -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">Crear Categoría</h1>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Categoría
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="Escribe el nombre de la categoría (máximo 50 caracteres)"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                maxlength="50">
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <textarea
                  formControlName="description"
                  placeholder="Describe la categoría..."
                  rows="4"
                  maxlength="90"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 resize-none"
                  (input)="updateCharCount()"></textarea>
              </div>
              <div class="flex justify-end mt-1 text-sm text-gray-500">
                <span>{{ characterCount() }}</span>
                <span>/90</span>
              </div>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                [disabled]="!categoryForm.valid"
                class="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Crear Categoría
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de categorías existentes -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Categorías Existentes</h2>        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (category of categories; track category.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ category.description }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button class="text-primary-600 hover:text-primary-700 mr-4" title="Editar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-700" title="Eliminar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        
        <!-- Paginación -->
        <nav class="flex justify-center mt-6 space-x-2">
          <button class="px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg">1</button>
          <button class="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">2</button>
          <button class="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">3</button>
          <button class="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">4</button>
          <button class="px-3 py-2 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .categorias-content {
      @apply max-w-6xl mx-auto;
    }

    /* Form styles */
    .form-section {
      @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
    }

    /* Table styles */
    .table-container {
      @apply bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden;
    }

    /* Custom button styles */
    .btn-primary {
      @apply px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
    }

    .btn-secondary {
      @apply px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors;
    }

    /* Action buttons */
    .action-btn {
      @apply p-1 rounded hover:bg-gray-100 transition-colors;
    }

    /* Input styles */
    .form-input {
      @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 transition-colors;
    }

    .form-textarea {
      @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 resize-none transition-colors;
    }
  `]
})
export class CategoriasComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  
  characterCount = signal(0);
  
  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(90)]]
  });

  categories: Category[] = [
    {
      id: '#CAT-2025001',
      name: 'Casas de lujo',
      description: 'Propiedades residenciales con acabados de lujo'
    },
    {
      id: '#CAT-2025002',
      name: 'Apartamentos',
      description: 'Espacios modernos y urbanos'
    }
  ];

  updateCharCount(): void {
    const description = this.categoryForm.get('description')?.value || '';
    this.characterCount.set(description.length);
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const newCategory: Category = {
        id: `#CAT-${new Date().getFullYear()}${String(this.categories.length + 1).padStart(3, '0')}`,
        name: formValue.name,
        description: formValue.description
      };
      
      this.categories.unshift(newCategory);
      this.categoryForm.reset();
      this.characterCount.set(0);
      
      console.log('Category created:', newCategory);
    }
  }
}
