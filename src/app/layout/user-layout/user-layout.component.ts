import { Component, inject, ChangeDetectionStrategy, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { AuthFacade } from '../../core/facades/auth.facade';
import { LogoComponent } from '../../shared/components/atoms/logo/logo.component';
import { ButtonComponent } from '../../shared/components/atoms/button/button.component';
import { UserRole } from '../../core/interfaces';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LogoComponent, ButtonComponent],
  template: `
    <div class="user-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo-container" (click)="navigateToHome($event)">
            <app-logo size="md" variant="white"></app-logo>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <ul class="nav-list">
            <!-- Dashboard común para todos -->
            <li>
              <a class="nav-item" 
                 [class.active]="isActiveRoute('dashboard')"
                 (click)="navigateToUserDashboard($event)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="6" height="7" rx="1"/>
                  <rect x="13" y="4" width="6" height="7" rx="1"/>
                  <rect x="3" y="15" width="6" height="6" rx="1"/>
                  <rect x="13" y="15" width="6" height="6" rx="1"/>
                </svg>
                Dashboard
              </a>
            </li>

            <!-- Opciones de Admin -->
            @if (isAdmin()) {
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
                   [class.active]="isActiveRoute('/admin/usuarios-vendedores')"
                   (click)="navigateTo('/admin/usuarios-vendedores', $event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Usuarios Vendedores
                </a>
              </li>
            }

            <!-- Opciones de Vendedor -->
            @if (isVendedor()) {
              <li>
                <a class="nav-item" 
                   [class.active]="isActiveRoute('/vendedor/propiedades')"
                   (click)="navigateTo('/vendedor/propiedades', $event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"/>
                    <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"/>
                  </svg>
                  Mis Propiedades
                </a>
              </li>
              <li>
                <a class="nav-item" 
                   [class.active]="isActiveRoute('/vendedor/horarios-visitas')"
                   (click)="navigateTo('/vendedor/horarios-visitas', $event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  Horarios de Visitas
                </a>
              </li>
            }

            <!-- Opciones de Comprador -->
            @if (isComprador()) {
              <li>
                <a class="nav-item" 
                   [class.active]="isActiveRoute('/propiedades')"
                   (click)="navigateTo('/propiedades', $event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 8.5l-7 7-4.5-4.5L7 13.5l2.5 2.5L14 8z"/>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Ver Propiedades
                </a>
              </li>
              <li>
                <a class="nav-item" 
                   [class.active]="isActiveRoute('/comprador/visitas')"
                   (click)="navigateTo('/comprador/visitas', $event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H3v9h6v-9z"/>
                    <path d="M21 11h-6v9h6v-9z"/>
                    <path d="M12 2L3 7v4h18V7l-9-5z"/>
                  </svg>
                  Mis Visitas
                </a>
              </li>
              <li>
                <a class="nav-item" 
                   [class.active]="isActiveRoute('/horarios-disponibles')"
                   (click)="navigateTo('/horarios-disponibles', $event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Horarios Disponibles
                </a>
              </li>
            }

            <!-- Configuración común para Admin y Vendedor -->
            @if (isAdminOrVendedor()) {
              <li>
                <a class="nav-item" 
                   [class.active]="isActiveRoute('configuracion')"
                   (click)="navigateToSettings($event)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Configuración
                </a>
              </li>
            }
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
    .user-layout {
      @apply flex min-h-screen bg-neutral-50;
    }

    /* Sidebar */
    .sidebar {
      @apply w-64 bg-primary-600 text-white flex flex-col fixed h-full z-10;
    }

    .sidebar-header {
      @apply p-6 border-b border-primary-500;
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
      @apply flex items-center gap-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-primary-500 transition-colors cursor-pointer;
    }

    .nav-item.active {
      @apply bg-primary-500 text-white shadow-lg;
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
export class UserLayoutComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  currentUser = this.authFacade.user$;
  dropdownOpen = signal(false);
  userRole = this.authFacade.userRole$;

  // Exponer UserRole para usarlo en el template
  UserRole = UserRole;

  ngOnInit(): void {
    // Verificar autenticación al inicializar
    if (!this.authFacade.getIsAuthenticated()) {
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
    if (url.includes('/ubicaciones')) return 'Ubicaciones';
    if (url.includes('/propiedades')) return 'Propiedades';
    if (url.includes('/usuarios')) return 'Usuarios';
    if (url.includes('/horarios')) return 'Horarios';
    if (url.includes('/visitas')) return 'Visitas';
    if (url.includes('/configuracion')) return 'Configuración';
    return 'Dashboard';
  }

  getUserName(): string {
    return this.authFacade.getCurrentUser()?.nombre || 'Usuario';
  }

  getUserRole(): string {
    return this.authFacade.getCurrentUser()?.role || 'user';
  }

  getUserAvatar(): string {
    return this.authFacade.getCurrentUser()?.avatar || '/assets/images/avatar.jpg';
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

  navigateToUserDashboard(event?: Event): void {
    event?.preventDefault();
    const role = this.authFacade.getUserRole();
    switch (role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case UserRole.VENDEDOR:
        this.router.navigate(['/vendedor/dashboard']);
        break;
      case UserRole.COMPRADOR:
        this.router.navigate(['/comprador/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
    this.dropdownOpen.set(false);
  }

  navigateToSettings(event?: Event): void {
    event?.preventDefault();
    const role = this.authFacade.getUserRole();
    if (role === UserRole.ADMIN) {
      this.router.navigate(['/admin/configuracion']);
    } else {
      this.router.navigate(['/vendedor/configuracion']);
    }
    this.dropdownOpen.set(false);
  }

  toggleDropdown(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  viewProfile(event?: Event): void {
    event?.preventDefault();
    this.dropdownOpen.set(false);
    this.router.navigate(['/perfil']);
  }

  // Helper methods for template
  isAdmin(): boolean {
    return this.authFacade.getUserRole() === UserRole.ADMIN;
  }

  isVendedor(): boolean {
    return this.authFacade.getUserRole() === UserRole.VENDEDOR;
  }

  isComprador(): boolean {
    return this.authFacade.getUserRole() === UserRole.COMPRADOR;
  }

  isAdminOrVendedor(): boolean {
    const role = this.authFacade.getUserRole();
    return role === UserRole.ADMIN || role === UserRole.VENDEDOR;
  }

  logout(event?: Event): void {
    event?.preventDefault();
    this.dropdownOpen.set(false);
    this.authFacade.logout();
    this.router.navigate(['/']);
  }
}
