import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/components/atoms/logo/logo.component';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';
import { InputComponent } from '../../../shared/components/atoms/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LogoComponent,
    ButtonComponent,
    InputComponent
  ],
  template: `
    <div class="login-page">
      <div class="login-container">
        <!-- Left Side - Branding -->
        <div class="brand-section">
          <div class="brand-content">
            <app-logo size="xl" variant="default"></app-logo>
            <h1 class="brand-title">Encuentra tu hogar perfecto</h1>
            <p class="brand-subtitle">
              Conectamos personas con espacios que transforman vidas. 
              Descubre miles de propiedades verificadas en toda Colombia.
            </p>
            
            <div class="features-list">
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Propiedades verificadas</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Búsqueda inteligente</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-section">
          <div class="form-container">
            <div class="form-header">
              <h2 class="form-title">Bienvenido de vuelta</h2>
              <p class="form-subtitle">Ingresa tus credenciales para continuar</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <!-- Email Field -->
              <div class="form-group">
                <label for="correo" class="form-label">Email</label>
                <app-input
                  id="correo"
                  type="email"
                  placeholder="tu@email.com"
                  formControlName="correo"
                ></app-input>
                @if (loginForm.get('correo')?.invalid && loginForm.get('correo')?.touched) {
                  <span class="error-message">
                    @if (loginForm.get('correo')?.errors?.['required']) {
                      El email es requerido
                    } @else if (loginForm.get('correo')?.errors?.['email']) {
                      Ingresa un email válido
                    }
                  </span>
                }
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label for="clave" class="form-label">Contraseña</label>
                <app-input
                  id="clave"
                  type="password"
                  placeholder="••••••••"
                  formControlName="clave"
                ></app-input>
                @if (loginForm.get('clave')?.invalid && loginForm.get('clave')?.touched) {
                  <span class="error-message">
                    La contraseña es requerida
                  </span>
                }
              </div>

              <!-- Forgot Password -->
              <div class="form-options">
                <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
              </div>

              <!-- Submit Button -->
              <app-button
                type="submit"
                variant="primary"
                size="lg"
                [disabled]="loginForm.invalid || isLoading()"
                class="submit-button"
              >
                {{ isLoading() ? 'Iniciando sesión...' : 'Iniciar sesión' }}
              </app-button>

              <!-- Error Message -->
              @if (errorMessage()) {
                <div class="error-alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M15 9l-6 6"/>
                    <path d="M9 9l6 6"/>
                  </svg>
                  {{ errorMessage() }}
                </div>
              }
            </form>

            <!-- Footer -->
            <div class="form-footer">
              <p class="footer-text">
                ¿No tienes una cuenta? 
                <a href="#" class="footer-link">Regístrate aquí</a>
              </p>
            </div>

            <!-- Demo Credentials -->
            <div class="demo-section">
              <details class="demo-toggle">
                <summary class="demo-summary">🔑 Credenciales de prueba</summary>
                <div class="demo-content">
                  <div class="demo-item">
                    <strong>Admin:</strong> admin&#64;hogar360.com / admin123
                  </div>
                  <div class="demo-item">
                    <strong>Vendedor:</strong> vendedor&#64;hogar360.com / vendedor123
                  </div>
                  <div class="demo-item">
                    <strong>Comprador:</strong> comprador&#64;hogar360.com / comprador123
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      @apply min-h-screen bg-neutral-50 flex items-center justify-center p-4;
    }

    .login-container {
      @apply w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center;
    }

    /* Left Side - Branding */
    .brand-section {
      @apply hidden lg:flex lg:justify-center;
    }

    .brand-content {
      @apply max-w-md space-y-6;
    }

    .brand-title {
      @apply text-3xl font-semibold text-neutral-900 mt-6;
    }

    .brand-subtitle {
      @apply text-neutral-600 leading-relaxed;
    }

    .features-list {
      @apply space-y-3;
    }

    .feature-item {
      @apply flex items-center gap-3 text-neutral-700;
    }

    .feature-item svg {
      @apply text-primary-500;
    }

    /* Right Side - Form */
    .form-section {
      @apply flex justify-center;
    }

    .form-container {
      @apply w-full max-w-md bg-white rounded-xl shadow-sm border border-neutral-200 p-8;
    }

    .form-header {
      @apply text-center mb-8;
    }

    .form-title {
      @apply text-2xl font-semibold text-neutral-900 mb-2;
    }

    .form-subtitle {
      @apply text-neutral-600;
    }

    .login-form {
      @apply space-y-6;
    }

    .form-group {
      @apply space-y-2;
    }

    .form-label {
      @apply block text-sm font-medium text-neutral-700;
    }

    .error-message {
      @apply text-sm text-danger-500;
    }

    .form-options {
      @apply text-right;
    }

    .forgot-link {
      @apply text-sm text-primary-500 hover:text-primary-600 transition-colors;
    }

    .submit-button {
      @apply w-full;
    }

    .error-alert {
      @apply flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm;
    }

    .form-footer {
      @apply text-center mt-6 pt-6 border-t border-neutral-200;
    }

    .footer-text {
      @apply text-sm text-neutral-600;
    }

    .footer-link {
      @apply text-primary-500 hover:text-primary-600 transition-colors font-medium;
    }

    /* Demo Section */
    .demo-section {
      @apply mt-6 pt-6 border-t border-neutral-200;
    }

    .demo-toggle {
      @apply bg-neutral-50 rounded-lg p-3;
    }

    .demo-summary {
      @apply text-sm font-medium text-neutral-600 cursor-pointer hover:text-primary-600 transition-colors;
    }

    .demo-content {
      @apply mt-3 space-y-2;
    }

    .demo-item {
      @apply text-xs text-neutral-600 bg-white rounded px-2 py-1;
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .login-container {
        @apply grid-cols-1;
      }

      .form-container {
        @apply max-w-sm;
      }
    }

    @media (max-width: 640px) {
      .login-page {
        @apply p-2;
      }

      .form-container {
        @apply p-6;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { correo, clave } = this.loginForm.value;
    
    this.authService.login({ correo, clave }).subscribe({
      next: () => {
        // El servicio de auth maneja la navegación automáticamente
        console.log('Login exitoso');
      },
      error: (error) => {
        this.errorMessage.set('Email o contraseña incorrectos');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
