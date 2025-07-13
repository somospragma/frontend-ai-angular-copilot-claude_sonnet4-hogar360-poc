import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url' | 'date' | 'textarea';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <div class="input-container">
        <input
          *ngIf="type !== 'textarea'"
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [class]="getInputClasses()"
          [value]="value"
          [attr.maxlength]="maxlength"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="errorMessage ? errorId : null"
          [attr.aria-invalid]="hasError"
        />

        <textarea
          *ngIf="type === 'textarea'"
          [id]="inputId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [required]="required"
          [class]="getInputClasses()"
          [value]="value"
          [rows]="rows"
          [attr.maxlength]="maxlength"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="errorMessage ? errorId : null"
          [attr.aria-invalid]="hasError"
        ></textarea>
        
        <div *ngIf="icon" class="input-icon">
          <ng-content select="[slot=icon]"></ng-content>
        </div>
      </div>
      
      <div *ngIf="errorMessage" [id]="errorId" class="input-error" role="alert">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="helperText && !errorMessage" class="input-helper">
        {{ helperText }}
      </div>

      <div *ngIf="maxlength && showCharacterCount" class="character-count">
        {{ value.length || 0 }}/{{ maxlength }}
      </div>
    </div>
  `,
  styles: [`
    /* Sobrescribir COMPLETAMENTE los estilos base de Tailwind */
    :host input,
    :host textarea {
      appearance: none !important;
      background-image: none !important;
      font-family: inherit !important;
      font-size: 1rem !important;
      line-height: 1.5rem !important;
      margin: 0 !important;
      box-shadow: none !important;
      --tw-shadow: none !important;
      --tw-ring-shadow: none !important;
    }

    .input-wrapper {
      @apply w-full;
    }
    
    .input-label {
      @apply block text-sm font-medium text-secondary-700 mb-1;
    }
    
    .input-container {
      @apply relative;
    }
    
    .input-base {
      display: block !important;
      width: 100% !important;
      padding: 0.5rem 0.75rem !important;
      border: 1px solid #d1d5db !important;
      border-radius: 0.5rem !important;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
      background-color: white !important;
      color: #374151 !important;
      transition: all 0.2s ease-in-out !important;
      font-size: 1rem !important;
      line-height: 1.5rem !important;
    }
    
    .input-base::placeholder {
      color: #9ca3af !important;
      opacity: 1 !important;
    }
    
    .input-default {
      border-color: #d1d5db !important;
    }

    .input-default:focus {
      outline: none !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    .input-error {
      border-color: #fca5a5 !important;
    }

    .input-error:focus {
      outline: none !important;
      border-color: #ef4444 !important;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .input-disabled {
      background-color: #f3f4f6 !important;
      color: #6b7280 !important;
      cursor: not-allowed !important;
    }
    
    .input-icon {
      @apply absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none;
    }
    
    .input-with-icon {
      padding-right: 2.5rem !important;
    }
    
    .input-error {
      @apply mt-1 text-sm text-red-600;
    }
    
    .input-helper {
      @apply mt-1 text-sm text-secondary-500;
    }

    .character-count {
      @apply mt-1 text-xs text-secondary-400 text-right;
    }

    textarea.input-base {
      resize: vertical !important;
      min-height: 80px !important;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: InputType = 'text';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;
  @Input() icon: boolean = false;
  @Input() ariaLabel?: string;
  @Input() maxlength?: number;
  @Input() rows: number = 3;
  @Input() showCharacterCount: boolean = false;
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  value: string = '';
  inputId: string = `input-${Math.random().toString(36).substring(2, 11)}`;
  errorId: string = `${this.inputId}-error`;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  getInputClasses(): string {
    const baseClasses = 'input-base';
    const stateClass = this.hasError ? 'input-error' : 'input-default';
    const disabledClass = this.disabled ? 'input-disabled' : '';
    const iconClass = this.icon ? 'input-with-icon' : '';
    
    return `${baseClasses} ${stateClass} ${disabledClass} ${iconClass}`.trim();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
    this.cdr.markForCheck(); // Force change detection
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
