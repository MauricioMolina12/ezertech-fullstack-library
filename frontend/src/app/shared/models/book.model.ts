import { BookStatus } from '../enums/book-status.enum';

/** DTO del backend: libro. */
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publicationYear: number;
  coverUrl: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}
