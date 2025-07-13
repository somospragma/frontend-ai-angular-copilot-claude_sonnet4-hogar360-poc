import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserInfo {
  name: string;
  role: string;
  avatar?: string;
}

export interface DropdownAction {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-section">
      <div class="user-info">
        <div class="user-details">
          <span class="welcome-text">Bienvenido, {{ user.name }}</span>
          <span class="user-role">{{ user.role }}</span>
        </div>
        <img 
          [src]="user.avatar || '/assets/images/avatar.jpg'" 
          [alt]="user.name"
          class="user-avatar clickable"
          (click)="toggleDropdown($event)"
        />
      </div>
      
      <div class="user-dropdown" [class.open]="dropdownOpen()">
        <div class="dropdown-menu" *ngIf="dropdownOpen()">
          <a class="dropdown-item" 
             *ngFor="let action of actions"
             (click)="onActionClick(action, $event)">
            <div class="action-icon" [innerHTML]="action.icon"></div>
            {{ action.label }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-section {
      @apply flex items-center gap-4 relative;
    }

    .user-info {
      @apply flex items-center gap-3;
    }

    .user-avatar {
      @apply w-12 h-12 rounded-full object-cover border-2 border-primary-200;
    }

    .user-avatar.clickable {
      @apply cursor-pointer transition-transform hover:scale-105 hover:border-primary-400;
    }

    .user-details {
      @apply flex flex-col;
    }

    .welcome-text {
      @apply font-medium text-neutral-900;
    }

    .user-role {
      @apply text-sm text-neutral-600 capitalize;
    }

    .user-dropdown {
      @apply relative;
    }

    .dropdown-menu {
      @apply absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-30;
    }

    .dropdown-item {
      @apply flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer;
    }

    .action-icon {
      @apply w-4 h-4 flex-shrink-0;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .user-details {
        @apply hidden;
      }
    }
  `]
})
export class UserDropdownComponent {
  @Input({ required: true }) user!: UserInfo;
  @Input() actions: DropdownAction[] = [];
  @Output() actionClick = new EventEmitter<DropdownAction>();

  dropdownOpen = signal(false);

  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  onActionClick(action: DropdownAction, event: Event): void {
    event.preventDefault();
    this.dropdownOpen.set(false);
    this.actionClick.emit(action);
  }
}
