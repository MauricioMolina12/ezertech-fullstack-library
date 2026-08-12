import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Mensaje de error reutilizable.
 * Los errores HTTP nunca se ocultan: cada pantalla los muestra con este componente.
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  readonly message = input.required<string>();
  readonly showRetry = input(true);
  readonly retryLabel = input('Reintentar');
  readonly retry = output<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
