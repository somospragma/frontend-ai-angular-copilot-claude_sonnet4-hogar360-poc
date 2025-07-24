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
  styleUrls: ['./login.component.scss'],
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
