import dayjs from 'dayjs';
import { IRangeOptions, IPredefinedRange } from '../interfaces/range.interface';
import { NavigationEventDetail } from '../interfaces/calendar.interface';
import { calendarStyles } from '../utils/range-utils';
import { calendar } from './calendar';
import CalendarConnector from './connector';

class DateDreamerRange extends HTMLElement implements IRangeOptions {
  calendar1: calendar | undefined;
  calendar2: calendar | undefined;
  calendar1DisplayedDate: Date = new Date();
  calendar2DisplayedDate: Date = new Date();

  element: string | Element;
  theme?: 'lite-purple' | 'unstyled' | undefined;
  styles?: string | undefined;
  format?: string | undefined;
  iconPrev?: string | undefined;
  iconNext?: string | undefined;
  darkMode?: boolean | undefined;
  darkModeAuto?: boolean | undefined;
  predefinedRanges?: IPredefinedRange[] | undefined;
  onChange?:
    | ((event: CustomEvent<{ startDate: string; endDate: string }>) => void)
    | undefined;
  onRender?: ((event: CustomEvent<Record<string, never>>) => void) | undefined;

  selectedStartDate: Date | undefined;
  selectedEndDate: Date | undefined;

  connector: CalendarConnector | undefined;

  constructor(options: IRangeOptions) {
    super();

    this.element = options.element;
    this.connector = new CalendarConnector();

    this.styles = options.styles;
    this.format = options.format;
    this.iconPrev = options.iconPrev;
    this.iconNext = options.iconNext;
    this.onChange = options.onChange;
    this.onRender = options.onRender;
    this.theme = options.theme;
    this.darkMode = options.darkMode;
    this.darkModeAuto = options.darkModeAuto;
    this.predefinedRanges = options.predefinedRanges;

    if (this.connector) {
      this.connector.dateChangedCallback = this.handleDateChange;
    }

    this.init();
  }

  /**
   * Handles click events on predefined range buttons
   * @param range - The predefined range that was clicked
   */
  private handlePredefinedRangeClick(range: IPredefinedRange): void {
    const { start, end } = range.getRange();

    if (this.connector) {
      this.connector.startDate = new Date(start);
      this.connector.endDate = new Date(end);

      // Update display dates to show the selected range
      this.calendar1DisplayedDate = new Date(start);
      this.calendar1DisplayedDate.setDate(1);
      this.calendar2DisplayedDate = new Date(end);
      this.calendar2DisplayedDate.setDate(1);

      // If the range spans multiple months, show start and end months
      if (
        start.getMonth() !== end.getMonth() ||
        start.getFullYear() !== end.getFullYear()
      ) {
        this.calendar2DisplayedDate = new Date(end);
        this.calendar2DisplayedDate.setDate(1);
      } else {
        // If same month, show current and next month
        this.calendar2DisplayedDate = new Date(start);
        this.calendar2DisplayedDate.setMonth(
          this.calendar2DisplayedDate.getMonth() + 1
        );
        this.calendar2DisplayedDate.setDate(1);
      }

      this.resetViewedDated();
      this.connector.rebuildAllCalendars();

      if (this.connector.dateChangedCallback) {
        this.connector.dateChangedCallback(new CustomEvent('dateChanged'));
      }
    }
  }

