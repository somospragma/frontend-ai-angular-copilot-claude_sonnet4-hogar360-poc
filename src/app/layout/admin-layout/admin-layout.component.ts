import { Component, inject, ChangeDetectionStrategy, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../shared/components/atoms/logo/logo.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoComponent],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo-container" (click)="navigateToHome($event)">
            <app-logo size="md" variant="default"></app-logo>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <ul class="nav-list">
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('/admin/dashboard')"
                 (click)="navigateTo('/admin/dashboard', $event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="6" height="7" rx="1"/>
                  <rect x="13" y="4" width="6" height="7" rx="1"/>
                  <rect x="3" y="15" width="6" height="6" rx="1"/>
                  <rect x="13" y="15" width="6" height="6" rx="1"/>
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('/admin/categorias')"
                 (click)="navigateTo('/admin/categorias', $event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="6" height="6" rx="1"/>
                  <rect x="11" y="4" width="6" height="6" rx="1"/>
                  <rect x="11" y="12" width="6" height="6" rx="1"/>
                  <rect x="3" y="12" width="6" height="6" rx="1"/>
                </svg>
                Categorías
              </a>
            </li>
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('/admin/propiedades')"
                 (click)="navigateTo('/admin/propiedades', $event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 2v20l-5.5-4L10 2z"/>
                  <path d="M14 2v20l5.5-4L14 2z"/>
                </svg>
                Propiedades
              </a>
            </li>
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('/admin/ubicaciones')"
                 (click)="navigateTo('/admin/ubicaciones', $event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Ubicaciones
              </a>
            </li>
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('/admin/usuarios')"
                 (click)="navigateTo('/admin/usuarios-vendedores', $event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Usuarios
              </a>
            </li>
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('/admin/configuracion')"
                 (click)="navigateTo('/admin/configuracion', $event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Configuración
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <div class="main-area">
        <!-- Header -->
        <header class="header">
          <div class="header-content">
            <h1 class="page-title">{{ getPageTitle() }}</h1>
            
            <div class="user-section">
              <div class="user-info">
                <div class="user-details">
                  <span class="welcome-text">Bienvenido, {{ getUserName() }}</span>
                  <span class="user-role">{{ getUserRole() }}</span>
                </div>
                <img 
                  [src]="getUserAvatar()" 
                  [alt]="getUserName()"
                  class="user-avatar clickable"
                  (click)="toggleDropdown($event)"
                />
              </div>
              
              <div class="user-dropdown" [class.open]="dropdownOpen()">
                <div class="dropdown-menu" *ngIf="dropdownOpen()">
                  <a class="dropdown-item" (click)="viewProfile($event)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Ver perfil
                  </a>
                  <a class="dropdown-item" (click)="logout($event)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Cerrar sesión
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            <div class="footer-left">
              <app-logo size="sm" variant="default"></app-logo>
              <span class="footer-text">© 2025 Hogar360. Todos los derechos reservados.</span>
            </div>
            <div class="footer-right">
              <span class="version">v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      @apply flex min-h-screen bg-neutral-50;
    }

    /* Sidebar */
    .sidebar {
      @apply w-64 flex flex-col fixed h-full z-10;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      color: #374151;
    }

    .sidebar-header {
      @apply p-6;
      border-bottom: 1px solid #e5e7eb;
    }

    .logo-container {
      @apply cursor-pointer transition-transform hover:scale-105;
    }

    .sidebar-nav {
      @apply flex-1 p-4;
    }

    .nav-list {
      @apply space-y-2;
    }

    .nav-item {
      @apply flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer;
    }

    .nav-item.active {
      @apply text-blue-600 font-medium;
      background: #eff6ff;
    }

    /* Main Area */
    .main-area {
      @apply flex-1 flex flex-col ml-64;
    }

    /* Header */
    .header {
      @apply bg-white border-b border-neutral-200 sticky top-0 z-20;
    }

    .header-content {
      @apply px-6 py-4 flex justify-between items-center;
    }

    .page-title {
      @apply text-2xl font-semibold text-neutral-900;
    }

    .user-section {
      @apply flex items-center gap-4;
    }

    .user-info {
      @apply flex items-center gap-3;
    }

    .user-avatar {
      @apply w-12 h-12 rounded-full object-cover border-2 border-primary-200;
    }

    .user-avatar.clickable {
      @apply cursor-pointer transition-transform hover:scale-105 hover:border-primary-400;
    }

    .user-details {
      @apply flex flex-col;
    }

    .welcome-text {
      @apply font-medium text-neutral-900;
    }

    .user-role {
      @apply text-sm text-neutral-600 capitalize;
    }

    /* Dropdown */
    .user-dropdown {
      @apply relative;
    }

    .dropdown-toggle {
      @apply p-2 rounded-lg hover:bg-neutral-100 transition-colors;
    }

    .dropdown-menu {
      @apply absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-30;
    }

    .dropdown-item {
      @apply flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer;
    }

    /* Page Content */
    .page-content {
      @apply flex-1 p-6;
    }

    /* Footer */
    .footer {
      @apply bg-white border-t border-neutral-200 mt-auto;
    }

    .footer-content {
      @apply px-6 py-4 flex justify-between items-center;
    }

    .footer-left {
      @apply flex items-center gap-4;
    }

    .footer-text {
      @apply text-sm text-neutral-600;
    }

    .version {
      @apply text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .sidebar {
        @apply transform -translate-x-full;
      }

      .main-area {
        @apply ml-0;
      }

      .header-content {
        @apply px-4;
      }

      .page-content {
        @apply p-4;
      }

      .user-info {
        @apply hidden;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;
  dropdownOpen = signal(false);

  ngOnInit(): void {
    // Verificar autenticación al inicializar
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Cerrar dropdown si se hace clic fuera
    if (this.dropdownOpen()) {
      this.dropdownOpen.set(false);
    }
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard';
    if (url.includes('/categorias')) return 'Categorías';
    if (url.includes('/propiedades')) return 'Propiedades';
    if (url.includes('/usuarios')) return 'Usuarios';
    if (url.includes('/configuracion')) return 'Configuración';
    return 'Admin';
  }

  getUserName(): string {
    return this.currentUser()?.nombre || 'Usuario';
  }

  getUserRole(): string {
    return this.currentUser()?.role || 'admin';
  }

  getUserAvatar(): string {
    // Usar una imagen por defecto o la imagen del usuario
    return this.currentUser()?.avatar || '/assets/images/avatar.jpg';
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  navigateTo(route: string, event?: Event): void {
    event?.preventDefault();
    this.router.navigate([route]);
    this.dropdownOpen.set(false);
  }

  navigateToHome(event?: Event): void {
    event?.preventDefault();
    this.router.navigate(['/landing']);
  }

  toggleDropdown(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  viewProfile(event?: Event): void {
    event?.preventDefault();
    this.dropdownOpen.set(false);
    this.router.navigate(['/admin/perfil']);
  }

  logout(event?: Event): void {
    event?.preventDefault();
    this.dropdownOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
