# Biblioteca Digital — Frontend (Angular 21)

Frontend de la prueba técnica de biblioteca digital. Consume las APIs REST reales del backend
Spring Boot en `http://localhost:8080/api`.

## Stack

- Angular 21 (standalone components, sin NgModules de features)
- Angular Signals para manejo de estado (sin NgRx)
- Angular Material (M3, tema violeta personalizado)
- SCSS + CSS variables
- Angular Router (con `withComponentInputBinding`)
- HttpClient + interceptores funcionales
- Reactive Forms
- Guards de rutas (auth por sesión + rol para `/admin`)

## Requisitos

- Node 20+
- Backend Spring Boot levantado en `http://localhost:8080`

## Instalación y ejecución

```bash
npm install
npm start        # http://localhost:4200
npm run build    # build de producción
npm test         # tests unitarios (vitest)
npm run test:watch
```

La URL base de la API está en `src/environments/environment.ts`
(se sustituye por `environment.development.ts` al usar `ng serve`).

## RBAC (roles y permisos)

La autorización se resuelve en un solo lugar, sin validaciones de rol dispersas en los componentes:

- `core/rbac/permissions.ts` — **registro central**: mapea cada rol a su conjunto de permisos.
  Añadir un nuevo rol = añadir su entrada aquí (y nada más).
- `core/rbac/permissions.service.ts` — `PermissionsService`: `can()` / `canAny()` / `canAll()` /
  `hasRole()` sobre el rol del `AuthStore`. Reactivo con Signals.
- `core/guards/role.guard.ts` — factories: `roleGuard(...roles)` y `permissionGuard(...)`.

| Permiso | ADMIN | LIBRARIAN |
| --- | --- | --- |
| `dashboard.view` | ✅ | ✅ |
| `stats.general` (GET /api/dashboard/stats) | ✅ | ❌ |
| `stats.library` (GET /api/users/{id}/stats) | ✅ | ✅ |
| `users.manage` | ✅ | ❌ |
| `books.manage` (crear/editar) | ✅ | ❌ |
| `books.loan` (prestar) | ✅ | ✅ |
| `books.reserve` (reservar) | ✅ | ✅ |
| `loans.view` | ✅ | ✅ |

> **Seguridad de roles**: los usuarios creados desde `/register` se envían con
> `role: 'LIBRARIAN'`. El backend debe tratarlo como un valor de confianza NO
> escalable: asignar LIBRARIAN a los auto-registros e ignorar cualquier `ADMIN`
> recibido del cliente. La elevación de rol solo la hace un ADMIN.

**Gestión de usuarios** (`/admin/users`): **solo ADMIN** (guard `roleGuard(Role.ADMIN)` /
permiso `users.manage`). Un LIBRARIAN o usuario no autenticado es redirigido a `/catalog`
y el enlace del menú no se muestra (validación del guard aunque se escriba la URL a mano).

Ejemplos de uso:

```ts
// Rutas
{ path: 'admin', component: DashboardComponent, canActivate: [permissionGuard('dashboard.view')] },
{ path: 'admin/users', component: UserManagementComponent, canActivate: [permissionGuard('users.manage')] },

// Sidebar / navbar (mostrar u ocultar opciones)
@if (permissions.can('users.manage')) { <a routerLink="/admin/users">Usuarios</a> }

// En componentes: nunca se pregunta por el rol, siempre por el permiso.
```

## Reservas (cola de espera)

Reglas de negocio implementadas en el catálogo:

- **AVAILABLE** → botón **"Prestar"** (si `books.loan`).
- **LOANED** → botón **"Reservar"** (si `books.reserve`).
- **RESERVED** → botón **"Unirse a la cola"** + hint "En cola". El libro queda como
  reservado cuando al devolverse existen reservas activas (lo mantiene el backend).
- El usuario con reserva activa (PENDING/NOTIFIED) ve el chip **"Reserva realizada"**
  (deshabilitado); si su reserva fue notificada (es el primero de la cola), el chip
  cambia a **"Libro disponible para ti"**.

El estado de reservas del usuario se consulta con `GET /api/reservations/user/{userId}`
y se sincroniza tras cada operación. `isActiveReservation()` considera activas solo
PENDING y NOTIFIED (CANCELLED/FULFILLED no ocupan lugar en la cola).

> La **notificación al primer usuario de la cola** (correo/email) es responsabilidad
> del backend; el frontend refleja el estado NOTIFIED.

## Estructura

