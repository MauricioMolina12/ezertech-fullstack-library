import { Role } from '../../../shared/enums/role.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

/**
 * Petición de registro (POST /api/auth/register).
 *
 * `role` se envía como LIBRARIAN para auto-registros.
 *
 * NOTA DE SEGURIDAD: la autoridad del rol debe vivir en el backend. El backend
 * debe asignar LIBRARIAN (o el rol menos privilegiado) a los auto-registros y
 * NUNCA aceptar ADMIN desde el cliente.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

/** Respuesta de registro (asumida). */
export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

/**
 * Usuario de sesión.
 * El `role` se completa con GET /users/{id} cuando el endpoint está disponible;
 * mientras tanto la sesión funciona solo con los datos del login.
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}
