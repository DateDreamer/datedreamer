import { calendarToggle } from '../components/calendar-toggle';

describe('CalendarToggle Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-toggle';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should create calendarToggle instance', () => {
    const toggleInstance = new calendarToggle({
      element: '#test-toggle',
      selectedDate: new Date('2024-01-15'),
    });
    expect(toggleInstance).toBeDefined();
    expect(toggleInstance.element).toBe('#test-toggle');
  });

  test('should render input and calendar container', () => {
    new calendarToggle({
      element: '#test-toggle',
      selectedDate: new Date('2024-01-15'),
    });
    const input = container.querySelector('datedreamer-calendar-toggle');
    expect(input).toBeDefined();
  });

  test('should handle theme and dark mode', () => {
    const toggleInstance = new calendarToggle({
      element: '#test-toggle',
      theme: 'lite-purple',
      darkMode: true,
    });
    expect(toggleInstance.options.theme).toBe('lite-purple');
    expect(toggleInstance.options.darkMode).toBe(true);
  });

  test('should support darkModeAuto', () => {
    const toggleInstance = new calendarToggle({
      element: '#test-toggle',
      darkModeAuto: true,
    });
    expect(toggleInstance.options.darkModeAuto).toBe(true);
  });

  test('should open calendar on input focus', () => {
    const toggleInstance = new calendarToggle({
      element: '#test-toggle',
      selectedDate: new Date('2024-01-15'),
    });
    const shadow = toggleInstance.shadowRoot;
    const input = shadow?.querySelector('#date-input') as HTMLInputElement;
    const calendarWrap = shadow?.querySelector(
      '.datedreamer__calendar-toggle__calendar'
    );
    input?.dispatchEvent(new Event('focus'));
    expect(calendarWrap?.classList.contains('active')).toBe(true);
  });

  test('should update input value on date change', () => {
    const toggleInstance = new calendarToggle({
      element: '#test-toggle',
      selectedDate: new Date('2024-01-15'),
    });
    const shadow = toggleInstance.shadowRoot;
    const input = shadow?.querySelector('#date-input') as HTMLInputElement;
    // Simulate date change event
    const event = new CustomEvent('onChange', { detail: '2024-02-01' });
    // Access the private method for testing
    (
      toggleInstance as unknown as {
        dateChangedHandler: (event: CustomEvent) => void;
      }
    ).dateChangedHandler(event);
    expect(input.value).toBe('2024-02-01');
  });

  describe('Error Handling', () => {
    test('should throw error when no element provided', () => {
      expect(() => {
        new calendarToggle({ element: null as unknown as Element });
      }).toThrow(
        'No element was provided to calendarToggle. Initializing aborted'
      );
    });

    test('should throw error when element not found in DOM', () => {
      expect(() => {
        new calendarToggle({ element: '#non-existent-toggle-element' });
      }).toThrow('Could not find #non-existent-toggle-element in DOM.');
    });
  });

  describe('Outside Click Handling', () => {
    test('should close calendar on outside click', () => {
      const toggleInstance = new calendarToggle({
        element: '#test-toggle',
        selectedDate: new Date('2024-01-15'),
      });

      const shadow = toggleInstance.shadowRoot;
      const input = shadow?.querySelector('#date-input') as HTMLInputElement;
      const calendarWrap = shadow?.querySelector(
        '.datedreamer__calendar-toggle__calendar'
      );

      // Open the calendar
      input?.dispatchEvent(new Event('focus'));
      expect(calendarWrap?.classList.contains('active')).toBe(true);

      // Simulate outside click
      const outsideClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(outsideClickEvent, 'target', {
        value: document.body,
      });

      document.dispatchEvent(outsideClickEvent);

      // Calendar should be closed
      expect(calendarWrap?.classList.contains('active')).toBe(false);
    });

    test('should not close calendar on inside click', () => {
      const toggleInstance = new calendarToggle({
        element: '#test-toggle',
        selectedDate: new Date('2024-01-15'),
      });

      const shadow = toggleInstance.shadowRoot;
      const input = shadow?.querySelector('#date-input') as HTMLInputElement;
      const calendarWrap = shadow?.querySelector(
        '.datedreamer__calendar-toggle__calendar'
      );

      // Open the calendar
      input?.dispatchEvent(new Event('focus'));
      expect(calendarWrap?.classList.contains('active')).toBe(true);

      // Simulate inside click
      const insideClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(insideClickEvent, 'target', {
        value: toggleInstance,
      });

      document.dispatchEvent(insideClickEvent);

      // Calendar should remain open
      expect(calendarWrap?.classList.contains('active')).toBe(true);
    });
  });

  describe('Dark Mode Support', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    test('should detect system dark mode preference when darkModeAuto is enabled', () => {
      // Mock matchMedia to return dark mode preference
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

      const toggleInstance = new calendarToggle({
        element: '#test-toggle',
        darkModeAuto: true,
      });

      // Access private method for testing
      const shouldUseDarkMode = (
        toggleInstance as unknown as { getDarkModeSetting: () => boolean }
      ).getDarkModeSetting();
      expect(shouldUseDarkMode).toBe(true);
    });

    test('should use manual dark mode setting when darkModeAuto is disabled', () => {
      const toggleInstance = new calendarToggle({
        element: '#test-toggle',
        darkMode: true,
        darkModeAuto: false,
      });

      // Access private method for testing
      const shouldUseDarkMode = (
        toggleInstance as unknown as { getDarkModeSetting: () => boolean }
      ).getDarkModeSetting();
      expect(shouldUseDarkMode).toBe(true);
    });

    test('should handle missing window.matchMedia gracefully', () => {
      // Remove matchMedia to test fallback
      delete (window as unknown as { matchMedia: undefined }).matchMedia;

      expect(() => {
        new calendarToggle({
          element: '#test-toggle',
          darkModeAuto: true,
        });
      }).not.toThrow();

      // Restore
      window.matchMedia = originalMatchMedia;
    });
  });

  describe('Element Type Handling', () => {
    test('should work with Element object instead of string selector', () => {
      const elementDiv = document.createElement('div');
      elementDiv.id = 'element-toggle';
      document.body.appendChild(elementDiv);

      expect(() => {
        new calendarToggle({
          element: elementDiv,
          selectedDate: new Date('2024-01-15'),
        });
      }).not.toThrow();

      document.body.removeChild(elementDiv);
    });
  });

  describe('Date Format Handling', () => {
    test('should handle undefined selectedDate', () => {
      expect(() => {
        new calendarToggle({
          element: '#test-toggle',
          // selectedDate is undefined
        });
      }).not.toThrow();
    });

    test('should handle custom date format', () => {
      const toggleInstance = new calendarToggle({
        element: '#test-toggle',
        selectedDate: '15/01/2024',
        format: 'DD/MM/YYYY',
      });

      const shadow = toggleInstance.shadowRoot;
      const input = shadow?.querySelector('#date-input') as HTMLInputElement;
      expect(input.value).toBe('15/01/2024');
    });
  });
});
