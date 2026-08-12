import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ApiError } from '../../../../core/services/http.service';
import { PermissionsService } from '../../../../core/rbac/permissions.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Role } from '../../../../shared/enums/role.enum';
import { UserResponse } from '../../../../shared/models/user.model';
import { BadgeComponent, BadgeColor } from '../../../../shared/ui/badge/badge.component';
import { formatDate } from '../../../../shared/utils/date.util';
import { AuthStore } from '../../../auth/auth.store';
import {
  UserEditDialogComponent,
  UserEditDialogData,
  UserEditDialogResult,
} from '../../components/user-edit-dialog/user-edit-dialog.component';
import { UsersFacade } from '../../users.facade';

const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.LIBRARIAN]: 'Bibliotecario',
};

const ROLE_COLORS: Record<Role, BadgeColor> = {
  [Role.ADMIN]: 'danger',
  [Role.LIBRARIAN]: 'info',
};

/**
 * Gestión de usuarios.
 * - ADMIN: editar y eliminar (permiso `users.manage`).
 * - LIBRARIAN: solo visualizar (permiso `users.view`).
 */
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    PageHeaderComponent,
    EmptyStateComponent,
    ErrorMessageComponent,
    BadgeComponent,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  protected readonly facade = inject(UsersFacade);
  protected readonly permissions = inject(PermissionsService);
  private readonly authStore = inject(AuthStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly displayedColumns = ['id', 'name', 'email', 'role', 'createdAt', 'actions'];

  ngOnInit(): void {
    if (!this.facade.loading() && this.facade.users().length === 0 && !this.facade.error()) {
      this.facade.loadUsers();
    }
  }

  roleLabel(role: Role): string {
    return ROLE_LABELS[role];
  }

  roleColor(role: Role): BadgeColor {
    return ROLE_COLORS[role];
  }

  formatDate(dateIso: string): string {
    return formatDate(dateIso);
  }

  /** ¿Es la cuenta del usuario autenticado? (no se permite auto-eliminarse) */
  isSelf(user: UserResponse): boolean {
    return this.authStore.user()?.id === user.id;
  }

  openEdit(user: UserResponse): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '440px',
      data: { user } satisfies UserEditDialogData,
    });

    dialogRef.afterClosed().subscribe((result: UserEditDialogResult | undefined) => {
      if (!result) {
        return;
      }

      this.facade.updateUser(user.id, result).subscribe({
        next: () =>
          this.snackBar.open(`Usuario "${result.name}" actualizado`, 'Cerrar', {
            duration: 3000,
          }),
        error: (error: ApiError) =>
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 }),
      });
    });
  }

  confirmDelete(user: UserResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Eliminar usuario',
        message: `¿Seguro que deseas eliminar a "${user.name}" (${user.email})? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
      } satisfies ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        return;
      }

      this.facade.deleteUser(user.id).subscribe({
        next: () =>
          this.snackBar.open(`Usuario "${user.name}" eliminado`, 'Cerrar', {
            duration: 3000,
          }),
        error: (error: ApiError) =>
          this.snackBar.open(error.message, 'Cerrar', { duration: 5000 }),
      });
    });
  }
}
