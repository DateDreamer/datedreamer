/**
 * Accessibility helpers for DateDreamer
 * Provides keyboard navigation logic and ARIA attribute generation
 */

export interface A11yGridState {
  focusedIndex: number;
  totalDays: number;
  cols: number;
}

export class A11yManager {
  private state: A11yGridState = {
    focusedIndex: 0,
    totalDays: 31,
    cols: 7
  };

  constructor(options: Partial<A11yGridState> = {}) {
    Object.assign(this.state, options);
  }

  /**
   * Handles keyboard navigation for the calendar grid
   */
  handleGridKeydown(e: KeyboardEvent): number | null {
    const { focusedIndex, totalDays, cols } = this.state;
    let newIndex = focusedIndex;

    switch (e.key) {
      case 'ArrowLeft':
        newIndex = Math.max(0, focusedIndex - 1);
        break;
      case 'ArrowRight':
        newIndex = Math.min(totalDays - 1, focusedIndex + 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(0, focusedIndex - cols);
        break;
      case 'ArrowDown':
        newIndex = Math.min(totalDays - 1, focusedIndex + cols);
        break;
      case 'Home':
        newIndex = Math.floor(focusedIndex / cols) * cols;
        break;
      case 'End':
        newIndex = Math.min(totalDays - 1, Math.ceil(focusedIndex / cols) * cols - 1);
        break;
      case 'PageUp':
        newIndex = Math.max(0, focusedIndex - (cols * 4));
        break;
      case 'PageDown':
        newIndex = Math.min(totalDays - 1, focusedIndex + (cols * 4));
        break;
      default:
        return null;
    }

    this.state.focusedIndex = newIndex;
    e.preventDefault();
    return newIndex;
  }

  /**
   * Generates ARIA attributes for a calendar day cell
   */
  generateDayAria(date: Date, isSelected: boolean, isToday: boolean): Record<string, string> {
    return {
      'role': 'gridcell',
      'tabindex': isSelected ? '0' : '-1',
      'aria-selected': isSelected ? 'true' : 'false',
      'aria-label': `${date.getDate()} ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}${isToday ? ' (Today)' : ''}`,
      'aria-current': isToday ? 'date' : 'false'
    };
  }

  /**
   * Generates ARIA attributes for the calendar header
   */
  generateHeaderAria(displayedMonth: Date): Record<string, string> {
    return {
      'role': 'row',
      'aria-label': 'Calendar Navigation'
    };
  }

  getState(): A11yGridState {
    return { ...this.state };
  }

  setState(state: Partial<A11yGridState>): void {
    Object.assign(this.state, state);
  }
}
