import { Injectable, computed } from '@angular/core';

import { AuthStore } from '../../features/auth/auth.store';
import { Role } from '../../shared/enums/role.enum';
import { PERMISSIONS, Permission } from './permissions';

/**
 * Servicio central de permisos.
 *
 * Expone los permisos concedidos al rol del usuario autenticado y ayuda a
 * decidir qué mostrar en componentes, rutas, sidebar y navbar sin tener que
 * conocer los roles en cada lugar.
 */
@Injectable({ providedIn: 'root' })
export class PermissionsService {
  /** Permisos concedidos al rol actual (reactivo a cambios de sesión). */
  private readonly granted = computed<ReadonlySet<Permission>>(() => {
    const role = this.authStore.user()?.role;
    if (!role) {
      return new Set<Permission>();
    }
    return new Set(
      (Object.keys(PERMISSIONS) as Permission[]).filter((permission) =>
        (PERMISSIONS[permission] as readonly Role[]).includes(role)
      )
    );
  });

  /** Lista de permisos concedidos (útil para depuración o selectores). */
  readonly permissions = computed(() => [...this.granted()]);

  constructor(private readonly authStore: AuthStore) {}

  /** ¿El rol actual tiene el permiso indicado? */
  can(permission: Permission): boolean {
    return this.granted().has(permission);
  }

  /** ¿El rol actual tiene al menos uno de los permisos indicados? */
  canAny(...permissions: Permission[]): boolean {
    return permissions.some((permission) => this.can(permission));
  }

  /** ¿El rol actual tiene todos los permisos indicados? */
  canAll(...permissions: Permission[]): boolean {
    return permissions.every((permission) => this.can(permission));
  }

  /** ¿El rol actual pertenece a alguno de los roles indicados? */
  hasRole(...roles: Role[]): boolean {
    const role = this.authStore.user()?.role;
    return role != null && roles.includes(role);
  }
}
