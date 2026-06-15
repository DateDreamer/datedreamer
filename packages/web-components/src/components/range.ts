import { getConnector, CalendarConnector } from '@datedreamer/core';

/** Predefined range option */
export interface RangePreset {
  label: string;
  calculate(): { start: Date; end: Date };
}

/** Default presets matching the legacy behavior */
const DEFAULT_PRESETS: RangePreset[] = [
  {
    label: 'Today',
    calculate: () => {
      const today = new Date();
      return { start: today, end: today };
    }
  },
  {
    label: 'Yesterday',
    calculate: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: yesterday };
    }
  },
  {
    label: 'Last 7 days',
    calculate: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { start, end };
    }
  },
  {
    label: 'Last 30 days',
    calculate: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { start, end };
    }
  },
  {
    label: 'This month',
    calculate: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start, end };
    }
  },
  {
    label: 'Last month',
    calculate: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start, end };
    }
  }
];

/**
 * <dd-range> Web Component — Dual-calendar range picker
 *
 * Displays two side-by-side calendars connected by a shared connector,
 * with an optional sidebar of predefined date ranges.
 *
 * Attributes:
 *   [show-sidebar]     - Show the preset ranges sidebar
 *   [dark-mode]        - Dark theme
 *   [theme="forest"]   - Named theme
 *   [connector-id]     - External connector ID to sync with other calendars
 */
export class RangeElement extends HTMLElement {
  private container!: HTMLDivElement;
  private sidebar!: HTMLDivElement;
  private calendarsContainer!: HTMLDivElement;
  private calendarLeft!: HTMLElement;
  private calendarRight!: HTMLElement;

  private _showSidebar: boolean = true;
  private _presets: RangePreset[] = DEFAULT_PRESETS;
  private _connectorId: string = `dd-range-${Math.random().toString(36).slice(2, 9)}`;
  private _connector?: CalendarConnector;

  static get observedAttributes(): string[] {
    return ['show-sidebar', 'dark-mode', 'theme', 'connector-id'];
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.setupConnector();
    this.bindEvents();
  }

  disconnectedCallback(): void {
    // Cleanup connector subscription if needed
  }

  attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null): void {
    switch (name) {
      case 'show-sidebar':
        this._showSidebar = newVal !== null;
        if (this.sidebar) {
          this.sidebar.style.display = this._showSidebar ? 'block' : 'none';
        }
        break;
      case 'connector-id':
        if (newVal) {
          this._connectorId = newVal;
          this.setupConnector();
        }
        break;
    }
  }

  // ============================================================
  // Public API
  // ============================================================

  /** Get the current range selection */
  public getRange(): { start: Date | null; end: Date | null } {
    if (this._connector) {
      const state = this._connector.getState();
      return { start: state.startDate, end: state.endDate };
    }
    return { start: null, end: null };
  }

  /** Set a range programmatically */
  public setRange(start: Date, end: Date): void {
    if (this._connector) {
      this._connector.setRange(start, end);
    }
  }

  // ============================================================
  // Rendering
  // ============================================================

  private render(): void {
    this.innerHTML = '';

    this.container = document.createElement('div');
    this.container.className = 'dd-range-container';

    // Sidebar (presets)
    if (this._showSidebar) {
      this.sidebar = document.createElement('div');
      this.sidebar.className = 'dd-range-sidebar';

      for (const preset of this._presets) {
        const btn = document.createElement('button');
        btn.className = 'dd-range-option';
        btn.textContent = preset.label;
        btn.addEventListener('click', () => {
          const { start, end } = preset.calculate();
          if (this._connector) {
            this._connector.setRange(start, end);
          }

          // Navigate left calendar to start month, right to end month
          if (this.calendarLeft) {
            this.calendarLeft.setAttribute('selected', start.toISOString());
          }

          this.emitChange(start, end);
        });
        this.sidebar.appendChild(btn);
      }

      this.container.appendChild(this.sidebar);
    }

    // Calendars container
    this.calendarsContainer = document.createElement('div');
    this.calendarsContainer.className = 'dd-range-calendars';

    // Left calendar (start)
    this.calendarLeft = document.createElement('dd-calendar');
    this.calendarLeft.setAttribute('connector-id', this._connectorId);
    this.calendarLeft.setAttribute('range-mode', '');
    const darkMode = this.getAttribute('dark-mode');
    if (darkMode) {
      this.calendarLeft.setAttribute('dark-mode', '');
    }
    const theme = this.getAttribute('theme');
    if (theme) {
      this.calendarLeft.setAttribute('theme', theme);
    }

    // Connector line
    const connectorLine = document.createElement('div');
    connectorLine.className = 'dd-connector-line';

    // Right calendar (end — shows next month)
    this.calendarRight = document.createElement('dd-calendar');
    this.calendarRight.setAttribute('connector-id', this._connectorId);
    this.calendarRight.setAttribute('range-mode', '');
    if (darkMode) {
      this.calendarRight.setAttribute('dark-mode', '');
    }
    if (theme) {
      this.calendarRight.setAttribute('theme', theme);
    }

    // Initialize right calendar to next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    this.calendarRight.setAttribute('selected', nextMonth.toISOString());

    this.calendarsContainer.appendChild(this.calendarLeft);
    this.calendarsContainer.appendChild(connectorLine);
    this.calendarsContainer.appendChild(this.calendarRight);
    this.container.appendChild(this.calendarsContainer);

    this.appendChild(this.container);
  }

  // ============================================================
  // Connector setup
  // ============================================================

  private setupConnector(): void {
    const connector = getConnector(this._connectorId);
    this._connector = connector;
  }

  // ============================================================
  // Event handling
  // ============================================================

  private bindEvents(): void {
    // Listen for date changes on left calendar (start of range)
    this.calendarLeft.addEventListener('dd-date-change', (e: CustomEvent) => {
      const detail = e.detail as { startDate?: Date; endDate?: Date };
      if (detail.startDate && detail.endDate) {
        this.emitChange(detail.startDate, detail.endDate);
      }
    });

    // Sync navigation between calendars via connector
    this.calendarLeft.addEventListener('dd-nav-change', () => {
      const state = this._connector?.getState();
      if (state?.displayedMonthDate) {
        // Right calendar shows the next month relative to left
        const rightMonth = new Date(state.displayedMonthDate);
        rightMonth.setMonth(rightMonth.getMonth() + 1);
        // We need to tell the right calendar about this — but connector syncs both
        // So we just let the connector handle it
      }
    });
  }

  private emitChange(start: Date, end: Date): void {
    this.dispatchEvent(new CustomEvent('range-change', {
      bubbles: true,
      composed: true,
      detail: { start, end }
    }));
  }
}

// Register the custom element
if (!customElements.get('dd-range')) {
  customElements.define('dd-range', RangeElement);
}

export default RangeElement;
