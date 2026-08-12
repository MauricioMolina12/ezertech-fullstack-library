import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthStore } from '../../features/auth/auth.store';

/** Rutas que no deben disparar el cierre de sesión ante un 401. */
const AUTH_IGNORED_PATHS = ['/auth/login'];

/**
 * Interceptor JWT:
 *
 * - Adjunta `Authorization: Bearer <token>` a cada petición autenticada.
 * - Ante una respuesta 401 limpia la sesión y redirige a `/login`
 *   conservando la URL original como `returnUrl`.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const token = authStore.token();
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = AUTH_IGNORED_PATHS.some((path) => req.url.includes(path));

      if (error.status === 401 && !isAuthEndpoint) {
        authStore.logout();
        const returnUrl = router.url !== '/login' ? router.url : undefined;
        router.navigate(['/login'], { queryParams: returnUrl ? { returnUrl } : {} });
      }

      return throwError(() => error);
    })
  );
};
