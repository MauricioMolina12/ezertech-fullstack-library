import '@angular/compiler';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { lastValueFrom, of, throwError } from 'rxjs';

import { HttpService, toApiError } from './http.service';

describe('toApiError', () => {
  it('uses the server body message when present', () => {
    const error = new HttpErrorResponse({ status: 404, error: { message: 'Libro no encontrado' } });
    expect(toApiError(error)).toEqual({ status: 404, message: 'Libro no encontrado' });
  });

  it('falls back to the HTTP status when there is no message', () => {
    const error = new HttpErrorResponse({ status: 500, error: null });
    const apiError = toApiError(error);
    expect(apiError.status).toBe(500);
    expect(apiError.message).toContain('500');
  });

  it('handles client-side network errors', () => {
    const error = new HttpErrorResponse({ error: new ErrorEvent('NetworkError') });
    const apiError = toApiError(error);
    expect(apiError.status).toBe(0);
    expect(apiError.message).toContain('conectar');
  });
});

describe('HttpService', () => {
  const baseUrl = 'http://localhost:8080/api';

  function createService(getMock: (...args: unknown[]) => unknown) {
    const http = {
      get: vi.fn(getMock),
      post: vi.fn(() => of({})),
      put: vi.fn(() => of({})),
      delete: vi.fn(() => of({})),
    } as unknown as HttpClient;
    return { service: new HttpService(http), http };
  }

  it('prepends the API base URL to requests', async () => {
    const { service, http } = createService(() => of({ data: 1 }));

    const response = await lastValueFrom(service.get('/books'));

    expect((response as { data: number }).data).toBe(1);
    expect(http.get).toHaveBeenCalledWith(`${baseUrl}/books`, expect.anything());
  });

  it('normalizes HTTP errors to ApiError', async () => {
    const { service } = createService(() =>
      throwError(() => new HttpErrorResponse({ status: 401, error: { message: 'No autorizado' } }))
    );

    await expect(lastValueFrom(service.get('/books'))).rejects.toEqual({
      status: 401,
      message: 'No autorizado',
    });
  });

  it('sends query params on GET requests', async () => {
    const { service, http } = createService(() => of([]));

    await lastValueFrom(service.get('/books', { search: 'borges', available: true }));

    expect(http.get).toHaveBeenCalledWith(`${baseUrl}/books`, expect.anything());
  });
});
