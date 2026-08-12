import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { addDays, toLocalIsoDateTime } from '../../../../shared/utils/date.util';

export interface LoanDialogData {
  bookId: number;
  bookTitle: string;
}

export interface LoanDialogResult {
  bookId: number;
  dueDate: string;
}

/** Días de préstamo por defecto (editable en el datepicker del diálogo). */
const DEFAULT_LOAN_DAYS = 14;

/** Devuelve hoy a las 00:00:00 en hora local. */
function todayAtMidnight(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Diálogo para solicitar un préstamo: permite elegir la fecha de vencimiento. */
@Component({
  selector: 'app-loan-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './loan-dialog.component.html',
  styleUrl: './loan-dialog.component.scss',
})
export class LoanDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<LoanDialogComponent>);
  protected readonly data = inject<LoanDialogData>(MAT_DIALOG_DATA);

  protected readonly today = todayAtMidnight();
  protected readonly dueDateControl = new FormControl<Date>(
    addDays(this.today, DEFAULT_LOAN_DAYS),
    [Validators.required]
  );

  confirm(): void {
    const date = this.dueDateControl.value;
    if (this.dueDateControl.invalid || !date) {
      return;
    }
    // Normaliza a medianoche local para enviar `2026-08-20T00:00:00` exactamente.
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);

    const result: LoanDialogResult = {
      bookId: this.data.bookId,
      dueDate: toLocalIsoDateTime(normalized),
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
