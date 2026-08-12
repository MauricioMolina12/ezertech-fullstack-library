import { Injectable, computed, signal } from '@angular/core';

import { ApiError } from '../../core/services/http.service';
import { DashboardStats } from './models/admin.models';
import { AdminService } from './services/admin.service';

/**
 * Store del panel de administración basado en Signals.
 *
 * Estados: data (stats), loading, error.
 */
@Injectable({ providedIn: 'root' })
export class AdminStore {
  private readonly _stats = signal<DashboardStats | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly stats = computed(() => this._stats());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private readonly adminService: AdminService) {}

  loadStats(): void {
    this._loading.set(true);
    this._error.set(null);

    this.adminService.getStats().subscribe({
      next: (stats) => {
        this._stats.set(stats);
        this._loading.set(false);
      },
      error: (error: ApiError) => {
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }
}
