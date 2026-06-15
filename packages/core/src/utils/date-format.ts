/**
 * Date formatting and parsing utilities for DateDreamer.
 * Supports multiple input formats: DD/MM/YYYY, YYYY-MM-DD, DD.MM.YYYY, MM-DD-YYYY
 */

export type DateFormat = 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD.MM.YYYY' | 'MM-DD-YYYY';

const FORMAT_PATTERNS: Array<{ format: DateFormat; regex: RegExp }> = [
  { format: 'YYYY-MM-DD', regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/ },
  { format: 'DD/MM/YYYY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/ },
  { format: 'DD.MM.YYYY', regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/ },
  { format: 'MM-DD-YYYY', regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/ },
];

/**
 * Parse a date string in one of the supported formats.
 * Returns null if parsing fails.
 */
export function parseDate(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try native ISO first (YYYY-MM-DD or full ISO string)
  const native = new Date(trimmed);
  if (!isNaN(native.getTime())) {
    return native;
  }

  for (const { format, regex } of FORMAT_PATTERNS) {
    const match = trimmed.match(regex);
    if (match) {
      const [, a, b, year] = match;
      let day: number, month: number;

      switch (format) {
        case 'YYYY-MM-DD':
          day = parseInt(a, 10);
          month = parseInt(b, 10) - 1;
          break;
        case 'DD/MM/YYYY':
        case 'DD.MM.YYYY':
          day = parseInt(a, 10);
          month = parseInt(b, 10) - 1;
          break;
        case 'MM-DD-YYYY':
          month = parseInt(a, 10) - 1;
          day = parseInt(b, 10);
          break;
      }

      const date = new Date(parseInt(year, 10), month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

/**
 * Format a Date object to the specified format string.
 */
export function formatDate(date: Date, format: DateFormat = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MM-DD-YYYY':
      return `${month}-${day}-${year}`;
    case 'YYYY-MM-DD':
    default:
      return `${year}-${month}-${day}`;
  }
}

/**
 * Detect the format of a date string. Returns null if unrecognized.
 */
export function detectFormat(input: string): DateFormat | null {
  const trimmed = input.trim();
  for (const { format, regex } of FORMAT_PATTERNS) {
    if (regex.test(trimmed)) {
      return format;
    }
  }
  return null;
}

/**
 * Check if two dates represent the same calendar day (ignoring time).
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if date d is between start and end (inclusive).
 */
export function isDateInRange(d: Date, start: Date, end: Date): boolean {
  const time = d.getTime();
  return time >= start.getTime() && time <= end.getTime();
}
