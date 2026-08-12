import { Component, input, output, signal } from '@angular/core';

import { BookStatusBadgeComponent } from '../../../../shared/components/status-badges/book-status-badge.component';
import { BookStatus } from '../../../../shared/enums/book-status.enum';
import { Book } from '../../../../shared/models/book.model';

/**
 * Card de libro (presentacional).
 *
 * Recibe el libro, el estado del usuario (reservas) y los permisos de acción
 * por inputs; emite eventos hacia el catálogo. NO realiza llamadas HTTP ni
 * contiene lógica de negocio: el catálogo orquesta stores/servicios.
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [BookStatusBadgeComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
})
export class BookCardComponent {
  /** Libro a mostrar. */
  readonly book = input.required<Book>();

  /** ¿El usuario autenticado ya tiene una reserva activa para este libro? */
  readonly userReserved = input(false);
  /** ¿La reserva del usuario fue notificada (primero de la cola)? */
  readonly userNotified = input(false);

  /** Permisos de acción (calculados en el catálogo según RBAC). */
  readonly canLoan = input(false);
  readonly canReserve = input(false);
  readonly canManage = input(false);

  /** Operaciones en curso (deshabilitan sus botones). */
  readonly loaning = input(false);
  readonly reserving = input(false);

  /** Eventos hacia el catálogo. */
  readonly loan = output<Book>();
  readonly reserve = output<Book>();
  readonly viewDetails = output<Book>();
  readonly edit = output<Book>();
  readonly delete = output<Book>();

  protected readonly BookStatus = BookStatus;
  protected readonly coverFailed = signal(false);

  onLoan(): void {
    this.loan.emit(this.book());
  }

  onReserve(): void {
    this.reserve.emit(this.book());
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.book());
  }

  onEdit(): void {
    this.edit.emit(this.book());
  }

  onDelete(): void {
    this.delete.emit(this.book());
  }

  onCoverError(): void {
    this.coverFailed.set(true);
  }
}
