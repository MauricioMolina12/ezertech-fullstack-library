import { Injectable, computed, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { ApiError } from '../../core/services/http.service';
import { BookStatus } from '../../shared/enums/book-status.enum';
import { Book } from '../../shared/models/book.model';
import { BookService } from './services/book.service';

export type BookStatusFilter = BookStatus | 'ALL';

/**
 * Store de libros basado en Signals.
 *
 * Estados:
 * - data: books / filteredBooks
 * - loading
 * - error (nunca se oculta)
 *
 * Además expone los filtros de búsqueda (texto + estado) como estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class BooksStore {
  private readonly _books = signal<Book[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _search = signal('');
  private readonly _statusFilter = signal<BookStatusFilter>('ALL');

  readonly books = computed(() => this._books());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly search = this._search.asReadonly();
  readonly statusFilter = this._statusFilter.asReadonly();

  readonly filteredBooks = computed(() => {
    const query = this._search().trim().toLowerCase();
    const status = this._statusFilter();

    return this._books().filter((book) => {
      const matchesQuery =
        !query || book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
      const matchesStatus = status === 'ALL' || book.status === status;
      return matchesQuery && matchesStatus;
    });
  });

  readonly availableCount = computed(
    () => this._books().filter((book) => book.status === BookStatus.AVAILABLE).length
  );

  constructor(private readonly bookService: BookService) {}

  loadBooks(): void {
    this._loading.set(true);
    this._error.set(null);

    this.bookService.getBooks().subscribe({
      next: (books) => {
        this._books.set(books);
        this._loading.set(false);
      },
      error: (error: ApiError) => {
        this._error.set(error.message);
        this._loading.set(false);
      },
    });
  }

  setSearch(search: string): void {
    this._search.set(search);
  }

  setStatusFilter(status: BookStatusFilter): void {
    this._statusFilter.set(status);
  }

  /** Elimina un libro y recarga el catálogo automáticamente. */
  deleteBook(id: number): Observable<void> {
    return this.bookService.deleteBook(id).pipe(
      map(() => undefined),
      tap(() => this.loadBooks())
    );
  }

  clear(): void {
    this._books.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._search.set('');
    this._statusFilter.set('ALL');
  }
}
