import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthStore } from '../../features/auth/auth.store';

/**
 * Guard de rutas autenticadas.
 *
 * Protege `/catalog`, `/my-loans`, `/my-reservations` y `/admin`.
 * Si el usuario no tiene sesión activa, redirige a `/login` con `returnUrl`.
 */
export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
