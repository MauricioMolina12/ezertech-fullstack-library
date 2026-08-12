import { addDays, formatDate, isBeforeToday, toLocalIsoDateTime } from './date.util';

describe('date.util', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isBeforeToday', () => {
    it('returns true when the date is before today', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-08-12T12:00:00'));
      expect(isBeforeToday('2026-08-11T23:59:59')).toBe(true);
    });

    it('returns false for today', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-08-12T12:00:00'));
      expect(isBeforeToday('2026-08-12T00:00:00')).toBe(false);
    });

    it('returns false for future dates', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-08-12T12:00:00'));
      expect(isBeforeToday('2026-08-13T00:00:00')).toBe(false);
    });

    it('returns false for invalid dates', () => {
      expect(isBeforeToday('not-a-date')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('formats an ISO date in Spanish (short month)', () => {
      expect(formatDate('2026-08-12T00:00:00').toLowerCase()).toContain('ago');
      expect(formatDate('2026-08-12T00:00:00')).toContain('2026');
    });

    it('returns an em dash for null / undefined / empty values', () => {
      expect(formatDate(null)).toBe('—');
      expect(formatDate(undefined)).toBe('—');
    });

    it('returns an em dash for invalid dates', () => {
      expect(formatDate('not-a-date')).toBe('—');
    });
  });

  describe('addDays', () => {
    it('adds days to a date', () => {
      const result = addDays(new Date(2026, 7, 12), 8);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(7);
      expect(result.getDate()).toBe(20);
    });

    it('does not mutate the original date', () => {
      const base = new Date(2026, 7, 12);
      addDays(base, 14);
      expect(base.getDate()).toBe(12);
    });
  });

  describe('toLocalIsoDateTime', () => {
    it('serializes a local date as YYYY-MM-DDTHH:mm:ss', () => {
      expect(toLocalIsoDateTime(new Date(2026, 7, 20, 0, 0, 0))).toBe('2026-08-20T00:00:00');
    });

    it('pads months, days, hours, minutes and seconds', () => {
      expect(toLocalIsoDateTime(new Date(2026, 0, 5, 9, 5, 7))).toBe('2026-01-05T09:05:07');
    });
  });
});
