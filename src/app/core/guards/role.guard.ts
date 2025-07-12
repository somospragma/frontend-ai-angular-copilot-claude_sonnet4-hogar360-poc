import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRoles = route.data?.['roles'] as UserRole[];
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        if (requiredRoles && !requiredRoles.includes(user.role)) {
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}
