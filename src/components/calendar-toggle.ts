import { ICalendarOptions } from '../interfaces/calendar.interface';
import { calendar } from './calendar';
import { calendarToggleRoot } from '../utils/calendar-utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

class DateDreamerCalendarToggle extends HTMLElement {
  element: Element | string;
  inputElement: Element | undefined;
  calendarElement: calendar | undefined;
  calendarWrapElement: Element | undefined;
  options: ICalendarOptions;
  inputPlaceholder: string = 'Enter a date';

  constructor(options: ICalendarOptions) {
    super();

    this.options = options;

    this.element = options.element;

    this.attachShadow({ mode: 'open' });

    this.init();
  }

  init() {
    // Check if element is defined
    // exits function and logs error if false
    if (this.element == null) {
      throw new Error(
        'No element was provided to calendarToggle. Initializing aborted'
      );
    }

    this.generateTemplate();

    document.addEventListener('click', (event: MouseEvent) => {
      if (this !== event.target && !this.contains(event.target as Node)) {
        this.calendarWrapElement?.classList.remove('active');
      }
    });
  }

  /**
   * Determines whether dark mode should be enabled based on user preferences
   * @returns boolean indicating if dark mode should be active
   */
  private getDarkModeSetting(): boolean {
    // If darkModeAuto is enabled, check system preference
    if (this.options.darkModeAuto) {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }

    // Otherwise, use the manual darkMode setting
    return this.options.darkMode || false;
  }

  generateTemplate() {
    let selectedDate;

    if (
      typeof this.options.selectedDate == 'string' ||
      typeof this.options.selectedDate == 'object'
    ) {
      selectedDate = dayjs(
        this.options.selectedDate,
        this.options.format
      ).format(this.options.format);
    } else {
      selectedDate = dayjs().format(this.options.format);
    }

    // Determine dark mode setting for toggle component
    const shouldUseDarkMode = this.getDarkModeSetting();

    const template = calendarToggleRoot(
      this.options.theme,
      this.options.styles,
      this.inputPlaceholder,
      selectedDate,
      shouldUseDarkMode
    );

    let selectedElement = undefined;
    if (typeof this.element == 'string') {
      selectedElement = document.querySelector(this.element as string);
    } else if (typeof this.element == 'object') {
      selectedElement = this.element;
    }

    if (selectedElement) {
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = template;
      }
      selectedElement.append(this);

      const calendarWrap = this.shadowRoot?.querySelector(
        '.datedreamer__calendar-toggle__calendar'
      );
      const inputElement = this.shadowRoot?.querySelector('#date-input');

      if (calendarWrap) {
        this.calendarWrapElement = calendarWrap;
      }

      if (inputElement) {
        this.inputElement = inputElement;
        this.inputElement.addEventListener('focus', () => {
          this.calendarWrapElement?.classList.add('active');
        });
      }

      this.generateCalendar();
    } else {
      throw new Error(`Could not find ${this.element} in DOM.`);
    }
  }

  generateCalendar() {
    const cal = new calendar({
      ...this.options,
      element: this.calendarWrapElement || '',
      hideInputs: true,
      onChange: e => this.dateChangedHandler(e),
    });
    this.calendarElement = cal;
  }

  dateChangedHandler(e: CustomEvent<string>) {
    (this.inputElement as HTMLInputElement).value = e.detail;
    this.calendarWrapElement?.classList.remove('active');
    if (this.options.onChange) {
      this.options.onChange(e);
    }
  }
}

customElements.define('datedreamer-calendar-toggle', DateDreamerCalendarToggle);

export { DateDreamerCalendarToggle as calendarToggle };
