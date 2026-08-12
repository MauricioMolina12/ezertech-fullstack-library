import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { UserResponse } from '../../../shared/models/user.model';
import { UserStats } from '../models/user-stats.model';
import { UpdateUserRequest } from '../models/update-user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private readonly http: HttpService) {}

  /** GET /api/users/{id}/stats — estadísticas de actividad del usuario. */
  getUserStats(userId: number): Observable<UserStats> {
    return this.http.get<UserStats>(`/users/${userId}/stats`);
  }

  /** GET /api/users — listado de usuarios para administración. */
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>('/users');
  }

  /** PUT /api/users/{id} — actualiza nombre, correo y rol. */
  updateUser(id: number, payload: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`/users/${id}`, payload);
  }

  /** DELETE /api/users/{id} — elimina un usuario. */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}
