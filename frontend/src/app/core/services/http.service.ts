import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { APP_CONFIG } from '../config/app.config';

/** Error normalizado que se propaga a los stores y componentes. */
export interface ApiError {
  status: number;
  message: string;
}

/** Normaliza cualquier HttpErrorResponse a un ApiError legible. */
export function toApiError(error: HttpErrorResponse): ApiError {
  if (error.error instanceof ErrorEvent) {
    // Error de red o del lado del cliente: el servidor nunca respondió.
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.',
    };
  }

  const body = error.error as { message?: string; error?: string } | null;
  const message = body?.message ?? body?.error ?? `Error ${error.status}: ${error.message}`;
  return { status: error.status, message };
}

/**
 * Servicio HTTP base.
 *
 * Toda llamada a la API pasa por aquí:
 * - Centraliza la URL base.
 * - Los errores HTTP NUNCA se ocultan: se normalizan a `ApiError` y se
 *   propagan hacia arriba para que cada store/componente los muestre.
 */
@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly baseUrl = APP_CONFIG.apiUrl;

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params: this.buildParams(params) })
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => toApiError(error))));
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${path}`, body ?? {})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => toApiError(error))));
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${path}`, body ?? {})
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => toApiError(error))));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${path}`)
      .pipe(catchError((error: HttpErrorResponse) => throwError(() => toApiError(error))));
  }

  private buildParams(params?: Record<string, string | number | boolean>): HttpParams | undefined {
    if (!params) {
      return undefined;
    }
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      httpParams = httpParams.set(key, String(value));
    }
    return httpParams;
  }
}
