import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor global de errores.
 *
 * Centraliza el log de errores HTTP (los 401 los gestiona `authInterceptor`).
 * Los errores nunca se tragan: siempre se re-emiten para que la capa de
 * presentación los muestre.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        console.error(
          `[HTTP ${error.status ?? 'RED'}] ${req.method} ${req.urlWithParams}`,
          error.error ?? error.message
        );
      }
      return throwError(() => error);
    })
  );
};
