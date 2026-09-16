import { Utils } from './date-utils';

describe('Utils.isValidDate', () => {
  test('returns true for a valid Date instance', () => {
    expect(Utils.isValidDate(new Date(2024, 0, 15))).toBe(true);
  });

  test('returns false for an invalid Date instance', () => {
    expect(Utils.isValidDate(new Date('not-a-date'))).toBe(false);
  });

  test('returns false for non-Date values', () => {
    expect(Utils.isValidDate('2024-01-15')).toBe(false);
    expect(Utils.isValidDate(1705315200000)).toBe(false);
    expect(Utils.isValidDate(null)).toBe(false);
    expect(Utils.isValidDate(undefined)).toBe(false);
    expect(Utils.isValidDate({})).toBe(false);
  });
});

describe('Utils.isInRange', () => {
  const start = new Date(2024, 0, 10);
  const end = new Date(2024, 0, 20);

  test('is inclusive of the start date', () => {
    expect(Utils.isInRange(start, end, new Date(2024, 0, 10))).toBe(true);
  });

  test('is inclusive of the end date', () => {
    expect(Utils.isInRange(start, end, new Date(2024, 0, 20))).toBe(true);
  });

  test('returns true for dates between start and end', () => {
    expect(Utils.isInRange(start, end, new Date(2024, 0, 15))).toBe(true);
  });

  test('returns false for dates before start or after end', () => {
    expect(Utils.isInRange(start, end, new Date(2024, 0, 9))).toBe(false);
    expect(Utils.isInRange(start, end, new Date(2024, 0, 21))).toBe(false);
  });
});

describe('Utils.formatDate', () => {
  const date = new Date(2024, 0, 15, 9, 30);

  test('formats with an explicit format string', () => {
    expect(Utils.formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
    expect(Utils.formatDate(date, 'DD/MM/YYYY')).toBe('15/01/2024');
    expect(Utils.formatDate(date, 'MMM D, YYYY')).toBe('Jan 15, 2024');
  });

  test('falls back to the default format when none is given', () => {
    expect(Utils.formatDate(date)).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    );
  });
});

describe('Utils.isSameDay', () => {
  test('returns true for the same calendar day at different times', () => {
    expect(
      Utils.isSameDay(
        new Date(2024, 0, 15, 0, 0),
        new Date(2024, 0, 15, 23, 59)
      )
    ).toBe(true);
  });

  test('returns false for adjacent days', () => {
    expect(Utils.isSameDay(new Date(2024, 0, 15), new Date(2024, 0, 16))).toBe(
      false
    );
  });

  test('returns false across month and year boundaries', () => {
    expect(Utils.isSameDay(new Date(2023, 11, 31), new Date(2024, 0, 1))).toBe(
      false
    );
  });
});

describe('Utils.addDays', () => {
  test('adds positive and negative day counts', () => {
    expect(Utils.addDays(new Date(2024, 0, 15), 7).getDate()).toBe(22);
    expect(Utils.addDays(new Date(2024, 0, 15), -7).getDate()).toBe(8);
  });

  test('rolls over month and year boundaries', () => {
    const endOfJanuary = Utils.addDays(new Date(2024, 0, 31), 1);
    expect(endOfJanuary.getMonth()).toBe(1);
    expect(endOfJanuary.getDate()).toBe(1);

    const newYear = Utils.addDays(new Date(2024, 11, 31), 1);
    expect(newYear.getFullYear()).toBe(2025);
    expect(newYear.getMonth()).toBe(0);
    expect(newYear.getDate()).toBe(1);
  });

  test('does not mutate the input date', () => {
    const original = new Date(2024, 0, 15);
    Utils.addDays(original, 5);
    expect(original).toEqual(new Date(2024, 0, 15));
  });
});

describe('Utils.isWeekend', () => {
  test('returns true for Saturday and Sunday', () => {
    expect(Utils.isWeekend(new Date(2024, 0, 13))).toBe(true); // Saturday
    expect(Utils.isWeekend(new Date(2024, 0, 14))).toBe(true); // Sunday
  });

  test('returns false for weekdays', () => {
    expect(Utils.isWeekend(new Date(2024, 0, 15))).toBe(false); // Monday
    expect(Utils.isWeekend(new Date(2024, 0, 19))).toBe(false); // Friday
  });
});

describe('Utils.getWeekNumber', () => {
  // Expected values verified against the ISO 8601 definition
  // (dayjs isoWeek plugin as independent reference).
  test.each([
    ['2021-01-01 (Friday)', new Date(2021, 0, 1), 53],
    ['2021-01-04 (Monday)', new Date(2021, 0, 4), 1],
    ['2020-12-31 (Thursday)', new Date(2020, 11, 31), 53],
    ['2023-01-01 (Sunday)', new Date(2023, 0, 1), 52],
    ['2026-01-01 (Thursday)', new Date(2026, 0, 1), 1],
    ['2026-12-31 (Thursday)', new Date(2026, 11, 31), 53],
    ['2024-06-15 (Saturday)', new Date(2024, 5, 15), 24],
  ])('returns the ISO week number for %s', (_label, date, expected) => {
    expect(Utils.getWeekNumber(date)).toBe(expected);
  });
});

describe('Utils.getWeekdayName', () => {
  test('returns the full weekday name', () => {
    expect(Utils.getWeekdayName(new Date(2024, 0, 15))).toBe('Monday');
    expect(Utils.getWeekdayName(new Date(2024, 0, 14))).toBe('Sunday');
  });
});

describe('Utils.getWeekdayShort', () => {
  test('returns the short weekday name for each day', () => {
    const expected = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    // 2024-01-14 is a Sunday, so consecutive days cover the whole week
    for (let i = 0; i < 7; i++) {
      expect(Utils.getWeekdayShort(new Date(2024, 0, 14 + i))).toBe(
        expected[i]
      );
    }
  });
});
