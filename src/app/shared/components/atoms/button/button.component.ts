import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="handleClick($event)"
      [attr.aria-label]="ariaLabel"
    >
      <span *ngIf="loading" class="loading-spinner" aria-hidden="true"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      @apply inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    
    .btn-sm { @apply px-3 py-1.5 text-sm; }
    .btn-md { @apply px-4 py-2 text-base; }
    .btn-lg { @apply px-6 py-3 text-lg; }
    
    .btn-primary { @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500; }
    .btn-secondary { @apply bg-secondary-100 text-secondary-700 hover:bg-secondary-200 focus:ring-secondary-500; }
    .btn-danger { @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500; }
    .btn-ghost { @apply bg-transparent text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500; }
    .btn-outline { @apply bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() ariaLabel?: string;
  
  @Output() clicked = new EventEmitter<Event>();

  getButtonClasses(): string {
    const baseClasses = 'btn';
    const variantClass = `btn-${this.variant}`;
    const sizeClass = `btn-${this.size}`;
    const widthClass = this.fullWidth ? 'w-full' : '';
    
    return `${baseClasses} ${variantClass} ${sizeClass} ${widthClass}`.trim();
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
