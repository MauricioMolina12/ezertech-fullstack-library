import { Role } from '../../shared/enums/role.enum';

/**
 * Registro central de permisos por rol.
 *
 * Para añadir un nuevo rol en el futuro basta con agregarlo aquí:
 * cada rol se mapea al conjunto de permisos que le corresponde.
 * NINGÚN componente debe validar roles directamente; siempre se usa
 * PermissionsService.can(...) o los guards.
 */
export const PERMISSIONS = {
  /** Acceso al dashboard. */
  'dashboard.view': [Role.ADMIN, Role.LIBRARIAN],
  /** Estadísticas generales de la biblioteca (GET /api/dashboard/stats). */
  'stats.general': [Role.ADMIN],
  /** Estadísticas de actividad del usuario (GET /api/users/{id}/stats). */
  'stats.library': [Role.ADMIN, Role.LIBRARIAN],
  /** Gestión de usuarios (solo ADMIN). */
  'users.manage': [Role.ADMIN],
  /** Crear/editar libros: SOLO ADMIN. */
  'books.manage': [Role.ADMIN],
  /** Prestar libros (crear préstamo). */
  'books.loan': [Role.ADMIN, Role.LIBRARIAN],
  /** Reservar libros (crear reserva). */
  'books.reserve': [Role.ADMIN, Role.LIBRARIAN],
  /** Consulta de préstamos. */
  'loans.view': [Role.ADMIN, Role.LIBRARIAN],
} as const;

export type Permission = keyof typeof PERMISSIONS;
