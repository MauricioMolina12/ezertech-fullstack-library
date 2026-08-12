import { Routes } from '@angular/router';

import { permissionGuard, roleGuard } from './core/guards/role.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Role } from './shared/enums/role.enum';
import { AdminDashboardComponent } from './features/admin/pages/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { BookFormComponent } from './features/books/pages/book-form/book-form.component';
import { CatalogComponent } from './features/books/pages/catalog/catalog.component';
import { MyLoansComponent } from './features/loans/pages/my-loans/my-loans.component';
import { MyReservationsComponent } from './features/reservations/pages/my-reservations/my-reservations.component';
import { UserManagementComponent } from './features/users/pages/user-management/user-management.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NotFoundComponent } from './layout/not-found/not-found.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'catalog' },
      { path: 'catalog', component: CatalogComponent, data: { title: 'Catálogo' } },
      {
        path: 'catalog/new',
        component: BookFormComponent,
        canActivate: [permissionGuard('books.manage')],
        data: { title: 'Nuevo libro' },
      },
      {
        path: 'catalog/:id/edit',
        component: BookFormComponent,
        canActivate: [permissionGuard('books.manage')],
        data: { title: 'Editar libro' },
      },
      { path: 'my-loans', component: MyLoansComponent, data: { title: 'Mis préstamos' } },
      { path: 'my-reservations', component: MyReservationsComponent, data: { title: 'Mis reservas' } },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [permissionGuard('dashboard.view')],
        data: { title: 'Dashboard' },
      },
      {
        path: 'admin/users',
        component: UserManagementComponent,
        canActivate: [roleGuard(Role.ADMIN)],
        data: { title: 'Gestión de usuarios' },
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

