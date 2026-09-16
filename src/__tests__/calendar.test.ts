import { calendar } from '../components/calendar';
import CalendarConnector from '../components/connector';

/** Finds the rendered day button with the given number in the shadow DOM. */
function dayButton(cal: calendar, dayNumber: string): HTMLButtonElement | null {
  const buttons = Array.from(
    cal.shadowRoot?.querySelectorAll<HTMLButtonElement>(
      '.datedreamer__calendar_days button'
    ) ?? []
  );
  return buttons.find(b => b.innerText === dayNumber) ?? null;
}

describe('Calendar Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-calendar';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should render the calendar into the target element', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: new Date(2024, 0, 15),
    });

    expect(container.contains(calendarInstance)).toBe(true);
    expect(
      calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar')
    ).not.toBeNull();
  });

  test('should mark the selected day as active in the grid', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: new Date(2024, 0, 15),
    });

    const button = dayButton(calendarInstance, '15');
    expect(button).not.toBeNull();
    expect(button!.parentElement?.classList.contains('active')).toBe(true);
    expect(button!.getAttribute('aria-selected')).toBe('true');
  });

  test('should parse a string date using the provided format', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: '15/01/2024',
      format: 'DD/MM/YYYY',
    });

    expect(calendarInstance.selectedDate.getFullYear()).toBe(2024);
    expect(calendarInstance.selectedDate.getMonth()).toBe(0);
    expect(calendarInstance.selectedDate.getDate()).toBe(15);
  });

  test('should produce an invalid Date for an unparseable string', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: 'not-a-date',
      format: 'YYYY-MM-DD',
    });

    expect(calendarInstance.selectedDate).toBeInstanceOf(Date);
    expect(isNaN(calendarInstance.selectedDate.getTime())).toBe(true);
  });

  test('should inject lite-purple theme styles into the shadow DOM', () => {
    const themed = new calendar({
      element: '#test-calendar',
      theme: 'lite-purple',
    });
    const defaultThemed = new calendar({
      element: document.createElement('div'),
    });

    expect(themed.shadowRoot?.querySelector('style')?.textContent).toContain(
      '#7d56da'
    );
    expect(
      defaultThemed.shadowRoot?.querySelector('style')?.textContent
    ).not.toContain('#7d56da');
  });

  test('should apply the dark class to the calendar root when darkMode is enabled', () => {
    const dark = new calendar({
      element: '#test-calendar',
      darkMode: true,
    });
    const light = new calendar({
      element: document.createElement('div'),
    });

    expect(
      dark.shadowRoot?.querySelector('.datedreamer__calendar')?.classList
    ).toContain('dark');
    expect(
      light.shadowRoot?.querySelector('.datedreamer__calendar')?.classList
    ).not.toContain('dark');
  });

  test('should detect system dark preference when darkModeAuto is enabled', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const calendarInstance = new calendar({
      element: '#test-calendar',
      darkModeAuto: true,
    });

    expect(
      calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar')
        ?.classList
    ).toContain('dark');
  });

  test('should call onChange callback with the new date when setDate is used', () => {
    const onChange = jest.fn();
    const calendarInstance = new calendar({
      element: '#test-calendar',
      onChange,
    });
    calendarInstance.setDate(new Date(2024, 1, 1));

    expect(onChange).toHaveBeenCalledTimes(1);
    const event = onChange.mock.calls[0][0] as CustomEvent;
    expect(String(event.detail)).toMatch(/^2024-02-01/);
  });

  test('should call onRender callback when the calendar renders', () => {
    const onRender = jest.fn();
    new calendar({
      element: '#test-calendar',
      onRender,
    });
    expect(onRender).toHaveBeenCalled();
  });

  test('should navigate to next and previous month', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: new Date(2024, 0, 15),
    });
    const initialMonth = calendarInstance.displayedMonthDate.getMonth();
    calendarInstance.goToNextMonth();
    expect(calendarInstance.displayedMonthDate.getMonth()).toBe(
      (initialMonth + 1) % 12
    );
    calendarInstance.goToPrevMonth();
    expect(calendarInstance.displayedMonthDate.getMonth()).toBe(initialMonth);
  });

  test('should hide navigation buttons when configured', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      hidePrevNav: true,
      hideNextNav: true,
    });

    expect(
      calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar_prev')
    ).toBeNull();
    expect(
      calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar_next')
    ).toBeNull();
  });

  test('should render custom navigation icons in the header buttons', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      iconPrev: '<span>prev-icon</span>',
      iconNext: '<span>next-icon</span>',
    });

    expect(
      calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar_prev')
        ?.innerHTML
    ).toContain('<span>prev-icon</span>');
    expect(
      calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar_next')
        ?.innerHTML
    ).toContain('<span>next-icon</span>');
  });

  test('should not render the date input when hideInputs is set', () => {
    const hidden = new calendar({
      element: '#test-calendar',
      hideInputs: true,
    });
    const visible = new calendar({
      element: document.createElement('div'),
    });

    expect(hidden.shadowRoot?.querySelector('#date-input')).toBeNull();
    expect(visible.shadowRoot?.querySelector('#date-input')).not.toBeNull();
  });

  test('should hide adjacent-month days when hideOtherMonthDays is set', () => {
    const hidden = new calendar({
      element: '#test-calendar',
      selectedDate: new Date(2024, 0, 15),
      hideOtherMonthDays: true,
    });
    const visible = new calendar({
      element: document.createElement('div'),
      selectedDate: new Date(2024, 0, 15),
    });

    expect(
      hidden.shadowRoot?.querySelectorAll('[aria-disabled="true"]').length
    ).toBe(0);
    expect(
      visible.shadowRoot?.querySelectorAll('[aria-disabled="true"]').length
    ).toBeGreaterThan(0);
  });

  test('should report range mode through the public API', () => {
    const rangeCal = new calendar({
      element: '#test-calendar',
      rangeMode: true,
    });
    const plainCal = new calendar({
      element: document.createElement('div'),
    });

    expect(rangeCal.getIsInRangeMode()).toBe(true);
    expect(plainCal.getIsInRangeMode()).toBe(false);
  });

  test('should render custom input label and placeholder', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      inputLabel: 'Custom Label',
      inputPlaceholder: 'Custom Placeholder',
    });

    expect(
      calendarInstance.shadowRoot?.querySelector('label[for="date-input"]')
        ?.textContent
    ).toBe('Custom Label');
    expect(
      calendarInstance.shadowRoot
        ?.querySelector('#date-input')
        ?.getAttribute('placeholder')
    ).toBe('Custom Placeholder');
  });

  test('should handle navigation callbacks', () => {
    const onNextNav = jest.fn();
    const onPrevNav = jest.fn();
    const calendarInstance = new calendar({
      element: '#test-calendar',
      onNextNav,
      onPrevNav,
    });
    calendarInstance.goToNextMonth();
    expect(onNextNav).toHaveBeenCalled();
    calendarInstance.goToPrevMonth();
    expect(onPrevNav).toHaveBeenCalled();
  });

  test('should set date to today when setDateToToday is called', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: new Date(2024, 0, 15),
    });
    const today = new Date();
    calendarInstance.setDateToToday();
    expect(calendarInstance.selectedDate.toDateString()).toBe(
      today.toDateString()
    );
  });

  describe('Date input', () => {
    test('should update the selected date on a valid keyup and fire onChange', () => {
      const onChange = jest.fn();
      const calendarInstance = new calendar({
        element: '#test-calendar',
        format: 'YYYY-MM-DD',
        onChange,
      });

      const input = calendarInstance.shadowRoot?.querySelector(
        '#date-input'
      ) as HTMLInputElement;
      input.value = '2024-03-10';
      input.dispatchEvent(new KeyboardEvent('keyup'));

      expect(calendarInstance.selectedDate.toISOString().slice(0, 10)).toBe(
        '2024-03-10'
      );
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('should keep the date and show an error message for invalid input', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        format: 'YYYY-MM-DD',
      });
      const dateBeforeInvalidInput = new Date(calendarInstance.selectedDate);

      const input = calendarInstance.shadowRoot?.querySelector(
        '#date-input'
      ) as HTMLInputElement;
      input.value = 'invalid-date';
      input.dispatchEvent(new KeyboardEvent('keyup'));

      expect(calendarInstance.selectedDate).toEqual(dateBeforeInvalidInput);
      expect(
        calendarInstance.shadowRoot?.querySelector<HTMLSpanElement>(
          '.datedreamer__calendar_errors span'
        )?.innerText
      ).toBe('The entered date is invalid');
    });

    test('should ignore Tab keyups in the input', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        format: 'YYYY-MM-DD',
      });
      const dateBeforeTab = new Date(calendarInstance.selectedDate);

      const input = calendarInstance.shadowRoot?.querySelector(
        '#date-input'
      ) as HTMLInputElement;
      input.value = '2024-03-10';
      input.dispatchEvent(new KeyboardEvent('keyup', { code: 'Tab' }));

      expect(calendarInstance.selectedDate).toEqual(dateBeforeTab);
    });
  });

  describe('Keyboard Navigation', () => {
    let calendarInstance: calendar;

    beforeEach(() => {
      calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });
    });

    function pressKey(dayNumber: string, key: string) {
      const button = dayButton(calendarInstance, dayNumber);
      expect(button).not.toBeNull();
      button!.dispatchEvent(new KeyboardEvent('keydown', { key }));
    }

    // jsdom does not track document.activeElement across shadow roots,
    // so focus is asserted via the focus event on the expected target.
    function pressOn(
      fromDay: string,
      key: string,
      expectedTarget: HTMLElement | null
    ) {
      expect(expectedTarget).not.toBeNull();
      let focused = false;
      expectedTarget!.addEventListener('focus', () => {
        focused = true;
      });
      pressKey(fromDay, key);
      expect(focused).toBe(true);
    }

    test('ArrowRight should focus the next day', () => {
      pressOn('15', 'ArrowRight', dayButton(calendarInstance, '16'));
    });

    test('ArrowLeft should focus the previous day', () => {
      pressOn('15', 'ArrowLeft', dayButton(calendarInstance, '14'));
    });

    test('ArrowDown should focus the day one week later', () => {
      pressOn('15', 'ArrowDown', dayButton(calendarInstance, '22'));
    });

    test('ArrowUp should focus the day one week earlier', () => {
      pressOn('15', 'ArrowUp', dayButton(calendarInstance, '8'));
    });

    test('Enter should select the focused day and fire onChange', () => {
      const onChange = jest.fn();
      calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
        onChange,
      });

      pressKey('20', 'Enter');

      expect(calendarInstance.selectedDate.getDate()).toBe(20);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(
        dayButton(calendarInstance, '20')?.parentElement?.classList
      ).toContain('active');
    });

    test('Home and End should focus the first and last day buttons', () => {
      const buttons = Array.from(
        calendarInstance.shadowRoot?.querySelectorAll<HTMLButtonElement>(
          '.datedreamer__calendar_days button'
        ) ?? []
      );

      pressOn('15', 'Home', buttons[0]);
      pressOn('15', 'End', buttons[buttons.length - 1]);
    });
  });

  describe('Dark Mode Functionality', () => {
    test('should toggle the dark class when the system preference changes', () => {
      let matches = false;
      let changeCallback: (() => void) | undefined;
      window.matchMedia = jest.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: (_type: string, cb: () => void) => {
          changeCallback = cb;
        },
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const calendarInstance = new calendar({
        element: '#test-calendar',
        darkModeAuto: true,
      });
      const root = () =>
        calendarInstance.shadowRoot?.querySelector('.datedreamer__calendar');

      expect(root()?.classList).not.toContain('dark');

      matches = true;
      changeCallback!();
      expect(root()?.classList).toContain('dark');

      matches = false;
      changeCallback!();
      expect(root()?.classList).not.toContain('dark');
    });
  });

  describe('Public API', () => {
    test('getSelectedDate should return the current selection', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });

      expect(calendarInstance.getSelectedDate()).toEqual(new Date(2024, 0, 15));
      calendarInstance.setDate(new Date(2024, 1, 10));
      expect(calendarInstance.getSelectedDate()!.getDate()).toBe(10);
    });

    test('display month getters should reflect navigation', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });

      expect(calendarInstance.getDisplayMonth()).toEqual(new Date(2024, 0, 15));
      expect(calendarInstance.getDisplayedYear()).toBe(2024);
      expect(calendarInstance.getDisplayMonthName()).toBe('January');

      calendarInstance.goToNextMonth();
      expect(calendarInstance.getDisplayMonthName()).toBe('February');
      expect(calendarInstance.getDisplayedYear()).toBe(2024);
    });

    test('isSelected should compare calendar days, not timestamps', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15, 9, 0),
      });

      expect(calendarInstance.isSelected(new Date(2024, 0, 15, 21, 30))).toBe(
        true
      );
      expect(calendarInstance.isSelected(new Date(2024, 0, 16))).toBe(false);
    });

    test('isDateInRange should be false outside range mode', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });

      expect(calendarInstance.isDateInRange(new Date(2024, 0, 15))).toBe(false);
    });

    test('isDateInRange should check the connector range inclusively', () => {
      const connector = new CalendarConnector();
      connector.startDate = new Date(2024, 0, 10);
      connector.endDate = new Date(2024, 0, 20);

      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
        rangeMode: true,
        connector,
      });

      expect(calendarInstance.isDateInRange(new Date(2024, 0, 15))).toBe(true);
      expect(calendarInstance.isDateInRange(connector.startDate!)).toBe(true);
      expect(calendarInstance.isDateInRange(connector.endDate!)).toBe(true);
      expect(calendarInstance.isDateInRange(new Date(2024, 0, 9))).toBe(false);
      expect(calendarInstance.isDateInRange(new Date(2024, 0, 21))).toBe(false);
    });

    test('isDateInRange should be false in range mode without a connector', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
        rangeMode: true,
      });

      expect(calendarInstance.isDateInRange(new Date(2024, 0, 15))).toBe(false);
    });

    test('focus methods should move focus within the shadow DOM', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });
      const buttons = Array.from(
        calendarInstance.shadowRoot?.querySelectorAll<HTMLButtonElement>(
          '.datedreamer__calendar_days button'
        ) ?? []
      );

      // jsdom does not track document.activeElement across shadow roots,
      // so focus is asserted via the focus event on the expected target.
      function assertFocused(
        target: HTMLElement | null | undefined,
        action: () => void
      ) {
        expect(target).toBeTruthy();
        let focused = false;
        target!.addEventListener('focus', () => {
          focused = true;
        });
        action();
        expect(focused).toBe(true);
      }

      assertFocused(
        calendarInstance.shadowRoot?.querySelector('#date-input'),
        () => calendarInstance.focusInput()
      );
      assertFocused(buttons[0], () => calendarInstance.focusFirstDay());
      assertFocused(buttons[buttons.length - 1], () =>
        calendarInstance.focusLastDay()
      );
    });

    test('clearSelection should reset the selection to today and fire onChange', () => {
      const onChange = jest.fn();
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
        onChange,
      });

      calendarInstance.clearSelection();

      expect(calendarInstance.selectedDate.toDateString()).toBe(
        new Date().toDateString()
      );
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('resetSelection should return the view to the selected month', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });

      calendarInstance.goToNextMonth();
      expect(calendarInstance.displayedMonthDate.getMonth()).toBe(1);

      calendarInstance.resetSelection();
      expect(calendarInstance.displayedMonthDate.getMonth()).toBe(0);
      expect(calendarInstance.displayedMonthDate.getFullYear()).toBe(2024);
    });

    test('goToMonth should navigate across year boundaries', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 15),
      });

      calendarInstance.goToMonth(2023, 11);
      expect(calendarInstance.getDisplayedYear()).toBe(2023);
      expect(calendarInstance.getDisplayMonthName()).toBe('December');

      calendarInstance.goToMonth(2025, 0);
      expect(calendarInstance.getDisplayedYear()).toBe(2025);
      expect(calendarInstance.getDisplayMonthName()).toBe('January');
    });

    test('goToPrevWeek and goToNextWeek should land on the week boundaries', () => {
      // 2024-01-17 is a Wednesday; its ISO week runs Mon 15th to Sat 20th.
      let calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 0, 17),
      });
      calendarInstance.goToPrevWeek();
      expect(calendarInstance.displayedMonthDate).toEqual(
        new Date(2024, 0, 15)
      );

      calendarInstance = new calendar({
        element: document.createElement('div'),
        selectedDate: new Date(2024, 0, 17),
      });
      calendarInstance.goToNextWeek();
      expect(calendarInstance.displayedMonthDate).toEqual(
        new Date(2024, 0, 20)
      );
    });

    test('jumpToStartOfMonth and jumpToEndOfMonth should land on month edges', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(2024, 1, 15), // February 2024 (leap year)
      });

      calendarInstance.jumpToStartOfMonth();
      expect(calendarInstance.displayedMonthDate.getDate()).toBe(1);

      calendarInstance.jumpToEndOfMonth();
      expect(calendarInstance.displayedMonthDate.getDate()).toBe(29);
    });

    test('isTodayVisible should reflect the displayed month', () => {
      const calendarInstance = new calendar({
        element: '#test-calendar',
        selectedDate: new Date(),
      });

      expect(calendarInstance.isTodayVisible()).toBe(true);
      calendarInstance.goToNextMonth();
      expect(calendarInstance.isTodayVisible()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should throw when no element is provided', () => {
      expect(() => {
        new calendar({ element: null as unknown as Element });
      }).toThrow();
    });

    test('should throw a descriptive error for a missing selector', () => {
      expect(() => {
        new calendar({ element: '#non-existent-element' });
      }).toThrow('Could not find #non-existent-element in DOM.');
    });
  });
});
