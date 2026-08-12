import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { CreateReservationRequest, ReservationResponse } from '../models/reservation.models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private readonly http: HttpService) {}

  createReservation(payload: CreateReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>('/reservations', payload);
  }

  getReservationsByUser(userId: number): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`/reservations/user/${userId}`);
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`/reservations/${id}`);
  }
}
