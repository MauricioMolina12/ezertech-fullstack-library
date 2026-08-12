import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { Role } from '../../shared/enums/role.enum';
import { Permission } from '../rbac/permissions';
import { PermissionsService } from '../rbac/permissions.service';

/** Redirige al catálogo cuando el usuario no tiene el permiso/rol requerido. */
function redirectToCatalog(): UrlTree {
  return inject(Router).createUrlTree(['/catalog']);
}

/**
 * Guard de rol: permite acceder solo si el usuario tiene al menos uno de los
 * roles indicados.
 *
 * Uso: `canActivate: [roleGuard(Role.ADMIN)]`
 */
export function roleGuard(...allowedRoles: Role[]): CanActivateFn {
  return (): boolean | UrlTree => {
    const permissions = inject(PermissionsService);
    return permissions.hasRole(...allowedRoles) ? true : redirectToCatalog();
  };
}

/**
 * Guard de permiso: permite acceder solo si el rol actual tiene el permiso.
 *
 * Uso: `canActivate: [permissionGuard('users.manage')]`
 */
export function permissionGuard(permission: Permission): CanActivateFn {
  return (): boolean | UrlTree => {
    const permissions = inject(PermissionsService);
    return permissions.can(permission) ? true : redirectToCatalog();
  };
}
