import { Role } from '../../../shared/enums/role.enum';

/** Opciones de rol para selects y badges. */
export const ROLE_OPTIONS: ReadonlyArray<{ value: Role; label: string }> = [
  { value: Role.ADMIN, label: 'Administrador' },
  { value: Role.LIBRARIAN, label: 'Bibliotecario' },
];
