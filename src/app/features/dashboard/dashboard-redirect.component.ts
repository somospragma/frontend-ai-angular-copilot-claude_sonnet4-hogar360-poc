import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/interfaces';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Redirigiendo al dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class DashboardRedirectComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.redirectToRoleDashboard();
  }

  private redirectToRoleDashboard(): void {
    const currentUser = this.authService.currentUser();
    
    if (!currentUser) {
      console.warn('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    const userRole = currentUser.role;
    let redirectPath = '';

    switch (userRole) {
      case UserRole.ADMIN:
        redirectPath = '/admin/dashboard';
        break;
      case UserRole.VENDEDOR:
        redirectPath = '/vendedor/dashboard';
        break;
      case UserRole.COMPRADOR:
        redirectPath = '/comprador/dashboard';
        break;
      default:
        console.warn('Unknown user role:', userRole);
        redirectPath = '/login';
        break;
    }

    console.log(`Redirecting ${userRole} to ${redirectPath}`);
    this.router.navigate([redirectPath]);
  }
}
