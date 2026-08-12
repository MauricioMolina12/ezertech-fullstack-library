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
import { LoanStatusBadgeComponent } from '../../../../shared/components/status-badges/loan-status-badge.component';
import { LoanStatus } from '../../../../shared/enums/loan-status.enum';
import { Book } from '../../../../shared/models/book.model';
import { BadgeComponent } from '../../../../shared/ui/badge/badge.component';
import { formatDate } from '../../../../shared/utils/date.util';
import { AuthStore } from '../../../auth/auth.store';
import { BookService } from '../../../books/services/book.service';
import { LoanResponse } from '../../../loans/models/loan.models';
import { LoansStore } from '../../../loans/loans.store';

@Component({
  selector: 'app-my-loans',
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
    LoanStatusBadgeComponent,
    BadgeComponent,
  ],
  templateUrl: './my-loans.component.html',
  styleUrl: './my-loans.component.scss',
})
export class MyLoansComponent implements OnInit {
  protected readonly store = inject(LoansStore);
  protected readonly LoanStatus = LoanStatus;
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
      this.store.loadLoans(user.id);
    }
  }

  bookTitle(loan: LoanResponse): string {
    return this.bookMap()[loan.bookId]?.title ?? `Libro #${loan.bookId}`;
  }

  isOverdue(loan: LoanResponse): boolean {
    return this.store.isOverdue(loan);
  }

  confirmReturn(loan: LoanResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Devolver libro',
        message: `¿Confirmas la devolución de "${this.bookTitle(loan)}"? La fecha de devolución quedará registrada como hoy.`,
        confirmLabel: 'Confirmar devolución',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        return;
      }

      this.store.returnLoan(loan).subscribe({
        next: () => {
          this.snackBar.open('Libro devuelto correctamente', 'Cerrar', { duration: 3000 });
          this.reload();
        },
        error: (error: ApiError) => {
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 });
        },
      });
    });
  }

  formatDate(dateIso: string | null): string {
    return formatDate(dateIso);
  }

  private loadBooksMap(): void {
    this.subscriptions.push(
      this.bookService.getBooks().subscribe({
        next: (books) =>
          this.bookMap.set(Object.fromEntries(books.map((book) => [book.id, book]))),
        error: (error) =>
          console.warn('[MyLoans] No se pudo cargar los títulos de los libros:', error),
      })
    );
  }
}
