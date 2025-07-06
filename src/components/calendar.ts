import { ICalendarOptions } from '../interfaces/calendar.interface';
import { calendarRoot } from '../utils/calendar-utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CalendarConnector from './connector';
import {
  generateHeader,
  generateInputs,
  generateErrors,
  generateDays,
} from './calendar-render';
import {
  goToPrevMonth,
  goToNextMonth,
  handleDayKeyDown,
  setSelectedDay,
  dateInputChanged,
  setDateToToday,
  dateChangedCallback,
  onRenderCallback,
} from './calendar-events';
dayjs.extend(customParseFormat);

/**
 * DateDreamer Calendar Component
 *
 * A customizable calendar component built with Web Components that provides
 * date selection functionality with various themes and customization options.
 *
 * @example
 * ```javascript
 * const calendar = new DateDreamerCalendar({
 *   element: '#my-calendar',
 *   selectedDate: new Date(),
 *   theme: 'lite-purple',
 *   darkMode: true
 * });
 * ```
 */
class DateDreamerCalendar extends HTMLElement implements ICalendarOptions {
  element: Element | string;
  calendarElement: HTMLElement | null | undefined = null;
  headerElement: HTMLElement | null | undefined = null;
  inputsElement: HTMLElement | null | undefined = null;
  errorsElement: HTMLElement | null | undefined = null;
  format: string | undefined;
  iconNext: string | undefined;
  iconPrev: string | undefined;
  hidePrevNav?: boolean | undefined;
  hideNextNav?: boolean | undefined;
  inputLabel: string = 'Set a date';
  inputPlaceholder: string = 'Enter a date';
  hideInputs: boolean = false;
  darkMode: boolean | undefined = false;
  darkModeAuto: boolean | undefined = false;
  hideOtherMonthDays: boolean | undefined = false;
  rangeMode: boolean | undefined;

  connector: CalendarConnector | undefined;

  onChange: ((event: CustomEvent) => void) | undefined;
  onRender: ((event: CustomEvent) => void) | undefined;
  onNextNav: ((event: CustomEvent) => void) | undefined;
  onPrevNav: ((event: CustomEvent) => void) | undefined;

  errors: Array<{ type: string; message: string }> = [];
  daysElement: HTMLElement | null | undefined = null;
  selectedDate: Date = new Date();
  displayedMonthDate: Date = new Date();

  theme: 'unstyled' | 'lite-purple' = 'unstyled';
  styles: string = '';

