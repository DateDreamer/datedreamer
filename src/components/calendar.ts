import { ICalendarOptions } from '../interfaces/calendar.interface';
import {
  calendarRoot,
  leftChevron,
  monthNames,
  rightChevron,
  weekdays,
} from '../utils/calendar-utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CalendarConnector from './connector';
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
    this.generateHeader();

    // Generate the inputs section
    this.generateInputs();

    // Generate the days buttons
    this.generateDays();

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
   * Generates the Previous, Title, and Next header elements.
   */
  private generateHeader(): void {
    // Previous Button
    if (!this.hidePrevNav) {
      const prevButton = document.createElement('button');
      prevButton.classList.add('datedreamer__calendar_prev');
      prevButton.innerHTML = this.iconPrev ? this.iconPrev : leftChevron;
      prevButton.setAttribute('aria-label', 'Previous');
      prevButton.addEventListener('click', this.goToPrevMonth);
      this.headerElement?.append(prevButton);
    }

    // Title
    const title = document.createElement('span');
    title.classList.add('datedreamer__calendar_title');
    title.innerText = `${monthNames[this.displayedMonthDate.getMonth()]} ${this.displayedMonthDate.getFullYear()}`;
    this.headerElement?.append(title);

    // Next Button
    if (!this.hideNextNav) {
      const nextButton = document.createElement('button');
      nextButton.classList.add('datedreamer__calendar_next');
      nextButton.innerHTML = this.iconNext ? this.iconNext : rightChevron;
      nextButton.setAttribute('aria-label', 'Next');
      nextButton.addEventListener('click', this.goToNextMonth);
      this.headerElement?.append(nextButton);
    }
  }

  /**
   * Generates the date field and today button
   */
  private generateInputs(): void {
    if (this.hideInputs) return;

    // Date input label
    const dateInputLabel = document.createElement('label');
    dateInputLabel.setAttribute('for', 'date-input');
    dateInputLabel.textContent = this.inputLabel;

    const inputButtonWrap = document.createElement('div');
    inputButtonWrap.classList.add('datedreamer__calendar__inputs-wrap');

    // Date input
    const dateField = document.createElement('input');
    dateField.id = 'date-input';
    dateField.placeholder = this.inputPlaceholder;
    dateField.value = dayjs(this.selectedDate).format(this.format);
    dateField.addEventListener('keyup', e => this.dateInputChanged(e));
    dateField.setAttribute('title', 'Set a date');

    // Today button
    const todayButton = document.createElement('button');
    todayButton.innerText = 'Today';
    todayButton.addEventListener('click', () => this.setDateToToday());

    inputButtonWrap.append(dateField, todayButton);

    this.inputsElement?.append(dateInputLabel, inputButtonWrap);
  }

  /**
   *  Generates errors pushed to the errors array.
   */
  private generateErrors(): void {
    const dateInput = this.inputsElement?.querySelector('input');
    if (dateInput) {
      dateInput.classList.remove('error');
    }

    if (this.errorsElement) this.errorsElement.innerHTML = '';

    this.errors.forEach(({ type, message }) => {
      const errEl = document.createElement('span');
      errEl.innerText = message;

      if (type == 'input-error') {
        if (dateInput) {
          dateInput.classList.add('error');
        }
      }

      this.errorsElement?.append(errEl);
    });

    this.errors = [];
  }

  /**
   * Generates the day buttons
   */
  private generateDays(
    focusFirstorLastDay: false | 'first' | 'last' = false
  ): void {
    // Dates
    const selectedDay = this.selectedDate.getDate();
    const month = this.displayedMonthDate.getMonth();
    const year = this.displayedMonthDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month, daysInMonth);
    const daysToSkipBefore = weekdays.indexOf(
      firstDayOfMonth.toString().split(' ')[0]
    );
    const daysToSkipAfter =
      6 - weekdays.indexOf(lastDayOfMonth.toString().split(' ')[0]);

    // Loop through the days and create a day element with button
    for (
      let i = 1;
      i <= daysToSkipBefore + daysInMonth + daysToSkipAfter;
      i++
    ) {
      // Days of the current month
      if (i > daysToSkipBefore && i <= daysToSkipBefore + daysInMonth) {
        const day = document.createElement('div');
        day.classList.add('datedreamer__calendar_day');
        const button = document.createElement('button');
        button.addEventListener('click', () =>
          this.setSelectedDay(i - daysToSkipBefore)
        );
        button.addEventListener('keydown', this.handleDayKeyDown);
        button.innerText = (i - daysToSkipBefore).toString();
        button.setAttribute('type', 'button');

        if (this.rangeMode) {
          if (
            this.displayedMonthDate.getMonth() ==
              this.connector?.startDate?.getMonth() &&
            this.displayedMonthDate.getFullYear() ==
              this.connector.startDate.getFullYear() &&
            i - daysToSkipBefore == this.connector.startDate.getDate()
          ) {
            day.classList.add('active');
          }

          if (
            this.displayedMonthDate.getMonth() ==
              this.connector?.endDate?.getMonth() &&
            this.displayedMonthDate.getFullYear() ==
              this.connector.endDate.getFullYear() &&
            i - daysToSkipBefore == this.connector.endDate.getDate()
          ) {
            day.classList.add('active');
          }

          const selectedDate = new Date(this.displayedMonthDate);
          selectedDate.setDate(i - daysToSkipBefore);

          if (this.connector?.startDate && this.connector.endDate) {
            if (
              this.connector?.startDate < selectedDate &&
              this.connector?.endDate > selectedDate
            ) {
              day.classList.add('highlight');
            }
          }
        } else {
          if (
            i == daysToSkipBefore + selectedDay &&
            this.displayedMonthDate.getMonth() ==
              this.selectedDate.getMonth() &&
            this.displayedMonthDate.getFullYear() ==
              this.selectedDate.getFullYear()
          ) {
            day.classList.add('active');
          }
        }

        day.append(button);
        this.daysElement?.append(day);

        // Focus on active
        if (focusFirstorLastDay) {
          if (focusFirstorLastDay === 'first' && i === daysToSkipBefore + 1) {
            button.focus();
          } else if (
            focusFirstorLastDay === 'last' &&
            i === daysToSkipBefore + daysInMonth
          ) {
            button.focus();
          }
        } else if (
          i == daysToSkipBefore + selectedDay &&
          this.displayedMonthDate.getMonth() == this.selectedDate.getMonth() &&
          this.displayedMonthDate.getFullYear() ==
            this.selectedDate.getFullYear()
        ) {
          button.focus();
        }

        // Days that should show before the first day of the current month.
      } else if (i <= daysToSkipBefore) {
        const day = document.createElement('div');
        day.classList.add('datedreamer__calendar_day', 'disabled');
        if (!this.hideOtherMonthDays) {
          const button = document.createElement('button');
          button.innerText = new Date(year, month, 0 - (daysToSkipBefore - i))
            .getDate()
            .toString();
          button.setAttribute('disabled', 'true');
          button.setAttribute('type', 'button');
          day.append(button);
        }
        this.daysElement?.append(day);

        // Days that should show of the next month
      } else if (i > daysToSkipBefore + daysInMonth) {
        const dayNumber =
          i -
          (daysToSkipBefore + daysToSkipAfter + daysInMonth) +
          daysToSkipAfter;
        const day = document.createElement('div');
        day.classList.add('datedreamer__calendar_day', 'disabled');
        if (!this.hideOtherMonthDays) {
          const button = document.createElement('button');
          button.innerText = new Date(year, month + 1, dayNumber)
            .getDate()
            .toString();
          button.setAttribute('disabled', 'true');
          button.setAttribute('type', 'button');
          day.append(button);
        }
        this.daysElement?.append(day);
      }
    }
  }

  handleDayKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      let sibling = null;
      if (
        (sibling = (e.target as HTMLElement).parentElement?.previousSibling)
      ) {
        (sibling.firstChild as HTMLButtonElement)?.focus();
      }
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      let sibling = null;
      if ((sibling = (e.target as HTMLElement).parentElement?.nextSibling)) {
        (sibling.firstChild as HTMLButtonElement)?.focus();
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      let sibling = null;
      if (
        (sibling = (e.target as HTMLElement).parentElement?.previousSibling
          ?.previousSibling?.previousSibling?.previousSibling?.previousSibling
          ?.previousSibling?.previousSibling)
      ) {
        (sibling.firstChild as HTMLButtonElement)?.focus();
      } else {
        // Reached bottom, go to next month
        this.goToPrevMonth(e, true);
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let sibling = null;
      if (
        (sibling = (e.target as HTMLElement).parentElement?.nextSibling
          ?.nextSibling?.nextSibling?.nextSibling?.nextSibling?.nextSibling
          ?.nextSibling)
      ) {
        (sibling.firstChild as HTMLButtonElement)?.focus();
      } else {
        // Reached bottom, go to next month
        this.goToNextMonth(e, true);
      }
    }
  };

  /**
   * Go to previous month
   * @param e Event
   * @param focusLastDay Sets active focus on last day of previous month
   */
  goToPrevMonth = (e: Event, focusLastDay: boolean = false) => {
    this.displayedMonthDate.setMonth(this.displayedMonthDate.getMonth() - 1);

    if (focusLastDay) {
      this.rebuildCalendar(false, 'last');
    } else {
      this.rebuildCalendar();
    }
    if (this.onPrevNav) {
      this.onPrevNav(
        new CustomEvent('prevNav', { detail: this.displayedMonthDate })
      );
    }
  };

  /**
   * Go to next month
   * @param e Event
   * @param focusFirstDay Sets active focus on first day of next month
   */
  goToNextMonth = (e: Event, focusFirstDay: boolean = false) => {
    this.displayedMonthDate.setMonth(this.displayedMonthDate.getMonth() + 1);
    if (focusFirstDay) {
      this.rebuildCalendar(false, 'first');
    } else {
      this.rebuildCalendar();
    }
    if (this.onNextNav) {
      this.onNextNav(
        new CustomEvent('prevNav', { detail: this.displayedMonthDate })
      );
    }
  };

  /**
   *
   * @param rebuildInput Rebuilds the input elements
   * @param focusFirstorLastDay Focuses the first or last day when the calendar is rebuilt.
   */
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

    this.generateErrors();

    if (focusFirstorLastDay) {
      this.generateDays(focusFirstorLastDay);
    } else {
      this.generateDays();
    }

    this.generateHeader();

    if (rebuildInput) {
      if (this.inputsElement) {
        this.inputsElement.innerHTML = '';
      }
      this.generateInputs();
    }
  }

  /**
   * Sets the selected day of the viewable month.
   * @param day The day of the month in number format.
   */
  private setSelectedDay = (day: number) => {
    const newSelectedDate = new Date(this.displayedMonthDate);
    newSelectedDate.setDate(day);

    if (this.rangeMode) {
      if (this.connector) {
        if (
          this.connector.startDate !== null &&
          this.connector.endDate !== null
        ) {
          this.connector.startDate = null;
          this.connector.endDate = null;
          this.connector.rebuildAllCalendars();
        }

        if (this.connector.startDate == null) {
          this.connector.startDate = new Date(newSelectedDate);
        } else if (this.connector.endDate == null) {
          this.connector.endDate = new Date(newSelectedDate);
        }

        if (
          this.connector.startDate !== null &&
          this.connector.endDate !== null
        ) {
          // Swapped start and end date because start date was larger than end date
          // Optionally, handle swapped dates here
          const oldEndDate = new Date(this.connector.endDate);
          const oldStartDate = new Date(this.connector.startDate);
          this.connector.startDate = oldEndDate;
          this.connector.endDate = oldStartDate;
        }

        if (this.connector.dateChangedCallback) {
          this.connector.dateChangedCallback(new CustomEvent('dateChanged'));
        }
      }
    } else {
      this.selectedDate = new Date(newSelectedDate);
      this.rebuildCalendar();
      this.dateChangedCallback(this.selectedDate);
    }
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
  setDateToToday() {
    this.selectedDate = new Date();
    this.displayedMonthDate = new Date();
    this.rebuildCalendar();
    this.dateChangedCallback(this.selectedDate);
  }

  /**
   * Handles the KeyUp event in the date textbox.
   * @param e KeyUp event
   */
  dateInputChanged(e: Event | KeyboardEvent) {
    if (e instanceof KeyboardEvent && e.code === 'Tab') return;
    const newDate = dayjs(
      (e.target as HTMLInputElement).value,
      this.format
    ).toDate();
    if (!isNaN(newDate.getUTCMilliseconds())) {
      this.selectedDate = newDate;
      this.displayedMonthDate = new Date(newDate);
      this.rebuildCalendar(false);
      this.dateChangedCallback(this.selectedDate);
    } else {
      this.errors.push({
        type: 'input-error',
        message: 'The entered date is invalid',
      });
      this.generateErrors();
    }
  }

  /**
   * Triggers the onChange callback that was passed into the calendar options.
   * @param date The new date that has been selected in the calendar.
   */
  private dateChangedCallback(date: Date) {
    if (this.onChange) {
      const customEvent = new CustomEvent('onChange', {
        detail: dayjs(date).format(this.format),
      });
      this.onChange(customEvent);
    }
  }

  /**
   * Triggers the onRender callback that was passed into the calendar options.
   */
  private onRenderCallback() {
    if (this.onRender) {
      const customEvent = new CustomEvent('onRender', {
        detail: {
          calendar: this.calendarElement,
        },
      });
      this.onRender(customEvent);
    }
  }

  setDisplayedMonthDate(date: Date) {
    this.displayedMonthDate = date;
    this.rebuildCalendar();
  }
}

customElements.define('datedreamer-calendar', DateDreamerCalendar);

export { DateDreamerCalendar as calendar };
