import { Injectable, computed, signal } from '@angular/core';

import { ApiError } from '../../core/services/http.service';
import { UserResponse } from '../../shared/models/user.model';
import { UserStats } from './models/user-stats.model';
import { UserService } from './services/user.service';

/**
 * Store de usuarios basado en Signals.
 *
 * Estados: data (users / stats), loading, error.
 */
@Injectable({ providedIn: 'root' })
export class UsersStore {
  private readonly _users = signal<UserResponse[]>([]);
  private readonly _stats = signal<UserStats | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly users = computed(() => this._users());
  readonly stats = computed(() => this._stats());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor(private readonly userService: UserService) {}

  loadStats(userId: number): void {
    this._loading.set(true);
    this._error.set(null);

    this.userService.getUserStats(userId).subscribe({
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

  loadUsers(): void {
    this._loading.set(true);
    this._error.set(null);

    this.userService.getUsers().subscribe({
      next: (users) => {
        this._users.set(users);
        this._loading.set(false);
      },
      error: (error: ApiError) => {
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }
}
