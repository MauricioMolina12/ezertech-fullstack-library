/**
 * Compara una fecha ISO contra hoy ignorando la hora.
 * Devuelve true si `dateIso` es anterior al día de hoy.
 */
export function isBeforeToday(dateIso: string): boolean {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() < today.getTime();
}

/** Suma días a una fecha (devuelve una nueva instancia). */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Serializa una fecha como `YYYY-MM-DDTHH:mm:ss` en hora LOCAL (sin `Z` ni milisegundos).
 * Útil para enviar fechas al backend con el formato `2026-08-20T00:00:00`.
 */
export function toLocalIsoDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

/** Formatea una fecha ISO a formato legible en español. */
export function formatDate(dateIso: string | null | undefined): string {
  if (!dateIso) {
    return '—';
  }
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}
