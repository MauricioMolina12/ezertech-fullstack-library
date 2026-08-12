import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Encabezado de página reutilizable con icono, título y subtítulo. */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly icon = input<string>();
}
