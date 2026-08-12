import { Component, computed, input } from '@angular/core';

import { LoanStatus } from '../../enums/loan-status.enum';
import { BadgeComponent, BadgeColor } from '../../ui/badge/badge.component';

const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  [LoanStatus.ACTIVE]: 'Activo',
  [LoanStatus.RETURNED]: 'Devuelto',
  [LoanStatus.OVERDUE]: 'Vencido',
};

const LOAN_STATUS_COLORS: Record<LoanStatus, BadgeColor> = {
  [LoanStatus.ACTIVE]: 'info',
  [LoanStatus.RETURNED]: 'neutral',
  [LoanStatus.OVERDUE]: 'danger',
};

@Component({
  selector: 'app-loan-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './loan-status-badge.component.html',
  styleUrl: './loan-status-badge.component.scss',
})
export class LoanStatusBadgeComponent {
  readonly status = input.required<LoanStatus>();

  protected readonly label = computed(() => LOAN_STATUS_LABELS[this.status()]);
  protected readonly color = computed(() => LOAN_STATUS_COLORS[this.status()]);
}
