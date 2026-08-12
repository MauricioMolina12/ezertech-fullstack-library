import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { DashboardStats } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpService) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>('/dashboard/stats');
  }
}
