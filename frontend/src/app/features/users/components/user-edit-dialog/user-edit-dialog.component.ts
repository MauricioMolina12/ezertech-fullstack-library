import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Role } from '../../../../shared/enums/role.enum';
import { UserResponse } from '../../../../shared/models/user.model';
import { ROLE_OPTIONS } from '../../models/role-options';

export interface UserEditDialogData {
  user: UserResponse;
}

export interface UserEditDialogResult {
  name: string;
  email: string;
  role: Role;
}

/** Diálogo para editar un usuario (name, email, role). */
@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss',
})
export class UserEditDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserEditDialogComponent>);
  protected readonly data = inject<UserEditDialogData>(MAT_DIALOG_DATA);
  protected readonly roleOptions = ROLE_OPTIONS;

  protected readonly form: FormGroup = this.fb.group({
    name: [this.data.user.name, [Validators.required]],
    email: [this.data.user.email, [Validators.required, Validators.email]],
    role: [this.data.user.role, [Validators.required]],
  });

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const result: UserEditDialogResult = this.form.getRawValue();
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
