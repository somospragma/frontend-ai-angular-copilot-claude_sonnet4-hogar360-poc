import { createAction, props } from '@ngrx/store';
import { User, LoginRequest } from '../../core/interfaces';

// Auth Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const clearError = createAction('[Auth] Clear Error');

export const initializeAuth = createAction('[Auth] Initialize');

export const setAuthenticated = createAction(
  '[Auth] Set Authenticated',
  props<{ user: User }>()
);
