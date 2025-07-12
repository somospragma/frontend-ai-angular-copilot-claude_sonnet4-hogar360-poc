import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { API_ENDPOINTS } from '../constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for login and refresh endpoints
    const isAuthEndpoint = request.url.includes(API_ENDPOINTS.LOGIN) || 
                          request.url.includes(API_ENDPOINTS.REFRESH);
    
    if (isAuthEndpoint) {
      return next.handle(request);
    }

    // Add authorization header
    const token = this.authService.getStoredToken();
    if (token) {
      request = this.addAuthHeader(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          // Try to refresh token
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        // Retry original request with new token
        const newToken = this.authService.getStoredToken();
        if (newToken) {
          return next.handle(this.addAuthHeader(request, newToken));
        }
        return throwError(() => new Error('No token available'));
      }),
      catchError(error => {
        // Refresh failed, logout user
        this.authService.logout();
        return throwError(() => error);
      })
    );
  }
}