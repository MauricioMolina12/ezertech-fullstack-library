import '@angular/compiler';
import { lastValueFrom, of, throwError } from 'rxjs';

import { BookStatus } from '../../shared/enums/book-status.enum';
import { Book } from '../../shared/models/book.model';
import { BooksStore } from './books.store';

function book(id: number, overrides: Partial<Book> = {}): Book {
  return {
    id,
    title: `Libro ${id}`,
    author: 'Autor',
    isbn: '9781234567890',
    genre: 'Novela',
    publicationYear: 2020,
    coverUrl: '',
    status: BookStatus.AVAILABLE,
    createdAt: '2026-01-01T00:00:00',
    updatedAt: '2026-01-01T00:00:00',
    ...overrides,
  };
}

describe('BooksStore', () => {
  it('loads books and exposes data with loading/error states', () => {
    const service = { getBooks: vi.fn(() => of([book(1), book(2)])) };
    const store = new BooksStore(service as never);

    store.loadBooks();

    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.books()).toHaveLength(2);
    expect(service.getBooks).toHaveBeenCalledTimes(1);
  });

  it('exposes the error message when the request fails (errors are never hidden)', () => {
    const service = {
      getBooks: vi.fn(() => throwError(() => ({ status: 500, message: 'Error del servidor' }))),
    };
    const store = new BooksStore(service as never);

    store.loadBooks();

    expect(store.error()).toBe('Error del servidor');
    expect(store.loading()).toBe(false);
    expect(store.books()).toHaveLength(0);
  });

  it('filters by search text over title and author', () => {
    const service = {
      getBooks: vi.fn(() =>
        of([book(1, { title: 'Cien años de soledad' }), book(2, { author: 'Jorge Luis Borges' })])
      ),
    };
    const store = new BooksStore(service as never);
    store.loadBooks();

    store.setSearch('borges');
    expect(store.filteredBooks().map((b) => b.id)).toEqual([2]);

    store.setSearch('CIEN');
    expect(store.filteredBooks().map((b) => b.id)).toEqual([1]);
  });

  it('filters by status', () => {
    const service = {
      getBooks: vi.fn(() => of([book(1), book(2, { status: BookStatus.LOANED })])),
    };
    const store = new BooksStore(service as never);
    store.loadBooks();

    store.setStatusFilter(BookStatus.LOANED);
    expect(store.filteredBooks().map((b) => b.id)).toEqual([2]);
  });

  it('clears all state', () => {
    const service = { getBooks: vi.fn(() => of([book(1)])) };
    const store = new BooksStore(service as never);
    store.loadBooks();
    store.setSearch('x');
    store.setStatusFilter(BookStatus.RESERVED);
    store.clear();

    expect(store.books()).toHaveLength(0);
    expect(store.search()).toBe('');
    expect(store.statusFilter()).toBe('ALL');
    expect(store.error()).toBeNull();
  });

  it('deletes a book and reloads the catalog automatically', async () => {
    const service = {
      getBooks: vi.fn(() => of([book(1), book(2)])),
      deleteBook: vi.fn(() => of(undefined)),
    };
    const store = new BooksStore(service as never);
    store.loadBooks();

    await lastValueFrom(store.deleteBook(1));

    expect(service.deleteBook).toHaveBeenCalledWith(1);
    // Carga inicial + recarga automática tras eliminar.
    expect(service.getBooks).toHaveBeenCalledTimes(2);
  });
});
