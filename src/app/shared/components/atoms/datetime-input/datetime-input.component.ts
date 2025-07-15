import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DateTimeInputType = 'date' | 'time' | 'datetime-local';

@Component({
  selector: 'app-datetime-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <label *ngIf="label" [for]="inputId" class="block text-sm font-medium text-secondary-700 mb-2">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <div class="relative">
        <input
          [id]="inputId"
          [type]="type"
          [disabled]="disabled"
          [required]="required"
          class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          [class.border-red-300]="hasError"
          [class.focus:border-red-500]="hasError"
          [class.focus:ring-red-500]="hasError"
          [class.bg-gray-50]="disabled"
          [class.text-gray-400]="disabled"
          [class.cursor-not-allowed]="disabled"
          [value]="value"
          [min]="min"
          [max]="max"
          [step]="step"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          [attr.aria-label]="ariaLabel"
          [attr.aria-describedby]="errorMessage ? errorId : null"
          [attr.aria-invalid]="hasError"
        />
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
      useExisting: forwardRef(() => DateTimeInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeInputComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() label?: string;
  @Input() type: DateTimeInputType = 'datetime-local';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() min?: string;
  @Input() max?: string;
  @Input() step?: string;
  @Input() errorMessage?: string;
  @Input() helperText?: string;
  @Input() ariaLabel?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() blur = new EventEmitter<FocusEvent>();

  value: string = '';
  inputId = `datetime-input-${Math.random().toString(36).substring(2, 11)}`;
  errorId = `${this.inputId}-error`;

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  // ControlValueAccessor implementation
  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (value: string) => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(event: FocusEvent): void {
    this.onTouchedCallback();
    this.blur.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focus.emit(event);
  }
}
