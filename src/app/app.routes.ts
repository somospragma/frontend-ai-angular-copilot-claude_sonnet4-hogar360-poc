import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/interfaces';

export const routes: Routes = [
  // Public routes - HU #7: "Todos los roles" pueden listar casas
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    title: 'Hogar360 - Encuentra tu casa perfecta'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Hogar360'
  },
  
  // Public routes with layout
  {
    path: '',
    loadComponent: () => import('./layout/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      // HU #7: Listar casas para todos los roles
      {
        path: 'propiedades',
        loadComponent: () => import('./features/property-listing/property-listing.component').then(m => m.PropertyListingComponent),
        title: 'Propiedades Disponibles - Hogar360'
      },
      // HU #10: Listar horarios disponibles para todos los roles
      {
        path: 'horarios-disponibles',
        loadComponent: () => import('./features/visit-schedules-listing/visit-schedules-listing.component').then(m => m.VisitSchedulesListingComponent),
        title: 'Horarios de Visitas Disponibles - Hogar360'
      }
    ]
  },
  
  // Protected routes - Dashboard redirects to role-based dashboard
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard-redirect.component').then(m => m.DashboardRedirectComponent),
    title: 'Redirigiendo... - Hogar360'
  },
  
  // Admin routes - HU #1, #3, #5, #8 with unified layout
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: UserRole.ADMIN },
    loadComponent: () => import('./layout/unified-layout/unified-layout.component').then(m => m.UnifiedLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-content/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Dashboard Admin - Hogar360'
      },
      // HU #1: Crear categorías de inmuebles (solo Admin)
      {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent),
        title: 'Gestión de Categorías - Hogar360'
      },
      // HU #3: Crear ubicaciones (solo Admin)
      {
        path: 'ubicaciones',
        loadComponent: () => import('./features/ubicaciones/ubicaciones.component').then(m => m.UbicacionesComponent),
        title: 'Gestión de Ubicaciones - Hogar360'
      },
      // HU #5: Crear usuario vendedor (solo Admin)
      {
        path: 'usuarios-vendedores',
        loadComponent: () => import('./features/usuarios-vendedores/usuarios-vendedores.component').then(m => m.UsuariosVendedoresComponent),
        title: 'Gestión de Usuarios Vendedores - Hogar360'
      },
      {
        path: 'propiedades',
        loadComponent: () => import('./features/properties/properties.component').then(m => m.PropertiesComponent),
        title: 'Gestión de Propiedades - Hogar360'
      },
      // HU #10: Listar horarios de visita (Admin puede ver todos)
      {
        path: 'horarios-visitas',
        loadComponent: () => import('./features/visit-schedules-listing/visit-schedules-listing.component').then(m => m.VisitSchedulesListingComponent),
        title: 'Horarios de Visitas - Hogar360'
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Configuración - Hogar360'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Seller routes - HU #6, #9 with unified layout
  {
    path: 'vendedor',
    canActivate: [AuthGuard],
    data: { role: UserRole.VENDEDOR },
    loadComponent: () => import('./layout/unified-layout/unified-layout.component').then(m => m.UnifiedLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-content/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Dashboard Vendedor - Hogar360'
      },
      // HU #2: Listar categorías (todos los roles)
      {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent),
        title: 'Categorías de Inmuebles - Hogar360'
      },
      // HU #4: Buscar ubicaciones (todos los roles)
      {
        path: 'ubicaciones',
        loadComponent: () => import('./features/ubicaciones/ubicaciones.component').then(m => m.UbicacionesComponent),
        title: 'Ubicaciones Disponibles - Hogar360'
      },
      // HU #6: Publicar casa (solo Vendedor)
      {
        path: 'propiedades',
        loadComponent: () => import('./features/properties/properties.component').then(m => m.PropertiesComponent),
        title: 'Mis Propiedades - Hogar360'
      },
      // HU #9: Disponibilizar horarios de visitas (solo Vendedor)
      {
        path: 'horarios-visitas',
        loadComponent: () => import('./features/visit-schedules/visit-schedules.component').then(m => m.VisitSchedulesComponent),
        title: 'Horarios de Visitas - Hogar360'
      },
      {
        path: 'configuracion',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Configuración - Hogar360'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Buyer routes - HU #11 with unified layout
  {
    path: 'comprador',
    canActivate: [AuthGuard],
    data: { role: UserRole.COMPRADOR },
    loadComponent: () => import('./layout/unified-layout/unified-layout.component').then(m => m.UnifiedLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-content/dashboard-content.component').then(m => m.DashboardContentComponent),
        title: 'Dashboard Comprador - Hogar360'
      },
      // HU #2: Listar categorías (todos los roles)
      {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent),
        title: 'Categorías de Inmuebles - Hogar360'
      },
      // HU #4: Buscar ubicaciones (todos los roles)
      {
        path: 'ubicaciones',
        loadComponent: () => import('./features/ubicaciones/ubicaciones.component').then(m => m.UbicacionesComponent),
        title: 'Ubicaciones Disponibles - Hogar360'
      },
      // HU #11: Agendar visitas (solo Comprador)
      {
        path: 'visitas',
        loadComponent: () => import('./features/visits/visits.component').then(m => m.VisitsComponent),
        title: 'Mis Visitas Agendadas - Hogar360'
      },
      {
        path: 'agendar-visita',
        loadComponent: () => import('./features/schedule-visit/schedule-visit.component').then(m => m.ScheduleVisitComponent),
        title: 'Agendar Visita - Hogar360'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  
  // Catch all route
  {
    path: '**',
    redirectTo: '/login'
  }
];
