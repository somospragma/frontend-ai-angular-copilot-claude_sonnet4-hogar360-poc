import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <label class="block">
        <span class="text-sm font-medium text-gray-700">{{ label }}</span>
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      
      @if (type === 'textarea') {
        <div class="mt-2">
          <textarea
            [value]="value"
            (input)="onInput($event)"
            [placeholder]="placeholder"
            [attr.maxlength]="maxLength"
            [rows]="rows || 5"
            [class]="getInputClasses()"
            [disabled]="disabled"
          ></textarea>
          @if (showCounter && maxLength) {
            <div class="flex justify-end mt-1">
              <span class="text-sm text-gray-500">
                {{ value.length }}/{{ maxLength }}
              </span>
            </div>
          }
        </div>
      } @else {
        <div class="mt-2">
          <input
            [type]="type"
            [value]="value"
            (input)="onInput($event)"
            [placeholder]="placeholder"
            [attr.maxlength]="maxLength"
            [class]="getInputClasses()"
            [disabled]="disabled"
          />
        </div>
        @if (loading) {
          <div class="flex items-center mt-2">
            <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span class="text-sm text-blue-600">Buscando coincidencias...</span>
          </div>
        }
      }
      
      @if (errors.length > 0) {
        <div class="mt-2">
          @for (error of errors; track error) {
            <p class="text-sm text-red-600">{{ error }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    /* Sobrescribir TODOS los estilos base de Tailwind específicamente para este componente */
    :host input,
    :host textarea {
      appearance: none !important;
      background-image: none !important;
      font-family: inherit !important;
      font-size: 1rem !important;
      line-height: 1.5 !important;
      margin: 0 !important;
      box-shadow: none !important;
      --tw-shadow: none !important;
    }

    /* Aplicar nuestros estilos específicos */
    :host input.block,
    :host textarea.block {
      display: block !important;
      width: 100% !important;
      padding: 0.75rem !important;
      border: 1px solid #d1d5db !important;
      border-radius: 0.5rem !important;
      background-color: white !important;
      color: #374151 !important;
      transition: all 0.2s ease-in-out !important;
    }

    /* Estados focus */
    :host input.block:focus,
    :host textarea.block:focus {
      outline: none !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }

    /* Estados error */
    :host input.border-red-300,
    :host textarea.border-red-300 {
      border-color: #fca5a5 !important;
    }

    :host input.border-red-300:focus,
    :host textarea.border-red-300:focus {
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    /* Estados disabled */
    :host input.bg-gray-100,
    :host textarea.bg-gray-100 {
      background-color: #f3f4f6 !important;
      color: #6b7280 !important;
      cursor: not-allowed !important;
    }

    /* Placeholders */
    :host input::placeholder,
    :host textarea::placeholder {
      color: #9ca3af !important;
      opacity: 1 !important;
    }

    /* Animación para el spinner */
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'textarea' = 'text';
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() maxLength?: number;
  @Input() rows?: number;
  @Input() showCounter: boolean = false;
  @Input() errors: string[] = [];
  @Input() loading: boolean = false;
  
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.valueChange.emit(target.value);
  }

  getInputClasses(): string {
    // Estilos más específicos que sobrescriban los base de Tailwind
    const baseClasses = 'block w-full rounded-lg transition-colors';
    const sizingClasses = 'px-3 py-3';
    const borderClasses = 'border border-solid';
    const backgroundClasses = 'bg-white';
    const errorClasses = this.errors.length > 0 ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500';
    const disabledClasses = this.disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : '';
    const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20';
    const fontClasses = 'text-base font-normal';
    
    return `${baseClasses} ${sizingClasses} ${borderClasses} ${backgroundClasses} ${errorClasses} ${disabledClasses} ${focusClasses} ${fontClasses}`;
  }
}
