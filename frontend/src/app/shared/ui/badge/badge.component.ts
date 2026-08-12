import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type BadgeColor = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Badge pill con código de color semántico. */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly color = input<BadgeColor>('neutral');
  readonly icon = input<string>();
}
