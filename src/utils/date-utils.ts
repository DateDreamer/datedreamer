import dayjs from 'dayjs';

export namespace Utils {
  /** Check if a value is a valid Date */
  export function isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /** Check if date is within a range (inclusive) */
  export function isInRange(start: Date, end: Date, date: Date): boolean {
    return date >= start && date <= end;
  }

  /** Format a date using DayJS format string */
  export function formatDate(
    date: Date,
    format?: string
  ): string {
    return dayjs(date).format(format);
  }

  /** Check if two dates represent the same day */
  export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  /** Add days to a date */
  export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /** Check if date is a weekend */
  export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  /** Get ISO week number */
  export function getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(yearStart.getFullYear(), 0, 0)) / 86400000 + 1) / 7);
    return weekNo;
  }

  /** Get week day name */
  export function getWeekdayName(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  }

  /** Get week day short name */
  export function getWeekdayShort(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
}
