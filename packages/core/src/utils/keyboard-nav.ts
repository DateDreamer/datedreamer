/**
 * Keyboard navigation utilities for calendar grids.
 * Pure functions that compute the next date based on key presses.
 */

export interface GridNavResult {
  /** The new focused date, or null if no change */
  date: Date | null;
  /** Whether to prevent default browser behavior */
  preventDefault: boolean;
}

/**
 * Handle arrow key navigation within a calendar grid.
 * Returns the new date to focus based on the current date and key pressed.
 */
export function handleDayKeyDown(
  e: KeyboardEvent,
  currentDate: Date
): GridNavResult {
  switch (e.key) {
    case 'ArrowLeft': {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      return { date: d, preventDefault: true };
    }
    case 'ArrowRight': {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      return { date: d, preventDefault: true };
    }
    case 'ArrowUp': {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      return { date: d, preventDefault: true };
    }
    case 'ArrowDown': {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      return { date: d, preventDefault: true };
    }
    case 'Home': {
      // Go to start of current week (Sunday)
      const d = new Date(currentDate);
      d.setDate(d.getDate() - d.getDay());
      return { date: d, preventDefault: true };
    }
    case 'End': {
      // Go to end of current week (Saturday)
      const d = new Date(currentDate);
      d.setDate(d.getDate() + (6 - d.getDay()));
      return { date: d, preventDefault: true };
    }
    case 'PageUp': {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() - 1);
      return { date: d, preventDefault: true };
    }
    case 'PageDown': {
      const d = new Date(currentDate);
      d.setMonth(d.getMonth() + 1);
      return { date: d, preventDefault: true };
    }
    default:
      return { date: null, preventDefault: false };
  }
}

/**
 * Find the index of a date within the days array.
 */
export function findDayIndex(date: Date, daysInMonth: Date[]): number {
  for (let i = 0; i < daysInMonth.length; i++) {
    if (
      daysInMonth[i].getFullYear() === date.getFullYear() &&
      daysInMonth[i].getMonth() === date.getMonth() &&
      daysInMonth[i].getDate() === date.getDate()
    ) {
      return i;
    }
  }
  return -1;
}
