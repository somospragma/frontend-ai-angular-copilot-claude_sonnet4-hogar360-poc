import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store/app.state';
import { User, LoginRequest } from '../interfaces';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly store = inject(Store<AppState>);

  // Selectors
  user$: Observable<User | null> = this.store.select(AuthSelectors.selectCurrentUser);
  isAuthenticated$: Observable<boolean> = this.store.select(AuthSelectors.selectIsAuthenticated);
  isLoading$: Observable<boolean> = this.store.select(AuthSelectors.selectAuthLoading);
  error$: Observable<string | null> = this.store.select(AuthSelectors.selectAuthError);
  userRole$: Observable<string | null> = this.store.select(AuthSelectors.selectUserRole);
  isAdmin$: Observable<boolean> = this.store.select(AuthSelectors.selectIsAdmin);
  isVendedor$: Observable<boolean> = this.store.select(AuthSelectors.selectIsVendedor);
  isComprador$: Observable<boolean> = this.store.select(AuthSelectors.selectIsComprador);

  // Actions
  login(credentials: LoginRequest): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  clearError(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  initializeAuth(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }

  // Helper methods for synchronous access (use sparingly)
  getCurrentUser(): User | null {
    let currentUser: User | null = null;
    this.user$.subscribe(user => currentUser = user).unsubscribe();
    return currentUser;
  }

  getIsAuthenticated(): boolean {
    let isAuth = false;
    this.isAuthenticated$.subscribe(auth => isAuth = auth).unsubscribe();
    return isAuth;
  }

  getUserRole(): string | null {
    let role: string | null = null;
    this.userRole$.subscribe(r => role = r).unsubscribe();
    return role;
  }
}
