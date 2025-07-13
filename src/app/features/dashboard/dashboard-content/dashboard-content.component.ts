import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';
import { UserRole } from '../../../core/interfaces';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
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

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="section-header">
          <h2 class="section-title">Acciones Rápidas</h2>
        </div>
        
        <div class="actions-grid">
          <div class="action-card" (click)="navigateToQuickAction('categories')">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="6" height="6" rx="1"/>
                <rect x="11" y="4" width="6" height="6" rx="1"/>
                <rect x="11" y="12" width="6" height="6" rx="1"/>
                <rect x="3" y="12" width="6" height="6" rx="1"/>
              </svg>
            </div>
            <h3 class="action-title">{{ getActionTitle('categories') }}</h3>
            <p class="action-description">{{ getActionDescription('categories') }}</p>
          </div>

          <div class="action-card" (click)="navigateToQuickAction('locations')">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 class="action-title">{{ getActionTitle('locations') }}</h3>
            <p class="action-description">{{ getActionDescription('locations') }}</p>
          </div>

          <div class="action-card" (click)="navigateToQuickAction('users')">
            <div class="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 class="action-title">{{ getActionTitle('users') }}</h3>
            <p class="action-description">{{ getActionDescription('users') }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      @apply space-y-8;
    }

    /* Stats Grid */
    .stats-grid {
      @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
    }

    .stat-card {
      @apply bg-white rounded-xl p-6 border border-neutral-200 flex items-center gap-4 hover:shadow-lg transition-shadow;
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

    /* Quick Actions */
    .quick-actions {
      @apply bg-white rounded-xl border border-neutral-200 p-6;
    }

    .actions-grid {
      @apply grid grid-cols-1 md:grid-cols-3 gap-4;
    }

    .action-card {
      @apply p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer;
    }

    .action-icon {
      @apply w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-3;
    }

    .action-icon svg {
      @apply w-5 h-5 text-primary-600;
      color: #2563eb; /* Fallback color */
    }

    .action-title {
      @apply font-medium text-neutral-900 mb-1;
    }

    .action-description {
      @apply text-sm text-neutral-600;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .stats-grid {
        @apply grid-cols-1;
      }

      .actions-grid {
        @apply grid-cols-1;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContentComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;

  navigateToQuickAction(action: string): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      console.error('No user found');
      return;
    }

    const userRole = currentUser.role;
    let route = '';

    switch (action) {
      case 'categories':
        route = userRole === UserRole.ADMIN ? '/admin/categories' : '/vendedor/categories';
        break;
      case 'locations':
        route = userRole === UserRole.ADMIN ? '/admin/locations' : '/vendedor/locations';
        break;
      case 'users':
        route = userRole === UserRole.ADMIN ? '/admin/users' : '/vendedor/profile';
        break;
      case 'properties':
        if (userRole === UserRole.ADMIN) {
          route = '/admin/properties';
        } else if (userRole === UserRole.VENDEDOR) {
          route = '/vendedor/properties';
        } else {
          route = '/comprador/properties';
        }
        break;
      default:
        console.warn('Unknown action:', action);
        return;
    }

    this.router.navigate([route]);
  }

  getActionTitle(action: string): string {
    const currentUser = this.authService.currentUser();
    const userRole = currentUser?.role;

    switch (action) {
      case 'categories':
        return userRole === UserRole.ADMIN ? 'Gestionar Categorías' : 'Ver Categorías';
      case 'locations':
        return userRole === UserRole.ADMIN ? 'Gestionar Ubicaciones' : 'Ver Ubicaciones';
      case 'users':
        return userRole === UserRole.ADMIN ? 'Gestionar Usuarios' : 'Mi Perfil';
      case 'properties':
        if (userRole === UserRole.ADMIN) {
          return 'Todas las Propiedades';
        } else if (userRole === UserRole.VENDEDOR) {
          return 'Mis Propiedades';
        } else {
          return 'Buscar Propiedades';
        }
      default:
        return 'Acción';
    }
  }

  getActionDescription(action: string): string {
    const currentUser = this.authService.currentUser();
    const userRole = currentUser?.role;

    switch (action) {
      case 'categories':
        return userRole === UserRole.ADMIN ? 'Crear y administrar categorías de propiedades' : 'Explorar categorías disponibles';
      case 'locations':
        return userRole === UserRole.ADMIN ? 'Agregar y gestionar ubicaciones' : 'Ver ubicaciones disponibles';
      case 'users':
        return userRole === UserRole.ADMIN ? 'Administrar vendedores y compradores' : 'Ver y editar información personal';
      case 'properties':
        if (userRole === UserRole.ADMIN) {
          return 'Supervisar todas las propiedades del sistema';
        } else if (userRole === UserRole.VENDEDOR) {
          return 'Gestionar mis propiedades en venta';
        } else {
          return 'Encontrar la propiedad ideal';
        }
      default:
        return 'Realizar acción';
    }
  }
}