```
src/app/
├── core/
│   ├── rbac/                  # permissions.ts + permissions.service.ts
│   ├── guards/                # auth, role (roleGuard/permissionGuard), guest
│   ├── interceptors/          # auth (JWT + 401), error
│   └── services/              # http.service (base), storage.service
├── shared/
│   ├── components/            # page-header, empty-state, error-message, badges, confirm-dialog
│   ├── enums/                 # Role, BookStatus, LoanStatus, ReservationStatus
│   ├── models/                # UserResponse, Book, LoanResponse, ReservationResponse
│   ├── ui/                    # badge, spinner, skeleton
│   └── utils/                 # date.util, isbn.util
├── features/                  # Un módulo lógico por dominio
│   ├── auth/                  # login, register, auth.store
│   ├── books/                 # catalog, book-form, books.store
│   ├── loans/                 # my-loans, loan-dialog, loans.store
│   ├── reservations/          # my-reservations, reservations.store
│   ├── users/                 # user-management, users.facade, users.store, user-edit-dialog
│   └── admin/                 # dashboard, admin.store
└── layout/                    # main-layout, navbar, sidebar
```

Cada feature sigue el patrón **service.ts + store.ts (Signals)**: el service solo llama a la API
y el store mantiene `data`, `loading` y `error` (los errores HTTP nunca se ocultan).

## Tests

Suite unitaria con **Vitest + jsdom** (`vitest.config.ts`). Cubre la lógica de negocio:

- `shared/utils/date.util.spec.ts` — detección de vencidos y formato de fechas.
- `core/services/http.service.spec.ts` — URL base, parámetros y normalización de errores.
- `features/auth/auth.store.spec.ts` — login, persistencia, hidratación, logout y fallos.
- `features/books/books.store.spec.ts` — carga, filtros (texto/estado) y errores.
- `features/loans/loans.store.spec.ts` — carga y detección de préstamos vencidos.
- `features/reservations/reservations.store.spec.ts` — creación y cancelación de reservas.

> Los specs que importan código Angular cargan `@angular/compiler` primero para habilitar el
> compilador JIT, ya que la suite se ejecuta con vitest directo (el runner `ng test` de Angular
> puede colgarse en algunos entornos).

## Endpoints consumidos

| Acción | Endpoint |
| --- | --- |
| Login | `POST /api/auth/login` |
| Registrar cuenta | `POST /api/auth/register` (body `{ name, email, password, role: 'LIBRARIAN' }`) |
| Perfil del usuario | `GET /api/users/{userId}` (enriquece rol; no bloquea el login si falla) |
| Estadísticas de usuario | `GET /api/users/{userId}/stats` (`totalLoans`, `activeLoans`, `returnedLoans`, `overdueLoans`) |
| Listar libros | `GET /api/books` |
| Obtener libro | `GET /api/books/{id}` |
| Autocompletar ISBN | `GET /api/books/isbn/{isbn}` |
| Crear libro | `POST /api/books` |
| Actualizar libro | `PUT /api/books/{id}` |
| Eliminar libro | `DELETE /api/books/{id}` |
| Préstamos del usuario | `GET /api/loans/user/{userId}` |
| Crear préstamo | `POST /api/loans` (body `{ userId, bookId, dueDate }`; la fecha de vencimiento se elige en el diálogo) |
| Devolver préstamo | `PUT /api/loans/{id}/return` |
| Crear reserva | `POST /api/reservations` (asumido) |
| Reservas del usuario | `GET /api/reservations/user/{userId}` (asumido) |
| Cancelar reserva | `DELETE /api/reservations/{id}` (asumido) |
| Dashboard | `GET /api/dashboard/stats` |
| Gestión de usuarios | `GET /api/users` |
| Editar usuario | `PUT /api/users/{id}` (body `{ name, email, role }`) |
| Eliminar usuario | `DELETE /api/users/{id}` |

> Los endpoints marcados como *asumido* no estaban documentados en la consigna; si tu backend
> usa otra ruta, basta ajustar los métodos de los services en `features/reservations`.

## Notas de diseño

- El JWT se guarda en `localStorage`; el `AuthStore` (Signals) restaura la sesión al recargar.
- El interceptor de auth agrega `Authorization: Bearer <token>` y, ante un 401, cierra la sesión
  y redirige a `/login` con `returnUrl`.
- `/catalog`, `/my-loans`, `/my-reservations` y `/admin` están protegidos por `authGuard`.
- `/admin` además exige rol `ADMIN` o `LIBRARIAN` (`adminGuard`). El rol se obtiene de
  `GET /api/users/{id}` tras el login.
- La **devolución sigue disponible para préstamos vencidos** (estado `OVERDUE` o activo con
  `dueDate < hoy`): al devolver, el backend registra el atraso del usuario y evalúa bloqueos.
- El backend debe permitir CORS hacia `http://localhost:4200` (o usar un proxy en desarrollo).

