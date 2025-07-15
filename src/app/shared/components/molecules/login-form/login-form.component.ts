import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthFacade } from '../../../../core/facades/auth.facade';
import { LoginRequest } from '../../../../core/interfaces';
import { PATTERNS, VALIDATION_RULES, MESSAGES } from '../../../../core/constants';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent
  ],
  template: `
    <div class="login-form-container">
      <div class="login-header">
        <h1 class="login-title">Iniciar Sesión</h1>
        <p class="login-subtitle">Ingresa a tu cuenta de Hogar360</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <app-input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            formControlName="correo"
            [required]="true"
            [errorMessage]="getFieldError('correo')"
            ariaLabel="Ingresa tu correo electrónico"
          />
        </div>

        <div class="form-group">
          <app-input
            label="Contraseña"
            type="password"
            placeholder="Tu contraseña"
            formControlName="clave"
            [required]="true"
            [errorMessage]="getFieldError('clave')"
            ariaLabel="Ingresa tu contraseña"
          />
        </div>

        <div *ngIf="errorMessage()" class="error-message" role="alert">
          {{ errorMessage() }}
        </div>

        <div class="form-actions">
          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="(authFacade.isLoading$ | async) || false"
            [disabled]="loginForm.invalid || (authFacade.isLoading$ | async) || false"
          >
            <span *ngIf="!(authFacade.isLoading$ | async)">Iniciar Sesión</span>
            <span *ngIf="(authFacade.isLoading$ | async)">Iniciando sesión...</span>
          </app-button>
        </div>
      </form>

      <div class="login-footer">
        <p class="text-center text-sm text-secondary-600">
          ¿No tienes una cuenta? 
          <a href="/register" class="text-primary-600 hover:text-primary-500 font-medium">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-form-container {
      @apply w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg;
    }
    
    .login-header {
      @apply text-center mb-8;
    }
    
    .login-title {
      @apply text-3xl font-bold text-secondary-900 mb-2;
    }
    
    .login-subtitle {
      @apply text-secondary-600;
    }
    
    .login-form {
      @apply space-y-6;
    }
    
    .form-group {
      @apply space-y-1;
    }
    
    .error-message {
      @apply p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm;
    }
    
    .form-actions {
      @apply pt-2;
    }
    
    .login-footer {
      @apply mt-8 pt-6 border-t border-secondary-200;
    }
    
    /* Mobile First Responsive Design */
    @media (max-width: 640px) {
      .login-form-container {
        @apply p-4 mx-4 shadow-none bg-transparent;
      }
      
      .login-title {
        @apply text-2xl;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly authFacade = inject(AuthFacade);

  // Signals
  readonly errorMessage = signal<string>('');

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.createLoginForm();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      correo: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(PATTERNS.EMAIL)
      ]],
      clave: ['', [
        Validators.required,
        Validators.minLength(VALIDATION_RULES.PASSWORD_MIN_LENGTH)
      ]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage.set('');
      
      const credentials: LoginRequest = {
        correo: this.loginForm.get('correo')?.value,
        clave: this.loginForm.get('clave')?.value
      };

      // Use AuthFacade for login - it handles the flow through NgRx
      this.authFacade.login(credentials);
      
      // Subscribe to errors to show them
      this.authFacade.error$.subscribe(error => {
        if (error) {
          this.errorMessage.set(error);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field && field.invalid && (field.dirty || field.touched)) {
      const errors = field.errors;
      
      if (errors?.['required']) {
        return 'Este campo es requerido';
      }
      
      if (errors?.['email']) {
        return 'Ingresa un correo electrónico válido';
      }
      
      if (errors?.['pattern']) {
        return 'Formato de correo electrónico inválido';
      }
      
      if (errors?.['minlength']) {
        return `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`;
      }
    }
    
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
