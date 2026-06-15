import { parseDate, formatDate } from '@datedreamer/core';
import type { DateFormat } from '@datedreamer/core';

/**
 * <dd-calendar-toggle> Web Component
 *
 * Wraps a text input with a popup calendar panel. Shows/hides the calendar
 * on focus/click and closes on outside click or date selection.
 *
 * Attributes:
 *   [placeholder]    - Input placeholder text
 *   [format]         - Date format string (default: YYYY-MM-DD)
 *   [value]          - Initial value as ISO date string
 *   [dark-mode]      - Passes through to inner calendar
 *   [theme="forest"] - Named theme
 */
export class CalendarToggleElement extends HTMLElement {
  private input!: HTMLInputElement;
  private panel!: HTMLDivElement;
  private calendarEl!: HTMLElement;

  private _format: DateFormat = 'YYYY-MM-DD';
  private _placeholder: string = 'Select a date';
  private _isOpen: boolean = false;
  private _selectedDate?: Date;

  static get observedAttributes(): string[] {
    return ['placeholder', 'format', 'value', 'dark-mode', 'theme'];
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.bindEvents();
    this.handleInitialValue();
  }

  disconnectedCallback(): void {
    document.removeEventListener('click', this.outsideClickHandler);
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null): void {
    if (name === 'placeholder' && newVal) {
      this._placeholder = newVal;
      if (this.input) this.input.placeholder = newVal;
    }
    if (name === 'format' && newVal) {
      this._format = newVal as DateFormat;
    }
    if (name === 'value' && newVal) {
      const parsed = parseDate(newVal);
      if (parsed) {
        this._selectedDate = parsed;
        if (this.input) {
          this.input.value = formatDate(parsed, this._format);
        }
      }
    }
  }

  // ============================================================
  // Public API
  // ============================================================

  /** Open the calendar popup */
  public open(): void {
    this._isOpen = true;
    this.panel.style.display = 'block';
    document.addEventListener('click', this.outsideClickHandler);
  }

  /** Close the calendar popup */
  public close(): void {
    this._isOpen = false;
    this.panel.style.display = 'none';
    document.removeEventListener('click', this.outsideClickHandler);
  }

  /** Toggle the calendar popup */
  public toggle(): void {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Get the currently selected date */
  public getSelectedDate(): Date | undefined {
    return this._selectedDate;
  }

  /** Set the selected date programmatically */
  public setSelectedDate(date: Date): void {
    this._selectedDate = date;
    if (this.input) {
      this.input.value = formatDate(date, this._format);
    }
    this.emitChange();
  }

  // ============================================================
  // Rendering
  // ============================================================

  private render(): void {
    this.innerHTML = '';

    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.display = 'inline-block';

    // Input
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'dd-toggle-input';
    this.input.placeholder = this._placeholder;
    this.input.readOnly = true; // Prevent manual typing, use calendar instead
    container.appendChild(this.input);

    // Panel (popup)
    this.panel = document.createElement('div');
    this.panel.className = 'dd-toggle-panel';
    this.panel.style.display = 'none';

    // Inner calendar
    this.calendarEl = document.createElement('dd-calendar');
    const darkMode = this.getAttribute('dark-mode');
    if (darkMode) {
      this.calendarEl.setAttribute('dark-mode', '');
    }
    const theme = this.getAttribute('theme');
    if (theme) {
      this.calendarEl.setAttribute('theme', theme);
    }

    // Sync selected date to inner calendar
    if (this._selectedDate) {
      this.calendarEl.setAttribute('selected', this._selectedDate.toISOString());
    }

    this.panel.appendChild(this.calendarEl);
    container.appendChild(this.panel);
    this.appendChild(container);
  }

  // ============================================================
  // Event handling
  // ============================================================

  private bindEvents(): void {
    // Input click/focus opens calendar
    this.input.addEventListener('click', () => this.open());
    this.input.addEventListener('focus', () => this.open());

    // Calendar date selection
    this.calendarEl.addEventListener('dd-date-change', (e: CustomEvent) => {
      const detail = e.detail as { selectedDate?: Date };
      if (detail.selectedDate) {
        this._selectedDate = detail.selectedDate;
        this.input.value = formatDate(detail.selectedDate, this._format);
        this.close();
        this.emitChange();
      }
    });
  }

  private outsideClickHandler = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node)) {
      this.close();
    }
  };

  private handleInitialValue(): void {
    const valueAttr = this.getAttribute('value');
    if (valueAttr) {
      const parsed = parseDate(valueAttr);
      if (parsed) {
        this._selectedDate = parsed;
        this.input.value = formatDate(parsed, this._format);
      }
    }
  }

  private emitChange(): void {
    this.dispatchEvent(new CustomEvent('date-change', {
      bubbles: true,
      composed: true,
      detail: {
        date: this._selectedDate,
        formatted: this.input.value
      }
    }));
  }
}

// Register the custom element
if (!customElements.get('dd-calendar-toggle')) {
  customElements.define('dd-calendar-toggle', CalendarToggleElement);
}

export default CalendarToggleElement;
