import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoVariant = 'default' | 'white' | 'minimal';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getLogoClasses()" [attr.aria-label]="'Logo de ' + appName">
      <!-- Logo Hogar360 estilo Figma - solo texto -->
      <span class="app-name" [style.color]="getTextColor()">{{ appName }}</span>
      <span *ngIf="showTagline && size !== 'sm'" class="tagline" [style.color]="getSubtextColor()">
        {{ tagline }}
      </span>
    </div>
  `,
  styles: [`
    .logo-container {
      @apply flex items-center;
    }

    .app-name {
      @apply font-sans font-medium leading-none;
    }

    .tagline {
      @apply font-sans text-xs leading-tight opacity-80 ml-2;
    }

    /* Tamaños */
    .logo-sm .app-name {
      @apply text-sm;
    }

    .logo-md .app-name {
      @apply text-lg;
    }

    .logo-lg .app-name {
      @apply text-xl;
    }

    .logo-xl .app-name {
      @apply text-2xl;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .logo-lg .app-name {
        @apply text-lg;
      }
      
      .logo-xl .app-name {
        @apply text-xl;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
  @Input() size: LogoSize = 'md';
  @Input() variant: LogoVariant = 'default';
  @Input() appName: string = 'Hogar360';
  @Input() tagline: string = 'Tu hogar ideal';
  @Input() showTagline: boolean = false;

  getLogoClasses(): string {
    return `logo-container logo-${this.size}`;
  }

  getTextColor(): string {
    switch (this.variant) {
      case 'white':
        return '#ffffff';
      case 'minimal':
        return '#5f6368'; // neutral-700
      default:
        return '#4285F4'; // primary-500 del diseño Figma
    }
  }

  getSubtextColor(): string {
    switch (this.variant) {
      case 'white':
        return '#e0f2fe';
      case 'minimal':
        return '#9aa0a6'; // neutral-500
      default:
        return '#80868b'; // neutral-600
    }
  }
}
