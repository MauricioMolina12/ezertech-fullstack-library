import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError } from '../../../../core/services/http.service';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SpinnerComponent } from '../../../../shared/ui/spinner/spinner.component';
import { normalizeIsbn } from '../../../../shared/utils/isbn.util';
import { BookFormValue } from '../../models/book.models';
import { BookService } from '../../services/book.service';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Formulario de libro (crear y editar).
 *
 * - Campos: title, author, isbn, genre, publicationYear, coverUrl.
 * - Botón "Autocompletar desde ISBN" que consume GET /api/books/isbn/{isbn}.
 * - Validaciones espejo del backend (required + ISBN).
 */
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    PageHeaderComponent,
    ErrorMessageComponent,
    SpinnerComponent,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly router = inject(Router);

  /** id del libro cuando es edición (binding con ruta /catalog/:id/edit). */
  readonly id = input<string>();

  protected readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(/^\d{9}[\dXx]$|^\d{13}$/)]],
    genre: ['', [Validators.required]],
    publicationYear: [
      CURRENT_YEAR,
      [Validators.required, Validators.min(1000), Validators.max(CURRENT_YEAR + 1)],
    ],
    coverUrl: ['', [Validators.required]],
  });

  protected readonly loadingBook = signal(false);
  protected readonly loadingIsbn = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly coverPreview = signal<string | null>(null);

  protected readonly isEditing = computed(() => this.id() != null);
  protected readonly pageTitle = computed(() =>
    this.isEditing() ? 'Editar libro' : 'Nuevo libro'
  );

  ngOnInit(): void {
    this.form.controls['coverUrl'].valueChanges.subscribe((value: string | null) => {
      const url = value?.trim();
      this.coverPreview.set(url ? url : null);
    });

    const bookId = this.id();
    if (bookId) {
      this.loadBook(Number(bookId));
    }
  }

  onAutocompleteIsbn(): void {
    const isbn = normalizeIsbn(this.form.controls['isbn'].value?.trim() ?? '');
    if (!isbn) {
      this.snackBar.open('Ingresa un ISBN válido primero', 'Cerrar', { duration: 3000 });
      return;
    }

    this.loadingIsbn.set(true);
    this.error.set(null);

    this.bookService
      .getBookByIsbn(isbn)
      .pipe(finalize(() => this.loadingIsbn.set(false)))
      .subscribe({
        next: (data) => {
          const year =
            data.publicationYear ?? (data as { year?: number }).year ?? CURRENT_YEAR;

          this.form.patchValue({
            title: data.title ?? '',
            author: data.author ?? '',
            isbn: normalizeIsbn(data.isbn || isbn),
            genre: data.genre ?? this.form.controls['genre'].value ?? 'Novela',
            publicationYear: year,
            coverUrl: data.coverUrl ?? '',
          });

          // Marca los campos como tocados para mostrar los errores de validación
          // de los que queden sin completar (p. ej. género o URL de portada).
          this.form.markAllAsTouched();

          if (this.form.valid) {
            this.snackBar.open('Datos autocompletados desde el ISBN', 'Cerrar', {
              duration: 3000,
            });
          } else {
            this.snackBar.open(
              `Autocompletado listo. Completa o corrige: ${this.firstInvalidControlLabel()}.`,
              'Cerrar',
              { duration: 5000 }
            );
          }
        },
        error: (error: ApiError) => {
          this.error.set(`No se pudo autocompletar desde el ISBN: ${error.message}`);
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    const payload = this.form.getRawValue() as BookFormValue;

    const request$ = this.isEditing()
      ? this.bookService.updateBook(Number(this.id()), payload)
      : this.bookService.createBook(payload);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditing() ? 'Libro actualizado correctamente' : 'Libro creado correctamente',
          'Cerrar',
          { duration: 3000 }
        );
        this.router.navigate(['/catalog']);
      },
      error: (error: ApiError) => this.error.set(error.message),
    });
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  private readonly controlLabels: Record<string, string> = {
    title: 'título',
    author: 'autor',
    isbn: 'ISBN',
    genre: 'género',
    publicationYear: 'año de publicación',
    coverUrl: 'URL de portada',
  };

  private firstInvalidControlLabel(): string {
    const key = Object.keys(this.form.controls).find((name) => this.form.controls[name].invalid);
    return key ? (this.controlLabels[key] ?? key) : 'los campos marcados';
  }

  onCoverError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder-cover.svg';
  }

  private loadBook(id: number): void {
    this.loadingBook.set(true);
    this.error.set(null);

    this.bookService
      .getBookById(id)
      .pipe(finalize(() => this.loadingBook.set(false)))
      .subscribe({
        next: (book) =>
          this.form.patchValue({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            genre: book.genre,
            publicationYear: book.publicationYear,
            coverUrl: book.coverUrl,
          }),
        error: (error: ApiError) => this.error.set(error.message),
      });
  }
}
