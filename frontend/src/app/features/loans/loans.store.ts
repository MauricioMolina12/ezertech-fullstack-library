import { Injectable, computed, signal } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../core/services/http.service';
import { LoanStatus } from '../../shared/enums/loan-status.enum';
import { isBeforeToday } from '../../shared/utils/date.util';
import { AuthStore } from '../auth/auth.store';
import { LoanResponse } from './models/loan.models';
import { LoanService } from './services/loan.service';

/**
 * Store de préstamos basado en Signals.
 *
 * Estados: data (loans), loading, error. Además expone helpers para
 * detectar préstamos vencidos (`dueDate < hoy`).
 */
@Injectable({ providedIn: 'root' })
export class LoansStore {
  private readonly _loans = signal<LoanResponse[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _returningId = signal<number | null>(null);

  readonly loans = computed(() => this._loans());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly returningId = this._returningId.asReadonly();

  readonly overdueCount = computed(
    () => this._loans().filter((loan) => this.isOverdue(loan)).length
  );

  constructor(
    private readonly loanService: LoanService,
    private readonly authStore: AuthStore
  ) {}

  loadLoans(userId: number): void {
    this._loading.set(true);
    this._error.set(null);

    this.loanService.getLoansByUser(userId).subscribe({
      next: (loans) => {
        this._loans.set(loans);
        this._loading.set(false);
      },
      error: (error: ApiError) => {
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }

  /** Solicita un préstamo para el usuario autenticado (POST /api/loans). */
  loan(bookId: number, dueDate: string): Observable<void> {
    const user = this.authStore.user();
    if (!user) {
      return throwError(() => new Error('Debes iniciar sesión para solicitar un préstamo.'));
    }
    return this.loanService
      .createLoan({ userId: user.id, bookId, dueDate })
      .pipe(map(() => undefined));
  }

  /**
   * Devuelve true si el préstamo está vencido: porque el backend ya lo marcó
   * como OVERDUE, o porque sigue ACTIVO y su dueDate es anterior a hoy.
   * La devolución sigue disponible en ambos casos (es cuando se registra el atraso).
   */
  isOverdue(loan: LoanResponse): boolean {
    return (
      loan.status === LoanStatus.OVERDUE ||
      (loan.status === LoanStatus.ACTIVE && isBeforeToday(loan.dueDate))
    );
  }

  /** Devuelve el libro; recarga el listado en el componente si es necesario. */
  returnLoan(loan: LoanResponse): Observable<void> {
    this._returningId.set(loan.id);
    return this.loanService.returnLoan(loan.id).pipe(
      map(() => undefined),
      finalize(() => this._returningId.set(null))
    );
  }
}
