import { permissionGuard } from './role.guard';

/**
 * Guard del dashboard (ADMIN y LIBRARIAN).
 * Definido en términos de permisos para mantener la lógica centralizada.
 */
export const adminGuard = permissionGuard('dashboard.view');
