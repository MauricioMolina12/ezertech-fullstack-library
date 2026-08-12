import { LoanStatus } from '../../../shared/enums/loan-status.enum';

/** DTO del backend: préstamo (espejo de LoanResponse). */
export interface LoanResponse {
  id: number;
  userId: number;
  bookId: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  reminderSentAt: string | null;
  overdueNoticeSentAt: string | null;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

/** Petición para crear un préstamo (POST /api/loans). */
export interface CreateLoanRequest {
  userId: number;
  bookId: number;
  dueDate: string;
}
