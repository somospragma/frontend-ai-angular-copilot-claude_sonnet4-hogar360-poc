import { Component, inject, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AuthFacade } from '../../../core/facades/auth.facade';
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
              <details class="demo-toggle" [attr.open]="true">
                <summary class="demo-summary">🔑 Credenciales de prueba</summary>
                <div class="demo-content">
                  <div class="demo-item">
                    <div class="demo-role">
                      <strong>Admin</strong>
                      <div class="demo-buttons">
                        <button 
                          type="button"
                          (click)="fillCredentials('admin@hogar360.com', 'admin123')"
                          class="demo-fill-btn">
                          Autorellenar
                        </button>
                        <button 
                          type="button"
                          (click)="copyCredentials('admin@hogar360.com', 'admin123')"
                          class="demo-copy-btn">
                          📋 Copiar
                        </button>
                      </div>
                    </div>
                    <div class="demo-credentials">
                      <span class="demo-email">admin&#64;hogar360.com</span>
                      <span class="demo-separator">•</span>
                      <span class="demo-password">admin123</span>
                    </div>
                  </div>
                  
                  <div class="demo-item">
                    <div class="demo-role">
                      <strong>Vendedor</strong>
                      <div class="demo-buttons">
                        <button 
                          type="button"
                          (click)="fillCredentials('vendedor@hogar360.com', 'vendedor123')"
                          class="demo-fill-btn">
                          Autorellenar
                        </button>
                        <button 
                          type="button"
                          (click)="copyCredentials('vendedor@hogar360.com', 'vendedor123')"
                          class="demo-copy-btn">
                          📋 Copiar
                        </button>
                      </div>
                    </div>
                    <div class="demo-credentials">
                      <span class="demo-email">vendedor&#64;hogar360.com</span>
                      <span class="demo-separator">•</span>
                      <span class="demo-password">vendedor123</span>
                    </div>
                  </div>
                  
                  <div class="demo-item">
                    <div class="demo-role">
                      <strong>Comprador</strong>
                      <div class="demo-buttons">
                        <button 
                          type="button"
                          (click)="fillCredentials('comprador@hogar360.com', 'comprador123')"
                          class="demo-fill-btn">
                          Autorellenar
                        </button>
                        <button 
                          type="button"
                          (click)="copyCredentials('comprador@hogar360.com', 'comprador123')"
                          class="demo-copy-btn">
                          📋 Copiar
                        </button>
                      </div>
                    </div>
                    <div class="demo-credentials">
                      <span class="demo-email">comprador&#64;hogar360.com</span>
                      <span class="demo-separator">•</span>
                      <span class="demo-password">comprador123</span>
                    </div>
                  </div>
                  
                  @if (copyMessage()) {
                    <div class="copy-message visible">
                      ✅ {{ copyMessage() }}
                    </div>
                  } @else {
                    <div class="copy-message hidden">
                      &nbsp;
                    </div>
                  }
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
      @apply bg-neutral-50 rounded-lg p-4;
    }

    .demo-summary {
      @apply text-sm font-medium text-neutral-600 cursor-pointer hover:text-primary-600 transition-colors mb-3;
    }

    .demo-content {
      @apply space-y-3 mt-3;
    }

    .demo-item {
      @apply bg-white rounded-lg p-3 border border-neutral-200;
    }

    .demo-role {
      @apply flex justify-between items-center mb-2;
    }

    .demo-buttons {
      @apply flex gap-2;
    }

    .demo-fill-btn {
      @apply px-3 py-1 bg-primary-500 text-white text-xs rounded-md hover:bg-primary-600 transition-colors;
    }

    .demo-copy-btn {
      @apply px-3 py-1 bg-neutral-500 text-white text-xs rounded-md hover:bg-neutral-600 transition-colors;
    }

    .demo-credentials {
      @apply text-sm text-neutral-600 font-mono;
    }

    .demo-email {
      @apply text-primary-600;
    }

    .demo-separator {
      @apply mx-2 text-neutral-400;
    }

    .demo-password {
      @apply text-secondary-600;
    }

    .copy-message {
      @apply text-xs p-2 rounded-md text-center min-h-[2rem] flex items-center justify-center;
    }

    .copy-message.visible {
      @apply text-success-600 bg-success-50;
    }

    .copy-message.hidden {
      @apply text-transparent bg-transparent;
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
export class LoginComponent implements OnInit, OnDestroy {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  copyMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authFacade.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading.set(loading));

    this.authFacade.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.errorMessage.set(error));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fillCredentials(email: string, password: string): void {
    this.loginForm.patchValue({
      correo: email,
      clave: password
    });
    this.copyMessage.set('Credenciales autorrellenadas ✓');
    setTimeout(() => this.copyMessage.set(null), 2000);
  }

  async copyCredentials(email: string, password: string): Promise<void> {
    try {
      const credentials = `Email: ${email}\nPassword: ${password}`;
      await navigator.clipboard.writeText(credentials);
      this.copyMessage.set('Credenciales copiadas al portapapeles ✓');
      setTimeout(() => this.copyMessage.set(null), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      this.copyMessage.set('Error al copiar credenciales');
      setTimeout(() => this.copyMessage.set(null), 2000);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authFacade.clearError();
    const { correo, clave } = this.loginForm.value;
    this.authFacade.login({ correo, clave });
  }
}
