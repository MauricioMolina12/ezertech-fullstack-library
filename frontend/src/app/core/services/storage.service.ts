import { Injectable } from '@angular/core';

/**
 * Abstracción sobre `localStorage` para poder testear y centralizar
 * el acceso al almacenamiento del navegador.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  getJson<T>(key: string): T | null {
    const raw = this.get(key);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      console.error(`[StorageService] No se pudo parsear el valor almacenado bajo "${key}".`);
      return null;
    }
  }

  setJson<T>(key: string, value: T): void {
    this.set(key, JSON.stringify(value));
  }
}
