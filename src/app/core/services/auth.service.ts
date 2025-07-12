import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { MockAuthService } from './mock-auth.service';

// Development mode flag - cambiar a false para usar API real
const DEVELOPMENT_MODE = true;

import { 
  User, 
  LoginRequest, 
  LoginResponse, 
  UserRole, 
  ApiResponse 
} from '../interfaces';
import { 
  API_CONFIG, 
  API_ENDPOINTS, 
  STORAGE_KEYS, 
  ROUTES, 
  MESSAGES 
} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly mockAuthService = inject(MockAuthService);

  // Signals for reactive state management
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _isLoading = signal<boolean>(false);

  // Public computed signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly userRole = computed(() => this._currentUser()?.role || null);
  readonly isAdmin = computed(() => this.userRole() === UserRole.ADMIN);
  readonly isVendedor = computed(() => this.userRole() === UserRole.VENDEDOR);
  readonly isComprador = computed(() => this.userRole() === UserRole.COMPRADOR);

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this._isLoading.set(true);
    
    // Use mock service in development mode
    if (DEVELOPMENT_MODE) {
      return this.mockAuthService.login(credentials)
        .pipe(
          tap(loginResponse => {
            this.setAuthData(loginResponse);
            this.navigateAfterLogin(loginResponse.user.role);
          }),
          catchError(this.handleError.bind(this)),
          tap(() => this._isLoading.set(false))
        );
    }
    
    // Production API call
    return this.http.post<ApiResponse<LoginResponse>>(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGIN}`, credentials)
      .pipe(
        map(response => response.data),
        tap(loginResponse => {
          this.setAuthData(loginResponse);
          this.navigateAfterLogin(loginResponse.user.role);
        }),
        catchError(this.handleError.bind(this)),
        tap(() => this._isLoading.set(false))
      );
  }

  /**
   * Logout user and clear authentication data
   */
  logout(): void {
    this._isLoading.set(true);
    
    // Call logout endpoint if token exists
    const token = this.getStoredToken();
    if (token) {
      this.http.post(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGOUT}`, {})
        .subscribe({
          complete: () => this.clearAuthData()
        });
    } else {
      this.clearAuthData();
    }
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getStoredRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<ApiResponse<LoginResponse>>(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.REFRESH}`, {
      refresh_token: refreshToken
    }).pipe(
      map(response => response.data),
      tap(loginResponse => {
        this.setAuthData(loginResponse);
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER_PROFILE}`)
      .pipe(
        map(response => response.data),
        tap(user => this._currentUser.set(user)),
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Set authentication data in localStorage and signals
   */
  private setAuthData(loginResponse: LoginResponse): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, loginResponse.access_token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refresh_token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginResponse.user));
    
    this._currentUser.set(loginResponse.user);
    this._isAuthenticated.set(true);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._isLoading.set(false);
    
    this.router.navigate([ROUTES.LOGIN]);
  }

  /**
   * Navigate to appropriate dashboard after login
   */
  private navigateAfterLogin(role: UserRole): void {
    switch (role) {
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
        this.router.navigate([ROUTES.DASHBOARD]);
    }
  }

  /**
   * Get stored access token
   */
  getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get stored refresh token
   */
  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get stored user data
   */
  private getStoredUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string = MESSAGES.ERROR.GENERIC;
    
    if (error.status === 401) {
      errorMessage = MESSAGES.ERROR.UNAUTHORIZED;
      this.clearAuthData();
    } else if (error.status === 403) {
      errorMessage = MESSAGES.ERROR.FORBIDDEN;
    } else if (error.status === 0) {
      errorMessage = MESSAGES.ERROR.NETWORK;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
