import '@angular/compiler';
import { lastValueFrom, of, throwError } from 'rxjs';

import { APP_CONFIG } from '../../core/config/app.config';
import { StorageService } from '../../core/services/storage.service';
import { Role } from '../../shared/enums/role.enum';
import { AuthStore } from './auth.store';

function createStore(authService: unknown, storage: StorageService): AuthStore {
  return new AuthStore(authService as never, storage);
}

describe('AuthStore', () => {
  let storage: StorageService;
  let loginMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    storage = new StorageService();
    storage.remove(APP_CONFIG.tokenStorageKey);
    storage.remove(APP_CONFIG.userStorageKey);
    loginMock = vi.fn(() =>
      of({ token: 'jwt-token', userId: 1, name: 'Ana Torres', email: 'ana@biblioteca.com' })
    );
  });

  it('starts unauthenticated when there is no stored token', () => {
    const store = createStore({ login: loginMock, getUserProfile: vi.fn() }, storage);
    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
    expect(store.user()).toBeNull();
  });

  it('hydrates the session from localStorage', () => {
    storage.set(APP_CONFIG.tokenStorageKey, 'saved-token');
    storage.setJson(APP_CONFIG.userStorageKey, {
      id: 1,
      name: 'Ana Torres',
      email: 'ana@biblioteca.com',
    });

    const store = createStore({ login: loginMock, getUserProfile: vi.fn() }, storage);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.token()).toBe('saved-token');
    expect(store.user()?.name).toBe('Ana Torres');
  });

  it('logs in, persists the session and completes the user profile with the role', async () => {
    const profile = {
      id: 1,
      name: 'Ana Torres',
      email: 'ana@biblioteca.com',
      role: Role.ADMIN,
      createdAt: '2026-01-01T00:00:00',
      updatedAt: '2026-01-01T00:00:00',
    };
    const store = createStore(
      { login: loginMock, getUserProfile: vi.fn(() => of(profile)) },
      storage
    );

    await lastValueFrom(store.login({ email: 'ana@biblioteca.com', password: 'secret' }));

    expect(store.isAuthenticated()).toBe(true);
    expect(store.token()).toBe('jwt-token');
    expect(store.user()?.role).toBe(Role.ADMIN);
    expect(store.isAdmin()).toBe(true);
    expect(storage.get(APP_CONFIG.tokenStorageKey)).toBe('jwt-token');
  });

  it('keeps the session when the profile endpoint is not available', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const store = createStore(
      {
        login: loginMock,
        getUserProfile: vi.fn(() => throwError(() => new Error('Endpoint no encontrado'))),
      },
      storage
    );

    await lastValueFrom(store.login({ email: 'ana@biblioteca.com', password: 'secret' }));

    expect(store.isAuthenticated()).toBe(true);
    expect(store.user()?.email).toBe('ana@biblioteca.com');
    expect(store.user()?.role).toBeUndefined();
    expect(store.isAdmin()).toBe(false);
    warnSpy.mockRestore();
  });

  it('propagates login failures without marking the session as active', async () => {
    const store = createStore(
      {
        login: vi.fn(() =>
          throwError(() => ({ status: 401, message: 'Credenciales inválidas' }))
        ),
        getUserProfile: vi.fn(),
      },
      storage
    );

    await expect(
      lastValueFrom(store.login({ email: 'ana@biblioteca.com', password: 'bad' }))
    ).rejects.toEqual({ status: 401, message: 'Credenciales inválidas' });
    expect(store.isAuthenticated()).toBe(false);
  });

  it('registers a new account and does not start a session', async () => {
    const registerMock = vi.fn(() =>
      of({ id: 10, name: 'Nuevo Usuario', email: 'nuevo@biblioteca.com' })
    );
    const store = createStore(
      { login: loginMock, getUserProfile: vi.fn(), register: registerMock },
      storage
    );

    await lastValueFrom(
      store.register({ name: 'Nuevo Usuario', email: 'nuevo@biblioteca.com', password: 'secret123' })
    );

    expect(registerMock).toHaveBeenCalledWith({
      name: 'Nuevo Usuario',
      email: 'nuevo@biblioteca.com',
      password: 'secret123',
    });
    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
  });

  it('propagates registration failures', async () => {
    const store = createStore(
      {
        login: loginMock,
        getUserProfile: vi.fn(),
        register: vi.fn(() =>
          throwError(() => ({ status: 409, message: 'El correo ya está registrado' }))
        ),
      },
      storage
    );

    await expect(
      lastValueFrom(store.register({ name: 'Ana', email: 'ana@biblioteca.com', password: 'secret123' }))
    ).rejects.toEqual({ status: 409, message: 'El correo ya está registrado' });
    expect(store.isAuthenticated()).toBe(false);
  });

  it('logs out and clears the stored session', () => {
    storage.set(APP_CONFIG.tokenStorageKey, 'jwt-token');
    const store = createStore({ login: loginMock, getUserProfile: vi.fn() }, storage);

    store.logout();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.token()).toBeNull();
    expect(store.user()).toBeNull();
    expect(storage.get(APP_CONFIG.tokenStorageKey)).toBeNull();
  });
});
