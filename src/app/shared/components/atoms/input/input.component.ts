import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url' | 'textarea';

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
      @apply block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200;
    }
    
    .input-default {
      @apply border-secondary-300 focus:border-primary-500 focus:ring-primary-500;
    }
    
    .input-error {
      @apply border-red-300 focus:border-red-500 focus:ring-red-500;
    }
    
    .input-disabled {
      @apply bg-secondary-50 text-secondary-500 cursor-not-allowed;
    }
    
    .input-icon {
      @apply absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none;
    }
    
    .input-with-icon {
      @apply pr-10;
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
      @apply resize-y min-h-[80px];
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
