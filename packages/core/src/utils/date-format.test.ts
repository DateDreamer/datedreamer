import { describe, it, expect } from 'vitest';
import { parseDate, formatDate, detectFormat, isSameDay, isDateInRange } from './date-format';

describe('parseDate', () => {
  it('parses YYYY-MM-DD format', () => {
    const result = parseDate('2024-03-15');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(2); // March is 0-indexed
    expect(result!.getDate()).toBe(15);
  });

  it('parses DD/MM/YYYY format', () => {
    const result = parseDate('15/03/2024');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(15);
  });

  it('parses DD.MM.YYYY format', () => {
    const result = parseDate('15.03.2024');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(15);
  });

  it('parses MM-DD-YYYY format', () => {
    const result = parseDate('03-15-2024');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2024);
    expect(result!.getMonth()).toBe(2);
    expect(result!.getDate()).toBe(15);
  });

  it('returns null for invalid input', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('not-a-date')).toBeNull();
    expect(parseDate('   ')).toBeNull();
  });
});

describe('formatDate', () => {
  const date = new Date(2024, 2, 15); // March 15, 2024

  it('formats as YYYY-MM-DD by default', () => {
    expect(formatDate(date)).toBe('2024-03-15');
  });

  it('formats as DD/MM/YYYY', () => {
    expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/03/2024');
  });

  it('formats as DD.MM.YYYY', () => {
    expect(formatDate(date, 'DD.MM.YYYY')).toBe('15.03.2024');
  });

  it('formats as MM-DD-YYYY', () => {
    expect(formatDate(date, 'MM-DD-YYYY')).toBe('03-15-2024');
  });
});

describe('detectFormat', () => {
  it('detects YYYY-MM-DD', () => {
    expect(detectFormat('2024-03-15')).toBe('YYYY-MM-DD');
  });

  it('detects DD/MM/YYYY', () => {
    expect(detectFormat('15/03/2024')).toBe('DD/MM/YYYY');
  });

  it('detects DD.MM.YYYY', () => {
    expect(detectFormat('15.03.2024')).toBe('DD.MM.YYYY');
  });

  it('returns null for unrecognized format', () => {
    expect(detectFormat('not-a-date')).toBeNull();
  });
});

describe('isSameDay', () => {
  it('returns true for same calendar day', () => {
    const a = new Date(2024, 2, 15, 10, 30);
    const b = new Date(2024, 2, 15, 14, 45);
    expect(isSameDay(a, b)).toBe(true);
  });

  it('returns false for different days', () => {
    const a = new Date(2024, 2, 15);
    const b = new Date(2024, 2, 16);
    expect(isSameDay(a, b)).toBe(false);
  });

  it('returns false for different months', () => {
    const a = new Date(2024, 2, 15);
    const b = new Date(2024, 3, 15);
    expect(isSameDay(a, b)).toBe(false);
  });
});

describe('isDateInRange', () => {
  it('returns true for date within range', () => {
    const start = new Date(2024, 2, 1);
    const end = new Date(2024, 2, 31);
    expect(isDateInRange(new Date(2024, 2, 15), start, end)).toBe(true);
  });

  it('returns true for boundary dates', () => {
    const start = new Date(2024, 2, 1);
    const end = new Date(2024, 2, 31);
    expect(isDateInRange(start, start, end)).toBe(true);
    expect(isDateInRange(end, start, end)).toBe(true);
  });

  it('returns false for date outside range', () => {
    const start = new Date(2024, 2, 1); // March 1
    const end = new Date(2024, 2, 31);  // March 31
    expect(isDateInRange(new Date(2024, 1, 15), start, end)).toBe(false); // Feb 15
    expect(isDateInRange(new Date(2024, 4, 1), start, end)).toBe(false);  // May 1
  });
});
