import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { ApiError } from '../../../../core/services/http.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReservationStatusBadgeComponent } from '../../../../shared/components/status-badges/reservation-status-badge.component';
import { ReservationStatus } from '../../../../shared/enums/reservation-status.enum';
import { Book } from '../../../../shared/models/book.model';
import { formatDate } from '../../../../shared/utils/date.util';
import { AuthStore } from '../../../auth/auth.store';
import { BookService } from '../../../books/services/book.service';
import { ReservationResponse } from '../../../reservations/models/reservation.models';
import { ReservationsStore } from '../../../reservations/reservations.store';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    ReservationStatusBadgeComponent,
  ],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss',
})
export class MyReservationsComponent implements OnInit {
  protected readonly store = inject(ReservationsStore);
  protected readonly ReservationStatus = ReservationStatus;
  private readonly authStore = inject(AuthStore);
  private readonly bookService = inject(BookService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly bookMap = signal<Record<number, Book>>({});
  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.reload();
    this.loadBooksMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  protected reload(): void {
    const user = this.authStore.user();
    if (user) {
      this.store.loadReservations(user.id);
    }
  }

  bookTitle(reservation: ReservationResponse): string {
    return this.bookMap()[reservation.bookId]?.title ?? `Libro #${reservation.bookId}`;
  }

  confirmCancel(reservation: ReservationResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Cancelar reserva',
        message: `¿Deseas cancelar la reserva de "${this.bookTitle(reservation)}"?`,
        confirmLabel: 'Cancelar reserva',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        return;
      }

      this.store.cancelReservation(reservation.id).subscribe({
        next: () => {
          this.snackBar.open('Reserva cancelada correctamente', 'Cerrar', { duration: 3000 });
          this.reload();
        },
        error: (error: ApiError) => {
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 });
        },
      });
    });
  }

  formatDate(dateIso: string): string {
    return formatDate(dateIso);
  }

  private loadBooksMap(): void {
    this.subscriptions.push(
      this.bookService.getBooks().subscribe({
        next: (books) =>
          this.bookMap.set(Object.fromEntries(books.map((book) => [book.id, book]))),
        error: (error) =>
          console.warn('[MyReservations] No se pudo cargar los títulos de los libros:', error),
      })
    );
  }
}
