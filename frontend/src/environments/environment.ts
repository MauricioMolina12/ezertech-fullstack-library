/**
 * Configuración global de entorno (producción).
 *
 * Con `ng serve` (configuración "development") este archivo se sustituye
 * automáticamente por `environment.development.ts` gracias a la opción
 * `fileReplacements` definida en angular.json.
 */
export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api',
};
