import { Injectable, computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { APP_CONFIG } from '../../core/config/app.config';
import { StorageService } from '../../core/services/storage.service';
import { Role } from '../../shared/enums/role.enum';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from './models/auth.model';
import { AuthService } from './services/auth.service';

/**
 * Store de autenticación basado en Angular Signals.
 *
 * Estado global:
 * - user
 * - token
 * - isAuthenticated (derivado)
 * - isAdmin (derivado, requiere rol)
 *
 * El token y el usuario se persisten en localStorage para restaurar la sesión
 * al recargar la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _token = signal<string | null>(null);

  readonly user = computed(() => this._user());
  readonly token = computed(() => this._token());
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly isAdmin = computed(() => {
    const role = this._user()?.role;
    return role === Role.ADMIN || role === Role.LIBRARIAN;
  });

  constructor(
    private readonly authService: AuthService,
    private readonly storage: StorageService
  ) {
    this.hydrate();
  }

  login(credentials: LoginRequest): Observable<void> {
    return this.authService.login(credentials).pipe(
      switchMap((response: LoginResponse) => {
        this.setSession(response);

        // Intenta enriquecer el perfil con el rol. Si el endpoint no existe,
        // la sesión continúa con los datos del login (se advierte en consola).
        return this.authService.getUserProfile(response.userId).pipe(
          tap((profile) => {
            this._user.set(profile);
            this.storage.setJson(APP_CONFIG.userStorageKey, profile);
          }),
          catchError((error) => {
            console.warn('[AuthStore] No se pudo obtener el perfil completo del usuario:', error);
            return of(undefined);
          }),
          map(() => undefined)
        );
      })
    );
  }

  /** Crea una cuenta nueva (POST /api/auth/register). Tras crearla se redirige al login. */
  register(credentials: RegisterRequest): Observable<void> {
    return this.authService.register(credentials).pipe(map(() => undefined));
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    this.storage.remove(APP_CONFIG.tokenStorageKey);
    this.storage.remove(APP_CONFIG.userStorageKey);
  }

  private setSession(response: LoginResponse): void {
    this._token.set(response.token);
    const user: AuthUser = {
      id: response.userId,
      name: response.name,
      email: response.email,
    };
    this._user.set(user);
    this.storage.set(APP_CONFIG.tokenStorageKey, response.token);
    this.storage.setJson(APP_CONFIG.userStorageKey, user);
  }

  private hydrate(): void {
    const token = this.storage.get(APP_CONFIG.tokenStorageKey);
    if (token) {
      this._token.set(token);
      this._user.set(this.storage.getJson<AuthUser>(APP_CONFIG.userStorageKey));
    }
  }
}
