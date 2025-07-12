import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { UserRole } from './core/interfaces';
import { ROUTES } from './core/constants';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    title: 'Hogar360 - Encuentra tu casa perfecta'
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
  {
    path: 'propiedades',
    loadComponent: () => import('./features/property-listing/property-listing.component').then(m => m.PropertyListingComponent),
    title: 'Propiedades Disponibles - Hogar360'
  },
  
  // Protected routes - Dashboard simple por ahora
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard - Hogar360'
  },
  
  // Admin routes
  {
    path: 'admin/dashboard',
    canActivate: [AuthGuard],
    data: { role: UserRole.ADMIN },
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard Admin - Hogar360'
  },
  {
    path: 'admin/categorias',
    canActivate: [AuthGuard],
    data: { role: UserRole.ADMIN },
    loadComponent: () => import('./features/categorias/categorias.component').then(m => m.CategoriasComponent),
    title: 'Gestión de Categorías - Hogar360'
  },
  {
    path: 'admin/ubicaciones',
    canActivate: [AuthGuard],
    data: { role: UserRole.ADMIN },
    loadComponent: () => import('./features/ubicaciones/ubicaciones.component').then(m => m.UbicacionesComponent),
    title: 'Gestión de Ubicaciones - Hogar360'
  },
  {
    path: 'admin/usuarios-vendedores',
    canActivate: [AuthGuard],
    data: { role: UserRole.ADMIN },
    loadComponent: () => import('./features/usuarios-vendedores/usuarios-vendedores.component').then(m => m.UsuariosVendedoresComponent),
    title: 'Gestión de Usuarios Vendedores - Hogar360'
  },
  
  // Seller routes
  {
    path: 'vendedor/dashboard',
    canActivate: [AuthGuard],
    data: { role: UserRole.VENDEDOR },
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard Vendedor - Hogar360'
  },
  {
    path: 'vendedor/propiedades',
    canActivate: [AuthGuard],
    data: { role: UserRole.VENDEDOR },
    loadComponent: () => import('./features/properties/properties.component').then(m => m.PropertiesComponent),
    title: 'Mis Propiedades - Hogar360'
  },
  {
    path: 'vendedor/horarios-visitas',
    canActivate: [AuthGuard],
    data: { role: UserRole.VENDEDOR },
    loadComponent: () => import('./features/visit-schedules/visit-schedules.component').then(m => m.VisitSchedulesComponent),
    title: 'Horarios de Visitas - Hogar360'
  },
  
  // Buyer routes
  {
    path: 'comprador/dashboard',
    canActivate: [AuthGuard],
    data: { role: UserRole.COMPRADOR },
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard Comprador - Hogar360'
  },
  
  // Catch all route
  {
    path: '**',
    redirectTo: '/login'
  }
];
