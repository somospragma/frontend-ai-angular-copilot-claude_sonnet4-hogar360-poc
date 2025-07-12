import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../shared/components/atoms/logo/logo.component';
import { ButtonComponent } from '../../shared/components/atoms/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LogoComponent, ButtonComponent],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <app-logo size="md" variant="white"></app-logo>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-title">Principal</h3>
            <ul class="nav-list">
              <li>
                <a href="#" class="nav-item active">
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
                <a href="#" class="nav-item" (click)="navigateToCategories()">
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
                <a href="#" class="nav-item" (click)="navigateToUbicaciones()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Ubicaciones
                </a>
              </li>
              <li>
                <a href="#" class="nav-item" (click)="navigateToUsuariosVendedores()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Usuarios Vendedores
                </a>
              </li>
              <li>
                <a href="#" class="nav-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 8.5l-7 7-4.5-4.5L7 13.5l2.5 2.5L14 8z"/>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Propiedades
                </a>
              </li>
            </ul>
          </div>
          
          <div class="nav-section">
            <h3 class="nav-title">Configuración</h3>
            <ul class="nav-list">
              <li>
                <a href="#" class="nav-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Configuración
                </a>
              </li>
            </ul>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <app-button 
            variant="outline" 
            size="sm" 
            (clicked)="logout()"
            class="w-full"
          >
            Cerrar sesión
          </app-button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <h1 class="page-title">Dashboard</h1>
            <p class="page-subtitle">Bienvenido, {{ currentUser()?.nombre || 'Usuario' }}</p>
          </div>
          
          <div class="header-right">
            <div class="user-profile">
              <div class="user-avatar">
                <span>{{ getUserInitials() }}</span>
              </div>
              <div class="user-info">
                <span class="user-name">{{ currentUser()?.nombre }}</span>
                <span class="user-role">{{ currentUser()?.role }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Dashboard Content -->
        <div class="dashboard-content">
          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">1,234</h3>
                <p class="stat-label">Usuarios Totales</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 8.5l-7 7-4.5-4.5L7 13.5l2.5 2.5L14 8z"/>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">856</h3>
                <p class="stat-label">Propiedades Activas</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="4" width="6" height="6" rx="1"/>
                  <rect x="11" y="4" width="6" height="6" rx="1"/>
                  <rect x="11" y="12" width="6" height="6" rx="1"/>
                  <rect x="3" y="12" width="6" height="6" rx="1"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">12</h3>
                <p class="stat-label">Categorías</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">45</h3>
                <p class="stat-label">Ventas Este Mes</p>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="activity-section">
            <div class="section-header">
              <h2 class="section-title">Actividad Reciente</h2>
              <app-button variant="secondary" size="sm">Ver Todo</app-button>
            </div>
            
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <p class="activity-text">Nuevo usuario registrado</p>
                  <span class="activity-time">Hace 2 horas</span>
                </div>
              </div>

              <div class="activity-item">
                <div class="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 8.5l-7 7-4.5-4.5L7 13.5l2.5 2.5L14 8z"/>
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <p class="activity-text">Propiedad añadida en Medellín</p>
                  <span class="activity-time">Hace 4 horas</span>
                </div>
              </div>

              <div class="activity-item">
                <div class="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="6" height="6" rx="1"/>
                    <rect x="11" y="4" width="6" height="6" rx="1"/>
                    <rect x="11" y="12" width="6" height="6" rx="1"/>
                    <rect x="3" y="12" width="6" height="6" rx="1"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <p class="activity-text">Nueva categoría creada: Oficinas</p>
                  <span class="activity-time">Ayer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      @apply flex min-h-screen bg-neutral-50;
    }

    /* Sidebar */
    .sidebar {
      @apply w-64 bg-primary-600 text-white flex flex-col;
    }

    .sidebar-header {
      @apply p-6 border-b border-primary-500;
    }

    .sidebar-nav {
      @apply flex-1 p-4 space-y-6;
    }

    .nav-section .nav-title {
      @apply text-primary-200 text-sm font-medium uppercase tracking-wider mb-3;
    }

    .nav-list {
      @apply space-y-1;
    }

    .nav-item {
      @apply flex items-center gap-3 px-3 py-2 rounded-lg text-primary-100 hover:bg-primary-500 transition-colors;
    }

    .nav-item.active {
      @apply bg-primary-500 text-white;
    }

    .sidebar-footer {
      @apply p-4 border-t border-primary-500;
    }

    /* Main Content */
    .main-content {
      @apply flex-1 flex flex-col;
    }

    .header {
      @apply bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center;
    }

    .page-title {
      @apply text-2xl font-semibold text-neutral-900;
    }

    .page-subtitle {
      @apply text-neutral-600 mt-1;
    }

    .user-profile {
      @apply flex items-center gap-3;
    }

    .user-avatar {
      @apply w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium;
    }

    .user-name {
      @apply font-medium text-neutral-900;
    }

    .user-role {
      @apply text-sm text-neutral-600 capitalize;
    }

    /* Dashboard Content */
    .dashboard-content {
      @apply flex-1 p-6 space-y-6;
    }

    .stats-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
    }

    .stat-card {
      @apply bg-white rounded-xl p-6 border border-neutral-200 flex items-center gap-4;
    }

    .stat-icon {
      @apply w-12 h-12 rounded-lg flex items-center justify-center;
    }

    .stat-icon.primary {
      @apply bg-primary-100 text-primary-600;
    }

    .stat-icon.success {
      @apply bg-success-100 text-success-600;
    }

    .stat-icon.warning {
      @apply bg-warning-100 text-warning-600;
    }

    .stat-icon.danger {
      @apply bg-danger-100 text-danger-600;
    }

    .stat-value {
      @apply text-2xl font-semibold text-neutral-900;
    }

    .stat-label {
      @apply text-neutral-600 text-sm;
    }

    /* Activity Section */
    .activity-section {
      @apply bg-white rounded-xl border border-neutral-200 p-6;
    }

    .section-header {
      @apply flex justify-between items-center mb-6;
    }

    .section-title {
      @apply text-lg font-semibold text-neutral-900;
    }

    .activity-list {
      @apply space-y-4;
    }

    .activity-item {
      @apply flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors;
    }

    .activity-icon {
      @apply w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600;
    }

    .activity-text {
      @apply font-medium text-neutral-900;
    }

    .activity-time {
      @apply text-sm text-neutral-500;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .sidebar {
        @apply hidden;
      }

      .header {
        @apply px-4;
      }

      .dashboard-content {
        @apply p-4;
      }

      .stats-grid {
        @apply grid-cols-1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user?.nombre) return 'U';
    
    return user.nombre
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  navigateToCategories(): void {
    this.router.navigate(['/admin/categorias']);
  }

  navigateToUbicaciones(): void {
    this.router.navigate(['/admin/ubicaciones']);
  }

  navigateToUsuariosVendedores(): void {
    this.router.navigate(['/admin/usuarios-vendedores']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
