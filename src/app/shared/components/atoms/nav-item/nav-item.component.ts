import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavigationItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a class="nav-item" 
       [class.active]="item.isActive"
       (click)="onItemClick($event)">
      <div class="nav-icon" [innerHTML]="item.icon"></div>
      <span class="nav-label">{{ item.label }}</span>
    </a>
  `,
  styles: [`
    .nav-item {
      @apply flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer;
    }

    .nav-item.active {
      @apply text-blue-600 font-medium;
      background: #eff6ff;
    }

    .nav-icon {
      @apply w-5 h-5 flex-shrink-0;
    }

    .nav-label {
      @apply font-medium;
    }
  `]
})
export class NavItemComponent {
  @Input({ required: true }) item!: NavigationItem;
  @Output() itemClick = new EventEmitter<NavigationItem>();

  onItemClick(event: Event): void {
    event.preventDefault();
    this.itemClick.emit(this.item);
  }
}
