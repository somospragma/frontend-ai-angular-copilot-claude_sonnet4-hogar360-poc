import { Injectable, inject } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces';
import { ROUTES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthStatus(route, state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthStatus(childRoute, state);
  }

  private checkAuthStatus(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      this.router.navigate([ROUTES.LOGIN], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    // Check role-based permissions
    const requiredRole = route.data?.['role'] as UserRole;
    if (requiredRole) {
      const userRole = this.authService.userRole();
      if (userRole !== requiredRole) {
        this.redirectToAppropriateRoute(userRole);
        return false;
      }
    }

    return true;
  }

  private redirectToAppropriateRoute(userRole: UserRole | null): void {
    switch (userRole) {
      case UserRole.ADMIN:
        this.router.navigate([ROUTES.ADMIN_DASHBOARD]);
        break;
      case UserRole.VENDEDOR:
        this.router.navigate([ROUTES.SELLER_DASHBOARD]);
        break;
      case UserRole.COMPRADOR:
        this.router.navigate([ROUTES.BUYER_DASHBOARD]);
        break;
      default:
        this.router.navigate([ROUTES.LOGIN]);
    }
  }
}
