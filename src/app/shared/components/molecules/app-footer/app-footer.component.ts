import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../atoms/logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <app-logo size="sm" variant="default"></app-logo>
          <span class="footer-text">{{ copyrightText }}</span>
        </div>
        <div class="footer-right">
          <span class="version">{{ version }}</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      @apply bg-white border-t border-neutral-200 mt-auto;
    }

    .footer-content {
      @apply px-6 py-4 flex justify-between items-center;
    }

    .footer-left {
      @apply flex items-center gap-4;
    }

    .footer-text {
      @apply text-sm text-neutral-600;
    }

    .version {
      @apply text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .footer-content {
        @apply px-4 flex-col gap-2;
      }
    }
  `]
})
export class AppFooterComponent {
  @Input() copyrightText: string = '© 2025 Hogar360. Todos los derechos reservados.';
  @Input() version: string = 'v1.0.0';
}