  /**
   * Determines whether dark mode should be enabled based on user preferences
   * @returns boolean indicating if dark mode should be active
   */
  private getDarkModeSetting(): boolean {
    if (this.darkModeAuto) {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return this.darkMode || false;
  }

  /**
   * Sets up a listener for system preference changes when darkModeAuto is enabled
   */
  private setupDarkModeListener(rangeElement: HTMLElement): void {
    if (this.darkModeAuto && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        this.updateDarkMode(rangeElement);
      });
    }
  }

  /**
   * Updates the dark mode styling based on current preferences
   */
  private updateDarkMode(rangeElement: HTMLElement): void {
    const shouldUseDarkMode = this.getDarkModeSetting();
    if (shouldUseDarkMode) {
      rangeElement.classList.add('dark');
    } else {
      rangeElement.classList.remove('dark');
    }
  }

  /**
   * Initialize parent div element and inject both calendars.
   */
  init(): void {
    this.addStyles();

    this.calendar1DisplayedDate.setDate(1);
    this.calendar2DisplayedDate.setDate(1);
    this.calendar2DisplayedDate.setMonth(
      this.calendar2DisplayedDate.getMonth() + 1
    );

    const rangeElement = document.createElement('div');
    rangeElement.classList.add('datedreamer-range');

    // Determine dark mode setting
    const shouldUseDarkMode = this.getDarkModeSetting();
    if (shouldUseDarkMode) {
      rangeElement.classList.add('dark');
    }

    // Set up dark mode listener if auto mode is enabled
    this.setupDarkModeListener(rangeElement);

    // Create predefined ranges sidebar if ranges are provided
    if (this.predefinedRanges && this.predefinedRanges.length > 0) {
      const sidebarElement = document.createElement('div');
      sidebarElement.classList.add('datedreamer-range-sidebar');

      this.predefinedRanges.forEach(range => {
        const rangeButton = document.createElement('button');
        rangeButton.classList.add('datedreamer-range-button');
        rangeButton.textContent = range.label;
        rangeButton.type = 'button';
        rangeButton.addEventListener('click', () =>
          this.handlePredefinedRangeClick(range)
        );
        sidebarElement.appendChild(rangeButton);
      });

      rangeElement.appendChild(sidebarElement);
    }

    const calendarsContainer = document.createElement('div');
    calendarsContainer.classList.add('datedreamer-range-calendars');

    const calendar1WrapElement = document.createElement('div');
    const calendar2WrapElement = document.createElement('div');

    calendarsContainer.append(calendar1WrapElement, calendar2WrapElement);
    rangeElement.append(calendarsContainer);

    this.calendar1 = new calendar({
      element: calendar1WrapElement,
      theme: this.theme,
      format: this.format,
      hideInputs: true,
      hideNextNav: true,
      styles: calendarStyles,
      iconPrev: this.iconPrev,
      onPrevNav: e => this.prevHandler(e),
      rangeMode: true,
      hideOtherMonthDays: true,
      connector: this.connector,
      darkMode: this.darkMode,
      darkModeAuto: this.darkModeAuto,
    });

    this.calendar2 = new calendar({
      element: calendar2WrapElement,
      theme: this.theme,
      format: this.format,
      hideInputs: true,
      hidePrevNav: true,
      styles: calendarStyles,
      iconNext: this.iconNext,
      onNextNav: e => this.nextHandler(e),
      rangeMode: true,
      hideOtherMonthDays: true,
      connector: this.connector,
      darkMode: this.darkMode,
      darkModeAuto: this.darkModeAuto,
    });

    this.calendar2.setDisplayedMonthDate(this.calendar2DisplayedDate);

    this.append(rangeElement);

    if (typeof this.element == 'string') {
      const parentElement = document.querySelector(this.element);
      if (parentElement) {
        parentElement.append(this);
      }
    } else if (typeof this.element == 'object') {
      this.element.append(this);
    }

    if (this.onRender) {
      const customEvent = new CustomEvent<Record<string, never>>('onRender');
      this.onRender(customEvent);
    }
  }

  addStyles(): void {
    const styles = `
            .datedreamer-range {
                display: inline-flex;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%);
                transition: background-color 0.3s ease;
            }

            .datedreamer-range.dark {
                background: #1a1a1a;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 30%), 0 4px 6px -4px rgb(0 0 0 / 30%);
            }

            .datedreamer-range-sidebar {
                display: flex;
                flex-direction: column;
                gap: 6px;
                padding: 12px;
                background: #f9f9f9;
                border-right: 1px solid #e5e5e5;
                min-width: 130px;
            }

            .datedreamer-range.dark .datedreamer-range-sidebar {
                background: #2a2a2a;
                border-right: 1px solid #404040;
            }

            .datedreamer-range-button {
                padding: 6px 10px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                background: white;
                color: #374151;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
            }

            .datedreamer-range-button:hover {
                background: #f3f4f6;
                border-color: #9ca3af;
            }

            .datedreamer-range-button:active {
                background: #e5e7eb;
                transform: translateY(1px);
            }

            .datedreamer-range.dark .datedreamer-range-button {
                background: #374151;
                color: #f9fafb;
                border-color: #4b5563;
            }

            .datedreamer-range.dark .datedreamer-range-button:hover {
                background: #4b5563;
                border-color: #6b7280;
            }

            .datedreamer-range.dark .datedreamer-range-button:active {
                background: #374151;
            }

            .datedreamer-range-calendars {
                display: flex;
            }
            ${this.styles ? this.styles : ''}
        `;

    const styleLink = document.createElement('style');
    styleLink.innerHTML = styles;

    this.append(styleLink);
  }

  prevHandler(e: CustomEvent<NavigationEventDetail>) {
    this.calendar1DisplayedDate = e.detail.displayedMonthDate;
    this.calendar2DisplayedDate.setMonth(
      this.calendar2DisplayedDate.getMonth() - 1
    );
    this.resetViewedDated();
  }

  nextHandler(e: CustomEvent<NavigationEventDetail>) {
    this.calendar2DisplayedDate = e.detail.displayedMonthDate;
    this.calendar1DisplayedDate.setMonth(
      this.calendar1DisplayedDate.getMonth() + 1
    );
    this.resetViewedDated();
  }

  resetViewedDated() {
    this.calendar1?.setDisplayedMonthDate(this.calendar1DisplayedDate);
    this.calendar2?.setDisplayedMonthDate(this.calendar2DisplayedDate);
  }

  handleDateChange = () => {
    if (this.onChange) {
      const customEvent = new CustomEvent('onChange', {
        detail: {
          startDate: dayjs(this.connector?.startDate).format(this.format),
          endDate: dayjs(this.connector?.endDate).format(this.format),
        },
      });
      this.onChange(customEvent);
    }
  };
}

customElements.define('datedreamer-range', DateDreamerRange);
export { DateDreamerRange as range };
