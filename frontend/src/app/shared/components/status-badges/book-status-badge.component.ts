import { Component, computed, input } from '@angular/core';

import { BookStatus } from '../../enums/book-status.enum';
import { BadgeComponent, BadgeColor } from '../../ui/badge/badge.component';

const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  [BookStatus.AVAILABLE]: 'Disponible',
  [BookStatus.LOANED]: 'Prestado',
  [BookStatus.RESERVED]: 'Reservado',
};

const BOOK_STATUS_COLORS: Record<BookStatus, BadgeColor> = {
  [BookStatus.AVAILABLE]: 'success',
  [BookStatus.LOANED]: 'warning',
  [BookStatus.RESERVED]: 'info',
};

@Component({
  selector: 'app-book-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './book-status-badge.component.html',
  styleUrl: './book-status-badge.component.scss',
})
export class BookStatusBadgeComponent {
  readonly status = input.required<BookStatus>();

  protected readonly label = computed(() => BOOK_STATUS_LABELS[this.status()]);
  protected readonly color = computed(() => BOOK_STATUS_COLORS[this.status()]);
}
