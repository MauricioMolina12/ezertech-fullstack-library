import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { Role } from '../../shared/enums/role.enum';
import { AuthStore } from '../../features/auth/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly menuToggle = output<void>();

  protected readonly pageTitle = signal('Biblioteca');
  protected readonly user = computed(() => this.authStore.user());
  protected readonly initials = computed(() => {
    const name = this.authStore.user()?.name?.trim() ?? 'U';
    const parts = name.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase() || 'U';
  });
  protected readonly roleLabel = computed(() => {
    const role = this.authStore.user()?.role;
    if (role === Role.ADMIN) {
      return 'Administrador';
    }
    if (role === Role.LIBRARIAN) {
      return 'Bibliotecario';
    }
    return 'Usuario';
  });

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.pageTitle.set(this.getDeepestTitle(this.router.routerState.root));
      });
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  private getDeepestTitle(route: ActivatedRoute): string {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return (current.snapshot.data['title'] as string | undefined) ?? 'Biblioteca';
  }
}
