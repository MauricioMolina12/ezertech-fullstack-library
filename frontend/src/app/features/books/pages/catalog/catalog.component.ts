import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BookStatus } from '../../../../shared/enums/book-status.enum';
import { ReservationStatus } from '../../../../shared/enums/reservation-status.enum';
import { Book } from '../../../../shared/models/book.model';
import { SkeletonCardComponent } from '../../../../shared/ui/skeleton/skeleton-card.component';
import { ApiError } from '../../../../core/services/http.service';
import { PermissionsService } from '../../../../core/rbac/permissions.service';
import { AuthStore } from '../../../auth/auth.store';
import {
  LoanDialogComponent,
  LoanDialogData,
  LoanDialogResult,
} from '../../../loans/components/loan-dialog/loan-dialog.component';
import { LoansStore } from '../../../loans/loans.store';
import { ReservationsStore } from '../../../reservations/reservations.store';
import { BookCardComponent } from '../../../books/components/book-card/book-card.component';
import {
  BookDetailDialogComponent,
  BookDetailDialogData,
} from '../../../books/components/book-detail-dialog/book-detail-dialog.component';
import { BooksStore, BookStatusFilter } from '../../../books/books.store';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    ConfirmDialogComponent,
    SkeletonCardComponent,
    BookCardComponent,
    BookDetailDialogComponent,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  protected readonly store = inject(BooksStore);
  protected readonly reservationsStore = inject(ReservationsStore);
  protected readonly loansStore = inject(LoansStore);
  protected readonly permissions = inject(PermissionsService);
  private readonly authStore = inject(AuthStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly ALL = 'ALL';
  protected readonly bookStatuses: BookStatus[] = [
    BookStatus.AVAILABLE,
    BookStatus.LOANED,
    BookStatus.RESERVED,
  ];
  protected readonly statusLabels: Record<BookStatus, string> = {
    [BookStatus.AVAILABLE]: 'Disponible',
    [BookStatus.LOANED]: 'Prestado',
    [BookStatus.RESERVED]: 'Reservado',
  };

  protected readonly reservingBookId = signal<number | null>(null);
  protected readonly loaningBookId = signal<number | null>(null);

  ngOnInit(): void {
    // Siempre recarga al entrar: garantiza que un libro creado/editado/reservado
    // se refleje automáticamente aunque el store singleton ya tenga datos.
    this.store.loadBooks();
    this.loadMyReservations();
  }

  private loadMyReservations(): void {
    const user = this.authStore.user();
    if (user) {
      this.reservationsStore.loadReservations(user.id);
    }
  }

  /** ¿El usuario autenticado ya tiene una reserva activa para este libro? */
  hasActiveReservation(book: Book): boolean {
    return this.reservationsStore.hasActiveReservation(book.id);
  }

  /** ¿La reserva del usuario fue notificada (es el primero de la cola)? */
  isNotified(book: Book): boolean {
    return (
      this.reservationsStore.activeReservationFor(book.id)?.status === ReservationStatus.NOTIFIED
    );
  }

  onSearch(value: string): void {
    this.store.setSearch(value);
  }

  onStatusChange(status: string): void {
    this.store.setStatusFilter(status as BookStatusFilter);
  }

  statusLabel(status: BookStatus): string {
    return this.statusLabels[status];
  }

  goToNewBook(): void {
    this.router.navigate(['/catalog/new']);
  }

  goToEdit(book: Book): void {
    this.router.navigate(['/catalog', book.id, 'edit']);
  }

  viewDetails(book: Book): void {
    this.dialog.open(BookDetailDialogComponent, {
      width: '560px',
      data: { book } satisfies BookDetailDialogData,
    });
  }

  confirmDeleteBook(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Eliminar libro',
        message: `¿Seguro que deseas eliminar "${book.title}"? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        return;
      }

      this.store.deleteBook(book.id).subscribe({
        next: () =>
          this.snackBar.open(`Libro "${book.title}" eliminado`, 'Cerrar', { duration: 3000 }),
        error: (error: ApiError) =>
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 }),
      });
    });
  }

  reserve(book: Book): void {
    this.reservingBookId.set(book.id);
    this.reservationsStore.reserve(book.id).subscribe({
      next: () => {
        this.snackBar.open(`Te añadiste a la cola de "${book.title}"`, 'Cerrar', {
          duration: 3000,
        });
        this.store.loadBooks();
        this.loadMyReservations();
      },
      error: (error: ApiError) => {
        this.snackBar.open(error.message, 'Cerrar', { duration: 5000 });
        // Sincroniza el estado real del backend (p. ej. si el usuario ya tenía reserva).
        this.loadMyReservations();
      },
      complete: () => this.reservingBookId.set(null),
    });
  }

  loan(book: Book): void {
    const dialogRef = this.dialog.open(LoanDialogComponent, {
      width: '420px',
      data: { bookId: book.id, bookTitle: book.title } satisfies LoanDialogData,
    });

    dialogRef.afterClosed().subscribe((result: LoanDialogResult | undefined) => {
      if (!result) {
        return;
      }

      this.loaningBookId.set(book.id);
      this.loansStore.loan(result.bookId, result.dueDate).subscribe({
        next: () => {
          this.snackBar.open(`Préstamo solicitado para "${book.title}"`, 'Cerrar', {
            duration: 3000,
          });
          this.store.loadBooks();
        },
        error: (error: ApiError) => {
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 });
        },
        complete: () => this.loaningBookId.set(null),
      });
    });
  }
}
