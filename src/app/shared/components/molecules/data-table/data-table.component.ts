import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  icon: string;
  label: string;
  color: 'red' | 'blue' | 'green' | 'gray';
  action: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            @for (column of columns; track column.key) {
              <th [class]="getHeaderClass(column)">
                {{ column.label }}
              </th>
            }
            @if (actions.length > 0) {
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            }
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          @for (item of data; track item.id) {
            <tr class="hover:bg-gray-50">
              @for (column of columns; track column.key) {
                <td [class]="getCellClass(column)">
                  {{ getValue(item, column.key) }}
                </td>
              }
              @if (actions.length > 0) {
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    @for (action of actions; track action.action) {
                      <button
                        (click)="onAction(action.action, item)"
                        [class]="getActionClass(action)"
                        [title]="action.label"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          @if (action.icon === 'delete') {
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          }
                          @if (action.icon === 'edit') {
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          }
                          @if (action.icon === 'view') {
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                          }
                        </svg>
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="getColspan()" class="px-6 py-8 text-center text-gray-500">
                {{ emptyMessage }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() emptyMessage: string = 'No hay datos disponibles';
  
  @Output() actionClick = new EventEmitter<{action: string, item: any}>();

  getHeaderClass(column: TableColumn): string {
    const baseClass = 'px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider';
    const alignClass = `text-${column.align || 'left'}`;
    return `${baseClass} ${alignClass}`;
  }

  getCellClass(column: TableColumn): string {
    const baseClass = 'px-6 py-4 whitespace-nowrap text-sm';
    const alignClass = `text-${column.align || 'left'}`;
    return `${baseClass} ${alignClass}`;
  }

  getActionClass(action: TableAction): string {
    const baseClass = 'inline-flex items-center p-2 rounded-lg transition-colors';
    const colorClasses = {
      red: 'text-red-600 hover:text-red-800 hover:bg-red-50',
      blue: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
      green: 'text-green-600 hover:text-green-800 hover:bg-green-50',
      gray: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
    };
    return `${baseClass} ${colorClasses[action.color]}`;
  }

  getValue(item: any, key: string): any {
    const keys = key.split('.');
    let value = item;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || '';
  }

  getColspan(): number {
    return this.columns.length + (this.actions.length > 0 ? 1 : 0);
  }

  onAction(action: string, item: any) {
    this.actionClick.emit({ action, item });
  }
}
