import { Role } from '../../../shared/enums/role.enum';

/** Payload para PUT /api/users/{id}. */
export interface UpdateUserRequest {
  name: string;
  email: string;
  role: Role;
}
