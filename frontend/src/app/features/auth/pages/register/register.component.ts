import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError } from '../../../../core/services/http.service';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { Role } from '../../../../shared/enums/role.enum';
import { RegisterRequest } from '../../models/auth.model';
import { AuthStore } from '../../auth.store';

/** Valida que `password` y `confirmPassword` coincidan dentro del FormGroup. */
export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    ErrorMessageComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly form: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator() }
  );

  protected readonly hidePassword = signal(true);
  protected readonly hideConfirmPassword = signal(true);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue() as { name: string; email: string; password: string };
    const payload: RegisterRequest = {
      name: raw.name,
      email: raw.email,
      password: raw.password,
      // Los auto-registros SIEMPRE se crean como LIBRARIAN, nunca como ADMIN.
      // La autoridad del rol debe estar en el backend: este campo no debe
      // poder escalar a ADMIN desde el cliente.
      role: Role.LIBRARIAN,
    };

    this.authStore
      .register(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Cuenta creada correctamente. Inicia sesión.', 'Cerrar', {
            duration: 4000,
          });
          this.router.navigate(['/login']);
        },
        error: (registerError: ApiError) => this.error.set(registerError.message),
      });
  }
}
