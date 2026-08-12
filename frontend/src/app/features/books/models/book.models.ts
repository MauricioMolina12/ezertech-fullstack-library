import { BookStatus } from '../../../shared/enums/book-status.enum';

export interface BookFilters {
  search: string;
  status: BookStatus | 'ALL';
}

/** Valores del formulario de libro (crear/editar). */
export interface BookFormValue {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publicationYear: number;
  coverUrl: string;
}

/** Respuesta esperada de GET /api/books/isbn/{isbn}. */
export interface IsbnLookupResponse {
  isbn: string;
  title: string;
  author: string;
  publicationYear: number;
  coverUrl: string;
  /** Género, si el backend lo provee; permite autocompletar también este campo. */
  genre?: string;
}
