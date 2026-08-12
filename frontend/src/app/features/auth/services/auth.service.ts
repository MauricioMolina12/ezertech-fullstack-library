import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { UserResponse } from '../../../shared/models/user.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpService) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', credentials);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/auth/register', payload);
  }

  getUserProfile(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`/users/${userId}`);
  }
}
