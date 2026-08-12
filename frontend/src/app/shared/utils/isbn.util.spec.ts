import { normalizeIsbn } from './isbn.util';

describe('isbn.util', () => {
  it('removes hyphens and spaces from ISBN-13', () => {
    expect(normalizeIsbn('978-0307-474728')).toBe('9780307474728');
  });

  it('keeps the trailing X of ISBN-10', () => {
    expect(normalizeIsbn('0307 4747 28X')).toBe('0307474728X');
  });

  it('returns an empty string when there are no digits', () => {
    expect(normalizeIsbn('---')).toBe('');
    expect(normalizeIsbn('')).toBe('');
  });

  it('leaves already normalized values unchanged', () => {
    expect(normalizeIsbn('9780307474728')).toBe('9780307474728');
  });
});
