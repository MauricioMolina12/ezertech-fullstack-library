import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { Book } from '../../../shared/models/book.model';
import { BookFormValue, IsbnLookupResponse } from '../models/book.models';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private readonly http: HttpService) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>('/books');
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`/books/${id}`);
  }

  getBookByIsbn(isbn: string): Observable<IsbnLookupResponse> {
    return this.http.get<IsbnLookupResponse>(`/books/lookup/${isbn}`);
  }

  createBook(book: BookFormValue): Observable<Book> {
    return this.http.post<Book>('/books', book);
  }

  updateBook(id: number, book: BookFormValue): Observable<Book> {
    return this.http.put<Book>(`/books/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`/books/${id}`);
  }
}
