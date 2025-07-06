import dayjs from 'dayjs';
import { IRangeOptions } from '../interfaces/range.interface';
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
  onChange?:
    | ((event: CustomEvent<{ startDate: string; endDate: string }>) => void)
    | undefined;
  onRender?: ((event: CustomEvent<any>) => void) | undefined;

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

    if (this.connector) {
      this.connector.dateChangedCallback = this.handleDateChange;
    }

    this.init();
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

    const calendar1WrapElement = document.createElement('div');
    const calendar2WrapElement = document.createElement('div');

    rangeElement.append(calendar1WrapElement, calendar2WrapElement);

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
      const customEvent = new CustomEvent<any>('onRender');
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
            ${this.styles ? this.styles : ''}
        `;

    const styleLink = document.createElement('style');
    styleLink.innerHTML = styles;

    this.append(styleLink);
  }

  prevHandler(e: CustomEvent) {
    this.calendar1DisplayedDate = e.detail;
    this.calendar2DisplayedDate.setMonth(
      this.calendar2DisplayedDate.getMonth() - 1
    );
    this.resetViewedDated();
  }

  nextHandler(e: CustomEvent) {
    this.calendar2DisplayedDate = e.detail;
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
