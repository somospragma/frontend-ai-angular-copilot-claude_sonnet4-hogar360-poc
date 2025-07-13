import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/interfaces';
import { DashboardLayoutComponent } from '../../shared/components/organisms/dashboard-layout/dashboard-layout.component';
import { NavigationItem } from '../../shared/components/atoms/nav-item/nav-item.component';

@Component({
  selector: 'app-unified-layout',
  standalone: true,
  imports: [DashboardLayoutComponent],
  template: `
    <app-dashboard-layout
      [navigationItems]="navigationItems"
      [pageTitle]="pageTitle"
      (navigationItemClick)="onNavigationItemClick($event)">
    </app-dashboard-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnifiedLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser = this.authService.currentUser;
  pageTitle = '';
  navigationItems: NavigationItem[] = [];

  ngOnInit(): void {
    this.setupNavigationBasedOnRole();
    this.updatePageTitle();
  }

  private setupNavigationBasedOnRole(): void {
    const user = this.currentUser();
    if (!user) return;

    const baseItems: NavigationItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: this.getDashboardRoute(),
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="6" height="7" rx="1"/>
          <rect x="13" y="4" width="6" height="7" rx="1"/>
          <rect x="3" y="15" width="6" height="6" rx="1"/>
          <rect x="13" y="15" width="6" height="6" rx="1"/>
        </svg>`,
        isActive: this.isActiveRoute('/dashboard')
      }
    ];

    switch (user.role) {
      case UserRole.ADMIN:
        this.navigationItems = [
          ...baseItems,
          {
            id: 'categorias',
            label: 'Categorías',
            route: '/admin/categorias',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="4" width="6" height="6" rx="1"/>
              <rect x="11" y="4" width="6" height="6" rx="1"/>
              <rect x="11" y="12" width="6" height="6" rx="1"/>
              <rect x="3" y="12" width="6" height="6" rx="1"/>
            </svg>`,
            isActive: this.isActiveRoute('/admin/categorias')
          },
          {
            id: 'propiedades',
            label: 'Propiedades',
            route: '/admin/propiedades',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 2v20l-5.5-4L10 2z"/>
              <path d="M14 2v20l5.5-4L14 2z"/>
            </svg>`,
            isActive: this.isActiveRoute('/admin/propiedades')
          },
          {
            id: 'ubicaciones',
            label: 'Ubicaciones',
            route: '/admin/ubicaciones',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>`,
            isActive: this.isActiveRoute('/admin/ubicaciones')
          },
          {
            id: 'usuarios',
            label: 'Usuarios',
            route: '/admin/usuarios-vendedores',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>`,
            isActive: this.isActiveRoute('/admin/usuarios')
          },
          {
            id: 'configuracion',
            label: 'Configuración',
            route: '/admin/configuracion',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>`,
            isActive: this.isActiveRoute('/admin/configuracion')
          }
        ];
        break;

      case UserRole.VENDEDOR:
        this.navigationItems = [
          ...baseItems,
          {
            id: 'propiedades',
            label: 'Mis Propiedades',
            route: '/vendedor/propiedades',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 2v20l-5.5-4L10 2z"/>
              <path d="M14 2v20l5.5-4L14 2z"/>
            </svg>`,
            isActive: this.isActiveRoute('/vendedor/propiedades')
          },
          {
            id: 'horarios',
            label: 'Horarios de Visitas',
            route: '/vendedor/horarios-visitas',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>`,
            isActive: this.isActiveRoute('/vendedor/horarios')
          },
          {
            id: 'configuracion',
            label: 'Configuración',
            route: '/vendedor/configuracion',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>`,
            isActive: this.isActiveRoute('/vendedor/configuracion')
          }
        ];
        break;

      case UserRole.COMPRADOR:
        this.navigationItems = [
          ...baseItems,
          {
            id: 'visitas',
            label: 'Mis Visitas',
            route: '/comprador/visitas',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 8.5l-7 7-4.5-4.5L7 13.5l2.5 2.5L14 8z"/>
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>`,
            isActive: this.isActiveRoute('/comprador/visitas')
          },
          {
            id: 'agendar',
            label: 'Agendar Visita',
            route: '/comprador/agendar-visita',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>`,
            isActive: this.isActiveRoute('/comprador/agendar')
          }
        ];
        break;

      default:
        this.navigationItems = baseItems;
    }
  }

  private getDashboardRoute(): string {
    const user = this.currentUser();
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin/dashboard';
      case UserRole.VENDEDOR:
        return '/vendedor/dashboard';
      case UserRole.COMPRADOR:
        return '/comprador/dashboard';
      default:
        return '/dashboard';
    }
  }

  private isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  private updatePageTitle(): void {
    const url = this.router.url;
    if (url.includes('/dashboard')) this.pageTitle = 'Dashboard';
    else if (url.includes('/categorias')) this.pageTitle = 'Categorías';
    else if (url.includes('/propiedades')) this.pageTitle = 'Propiedades';
    else if (url.includes('/ubicaciones')) this.pageTitle = 'Ubicaciones';
    else if (url.includes('/usuarios')) this.pageTitle = 'Usuarios';
    else if (url.includes('/visitas')) this.pageTitle = 'Visitas';
    else if (url.includes('/horarios')) this.pageTitle = 'Horarios';
    else if (url.includes('/configuracion')) this.pageTitle = 'Configuración';
    else this.pageTitle = 'Panel de Control';
  }

  onNavigationItemClick(item: NavigationItem): void {
    // Actualizar estados activos
    this.navigationItems = this.navigationItems.map(navItem => ({
      ...navItem,
      isActive: navItem.id === item.id
    }));
    
    // Actualizar título de página
    this.updatePageTitle();
  }
}