  /**
   * Creates a new DateDreamer Calendar instance
   *
   * @param options - Configuration options for the calendar
   * @param options.element - The DOM element or selector where the calendar will be rendered
   * @param options.selectedDate - Initial selected date (Date object, string, or null for today)
   * @param options.theme - Visual theme for the calendar ('unstyled' or 'lite-purple')
   * @param options.styles - Custom CSS styles to apply
   * @param options.format - Date format for parsing and displaying dates
   * @param options.iconNext - Custom icon for next month navigation
   * @param options.iconPrev - Custom icon for previous month navigation
   * @param options.hidePrevNav - Whether to hide the previous month button
   * @param options.hideNextNav - Whether to hide the next month button
   * @param options.inputLabel - Label for the date input field
   * @param options.inputPlaceholder - Placeholder text for the date input field
   * @param options.hideInputs - Whether to hide the input field and today button
   * @param options.darkMode - Whether to enable dark mode styling
   * @param options.darkModeAuto - Whether to automatically detect user's system preference for dark mode
   * @param options.hideOtherMonthDays - Whether to hide days from other months
   * @param options.rangeMode - Whether to enable range selection mode
   * @param options.connector - Calendar connector for linking multiple calendars
   * @param options.onChange - Callback function triggered when date changes
   * @param options.onRender - Callback function triggered when calendar renders
   * @param options.onNextNav - Callback function triggered when navigating to next month
   * @param options.onPrevNav - Callback function triggered when navigating to previous month
   */
  constructor(options: ICalendarOptions) {
    super();

    this.element = options.element;

    if (options.format) {
      this.format = options.format;
    }

    if (options.theme) {
      this.theme = options.theme;
    }

    if (options.styles) {
      this.styles = options.styles;
    }

    if (options.iconNext) {
      this.iconNext = options.iconNext;
    }

    if (options.iconPrev) {
      this.iconPrev = options.iconPrev;
    }

    if (options.inputLabel) {
      this.inputLabel = options.inputLabel;
    }

    if (options.inputPlaceholder) {
      this.inputPlaceholder = options.inputPlaceholder;
    }

    if (options.hidePrevNav) {
      this.hidePrevNav = options.hidePrevNav;
    }

    if (options.hideNextNav) {
      this.hideNextNav = options.hideNextNav;
    }

    if (options.hideInputs) {
      this.hideInputs = options.hideInputs;
    }

    if (options.darkMode !== undefined) {
      this.darkMode = options.darkMode;
    }

    if (options.darkModeAuto) {
      this.darkModeAuto = options.darkModeAuto;
    }

    if (options.rangeMode) {
      this.rangeMode = options.rangeMode;
    }

    if (options.connector) {
      this.connector = options.connector;
      this.connector.calendars.push(this);
    }

    if (options.hideOtherMonthDays) {
      this.hideOtherMonthDays = options.hideOtherMonthDays;
    }

    if (typeof options.selectedDate == 'string') {
      this.selectedDate = dayjs(options.selectedDate, options.format).toDate();
    } else if (typeof options.selectedDate == 'object') {
      this.selectedDate = options.selectedDate;
    }

    this.attachShadow({ mode: 'open' });

    // Get callbacks from options
    this.onChange = options.onChange;
    this.onRender = options.onRender;
    this.onNextNav = options.onNextNav;
    this.onPrevNav = options.onPrevNav;

    // Instanciate display date from initially selected date.
    this.displayedMonthDate = new Date(this.selectedDate);

    this.init();
  }

  private init() {
    // Check if element is defined
    // exits function and logs error if false
    if (this.element == null) {
      throw new Error(
        'No element was provided to calendar. Initializing aborted'
      );
    }

    // Determine dark mode setting
    const shouldUseDarkMode = this.getDarkModeSetting();

    // Generate calendar
    const calendar: string = calendarRoot(
      this.theme,
      this.styles,
      shouldUseDarkMode
    );

    // Insert calendar into DOM
    this.insertCalendarIntoSelector(calendar);

    this.headerElement = this.shadowRoot?.querySelector(
      '.datedreamer__calendar_header'
    );
    this.daysElement = this.shadowRoot?.querySelector(
      '.datedreamer__calendar_days'
    );
    this.inputsElement = this.shadowRoot?.querySelector(
      '.datedreamer__calendar_inputs'
    );
    this.errorsElement = this.shadowRoot?.querySelector(
      '.datedreamer__calendar_errors'
    );

    // Generate the previous, title, next buttons.
    generateHeader(this);

    // Generate the inputs section
    generateInputs(this);

    // Generate the days buttons
    generateDays(this);

    // Set up dark mode listener if auto mode is enabled
    this.setupDarkModeListener();

    // Trigger onRender callback
    this.onRenderCallback();
  }

  /**
   * Determines whether dark mode should be enabled based on user preferences
   * @returns boolean indicating if dark mode should be active
   */
  private getDarkModeSetting(): boolean {
    // If darkModeAuto is enabled, check system preference
    if (this.darkModeAuto) {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }

    // Otherwise, use the manual darkMode setting
    return this.darkMode || false;
  }

