import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <nav class="flex justify-center mt-6">
        <div class="flex space-x-1">
          @for (page of getPaginationArray(); track page) {
            <button
              (click)="goToPage(page)"
              [disabled]="page === -1"
              [class]="getPageButtonClass(page)"
            >
              @if (page === -1) {
                ...
              } @else {
                {{ page }}
              }
            </button>
          }
          @if (currentPage < totalPages) {
            <button
              (click)="goToPage(currentPage + 1)"
              class="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          }
        </div>
      </nav>
    }
  `
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() maxVisiblePages: number = 5;
  
  @Output() pageChange = new EventEmitter<number>();

  getPaginationArray(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = Math.floor(this.maxVisiblePages / 2);
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push(-1, total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  }

  getPageButtonClass(page: number): string {
    const baseClasses = 'px-4 py-2 rounded-lg';
    
    if (page === -1) {
      return `${baseClasses} bg-white text-gray-400 cursor-default`;
    }
    
    if (page === this.currentPage) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    
    return `${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage && page !== -1) {
      this.pageChange.emit(page);
    }
  }
}
