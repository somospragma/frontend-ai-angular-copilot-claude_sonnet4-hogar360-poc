import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-content">
      <div class="settings-header">
        <h2 class="settings-title">Configuración del Sistema</h2>
        <p class="settings-subtitle">Gestiona las configuraciones generales de la aplicación</p>
      </div>

      <div class="settings-sections">
        <div class="setting-card">
          <h3 class="setting-title">Configuración General</h3>
          <p class="setting-description">Configuraciones básicas del sistema</p>
          <div class="setting-actions">
            <button class="btn-primary">Configurar</button>
          </div>
        </div>

        <div class="setting-card">
          <h3 class="setting-title">Gestión de Usuarios</h3>
          <p class="setting-description">Configurar permisos y roles de usuario</p>
          <div class="setting-actions">
            <button class="btn-primary">Gestionar</button>
          </div>
        </div>

        <div class="setting-card">
          <h3 class="setting-title">Notificaciones</h3>
          <p class="setting-description">Configurar notificaciones del sistema</p>
          <div class="setting-actions">
            <button class="btn-primary">Configurar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-content {
      @apply max-w-4xl mx-auto;
    }

    .settings-header {
      @apply mb-8;
    }

    .settings-title {
      @apply text-2xl font-semibold text-neutral-900 mb-2;
    }

    .settings-subtitle {
      @apply text-neutral-600;
    }

    .settings-sections {
      @apply grid gap-6;
    }

    .setting-card {
      @apply bg-white rounded-xl border border-neutral-200 p-6;
    }

    .setting-title {
      @apply text-lg font-medium text-neutral-900 mb-2;
    }

    .setting-description {
      @apply text-neutral-600 mb-4;
    }

    .setting-actions {
      @apply flex gap-3;
    }

    .btn-primary {
      @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}
