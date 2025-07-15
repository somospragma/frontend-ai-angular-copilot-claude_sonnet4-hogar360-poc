import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      @apply min-h-screen bg-gray-50;
    }
  `]
})
export class AppComponent implements OnInit {
  private readonly authFacade = inject(AuthFacade);

  ngOnInit(): void {
    // Initialize auth state from localStorage
    this.authFacade.initializeAuth();
  }
  title = 'Hogar360';
}
