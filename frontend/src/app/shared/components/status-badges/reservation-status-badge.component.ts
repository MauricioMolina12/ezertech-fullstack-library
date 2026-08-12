import { Component, computed, input } from '@angular/core';

import { ReservationStatus } from '../../enums/reservation-status.enum';
import { BadgeComponent, BadgeColor } from '../../ui/badge/badge.component';

const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'En cola',
  [ReservationStatus.NOTIFIED]: 'Libro disponible',
  [ReservationStatus.CANCELLED]: 'Cancelada',
  [ReservationStatus.FULFILLED]: 'Completada',
};

const RESERVATION_STATUS_COLORS: Record<ReservationStatus, BadgeColor> = {
  [ReservationStatus.PENDING]: 'warning',
  [ReservationStatus.NOTIFIED]: 'success',
  [ReservationStatus.CANCELLED]: 'neutral',
  [ReservationStatus.FULFILLED]: 'info',
};

@Component({
  selector: 'app-reservation-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './reservation-status-badge.component.html',
  styleUrl: './reservation-status-badge.component.scss',
})
export class ReservationStatusBadgeComponent {
  readonly status = input.required<ReservationStatus>();

  protected readonly label = computed(() => RESERVATION_STATUS_LABELS[this.status()]);
  protected readonly color = computed(() => RESERVATION_STATUS_COLORS[this.status()]);
}
