import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PropertyCard {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: 'Venta' | 'Renta';
  image: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-18">
          <div class="flex items-center">
            <div class="text-2xl font-bold text-primary-600">
              Hogar360
            </div>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <a href="#" class="text-secondary-600 hover:text-primary-600 font-medium">Compra</a>
            <a href="#" class="text-secondary-600 hover:text-primary-600 font-medium">Renta</a>
            <a href="#" class="text-secondary-600 hover:text-primary-600 font-medium">Vende</a>
            <button 
              (click)="navigateToLogin()"
              class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Ingresar
            </button>
          </div>
        </div>
      </nav>
    </header>

    <div class="bg-gray-50">
      <!-- Hero Section -->
      <section class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-black mb-8">Encuentra tu casa perfecta</h1>
            
            <!-- Search Form -->
            <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-xl">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Category Dropdown -->
                <div class="relative">
                  <select 
                    [(ngModel)]="selectedCategory"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white">
                    <option value="">Categoría</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="oficina">Oficina</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <!-- Location Input -->
                <input 
                  type="text" 
                  [(ngModel)]="searchLocation"
                  placeholder="Buscar por ubicación"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                
                <!-- Search Button -->
                <button 
                  (click)="searchProperties()"
                  class="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Properties Section -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- View Toggle -->
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-black">Propiedades Destacadas</h2>
            <div class="flex space-x-2">
              <button 
                [class]="viewMode() === 'grid' ? 'bg-white border border-gray-300 text-secondary-600' : 'bg-white border border-gray-300 text-secondary-600'"
                (click)="setViewMode('grid')"
                class="p-2 rounded-lg">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                [class]="viewMode() === 'list' ? 'bg-white border border-gray-300 text-secondary-600' : 'bg-white border border-gray-300 text-secondary-600'"
                (click)="setViewMode('list')"
                class="p-2 rounded-lg">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Properties Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (property of properties; track property.id) {
              <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <!-- Property Image -->
                <div class="relative h-48">
                  <img [src]="property.image" [alt]="property.title" class="w-full h-full object-cover">
                  <span [class]="property.type === 'Venta' ? 'absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm' : 'absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm'">
                    {{ property.type }}
                  </span>
                </div>
                
                <!-- Property Details -->
                <div class="p-6">
                  <h3 class="text-lg font-bold text-black mb-2">{{ property.title }}</h3>
                  <p class="text-secondary-600 mb-4">{{ property.location }}</p>
                  
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-2xl font-bold text-primary-600">{{ property.price }}</span>
                    <button class="text-gray-400 hover:text-red-500 transition-colors">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="flex justify-between text-sm text-secondary-600">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      {{ property.bedrooms }}
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd" />
                      </svg>
                      {{ property.bathrooms }}
                    </div>
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                      {{ property.area }}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Company Info -->
            <div>
              <h3 class="text-lg font-bold text-primary-600 mb-4">Hogar360</h3>
              <p class="text-secondary-600">Tu partner en la búsqueda del espacio perfecto.</p>
            </div>
            
            <!-- Quick Links -->
            <div>
              <h4 class="font-semibold text-black mb-4">Acceso rápido</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-secondary-600 hover:text-primary-600">Buscar Propiedades</a></li>
                <li><a href="#" class="text-secondary-600 hover:text-primary-600">Publica tu propiedad</a></li>
              </ul>
            </div>
            
            <!-- Contact -->
            <div>
              <h4 class="font-semibold text-black mb-4">Contactanos</h4>
              <ul class="space-y-2">
                <li class="flex items-center text-secondary-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  1-800-HOGAR360
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info&#64;hogar360.com
                </li>
                <li class="flex items-center text-secondary-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  123 Real Estate Ave
                </li>
              </ul>
            </div>
            
            <!-- Social Media -->
            <div>
              <h4 class="font-semibold text-black mb-4">Síguenos</h4>
              <div class="flex space-x-4">
                <a href="#" class="text-secondary-600 hover:text-primary-600">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="text-secondary-600 hover:text-primary-600">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" class="text-secondary-600 hover:text-primary-600">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.171.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" class="text-secondary-600 hover:text-primary-600">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div class="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-secondary-600">
            © 2025 Hogar360. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  private readonly router = inject(Router);
  
  selectedCategory = signal('');
  searchLocation = signal('');
  viewMode = signal<'grid' | 'list'>('grid');

  properties: PropertyCard[] = [
    {
      id: 1,
      title: 'Casa a las afueras',
      location: 'Medellín',
      price: '$850,000',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,500 sq ft',
      type: 'Venta',
      image: '/assets/images/property-1.jpg'
    },
    {
      id: 2,
      title: 'Apartamento en el centro',
      location: 'Bogotá',
      price: '$3,500/mo',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200 sq ft',
      type: 'Renta',
      image: '/assets/images/property-2.jpg'
    },
    {
      id: 3,
      title: 'Moderno apartamento',
      location: 'Bogotá',
      price: '$425,000',
      bedrooms: 1,
      bathrooms: 1,
      area: '800 sq ft',
      type: 'Venta',
      image: '/assets/images/property-3.jpg'
    }
  ];

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  searchProperties(): void {
    console.log('Searching properties...', {
      category: this.selectedCategory(),
      location: this.searchLocation()
    });
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }
}
