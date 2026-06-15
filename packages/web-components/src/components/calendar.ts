import { CalendarEngine } from '@datedreamer/core';
import type { ICalendarState, CalendarSubscriber } from '@datedreamer/core';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** SVG icon helpers */
function prevIcon(): string {
  return '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M12.707 5.293a1 1 0 010 1.414L8.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"/></svg>';
}

function nextIcon(): string {
  return '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M7.293 14.707a1 1 0 010-1.414L11.586 10 7.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>';
}

/**
 * <dd-calendar> Web Component
 *
 * Attributes:
 *   [selected]       - ISO date string for initial selection (controlled)
 *   [range-mode]     - Enables range selection mode
 *   [dark-mode]      - Enables dark theme
 *   [theme="forest"] - Named theme override
 *   [connector-id]   - Syncs navigation with other calendars sharing this ID
 *   [show-input]     - Shows date input field above the grid
 *   [input-format]   - Date format for input: DD/MM/YYYY, YYYY-MM-DD, etc.
 *   [hide-weekends]  - Disables weekend day clicks
 *   [min-date]       - Earliest selectable date (ISO)
 *   [max-date]       - Latest selectable date (ISO)
 *   [disabled-dates] - Comma-separated ISO dates to disable
 */
export class CalendarElement extends HTMLElement {
  // --- State ---
  private engine: CalendarEngine;
  private unsubscribe?: () => void;

  // --- DOM refs ---
  private root!: HTMLDivElement;
  private headerTitle!: HTMLSpanElement;
  private prevBtn!: HTMLButtonElement;
  private nextBtn!: HTMLButtonElement;
  private weekdaysRow!: HTMLDivElement;
  private daysGrid!: HTMLDivElement;
  private inputGroup?: HTMLDivElement;
  private dateInput?: HTMLInputElement;

  // --- Config ---
  private _inputFormat: string = 'YYYY-MM-DD';
  private _showInput: boolean = false;
  private _hideWeekends: boolean = false;
  private _minDate?: Date;
  private _maxDate?: Date;
  private _disabledDates: Set<string> = new Set();

  // --- Connector ---
  private connectorUnsub?: () => void;

  // --- Custom icons (override via attributes) ---
  private _prevIcon?: string;
  private _nextIcon?: string;

  static get observedAttributes(): string[] {
    return [
      'selected', 'range-mode', 'dark-mode', 'theme', 'connector-id',
      'show-input', 'input-format', 'hide-weekends', 'min-date', 'max-date',
      'disabled-dates', 'prev-icon', 'next-icon'
    ];
  }

  constructor() {
    super();
    this.engine = new CalendarEngine({ selectedDate: new Date() });
  }

  connectedCallback(): void {
    this.render();
    this.subscribeToEngine();
    this.bindEvents();
    this.handleAttributes();
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    this.connectorUnsub?.();
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null): void {
    this.handleAttributeChange(name, newVal);
  }

  // ============================================================
  // Public API
  // ============================================================

