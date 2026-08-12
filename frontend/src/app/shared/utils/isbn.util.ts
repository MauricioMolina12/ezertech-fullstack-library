/**
 * Normaliza un ISBN eliminando espacios, guiones y otros separadores,
 * conservando dígitos y la `X` final de los ISBN-10.
 */
export function normalizeIsbn(isbn: string): string {
  return isbn.replace(/[^0-9Xx]/g, '');
}
