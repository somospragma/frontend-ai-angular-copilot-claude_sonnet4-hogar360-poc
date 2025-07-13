import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  template: `
    <div class="public-layout">
      <!-- Header Navigation -->
      <header class="bg-white shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-18">
            <div class="flex items-center">
              <div class="text-2xl font-bold text-primary-600 cursor-pointer" (click)="navigateToLanding()">
                Hogar360
              </div>
            </div>
            
            <div class="hidden md:flex items-center space-x-8">
              <a (click)="navigateToProperties()" class="text-secondary-600 hover:text-primary-600 font-medium cursor-pointer">Propiedades</a>
              <a (click)="navigateToSchedules()" class="text-secondary-600 hover:text-primary-600 font-medium cursor-pointer">Horarios</a>
              <button 
                (click)="navigateToLogin()"
                class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Ingresar
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-secondary-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="col-span-1 md:col-span-2">
              <h3 class="text-2xl font-bold mb-4">Hogar360</h3>
              <p class="text-secondary-300 mb-4">
                Conectamos personas con espacios que transforman vidas. 
                Encuentra tu hogar perfecto en toda Colombia.
              </p>
            </div>
            
            <div>
              <h4 class="font-semibold mb-4">Enlaces</h4>
              <ul class="space-y-2 text-secondary-300">
                <li><a (click)="navigateToProperties()" class="hover:text-white cursor-pointer">Propiedades</a></li>
                <li><a (click)="navigateToSchedules()" class="hover:text-white cursor-pointer">Horarios</a></li>
                <li><a (click)="navigateToLogin()" class="hover:text-white cursor-pointer">Iniciar Sesión</a></li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-semibold mb-4">Contacto</h4>
              <ul class="space-y-2 text-secondary-300">
                <li>📧 info&#64;hogar360.com</li>
                <li>📱 +57 300 123 4567</li>
                <li>📍 Bogotá, Colombia</li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-secondary-700 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 Hogar360. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .public-layout {
      @apply min-h-screen flex flex-col;
    }

    .main-content {
      @apply flex-1;
    }

    header nav .h-18 {
      height: 4.5rem;
    }
  `]
})
export class PublicLayoutComponent {
  private readonly router = inject(Router);

  navigateToLanding(): void {
    this.router.navigate(['/landing']);
  }

  navigateToProperties(): void {
    this.router.navigate(['/propiedades']);
  }

  navigateToSchedules(): void {
    this.router.navigate(['/horarios-disponibles']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
