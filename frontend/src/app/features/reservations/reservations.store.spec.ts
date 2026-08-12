// import '@angular/compiler';
// import { lastValueFrom, of } from 'rxjs';

// import { ReservationStatus } from '../../shared/enums/reservation-status.enum';
// import { AuthStore } from '../auth/auth.store';
// import { isActiveReservation, ReservationsStore } from './reservations.store';

// const reservationServiceMock = () => ({
//   createReservation: vi.fn(),
//   getReservationsByUser: vi.fn(() => of([])),
//   cancelReservation: vi.fn(() => of(undefined)),
// });

// describe('ReservationsStore', () => {
//   it('creates a reservation using the authenticated user id', async () => {
//     const service = reservationServiceMock();
//     service.createReservation.mockReturnValue(
//       of({
//         id: 9,
//         userId: 5,
//         bookId: 42,
//         reservedAt: '2026-08-12T00:00:00',
//         status: ReservationStatus.PENDING,
//         createdAt: '2026-08-12T00:00:00',
//         updatedAt: '2026-08-12T00:00:00',
//       })
//     );
//     const authStore = { user: () => ({ id: 5, name: 'Ana', email: 'ana@biblioteca.com' }) } as unknown as AuthStore;

//     const store = new ReservationsStore(service as never, authStore);
//     await lastValueFrom(store.reserve(42));

//     expect(service.createReservation).toHaveBeenCalledWith({ userId: 5, bookId: 42 });
//   });

//   it('fails with a clear message when there is no authenticated user', async () => {
//     const service = reservationServiceMock();
//     const authStore = { user: () => null } as unknown as AuthStore;

//     const store = new ReservationsStore(service as never, authStore);

//     await expect(lastValueFrom(store.reserve(1))).rejects.toMatchObject({
//       message: expect.stringContaining('iniciar sesión'),
//     });
//     expect(service.createReservation).not.toHaveBeenCalled();
//   });

//   it('loads the reservations of a user', () => {
//     const service = reservationServiceMock();
//     service.getReservationsByUser.mockReturnValue(
//       of([
//         {
//           id: 1,
//           userId: 5,
//           bookId: 2,
//           reservedAt: '2026-08-12T00:00:00',
//           status: ReservationStatus.PENDING,
//           createdAt: '2026-08-12T00:00:00',
//           updatedAt: '2026-08-12T00:00:00',
//         },
//       ])
//     );
//     const authStore = { user: () => null } as unknown as AuthStore;

//     const store = new ReservationsStore(service as never, authStore);
//     store.loadReservations(5);

//     expect(service.getReservationsByUser).toHaveBeenCalledWith(5);
//     expect(store.reservations()).toHaveLength(1);
//     expect(store.reservations()[0].status).toBe(ReservationStatus.PENDING);
//   });

//   it('detects the current user active reservation for a book (queue membership)', () => {
//     const service = reservationServiceMock();
//     service.getReservationsByUser.mockReturnValue(
//       of([
//         {
//           id: 1,
//           userId: 5,
//           bookId: 2,
//           reservedAt: '2026-08-12T00:00:00',
//           status: ReservationStatus.PENDING,
//           createdAt: '2026-08-12T00:00:00',
//           updatedAt: '2026-08-12T00:00:00',
//         },
//         {
//           id: 2,
//           userId: 5,
//           bookId: 7,
//           reservedAt: '2026-08-12T00:00:00',
//           status: ReservationStatus.NOTIFIED,
//           createdAt: '2026-08-12T00:00:00',
//           updatedAt: '2026-08-12T00:00:00',
//         },
//         {
//           id: 3,
//           userId: 5,
//           bookId: 9,
//           reservedAt: '2026-08-12T00:00:00',
//           status: ReservationStatus.CANCELLED,
//           createdAt: '2026-08-12T00:00:00',
//           updatedAt: '2026-08-12T00:00:00',
//         },
//       ])
//     );
//     const authStore = { user: () => null } as unknown as AuthStore;

//     const store = new ReservationsStore(service as never, authStore);
//     store.loadReservations(5);

//     // PENDING y NOTIFIED cuentan como reserva activa.
//     expect(store.hasActiveReservation(2)).toBe(true);
//     expect(store.hasActiveReservation(7)).toBe(true);
//     // CANCELLED ya no ocupa lugar en la cola.
//     expect(store.hasActiveReservation(9)).toBe(false);
//     // Libro sin reserva.
//     expect(store.hasActiveReservation(99)).toBe(false);

//     expect(store.activeReservationFor(7)?.status).toBe(ReservationStatus.NOTIFIED);
//     expect(store.activeReservationFor(99)).toBeNull();
//   });

//   it('isActiveReservation only considers PENDING and NOTIFIED as active', () => {
//     expect(isActiveReservation(ReservationStatus.PENDING)).toBe(true);
//     expect(isActiveReservation(ReservationStatus.NOTIFIED)).toBe(true);
//     expect(isActiveReservation(ReservationStatus.CANCELLED)).toBe(false);
//     expect(isActiveReservation(ReservationStatus.FULFILLED)).toBe(false);
//   });
// });
