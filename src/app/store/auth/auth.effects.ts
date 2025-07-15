import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';

import { MockAuthService } from '../../core/services/mock-auth.service';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS } from '../../core/constants';
import { LoginResponse, ApiResponse } from '../../core/interfaces';
import * as AuthActions from './auth.actions';

// Development mode flag - change to false for real API
const DEVELOPMENT_MODE = true;

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly mockAuthService = inject(MockAuthService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action => {
        // Use mock service in development mode
        if (DEVELOPMENT_MODE) {
          return this.mockAuthService.login(action.credentials).pipe(
            map(response => {
              // Store tokens in localStorage
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
              
              return AuthActions.loginSuccess({
                user: response.user,
                accessToken: response.access_token,
                refreshToken: response.refresh_token
              });
            }),
            catchError(error => 
              of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
            )
          );
        }
        
        // Production API call
        return this.http.post<ApiResponse<LoginResponse>>(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGIN}`, action.credentials).pipe(
          map(apiResponse => apiResponse.data),
          map(response => {
            // Store tokens in localStorage
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
            
            return AuthActions.loginSuccess({
              user: response.user,
              accessToken: response.access_token,
              refreshToken: response.refresh_token
            });
          }),
          catchError(error => 
            of(AuthActions.loginFailure({ error: error.message || 'Login failed' }))
          )
        );
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ user }) => {
        // Navigate based on user role
        this.navigateBasedOnRole(user.role);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Navigate to login
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            return AuthActions.setAuthenticated({ user });
          } catch (error) {
            console.error('Error parsing stored user:', error);
            return AuthActions.logout();
          }
        }
        
        return AuthActions.logout();
      })
    )
  );

  private navigateBasedOnRole(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'vendedor':
        this.router.navigate(['/vendedor/dashboard']);
        break;
      case 'comprador':
        this.router.navigate(['/comprador/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
