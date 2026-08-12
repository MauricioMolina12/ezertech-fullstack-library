import { Injectable, Signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { UserResponse } from '../../shared/models/user.model';
import { UserStats } from './models/user-stats.model';
import { UpdateUserRequest } from './models/update-user.model';
import { UserService } from './services/user.service';
import { UsersStore } from './users.store';

/**
 * Facade del módulo de usuarios.
 *
 * Los componentes usan únicamente este facade (nunca el store o el service
 * directamente). Expone los selectores del store como señales y orquesta las
 * operaciones de escritura (recargando la lista tras cada mutación).
 */
@Injectable({ providedIn: 'root' })
export class UsersFacade {
  readonly users: Signal<UserResponse[]>;
  readonly stats: Signal<UserStats | null>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;

  constructor(
    private readonly store: UsersStore,
    private readonly userService: UserService
  ) {
    // Inicialización en el constructor: garantiza el orden correcto de los
    // class fields (useDefineForClassFields) al referenciar `this.store`.
    this.users = this.store.users;
    this.stats = this.store.stats;
    this.loading = this.store.loading;
    this.error = this.store.error;
  }

  loadUsers(): void {
    this.store.loadUsers();
  }

  loadStats(userId: number): void {
    this.store.loadStats(userId);
  }

  /** Actualiza un usuario y recarga la lista automáticamente. */
  updateUser(id: number, payload: UpdateUserRequest): Observable<void> {
    return this.userService.updateUser(id, payload).pipe(
      map(() => undefined),
      tap(() => this.store.loadUsers())
    );
  }

  /** Elimina un usuario y recarga la lista automáticamente. */
  deleteUser(id: number): Observable<void> {
    return this.userService.deleteUser(id).pipe(
      map(() => undefined),
      tap(() => this.store.loadUsers())
    );
  }

  /** Carga las estadísticas de actividad de un usuario. */
  getUserStats(userId: number): Observable<UserStats> {
    return this.userService.getUserStats(userId);
  }
}
