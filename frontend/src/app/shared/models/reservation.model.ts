import { ReservationStatus } from '../enums/reservation-status.enum';

/** DTO del backend: reserva. */
export interface ReservationResponse {
  id: number;
  userId: number;
  bookId: number;
  reservedAt: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}
