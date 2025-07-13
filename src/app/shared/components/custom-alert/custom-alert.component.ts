import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 animate-slideIn">
          <!-- Header -->
          <div class="px-6 py-4" 
               [class]="getHeaderClass()">
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center"
                     [class]="getIconBackgroundClass()">
                  <i [class]="getIconClass()" class="text-sm"></i>
                </div>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ alertData.title }}</h3>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-6">
            <p class="text-gray-600 leading-relaxed">{{ alertData.message }}</p>
          </div>

          <!-- Actions -->
          <div class="px-6 py-4 bg-gray-50">
            @if (alertData.type === 'confirm') {
              <div class="flex space-x-3 justify-end">
                @if (alertData.showCancel) {
                  <button
                    (click)="onCancel()"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
                  >
                    {{ alertData.cancelText || 'Cancelar' }}
                  </button>
                }
                <button
                  (click)="onConfirm()"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
                >
                  {{ alertData.confirmText || 'Confirmar' }}
                </button>
              </div>
            } @else {
              <div class="flex justify-end">
                <button
                  (click)="onClose()"
                  class="px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
                  [class]="getButtonClass()"
                >
                  Entendido
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* Animaciones de entrada */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }

    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }

    /* Transiciones suaves */
    .transition-all {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Backdrop blur para navegadores que lo soporten */
    .backdrop-blur-sm {
      backdrop-filter: blur(4px);
    }

    /* Sombras personalizadas */
    .shadow-2xl {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    /* Estados hover suaves */
    button:hover {
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    /* Efecto hover para botones */
    .hover\\:scale-105:hover {
      transform: scale(1.05) translateY(-1px);
    }
  `]
})
export class CustomAlertComponent {
  @Input() alertData!: AlertData;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isVisible = signal(true);

  onConfirm(): void {
    this.confirmed.emit();
    this.isVisible.set(false);
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isVisible.set(false);
  }

  onClose(): void {
    this.closed.emit();
    this.isVisible.set(false);
  }

  getHeaderClass(): string {
    switch (this.alertData.type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
        return 'bg-blue-50';
      case 'confirm':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  }

  getIconClass(): string {
    switch (this.alertData.type) {
      case 'success':
        return 'fas fa-check text-green-600';
      case 'error':
        return 'fas fa-exclamation-triangle text-red-600';
      case 'warning':
        return 'fas fa-exclamation-circle text-yellow-600';
      case 'info':
        return 'fas fa-info-circle text-blue-600';
      case 'confirm':
        return 'fas fa-question-circle text-blue-600';
      default:
        return 'fas fa-info-circle text-gray-600';
    }
  }

  getIconBackgroundClass(): string {
    switch (this.alertData.type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'info':
        return 'bg-blue-100';
      case 'confirm':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  }

  getButtonClass(): string {
    switch (this.alertData.type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'confirm':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
    }
  }
}
