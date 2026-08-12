import { ReservationStatus } from '../../../shared/enums/reservation-status.enum';

/** DTO del backend: reserva (espejo de ReservationResponse). */
export interface ReservationResponse {
  id: number;
  userId: number;
  bookId: number;
  reservedAt: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  userId: number;
  bookId: number;
}

/**
 * Una reserva está "activa" mientras espera turno (PENDING) o cuando el primer
 * usuario de la cola fue notificado (NOTIFIED). CANCELLED/FULFILLED ya no ocupan
 * lugar en la cola.
 */
export function isActiveReservation(status: ReservationStatus): boolean {
  return status === ReservationStatus.PENDING || status === ReservationStatus.NOTIFIED;
}
