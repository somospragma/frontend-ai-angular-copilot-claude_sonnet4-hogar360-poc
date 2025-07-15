import { Component, Input, Output, EventEmitter, inject, OnInit, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthFacade } from '../../../../core/facades/auth.facade';
import { SidebarComponent } from '../../molecules/sidebar/sidebar.component';
import { AppHeaderComponent } from '../../molecules/app-header/app-header.component';
import { AppFooterComponent } from '../../molecules/app-footer/app-footer.component';
import { NavigationItem } from '../../atoms/nav-item/nav-item.component';
import { UserInfo, DropdownAction } from '../../atoms/user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    AppHeaderComponent,
    AppFooterComponent
  ],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <app-sidebar
        [navigationItems]="navigationItems"
        (logoClick)="onLogoClick()"
        (itemClick)="onNavigationItemClick($event)">
      </app-sidebar>

      <!-- Main Content Area -->
      <div class="main-area">
        <!-- Header -->
        <app-header
          [pageTitle]="pageTitle"
          [user]="userInfo"
          [userActions]="userActions"
          (userActionClick)="onUserActionClick($event)">
        </app-header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>

        <!-- Footer -->
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      @apply flex min-h-screen bg-neutral-50;
    }

    .main-area {
      @apply flex-1 flex flex-col ml-64;
    }

    .page-content {
      @apply flex-1 p-6;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .main-area {
        @apply ml-0;
      }

      .page-content {
        @apply p-4;
      }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  @Input({ required: true }) navigationItems: NavigationItem[] = [];
  @Input() pageTitle: string = '';
  @Output() navigationItemClick = new EventEmitter<NavigationItem>();

  currentUser = this.authFacade.user$;
  dropdownOpen = signal(false);

  get userInfo(): UserInfo {
    const user = this.authFacade.getCurrentUser();
    return {
      name: user?.nombre || 'Usuario',
      role: user?.role || 'usuario',
      avatar: user?.avatar || '/assets/images/avatar.jpg'
    };
  }

  get userActions(): DropdownAction[] {
    return [
      {
        id: 'profile',
        label: 'Ver perfil',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>`
      },
      {
        id: 'logout',
        label: 'Cerrar sesión',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>`
      }
    ];
  }

  ngOnInit(): void {
    // Verificar autenticación al inicializar
    if (!this.authFacade.getIsAuthenticated()) {
      this.router.navigate(['/login']);
    }

    // Actualizar página título basado en la ruta actual
    this.updatePageTitle();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Cerrar dropdown si se hace clic fuera
    if (this.dropdownOpen()) {
      this.dropdownOpen.set(false);
    }
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

  onLogoClick(): void {
    const currentUser = this.authFacade.getCurrentUser();
    if (currentUser) {
      // Usuario autenticado - redirigir al dashboard correspondiente
      const dashboardRoute = this.getDashboardRouteForRole(currentUser.role);
      this.router.navigate([dashboardRoute]);
    } else {
      // Usuario no autenticado - ir al landing
      this.router.navigate(['/landing']);
    }
  }

  private getDashboardRouteForRole(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'vendedor':
        return '/vendedor/dashboard';
      case 'comprador':
        return '/comprador/dashboard';
      default:
        return '/landing';
    }
  }

  onNavigationItemClick(item: NavigationItem): void {
    this.router.navigate([item.route]);
    this.navigationItemClick.emit(item);
  }

  onUserActionClick(action: DropdownAction): void {
    switch (action.id) {
      case 'profile':
        this.viewProfile();
        break;
      case 'logout':
        this.logout();
        break;
    }
  }

  private viewProfile(): void {
    const userRole = this.authFacade.getCurrentUser()?.role?.toLowerCase();
    this.router.navigate([`/${userRole}/perfil`]);
  }

  private logout(): void {
    this.authFacade.logout();
    this.router.navigate(['/']);
  }
}
