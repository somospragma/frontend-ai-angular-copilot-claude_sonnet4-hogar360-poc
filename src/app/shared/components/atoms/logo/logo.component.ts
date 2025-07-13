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
      <!-- Logo Hogar360 estilo Figma -->
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
      @apply font-semibold leading-none;
      font-family: 'Poppins', sans-serif;
    }

    .tagline {
      @apply font-normal text-xs leading-tight opacity-80 ml-2;
      font-family: 'Poppins', sans-serif;
    }

    /* Tamaños siguiendo el diseño de Figma */
    .logo-sm .app-name {
      @apply text-base; /* 16px */
    }

    .logo-md .app-name {
      @apply text-xl; /* 20px */
    }

    .logo-lg .app-name {
      @apply text-2xl; /* 24px */
    }

    .logo-xl .app-name {
      @apply text-3xl; /* 30px */
    }

    /* Responsive */
    @media (max-width: 640px) {
      .logo-lg .app-name {
        @apply text-xl;
      }
      
      .logo-xl .app-name {
        @apply text-2xl;
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
        return '#4B5563'; // neutral-600
      default:
        return '#2563EB'; // blue-600 del diseño Figma
    }
  }

  getSubtextColor(): string {
    switch (this.variant) {
      case 'white':
        return '#e0f2fe';
      case 'minimal':
        return '#9CA3AF'; // neutral-400
      default:
        return '#6B7280'; // neutral-500
    }
  }
}
