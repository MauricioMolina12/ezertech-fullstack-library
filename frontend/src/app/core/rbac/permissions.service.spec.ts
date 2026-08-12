import '@angular/compiler';
import { PermissionsService } from './permissions.service';
import { Role } from '../../shared/enums/role.enum';

function createPermissions(role: Role | undefined): PermissionsService {
  const authStore = {
    user: () =>
      role ? { id: 1, name: 'Ana Torres', email: 'ana@test.com', role } : null,
  };
  return new PermissionsService(authStore as never);
}

describe('PermissionsService', () => {
  it('grants ADMIN the full administrative permission set', () => {
    const service = createPermissions(Role.ADMIN);
    expect(service.can('dashboard.view')).toBe(true);
    expect(service.can('stats.general')).toBe(true);
    expect(service.can('stats.library')).toBe(true);
    expect(service.can('users.manage')).toBe(true);
    expect(service.can('books.manage')).toBe(true);
    expect(service.can('books.loan')).toBe(true);
    expect(service.can('books.reserve')).toBe(true);
    expect(service.can('loans.view')).toBe(true);
  });

  it('grants LIBRARIAN reserve/loan but not book creation or sensitive admin options', () => {
    const service = createPermissions(Role.LIBRARIAN);
    expect(service.can('dashboard.view')).toBe(true);
    expect(service.can('stats.library')).toBe(true);
    expect(service.can('books.loan')).toBe(true);
    expect(service.can('books.reserve')).toBe(true);
    expect(service.can('loans.view')).toBe(true);
    expect(service.can('users.view')).toBe(true);
    expect(service.can('books.manage')).toBe(false);
    expect(service.can('users.manage')).toBe(false);
    expect(service.can('stats.general')).toBe(false);
  });

  it('denies everything when there is no authenticated user', () => {
    const service = createPermissions(undefined);
    expect(service.can('dashboard.view')).toBe(false);
    expect(service.canAny('users.manage', 'books.manage')).toBe(false);
    expect(service.canAll('dashboard.view', 'loans.view')).toBe(false);
  });

  it('hasRole checks role membership', () => {
    const admin = createPermissions(Role.ADMIN);
    expect(admin.hasRole(Role.ADMIN)).toBe(true);
    expect(admin.hasRole(Role.LIBRARIAN)).toBe(false);
  });

  it('exposes the granted permission list', () => {
    const service = createPermissions(Role.LIBRARIAN);
    expect(service.permissions()).toContain('books.manage');
    expect(service.permissions()).toContain('loans.view');
    expect(service.permissions()).not.toContain('users.manage');
    expect(service.permissions()).not.toContain('stats.general');
  });
});
