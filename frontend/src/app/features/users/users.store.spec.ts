import '@angular/compiler';
import { of, throwError } from 'rxjs';

import { UserStats } from './models/user-stats.model';
import { UsersStore } from './users.store';

const stats: UserStats = { totalLoans: 3, activeLoans: 0, returnedLoans: 3, overdueLoans: 0 };

function createStore(service: unknown): UsersStore {
  return new UsersStore(service as never);
}

describe('UsersStore', () => {
  it('loads the stats of a user', () => {
    const service = { getUserStats: vi.fn(() => of(stats)), getUsers: vi.fn(() => of([])) };
    const store = createStore(service);

    store.loadStats(7);

    expect(service.getUserStats).toHaveBeenCalledWith(7);
    expect(store.stats()).toEqual(stats);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('exposes the error when the stats request fails', () => {
    const service = {
      getUserStats: vi.fn(() =>
        throwError(() => ({ status: 500, message: 'Error del servidor' }))
      ),
      getUsers: vi.fn(() => of([])),
    };
    const store = createStore(service);

    store.loadStats(7);

    expect(store.error()).toBe('Error del servidor');
    expect(store.loading()).toBe(false);
  });

  it('loads the user list', () => {
    const users = [
      { id: 1, name: 'Ana', email: 'ana@test.com', role: 'ADMIN', createdAt: 'x', updatedAt: 'y' },
      { id: 2, name: 'Luis', email: 'luis@test.com', role: 'LIBRARIAN', createdAt: 'x', updatedAt: 'y' },
    ];
    const service = { getUserStats: vi.fn(() => of(stats)), getUsers: vi.fn(() => of(users)) };
    const store = createStore(service);

    store.loadUsers();

    expect(service.getUsers).toHaveBeenCalledTimes(1);
    expect(store.users()).toHaveLength(2);
  });
});