  /** Programmatically set the selected date */
  public setDate(date: Date | string): void {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!isNaN(d.getTime())) {
      this.engine.setDate(d);
    }
  }

  /** Programmatically set a range */
  public setRange(start: Date | string, end: Date | string): void {
    const s = typeof start === 'string' ? new Date(start) : start;
    const e = typeof end === 'string' ? new Date(end) : end;
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      this.engine.setRange(s, e);
    }
  }

  /** Navigate to a specific month */
  public goToMonth(year: number, month: number): void {
    this.engine.goToMonth(year, month);
  }

  /** Get current engine state */
  public getState(): ICalendarState {
    return this.engine.getState();
  }

  // ============================================================
  // Attribute handling
  // ============================================================

  private handleAttributes(): void {
    const attrs = CalendarElement.observedAttributes;
    for (const attr of attrs) {
      const val = this.getAttribute(attr);
      if (val !== null) {
        this.handleAttributeChange(attr, val);
      }
    }
  }

  private handleAttributeChange(name: string, value: string | null): void {
    switch (name) {
      case 'selected':
        if (value) {
          const d = new Date(value);
          if (!isNaN(d.getTime())) this.engine.setDate(d);
        }
        break;

      case 'range-mode':
        this.engine.toggleRangeMode(value !== null);
        break;

      case 'dark-mode':
        this.engine.setDarkMode(value !== null);
        if (value) {
          this.setAttribute('data-dd-dark-mode', '');
        } else {
          this.removeAttribute('data-dd-dark-mode');
        }
        break;

      case 'theme':
        if (value) {
          this.setAttribute('data-dd-theme', value);
        }
        break;

      case 'connector-id':
        this.setupConnector(value);
        break;

      case 'show-input':
        this._showInput = value !== null;
        this.render();
        break;

      case 'input-format':
        if (value) {
          this._inputFormat = value;
          // Re-render input if it exists
          if (this.dateInput && this.engine.getState().selectedDate) {
            this.dateInput.value = this.formatDate(this.engine.getState().selectedDate);
          }
        }
        break;

      case 'hide-weekends':
        this._hideWeekends = value !== null;
        break;

      case 'min-date':
        if (value) {
          const d = new Date(value);
          this._minDate = isNaN(d.getTime()) ? undefined : d;
        } else {
          this._minDate = undefined;
        }
        break;

      case 'max-date':
        if (value) {
          const d = new Date(value);
          this._maxDate = isNaN(d.getTime()) ? undefined : d;
        } else {
          this._maxDate = undefined;
        }
        break;

      case 'disabled-dates':
        if (value) {
          this._disabledDates = new Set(value.split(',').map(s => s.trim()));
        } else {
          this._disabledDates.clear();
        }
        break;

      case 'prev-icon':
        this._prevIcon = value || undefined;
        this.renderHeader();
        break;

      case 'next-icon':
        this._nextIcon = value || undefined;
        this.renderHeader();
        break;
    }
  }

  private setupConnector(connectorId: string | null): void {
    if (!connectorId) return;

    // Import connector dynamically to avoid issues
    import('@datedreamer/core').then(({ getConnector }) => {
      const connector = getConnector(connectorId);
      this.connectorUnsub?.();
      this.connectorUnsub = connector.subscribe((state) => {
        if (state.displayedMonthDate) {
          this.engine.goToDate(state.displayedMonthDate);
        }
        if (state.startDate && state.endDate) {
          this.engine.setRange(state.startDate, state.endDate);
        }
      });

      // Notify connector of our current month
      const currentState = this.engine.getState();
      connector.setDisplayedMonth(currentState.displayedMonthDate);
    });
  }

  // ============================================================
  // Rendering
  // ============================================================

  private render(): void {
    this.innerHTML = '';

    this.root = document.createElement('div');
    this.root.className = 'dd-calendar';

    // Input group (optional)
    if (this._showInput) {
      this.inputGroup = document.createElement('div');
      this.inputGroup.className = 'dd-input-group';
      this.dateInput = document.createElement('input');
      this.dateInput.type = 'text';
      this.dateInput.className = 'dd-date-input';
      this.dateInput.placeholder = this._inputFormat;
      const state = this.engine.getState();
      if (state.selectedDate) {
        this.dateInput.value = this.formatDate(state.selectedDate);
      }
      this.inputGroup.appendChild(this.dateInput);
      this.root.appendChild(this.inputGroup);
    }

    // Header
    const header = document.createElement('div');
    header.className = 'dd-header';

    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'dd-nav-btn dd-prev';
    this.prevBtn.innerHTML = this._prevIcon || prevIcon();
    this.prevBtn.setAttribute('aria-label', 'Previous month');

    this.headerTitle = document.createElement('span');
    this.headerTitle.className = 'dd-header-title';

    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'dd-nav-btn dd-next';
    this.nextBtn.innerHTML = this._nextIcon || nextIcon();
    this.nextBtn.setAttribute('aria-label', 'Next month');

    header.appendChild(this.prevBtn);
    header.appendChild(this.headerTitle);
    header.appendChild(this.nextBtn);
    this.root.appendChild(header);

    // Weekday headers
    this.weekdaysRow = document.createElement('div');
    this.weekdaysRow.className = 'dd-weekdays';
    WEEKDAY_SHORT.forEach(day => {
      const el = document.createElement('span');
      el.className = 'dd-weekday';
      el.textContent = day;
      this.weekdaysRow.appendChild(el);
    });
    this.root.appendChild(this.weekdaysRow);

    // Days grid
    this.daysGrid = document.createElement('div');
    this.daysGrid.className = 'dd-days';
    this.root.appendChild(this.daysGrid);

    this.appendChild(this.root);
    this.renderContent();
  }

  private renderHeader(): void {
    const state = this.engine.getState();
    const monthDate = state.displayedMonthDate;
    this.headerTitle.textContent = `${MONTH_NAMES[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  }

  private renderContent(): void {
    this.renderHeader();
    this.renderDays();
  }

  private renderDays(): void {
    const state = this.engine.getState();
    const days = this.engine.getDaysInMonth(state.displayedMonthDate);

    this.daysGrid.innerHTML = '';

    days.forEach((date, index) => {
      const dayEl = document.createElement('button');
      dayEl.className = 'dd-day';
      dayEl.textContent = String(date.getDate());
      dayEl.setAttribute('tabindex', '-1');
      dayEl.setAttribute('aria-label', `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);

      // Focusable first day of the displayed month
      if (this.engine.isCurrentMonth(date) && index === 0) {
        dayEl.setAttribute('tabindex', '0');
      }

      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      // Classes
      if (!this.engine.isCurrentMonth(date)) {
        dayEl.classList.add('other-month');
      }

      if (this.engine.isToday(date)) {
        dayEl.classList.add('today');
      }

      if (state.selectedDate && this.engine.isSameDay(date, state.selectedDate) && !state.rangeMode) {
        dayEl.classList.add('selected');
      }

      // Range classes
      if (state.rangeMode) {
        if (this.engine.isRangeStart(date)) {
          dayEl.classList.add('range-start');
        } else if (this.engine.isRangeEnd(date)) {
          dayEl.classList.add('range-end');
        } else if (this.engine.isInRange(date)) {
          dayEl.classList.add('in-range');
        }
      }

      // Disabled checks
      const isDisabled = this.isDateDisabled(date);
      if (isDisabled) {
        dayEl.classList.add('disabled');
        dayEl.setAttribute('aria-disabled', 'true');
      }

      // Click handler
      dayEl.addEventListener('click', () => {
        if (!isDisabled) {
          this.handleDayClick(date);
        }
      });

      // Keyboard navigation
      dayEl.addEventListener('keydown', (e: KeyboardEvent) => {
        if (isDisabled) return;
        this.handleDayKeyDown(e, date);
      });

      this.daysGrid.appendChild(dayEl);
    });
  }

  private isDateDisabled(date: Date): boolean {
    // Weekend check
    if (this._hideWeekends && (date.getDay() === 0 || date.getDay() === 6)) {
      return true;
    }

    // Min/max checks
    if (this._minDate && date < this._minDate) return true;
    if (this._maxDate && date > this._maxDate) return true;

    // Disabled dates list
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (this._disabledDates.has(key)) return true;

    return false;
  }

  private handleDayClick(date: Date): void {
    const state = this.engine.getState();

    if (state.rangeMode) {
      if (!state.startDate || (state.startDate && state.endDate)) {
        // Start a new range
        this.engine.setRangeStart(date);
      } else {
        // Complete the range
        this.engine.setRangeEnd(date);
      }
    } else {
      this.engine.setDate(date);
      if (this.dateInput) {
        this.dateInput.value = this.formatDate(date);
      }
    }

    // Emit custom event
    const stateAfter = this.engine.getState();
    this.dispatchEvent(new CustomEvent('dd-date-change', {
      bubbles: true,
      composed: true,
      detail: {
        selectedDate: stateAfter.selectedDate,
        startDate: stateAfter.startDate,
        endDate: stateAfter.endDate,
        rangeMode: stateAfter.rangeMode
      }
    }));

    this.renderContent();
  }

  private handleDayKeyDown(e: KeyboardEvent, currentDate: Date): void {
    import('@datedreamer/core').then(({ handleDayKeyDown }) => {
      const result = handleDayKeyDown(e, currentDate);
      if (result.preventDefault) {
        e.preventDefault();
      }
      if (result.date && !this.isDateDisabled(result.date)) {
        // Find and focus the corresponding day element
        const days = this.daysGrid.querySelectorAll('.dd-day');
        for (const el of days as NodeListOf<HTMLButtonElement>) {
          const text = parseInt(el.textContent || '0', 10);
          if (text === result.date.getDate()) {
            // Check it's the right month too
            const label = el.getAttribute('aria-label') || '';
            if (label.includes(result.date.getMonth().toString())) {
              el.focus();
              break;
            }
          }
        }

        // If navigating to a different month, update displayed month
        if (result.date.getMonth() !== this.engine.getState().displayedMonthDate.getMonth()) {
          this.engine.goToDate(result.date);
          this.renderContent();
        }
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (this._inputFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'DD.MM.YYYY':
        return `${day}.${month}.${year}`;
      case 'MM-DD-YYYY':
        return `${month}-${day}-${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }

  // ============================================================
  // Event binding
  // ============================================================

  private bindEvents(): void {
    this.prevBtn?.addEventListener('click', () => {
      this.engine.prevMonth();
      this.renderContent();
      this.emitNavChange();
    });

    this.nextBtn?.addEventListener('click', () => {
      this.engine.nextMonth();
      this.renderContent();
      this.emitNavChange();
    });

    // Input change handler
    if (this.dateInput) {
      this.dateInput.addEventListener('change', (e) => {
        const value = (e.target as HTMLInputElement).value;
        import('@datedreamer/core').then(({ parseDate }) => {
          const parsed = parseDate(value);
          if (parsed && !isNaN(parsed.getTime())) {
            this.engine.setDate(parsed);
            this.renderContent();

            this.dispatchEvent(new CustomEvent('dd-date-change', {
              bubbles: true,
              composed: true,
              detail: { selectedDate: parsed }
            }));
          }
        });
      });
    }
  }

  private subscribeToEngine(): void {
    this.unsubscribe = this.engine.subscribe((state) => {
      // Re-render content on state change (but not full render to preserve DOM refs)
      if (this.headerTitle && this.daysGrid) {
        this.renderContent();
      }
    });
  }

  private emitNavChange(): void {
    const state = this.engine.getState();
    this.dispatchEvent(new CustomEvent('dd-nav-change', {
      bubbles: true,
      composed: true,
      detail: {
        displayedMonthDate: state.displayedMonthDate
      }
    }));

    // Notify connector if active
    const connectorId = this.getAttribute('connector-id');
    if (connectorId) {
      import('@datedreamer/core').then(({ getConnector }) => {
        const connector = getConnector(connectorId);
        connector.setDisplayedMonth(state.displayedMonthDate);
      });
    }
  }
}

// Register the custom element
if (!customElements.get('dd-calendar')) {
  customElements.define('dd-calendar', CalendarElement);
}

export default CalendarElement;
