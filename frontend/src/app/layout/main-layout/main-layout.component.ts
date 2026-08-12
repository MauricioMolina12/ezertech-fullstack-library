import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

/**
 * Layout principal autenticado: sidebar + navbar + contenido.
 * Responsive: sidebar fijo en escritorio (mode="side") y overlay en móvil.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, MatIconModule, NavbarComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  protected readonly desktop = signal(true);
  protected readonly sidenavOpened = signal(false);

  constructor() {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    this.desktop.set(mediaQuery.matches);
    mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
      this.desktop.set(event.matches);
      if (event.matches) {
        this.sidenavOpened.set(false);
      }
    });
  }

  onMenuToggle(): void {
    this.sidenavOpened.update((value) => !value);
  }
}