  /**
   * Sets up a listener for system preference changes when darkModeAuto is enabled
   */
  private setupDarkModeListener(): void {
    if (this.darkModeAuto && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        this.updateDarkMode();
      });
    }
  }

  /**
   * Updates the dark mode styling based on current preferences
   */
  private updateDarkMode(): void {
    const shouldUseDarkMode = this.getDarkModeSetting();
    const calendarElement = this.shadowRoot?.querySelector(
      '.datedreamer__calendar'
    );

    if (calendarElement) {
      if (shouldUseDarkMode) {
        calendarElement.classList.add('dark');
      } else {
        calendarElement.classList.remove('dark');
      }
    }
  }

  /**
   * Inserts calendar HTML into the element via query selector.
   * @param calendar Calendar HTML
   */
  private insertCalendarIntoSelector(calendar: string) {
    let selectedElement = undefined;
    if (typeof this.element == 'string') {
      selectedElement = document.querySelector(this.element as string);
    } else if (typeof this.element == 'object') {
      selectedElement = this.element;
    }

    if (selectedElement) {
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = calendar;
      }
      selectedElement.append(this);
    } else {
      throw new Error(`Could not find ${this.element} in DOM.`);
    }
  }

  /**
   * Navigates to the previous month
   */
  goToPrevMonth = () => {
    goToPrevMonth(this);
  };

  /**
   * Navigates to the next month
   */
  goToNextMonth = () => {
    goToNextMonth(this);
  };

  /**
   * Handles keyboard navigation within calendar days
   */
  handleDayKeyDown = (event: KeyboardEvent) => {
    handleDayKeyDown(this, event);
  };

  /**
   * Triggers the onRender callback that was passed into the calendar options.
   */
  private onRenderCallback() {
    onRenderCallback(this);
  }

  setDisplayedMonthDate(date: Date) {
    this.displayedMonthDate = date;
    this.rebuildCalendar();
  }

  rebuildCalendar(
    rebuildInput = true,
    focusFirstorLastDay: false | 'first' | 'last' = false
  ) {
    if (this.daysElement) {
      this.daysElement.innerHTML = '';
    }

    if (this.headerElement) {
      this.headerElement.innerHTML = '';
    }

    generateErrors(this);

    if (focusFirstorLastDay) {
      generateDays(this, focusFirstorLastDay);
    } else {
      generateDays(this);
    }

    generateHeader(this);

    if (rebuildInput) {
      if (this.inputsElement) {
        this.inputsElement.innerHTML = '';
      }
      generateInputs(this);
    }
  }

  /**
   * Sets the selected day of the viewable month.
   * @param day The day of the month in number format.
   */
  setSelectedDay = (day: number) => {
    setSelectedDay(this, day);
  };

  /**
   * Sets the given date as selected in the calendar.
   *
   * @param date - The new date to select in the calendar. Can be a Date object or date string.
   * @example
   * ```javascript
   * calendar.setDate(new Date('2024-01-15'));
   * calendar.setDate('2024-01-15');
   * ```
   */
  setDate(date: string | Date) {
    if (typeof date == 'string') {
      this.selectedDate = new Date(date);
    } else if (typeof date == 'object') {
      this.selectedDate = date;
    }

    this.displayedMonthDate = this.selectedDate;

    this.rebuildCalendar();

    this.dateChangedCallback(this.selectedDate);
  }

  /**
   * Sets the selected and viewable month to today.
   *
   * @example
   * ```javascript
   * calendar.setDateToToday();
   * ```
   */
  setDateToToday = () => {
    setDateToToday(this);
  };

  /**
   * Handles the KeyUp event in the date textbox.
   * @param e KeyUp event
   */
  dateInputChanged = (e: Event | KeyboardEvent) => {
    dateInputChanged(this, e);
  };

  /**
   * Triggers the onChange callback that was passed into the calendar options.
   * @param date The new date that has been selected in the calendar.
   */
  private dateChangedCallback(date: Date) {
    dateChangedCallback(this, date);
  }
}

customElements.define('datedreamer-calendar', DateDreamerCalendar);

export { DateDreamerCalendar as calendar };
