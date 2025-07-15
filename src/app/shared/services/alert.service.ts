import { Injectable, signal, ComponentRef, ViewContainerRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { CustomAlertComponent, AlertData } from '../components/custom-alert/custom-alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly environmentInjector = inject(EnvironmentInjector);
  private viewContainerRef?: ViewContainerRef;
  private readonly activeAlerts = signal<ComponentRef<CustomAlertComponent>[]>([]);

  setViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  /**
   * Mostrar alerta de éxito
   */
  success(title: string, message: string): Promise<void> {
    return this.showAlert({
      title,
      message,
      type: 'success'
    });
  }

  /**
   * Mostrar alerta de error
   */
  error(title: string, message: string): Promise<void> {
    return this.showAlert({
      title,
      message,
      type: 'error'
    });
  }

  /**
   * Mostrar alerta de advertencia
   */
  warning(title: string, message: string): Promise<void> {
    return this.showAlert({
      title,
      message,
      type: 'warning'
    });
  }

  /**
   * Mostrar alerta de información
   */
  info(title: string, message: string): Promise<void> {
    return this.showAlert({
      title,
      message,
      type: 'info'
    });
  }

  /**
   * Mostrar alerta de confirmación
   */
  confirm(
    title: string, 
    message: string, 
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.showConfirmAlert({
        title,
        message,
        type: 'confirm',
        confirmText,
        cancelText,
        showCancel: true
      }, resolve);
    });
  }

  /**
   * Mostrar alerta personalizada
   */
  private showAlert(alertData: AlertData): Promise<void> {
    return new Promise((resolve) => {
      if (!this.viewContainerRef) {
        console.error('ViewContainerRef not set. Call setViewContainerRef() first.');
        resolve();
        return;
      }

      const componentRef = createComponent(CustomAlertComponent, {
        environmentInjector: this.environmentInjector,
        hostElement: document.createElement('div')
      });

      componentRef.instance.alertData = alertData;

      // Suscribirse a eventos
      componentRef.instance.closed.subscribe(() => {
        this.removeAlert(componentRef);
        resolve();
      });

      // Agregar al DOM
      this.viewContainerRef.element.nativeElement.appendChild(componentRef.location.nativeElement);
      componentRef.changeDetectorRef.detectChanges();

      // Agregar a la lista de alertas activas
      const currentAlerts = this.activeAlerts();
      this.activeAlerts.set([...currentAlerts, componentRef]);
    });
  }

  /**
   * Mostrar alerta de confirmación
   */
  private showConfirmAlert(alertData: AlertData, resolve: (confirmed: boolean) => void): void {
    if (!this.viewContainerRef) {
      console.error('ViewContainerRef not set. Call setViewContainerRef() first.');
      resolve(false);
      return;
    }

    const componentRef = createComponent(CustomAlertComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: document.createElement('div')
    });

    componentRef.instance.alertData = alertData;

    // Suscribirse a eventos
    componentRef.instance.confirmed.subscribe(() => {
      this.removeAlert(componentRef);
      resolve(true);
    });

    componentRef.instance.cancelled.subscribe(() => {
      this.removeAlert(componentRef);
      resolve(false);
    });

    componentRef.instance.closed.subscribe(() => {
      this.removeAlert(componentRef);
      resolve(false);
    });

    // Agregar al DOM
    this.viewContainerRef.element.nativeElement.appendChild(componentRef.location.nativeElement);
    componentRef.changeDetectorRef.detectChanges();

    // Agregar a la lista de alertas activas
    const currentAlerts = this.activeAlerts();
    this.activeAlerts.set([...currentAlerts, componentRef]);
  }

  /**
   * Remover alerta del DOM
   */
  private removeAlert(componentRef: ComponentRef<CustomAlertComponent>): void {
    const currentAlerts = this.activeAlerts();
    const filteredAlerts = currentAlerts.filter(alert => alert !== componentRef);
    this.activeAlerts.set(filteredAlerts);

    // Remover del DOM inmediatamente
    if (componentRef.location.nativeElement.parentNode) {
      componentRef.location.nativeElement.parentNode.removeChild(componentRef.location.nativeElement);
    }
    
    componentRef.destroy();
  }

  /**
   * Cerrar todas las alertas
   */
  closeAll(): void {
    const currentAlerts = this.activeAlerts();
    currentAlerts.forEach(alert => alert.destroy());
    this.activeAlerts.set([]);
  }
}
