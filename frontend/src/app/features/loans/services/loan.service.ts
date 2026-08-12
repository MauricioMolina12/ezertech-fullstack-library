import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { CreateLoanRequest, LoanResponse } from '../models/loan.models';

@Injectable({ providedIn: 'root' })
export class LoanService {
  constructor(private readonly http: HttpService) {}

  getLoansByUser(userId: number): Observable<LoanResponse[]> {
    return this.http.get<LoanResponse[]>('/loans/user/' + userId);
  }

  createLoan(payload: CreateLoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>('/loans', payload);
  }

  returnLoan(loanId: number): Observable<LoanResponse> {
    return this.http.put<LoanResponse>(`/loans/${loanId}/return`);
  }
}
