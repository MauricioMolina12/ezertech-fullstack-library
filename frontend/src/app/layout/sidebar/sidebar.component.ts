import { Component, computed, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PermissionsService } from '../../core/rbac/permissions.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  /** Coincidencia exacta de URL (evita que /admin se active en /admin/users). */
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly permissions = inject(PermissionsService);

  readonly navigate = output<void>();

  /** Navegación basada en permisos (no en roles): añadir roles no toca este código. */
  protected readonly navItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [];

    if (this.permissions.can('dashboard.view')) {
      items.push({ label: 'Dashboard', icon: 'dashboard', route: '/admin', exact: true });
    }

    items.push({ label: 'Catálogo', icon: 'menu_book', route: '/catalog' });

    if (this.permissions.can('loans.view')) {
      items.push({ label: 'Mis préstamos', icon: 'swap_horiz', route: '/my-loans' });
    }

    items.push({ label: 'Mis reservas', icon: 'bookmark', route: '/my-reservations' });

    if (this.permissions.can('users.manage')) {
      items.push({ label: 'Usuarios', icon: 'group', route: '/admin/users', exact: true });
    }

    return items;
  });

  /** Opciones de routerLinkActive: exacto para ítems con sub-rutas (p. ej. /admin). */
  protected routerLinkActiveOptions(item: NavItem): { paths: 'exact' | 'subset' } {
    return { paths: item.exact ? 'exact' : 'subset' };
  };

  onNavigate(): void {
    this.navigate.emit();
  }
}
