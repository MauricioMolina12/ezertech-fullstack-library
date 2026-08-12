import { Role } from '../enums/role.enum';

/** DTO del backend: respuesta de usuario. */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
