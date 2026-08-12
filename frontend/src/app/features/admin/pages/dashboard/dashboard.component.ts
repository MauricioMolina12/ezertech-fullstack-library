import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SkeletonCardComponent } from '../../../../shared/ui/skeleton/skeleton-card.component';
import { PermissionsService } from '../../../../core/rbac/permissions.service';
import { AdminStore } from '../../../admin/admin.store';
import { AuthStore } from '../../../auth/auth.store';
import { UsersStore } from '../../../users/users.store';

interface StatCard {
  key: string;
  label: string;
  icon: string;
  color: string;
}

/** Estadísticas generales de la biblioteca (GET /api/dashboard/stats). */
const STAT_CARDS: StatCard[] = [
  { key: 'totalBooks', label: 'Total de libros', icon: 'menu_book', color: '#7c3aed' },
  { key: 'availableBooks', label: 'Disponibles', icon: 'check_circle', color: '#16a34a' },
  { key: 'loanedBooks', label: 'Prestados', icon: 'swap_horiz', color: '#2563eb' },
  { key: 'reservedBooks', label: 'Reservados', icon: 'bookmark', color: '#d97706' },
  { key: 'totalUsers', label: 'Usuarios', icon: 'group', color: '#0d9488' },
  { key: 'activeLoans', label: 'Préstamos activos', icon: 'local_library', color: '#4f46e5' },
  { key: 'overdueLoans', label: 'Préstamos vencidos', icon: 'warning_amber', color: '#dc2626' },
];

/** Estadísticas de actividad del usuario (GET /api/users/{id}/stats). */
const ACTIVITY_CARDS: StatCard[] = [
  { key: 'totalLoans', label: 'Total de préstamos', icon: 'local_library', color: '#7c3aed' },
  { key: 'activeLoans', label: 'Préstamos activos', icon: 'swap_horiz', color: '#2563eb' },
  { key: 'returnedLoans', label: 'Devueltos', icon: 'assignment_return', color: '#16a34a' },
  { key: 'overdueLoans', label: 'Vencidos', icon: 'warning_amber', color: '#dc2626' },
];

/**
 * Dashboard por rol.
 *
 * Cada sección se muestra según permisos (PermissionsService), nunca según
 * validaciones de rol dispersas en el componente:
 * - ADMIN:     estadísticas generales + actividad + gestión de usuarios/libros.
 * - LIBRARIAN: estadísticas de actividad + gestión de libros/préstamos.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    SkeletonCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  protected readonly store = inject(AdminStore);
  protected readonly usersStore = inject(UsersStore);
  protected readonly permissions = inject(PermissionsService);
  private readonly authStore = inject(AuthStore);

  protected readonly statCards = STAT_CARDS;
  protected readonly activityCards = ACTIVITY_CARDS;

  /** Porcentajes para el resumen de inventario por estado. */
  protected readonly totalBooks = computed(() => this.store.stats()?.totalBooks ?? 0);
  protected readonly availablePercent = computed(() => this.percentOf('availableBooks'));
  protected readonly loanedPercent = computed(() => this.percentOf('loanedBooks'));
  protected readonly reservedPercent = computed(() => this.percentOf('reservedBooks'));

  ngOnInit(): void {
    if (this.permissions.can('stats.general') && !this.store.stats() && !this.store.error()) {
      this.store.loadStats();
    }

    this.loadActivityStats();
  }

  protected loadActivityStats(): void {
    const user = this.authStore.user();
    if (user && this.permissions.can('stats.library')) {
      this.usersStore.loadStats(user.id);
    }
  }

  valueOf(key: string): number {
    const stats = this.store.stats();
    if (!stats) {
      return 0;
    }
    return (stats as unknown as Record<string, number>)[key] ?? 0;
  }

  activityValue(key: string): number {
    const stats = this.usersStore.stats();
    if (!stats) {
      return 0;
    }
    return (stats as unknown as Record<string, number>)[key] ?? 0;
  }

  private percentOf(key: string): number {
    const stats = this.store.stats();
    if (!stats || stats.totalBooks === 0) {
      return 0;
    }
    const value = (stats as unknown as Record<string, number>)[key] ?? 0;
    return Math.min(100, Math.round((value / stats.totalBooks) * 100));
  }
}
