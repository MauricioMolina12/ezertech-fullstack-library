import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthStore } from '../../features/auth/auth.store';

/** Impide que un usuario ya autenticado vuelva a la pantalla de login. */
export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return authStore.isAuthenticated() ? router.createUrlTree(['/catalog']) : true;
};
