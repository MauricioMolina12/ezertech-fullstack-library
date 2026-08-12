import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { BookStatusBadgeComponent } from '../../../../shared/components/status-badges/book-status-badge.component';
import { Book } from '../../../../shared/models/book.model';
import { formatDate } from '../../../../shared/utils/date.util';

export interface BookDetailDialogData {
  book: Book;
}

/** Diálogo de detalle del libro (acción "Ver detalles"). */
@Component({
  selector: 'app-book-detail-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, BookStatusBadgeComponent],
  templateUrl: './book-detail-dialog.component.html',
  styleUrl: './book-detail-dialog.component.scss',
})
export class BookDetailDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<BookDetailDialogComponent>);
  protected readonly book = inject<BookDetailDialogData>(MAT_DIALOG_DATA).book;

  protected readonly coverFailed = signal(false);

  formatDate(dateIso: string): string {
    return formatDate(dateIso);
  }

  onCoverError(): void {
    this.coverFailed.set(true);
  }

  close(): void {
    this.dialogRef.close();
  }
}
