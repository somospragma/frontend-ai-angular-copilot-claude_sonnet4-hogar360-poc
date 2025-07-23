import { Component, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { AuthFacade } from '../../core/facades/auth.facade';
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
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);

  currentUser = this.authFacade.user$;
  pageTitle = '';
  navigationItems: NavigationItem[] = [];
  
  // Cache para los SVGs
  private readonly svgCache = new Map<string, string>();

  ngOnInit(): void {
    this.loadSvgIcons().then(() => {
      this.setupNavigationBasedOnRole();
      this.updatePageTitle();
      // Forzar detección de cambios después de cargar los íconos
      this.cdr.detectChanges();
    });
  }

  private async loadSvgIcons(): Promise<void> {
    const iconFiles = [
      'dashboard-icon.svg',
      'categories-icon.svg', 
      'properties-icon.svg',
      'users-icon.svg',
      'settings-icon.svg',
      'location-icon.svg'
    ];

    console.log('🎨 Loading SVG icons...');
    
    for (const file of iconFiles) {
      try {
        const svg = await firstValueFrom(this.http.get(`/assets/images/${file}`, { responseType: 'text' }));
        if (svg) {
          this.svgCache.set(file, svg);
        }
      } catch (error) {
        console.warn(`❌ Failed to load SVG: ${file}`, error);
      }
    }
  }

  private getSvgIcon(filename: string): string {
    const svg = this.svgCache.get(filename);
    if (!svg) {
      console.warn(`SVG not found in cache: ${filename}`);
      return '';
    }
    return svg;
  }

  private setupNavigationBasedOnRole(): void {
    const user = this.authFacade.getCurrentUser();
    if (!user) return;

    const baseItems: NavigationItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        route: this.getDashboardRoute(),
        icon: this.getSvgIcon('dashboard-icon.svg'),
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
            icon: this.getSvgIcon('categories-icon.svg'),
            isActive: this.isActiveRoute('/admin/categorias')
          },
          {
            id: 'propiedades',
            label: 'Propiedades',
            route: '/admin/propiedades',
            icon: this.getSvgIcon('properties-icon.svg'),
            isActive: this.isActiveRoute('/admin/propiedades')
          },
          {
            id: 'ubicaciones',
            label: 'Ubicaciones',
            route: '/admin/ubicaciones',
            icon: this.getSvgIcon('location-icon.svg'),
            isActive: this.isActiveRoute('/admin/ubicaciones')
          },
          {
            id: 'usuarios',
            label: 'Usuarios',
            route: '/admin/usuarios-vendedores',
            icon: this.getSvgIcon('users-icon.svg'),
            isActive: this.isActiveRoute('/admin/usuarios')
          },
          {
            id: 'horarios-visitas',
            label: 'Horarios de Visitas',
            route: '/admin/horarios-visitas',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>`,
            isActive: this.isActiveRoute('/admin/horarios-visitas')
          },
          {
            id: 'configuracion',
            label: 'Configuración',
            route: '/admin/configuracion',
            icon: this.getSvgIcon('settings-icon.svg'),
            isActive: this.isActiveRoute('/admin/configuracion')
          }
        ];
        break;

      case UserRole.VENDEDOR:
        this.navigationItems = [
          ...baseItems,
          // HU #2: Listar categorías (todos los roles)
          {
            id: 'categorias',
            label: 'Categorías',
            route: '/vendedor/categorias',
            icon: this.getSvgIcon('categories-icon.svg'),
            isActive: this.isActiveRoute('/vendedor/categorias')
          },
          // HU #4: Buscar ubicaciones (todos los roles)
          {
            id: 'ubicaciones',
            label: 'Ubicaciones',
            route: '/vendedor/ubicaciones',
            icon: this.getSvgIcon('location-icon.svg'),
            isActive: this.isActiveRoute('/vendedor/ubicaciones')
          },
          {
            id: 'propiedades',
            label: 'Mis Propiedades',
            route: '/vendedor/propiedades',
            icon: this.getSvgIcon('properties-icon.svg'),
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
            isActive: this.isActiveRoute('/vendedor/horarios-visitas')
          },
          {
            id: 'configuracion',
            label: 'Configuración',
            route: '/vendedor/configuracion',
            icon: this.getSvgIcon('settings-icon.svg'),
            isActive: this.isActiveRoute('/vendedor/configuracion')
          }
        ];
        break;

      case UserRole.COMPRADOR:
        this.navigationItems = [
          ...baseItems,
          // HU #2: Listar categorías (todos los roles)
          {
            id: 'categorias',
            label: 'Categorías',
            route: '/comprador/categorias',
            icon: this.getSvgIcon('categories-icon.svg'),
            isActive: this.isActiveRoute('/comprador/categorias')
          },
          // HU #4: Buscar ubicaciones (todos los roles)
          {
            id: 'ubicaciones',
            label: 'Ubicaciones',
            route: '/comprador/ubicaciones',
            icon: this.getSvgIcon('location-icon.svg'),
            isActive: this.isActiveRoute('/comprador/ubicaciones')
          },
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
            id: 'horarios',
            label: 'Horarios de Visitas',
            route: '/comprador/horarios-visitas',
            icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>`,
            isActive: this.isActiveRoute('/comprador/horarios-visitas')
          },
        ];
        break;

      default:
        this.navigationItems = baseItems;
    }
  }

  private getDashboardRoute(): string {
    const user = this.authFacade.getCurrentUser();
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
