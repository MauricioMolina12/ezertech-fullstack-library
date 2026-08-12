import { Injectable, computed, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiError } from '../../core/services/http.service';
import { AuthStore } from '../auth/auth.store';
import { isActiveReservation, ReservationResponse } from './models/reservation.models';
import { ReservationService } from './services/reservation.service';

/**
 * Store de reservas basado en Signals.
 *
 * Estados: data (reservations), loading, error.
 * `reserve()` se usa desde el catálogo; el userId se toma del AuthStore.
 * Expone helpers para saber si el usuario autenticado ya forma parte de la
 * cola de reservas de un libro.
 */
@Injectable({ providedIn: 'root' })
export class ReservationsStore {
  private readonly _reservations = signal<ReservationResponse[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly reservations = computed(() => this._reservations());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(
    private readonly reservationService: ReservationService,
    private readonly authStore: AuthStore
  ) {}

  loadReservations(userId: number): void {
    this._loading.set(true);
    this._error.set(null);

    this.reservationService.getReservationsByUser(userId).subscribe({
      next: (reservations) => {
        this._reservations.set(reservations);
        this._loading.set(false);
      },
      error: (error: ApiError) => {
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }

  /** Crea una reserva para el usuario autenticado (se añade a la cola). */
  reserve(bookId: number): Observable<void> {
    const user = this.authStore.user();
    if (!user) {
      return throwError(() => new Error('Debes iniciar sesión para reservar un libro.'));
    }
    return this.reservationService
      .createReservation({ userId: user.id, bookId })
      .pipe(map(() => undefined));
  }

  /** ¿El usuario autenticado tiene una reserva activa para este libro? */
  hasActiveReservation(bookId: number): boolean {
    return this._reservations().some(
      (reservation) => reservation.bookId === bookId && isActiveReservation(reservation.status)
    );
  }

  /** Reserva activa del usuario para este libro (null si no existe). */
  activeReservationFor(bookId: number): ReservationResponse | null {
    return (
      this._reservations().find(
        (reservation) => reservation.bookId === bookId && isActiveReservation(reservation.status)
      ) ?? null
    );
  }

  cancelReservation(id: number): Observable<void> {
    return this.reservationService.cancelReservation(id).pipe(map(() => undefined));
  }
}
