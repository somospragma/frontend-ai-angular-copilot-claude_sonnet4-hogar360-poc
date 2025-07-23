import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="selectId" class="block text-sm font-medium text-secondary-700 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <div class="relative">
        <select
          [id]="selectId"
          [disabled]="disabled"
          [required]="required"
          class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none pr-10"
          [class.border-red-300]="hasError"
          [class.focus:border-red-500]="hasError"
          [class.focus:ring-red-500]="hasError"
          [class.bg-gray-50]="disabled"
          [class.text-gray-400]="disabled"
          [class.cursor-not-allowed]="disabled"
          [value]="value"
          (change)="onChange($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="errorMessage ? errorId : null"
          [attr.aria-invalid]="hasError"
        >
          <option value="" *ngIf="placeholder" [disabled]="required">{{ placeholder }}</option>
          <option 
            *ngFor="let option of options" 
            [value]="option.value"
            [disabled]="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- Dropdown arrow icon -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      
      <div *ngIf="errorMessage" [id]="errorId" class="text-red-500 text-sm mt-1">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="helperText && !errorMessage" class="text-secondary-600 text-sm mt-1">
        {{ helperText }}
      </div>
    </div>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() label?: string;
  @Input() placeholder: string = 'Seleccionar...';
  @Input() options: SelectOption[] = [];
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;
  @Input() ariaLabel?: string;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  value: any = '';
  selectId = `select-${Math.random().toString(36).substring(2, 11)}`;
  errorId = `${this.selectId}-error`;

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  // ControlValueAccessor implementation
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (value: any) => void = () => {};

  writeValue(value: any): void {
    this.value = value || '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
    this.selectionChange.emit(this.value);
  }

  onBlur(event: FocusEvent): void {
    this.onTouchedCallback();
    this.blur.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }

  getSelectClasses(): string {
    const baseClasses = 'w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none pr-10';
    const errorClasses = this.hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '';
    const disabledClasses = this.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '';
    
    const finalClasses = [baseClasses, errorClasses, disabledClasses].filter(Boolean).join(' ');
    return finalClasses;
  }
}
