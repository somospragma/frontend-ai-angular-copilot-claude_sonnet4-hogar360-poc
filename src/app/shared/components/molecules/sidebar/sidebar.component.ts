import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../atoms/logo/logo.component';
import { NavItemComponent, NavigationItem } from '../../atoms/nav-item/nav-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LogoComponent, NavItemComponent],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container" (click)="onLogoClick()">
          <app-logo size="md" variant="default"></app-logo>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of navigationItems">
            <app-nav-item 
              [item]="item"
              (itemClick)="onItemClick($event)">
            </app-nav-item>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      @apply w-64 flex flex-col fixed h-full z-10;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      color: #374151;
    }

    .sidebar-header {
      @apply p-6;
      border-bottom: 1px solid #e5e7eb;
    }

    .logo-container {
      @apply cursor-pointer transition-transform hover:scale-105;
    }

    .sidebar-nav {
      @apply flex-1 p-4;
    }

    .nav-list {
      @apply space-y-2;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .sidebar {
        @apply transform -translate-x-full;
      }
    }
  `]
})
export class SidebarComponent {
  @Input({ required: true }) navigationItems: NavigationItem[] = [];
  @Output() logoClick = new EventEmitter<void>();
  @Output() itemClick = new EventEmitter<NavigationItem>();

  onLogoClick(): void {
    this.logoClick.emit();
  }

  onItemClick(item: NavigationItem): void {
    this.itemClick.emit(item);
  }
}
