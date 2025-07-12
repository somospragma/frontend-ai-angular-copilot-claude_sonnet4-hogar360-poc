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
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white border-b border-gray-200 h-14">
        <div class="max-w-full px-3">
          <div class="flex justify-between items-center h-12 mx-3 my-3">
            <div class="flex items-center">
              <div class="text-xs font-normal text-black leading-[20px] ml-2.5">
                Hogar 360
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-base font-normal text-gray-600">Bienvenido, Admin</span>
              <img src="/assets/images/avatar.jpg" alt="Avatar" class="w-8 h-8 rounded-full">
            </div>
          </div>
        </div>
      </nav>

      <div class="flex">
        <aside class="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div class="p-0">
            <div class="mt-5 mx-3">
              <div class="space-y-1">
                <div class="flex items-center px-2 py-2 text-sm font-normal text-gray-600 rounded-md">
                  <img src="/assets/images/dashboard-icon.svg" alt="Dashboard" class="mr-3 w-3.5 h-3.5">
                  Dashboard
                </div>
                <div class="flex items-center px-2 py-2 text-sm font-normal text-blue-600 bg-blue-50 rounded-md">
                  <img src="/assets/images/categories-icon.svg" alt="Categorías" class="mr-3 w-3.5 h-3.5">
                  Categorías
                </div>
                <div class="flex items-center px-2 py-2 text-sm font-normal text-gray-600 rounded-md">
                  <img src="/assets/images/properties-icon.svg" alt="Propiedades" class="mr-3 w-4 h-3.5">
                  Propiedades
                </div>
                <div class="flex items-center px-2 py-2 text-sm font-normal text-gray-600 rounded-md">
                  <img src="/assets/images/users-icon.svg" alt="Usuarios" class="mr-3 w-4 h-3.5">
                  Usuarios
                </div>
                <div class="flex items-center px-2 py-2 text-sm font-normal text-gray-600 rounded-md">
                  <img src="/assets/images/settings-icon.svg" alt="Configuración" class="mr-3 w-3.5 h-3.5">
                  Configuración
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="flex-1 p-16">
          <div class="max-w-7xl">
            <div class="mb-6">
              <h1 class="text-2xl font-normal text-gray-900 mb-16 leading-8">Crear Categoría</h1>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-16">
                <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
                  <div class="mb-7">
                    <label class="block text-sm font-normal text-gray-700 mb-2">
                      Nombre de la Categoría
                      <span class="text-red-500 text-sm font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="name"
                      placeholder="Escribe el nombre de la categoría (máximo 50 caracteres)"
                      class="w-full px-2.5 py-2.5 text-sm font-normal text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                      maxlength="50">
                  </div>
                  <div class="mb-10">
                    <label class="block text-sm font-normal text-gray-700 mb-2">
                      Descripción
                      <span class="text-red-500 text-sm font-normal">*</span>
                    </label>
                    <div class="relative">
                      <textarea
                        formControlName="description"
                        placeholder="Enter category description"
                        rows="7"
                        maxlength="90"
                        class="w-full px-4 py-2 text-base font-normal text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
                        (input)="updateCharCount()"></textarea>
                    </div>
                    <div class="flex justify-end mt-1 text-sm font-normal text-gray-600">
                      <span>{{ characterCount() }}</span>
                      <span class="font-normal">/90</span>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      [disabled]="!categoryForm.valid"
                      class="px-4 py-2.5 bg-blue-600 text-white text-sm font-normal rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[142px]">
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-8">Categorías existentes</h2>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    @for (category of categories; track category.id) {
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-600">{{ category.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900">{{ category.name }}</td>
                        <td class="px-6 py-4 text-sm font-normal text-gray-600">{{ category.description }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button class="text-red-600 hover:text-red-900">
                            <img src="/assets/images/edit-icon.svg" alt="Edit" class="w-3 h-3.5">
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <nav class="flex justify-center mt-6 space-x-2">
                <button class="px-4 py-2.5 bg-blue-600 text-white text-base font-normal rounded-lg">1</button>
                <button class="px-4 py-2.5 bg-white border border-gray-200 text-black text-base font-normal rounded-lg hover:bg-gray-50">2</button>
                <button class="px-4 py-2.5 bg-white border border-gray-200 text-black text-base font-normal rounded-lg hover:bg-gray-50">3</button>
                <button class="px-4 py-2.5 bg-white border border-gray-200 text-black text-base font-normal rounded-lg hover:bg-gray-50">4</button>
                <button class="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-base font-normal rounded-lg hover:bg-gray-50">
                  <img src="/assets/images/next-arrow.svg" alt="Next" class="w-2.5 h-4">
                </button>
              </nav>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
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
