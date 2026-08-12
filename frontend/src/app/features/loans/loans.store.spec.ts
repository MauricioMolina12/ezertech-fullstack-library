import '@angular/compiler';
import { lastValueFrom, of, throwError } from 'rxjs';

import { LoanStatus } from '../../shared/enums/loan-status.enum';
import { LoanResponse } from './models/loan.models';
import { LoansStore } from './loans.store';

function loan(id: number, overrides: Partial<LoanResponse> = {}): LoanResponse {
  return {
    id,
    userId: 1,
    bookId: 1,
    loanDate: '2026-08-01T00:00:00',
    dueDate: '2026-08-30T00:00:00',
    returnDate: null,
    reminderSentAt: null,
    overdueNoticeSentAt: null,
    status: LoanStatus.ACTIVE,
    createdAt: '2026-08-01T00:00:00',
    updatedAt: '2026-08-01T00:00:00',
    ...overrides,
  };
}

function createStore(service: unknown): LoansStore {
  const authStore = { user: () => ({ id: 1, name: 'Ana Torres', email: 'ana@biblioteca.com' }) };
  return new LoansStore(service as never, authStore as never);
}

describe('LoansStore', () => {
  it('loads loans for a user and exposes data/loading/error states', () => {
    const service = {
      getLoansByUser: vi.fn(() => of([loan(1), loan(2)])),
      returnLoan: vi.fn(() => of(loan(1))),
    };
    const store = createStore(service);

    store.loadLoans(1);

    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.loans()).toHaveLength(2);
    expect(service.getLoansByUser).toHaveBeenCalledWith(1);
  });

  it('detects overdue loans (active and dueDate before today)', () => {
    const service = {
      getLoansByUser: vi.fn(() =>
        of([
          loan(1, { dueDate: '2020-01-01T00:00:00' }), // activo y vencido
          loan(2, { status: LoanStatus.RETURNED, dueDate: '2020-01-01T00:00:00' }), // devuelto
          loan(3, { dueDate: '2099-01-01T00:00:00' }), // futuro
        ])
      ),
      returnLoan: vi.fn(() => of(loan(1))),
    };
    const store = createStore(service);
    store.loadLoans(1);

    expect(store.overdueCount()).toBe(1);
    expect(store.isOverdue(store.loans()[0])).toBe(true);
    expect(store.isOverdue(store.loans()[1])).toBe(false);
    expect(store.isOverdue(store.loans()[2])).toBe(false);
  });

  it('exposes the error when the request fails', () => {
    const service = {
      getLoansByUser: vi.fn(() =>
        throwError(() => ({ status: 500, message: 'No se pudieron cargar los préstamos' }))
      ),
      returnLoan: vi.fn(),
    };
    const store = createStore(service);

    store.loadLoans(1);

    expect(store.error()).toBe('No se pudieron cargar los préstamos');
    expect(store.loading()).toBe(false);
  });

  it('calls the return endpoint for a loan', async () => {
    const service = {
      getLoansByUser: vi.fn(() => of([loan(1)])),
      returnLoan: vi.fn(() => of(loan(1, { status: LoanStatus.RETURNED }))),
    };
    const store = createStore(service);
    store.loadLoans(1);

    await lastValueFrom(store.returnLoan(store.loans()[0]));

    expect(service.returnLoan).toHaveBeenCalledWith(1);
    expect(store.returningId()).toBeNull();
  });

  it('creates a loan using the authenticated user id and the chosen due date', async () => {
    const service = {
      getLoansByUser: vi.fn(() => of([])),
      returnLoan: vi.fn(),
      createLoan: vi.fn(() => of(loan(10, { bookId: 42 }))),
    };
    const store = createStore(service);

    await lastValueFrom(store.loan(42, '2026-08-20T00:00:00'));

    expect(service.createLoan).toHaveBeenCalledWith({
      userId: 1,
      bookId: 42,
      dueDate: '2026-08-20T00:00:00',
    });
  });

  it('fails with a clear message when there is no authenticated user', async () => {
    const service = {
      getLoansByUser: vi.fn(() => of([])),
      returnLoan: vi.fn(),
      createLoan: vi.fn(),
    };
    const store = new LoansStore(service as never, { user: () => null } as never);

    await expect(lastValueFrom(store.loan(1, '2026-08-20T00:00:00'))).rejects.toMatchObject({
      message: expect.stringContaining('iniciar sesión'),
    });
    expect(service.createLoan).not.toHaveBeenCalled();
  });
});
