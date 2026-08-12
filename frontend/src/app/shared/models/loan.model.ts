import { LoanStatus } from '../enums/loan-status.enum';

/** DTO del backend: préstamo. */
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
