import { environment } from '../../../environments/environment';

/**
 * Configuración centralizada de la aplicación.
 * Todas las constantes relevantes viven aquí para evitar dispersión.
 */
export const APP_CONFIG = {
  apiUrl: environment.apiUrl,
  tokenStorageKey: 'library.auth.token',
  userStorageKey: 'library.auth.user',
} as const;
