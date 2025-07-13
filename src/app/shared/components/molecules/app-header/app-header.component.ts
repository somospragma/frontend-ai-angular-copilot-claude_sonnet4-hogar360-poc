import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent, UserInfo, DropdownAction } from '../../atoms/user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserDropdownComponent],
  template: `
    <header class="header">
      <div class="header-content">
        <h1 class="page-title">{{ pageTitle }}</h1>
        
        <app-user-dropdown
          [user]="user"
          [actions]="userActions"
          (actionClick)="onUserActionClick($event)">
        </app-user-dropdown>
      </div>
    </header>
  `,
  styles: [`
    .header {
      @apply bg-white border-b border-neutral-200 sticky top-0 z-20;
    }

    .header-content {
      @apply px-6 py-4 flex justify-between items-center;
    }

    .page-title {
      @apply text-2xl font-semibold text-neutral-900;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .header-content {
        @apply px-4;
      }
    }
  `]
})
export class AppHeaderComponent {
  @Input({ required: true }) pageTitle!: string;
  @Input({ required: true }) user!: UserInfo;
  @Input() userActions: DropdownAction[] = [];
  @Output() userActionClick = new EventEmitter<DropdownAction>();

  onUserActionClick(action: DropdownAction): void {
    this.userActionClick.emit(action);
  }
}
