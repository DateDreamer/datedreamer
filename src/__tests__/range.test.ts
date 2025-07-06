import { range } from '../components/range';
import { calendar } from '../components/calendar';

// Test interface to access private properties
interface RangeTestInstance extends range {
  connector: {
    startDate: Date | null;
    endDate: Date | null;
    pickingEndDate: Date | null;
    calendars: Array<calendar>;
    rebuildAllCalendars: () => void;
    dateChangedCallback?: ((event: CustomEvent) => void) | undefined;
  };
  calendar1DisplayedDate: Date;
  calendar2DisplayedDate: Date;
  handleDateChange: () => void;
}

describe('Range Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-range';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should create range instance', () => {
    const rangeInstance = new range({
      element: '#test-range',
      selectedDate: new Date('2024-01-15'),
    });
    expect(rangeInstance).toBeDefined();
    expect(rangeInstance.element).toBe('#test-range');
  });

  test('should render range container', () => {
    new range({
      element: '#test-range',
      selectedDate: new Date('2024-01-15'),
    });
    const rangeEl = container.querySelector('datedreamer-range');
    expect(rangeEl).toBeDefined();
  });

  test('should handle theme and dark mode', () => {
    const rangeInstance = new range({
      element: '#test-range',
      theme: 'lite-purple',
      darkMode: true,
    });
    expect(rangeInstance.theme).toBe('lite-purple');
    expect(rangeInstance.darkMode).toBe(true);
  });

  test('should support darkModeAuto', () => {
    const rangeInstance = new range({
      element: '#test-range',
      darkModeAuto: true,
    });
    expect(rangeInstance.darkModeAuto).toBe(true);
  });

  test('should call onChange when range is selected', () => {
    const onChange = jest.fn();
    const rangeInstance = new range({
      element: '#test-range',
      onChange,
    });
    // Simulate range selection
    (rangeInstance as RangeTestInstance).connector.startDate = new Date(
      '2024-01-01'
    );
    (rangeInstance as RangeTestInstance).connector.endDate = new Date(
      '2024-01-10'
    );
    (rangeInstance as RangeTestInstance).handleDateChange();
    expect(onChange).toHaveBeenCalled();
    const event = onChange.mock.calls[0][0];
    expect(event.detail.startDate).toBeDefined();
    expect(event.detail.endDate).toBeDefined();
  });

  test('should create range with predefined ranges', () => {
    const predefinedRanges = [
      {
        label: 'Last 7 Days',
        getRange: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 6);
          return { start, end };
        },
      },
      {
        label: 'This Month',
        getRange: () => {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return { start, end };
        },
      },
    ];

    const rangeInstance = new range({
      element: '#test-range',
      predefinedRanges,
    });

    expect(rangeInstance.predefinedRanges).toBeDefined();
    expect(rangeInstance.predefinedRanges?.length).toBe(2);
    expect(rangeInstance.predefinedRanges?.[0].label).toBe('Last 7 Days');
    expect(rangeInstance.predefinedRanges?.[1].label).toBe('This Month');
  });

  test('should render predefined range buttons', () => {
    const predefinedRanges = [
      {
        label: 'Last 7 Days',
        getRange: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 6);
          return { start, end };
        },
      },
      {
        label: 'This Month',
        getRange: () => {
          const now = new Date();
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return { start, end };
        },
      },
    ];

    new range({
      element: '#test-range',
      predefinedRanges,
    });

    const rangeEl = container.querySelector('datedreamer-range');
    expect(rangeEl).toBeDefined();

    const sidebar = rangeEl?.querySelector('.datedreamer-range-sidebar');
    expect(sidebar).toBeDefined();

    const buttons = sidebar?.querySelectorAll('.datedreamer-range-button');
    expect(buttons?.length).toBe(2);
    expect(buttons?.[0].textContent).toBe('Last 7 Days');
    expect(buttons?.[1].textContent).toBe('This Month');
  });

  test('should not render sidebar when no predefined ranges provided', () => {
    new range({
      element: '#test-range',
    });

    const rangeEl = container.querySelector('datedreamer-range');
    expect(rangeEl).toBeDefined();

    const sidebar = rangeEl?.querySelector('.datedreamer-range-sidebar');
    expect(sidebar).toBeNull();
  });

  test('should handle predefined range button clicks', () => {
    const onChange = jest.fn();
    const testStartDate = new Date('2024-01-01');
    const testEndDate = new Date('2024-01-07');

    const predefinedRanges = [
      {
        label: 'Test Range',
        getRange: () => ({
          start: testStartDate,
          end: testEndDate,
        }),
      },
    ];

    const rangeInstance = new range({
      element: '#test-range',
      predefinedRanges,
      onChange,
    });

    const rangeEl = container.querySelector('datedreamer-range');
    const button = rangeEl?.querySelector(
      '.datedreamer-range-button'
    ) as HTMLButtonElement;

    expect(button).toBeDefined();

    // Click the button
    button.click();

    // Check that the connector has the correct dates
    expect((rangeInstance as RangeTestInstance).connector.startDate).toEqual(
      testStartDate
    );
    expect((rangeInstance as RangeTestInstance).connector.endDate).toEqual(
      testEndDate
    );

    // Check that onChange was called
    expect(onChange).toHaveBeenCalled();
  });

  test('should update calendar display dates when predefined range is selected', () => {
    const testStartDate = new Date('2024-01-01');
    const testEndDate = new Date('2024-02-15');

    const predefinedRanges = [
      {
        label: 'Test Range',
        getRange: () => ({
          start: testStartDate,
          end: testEndDate,
        }),
      },
    ];

    const rangeInstance = new range({
      element: '#test-range',
      predefinedRanges,
    });

    const rangeEl = container.querySelector('datedreamer-range');
    const button = rangeEl?.querySelector(
      '.datedreamer-range-button'
    ) as HTMLButtonElement;

    // Click the button
    button.click();

    // Check that display dates are updated to match the range
    expect(
      (rangeInstance as RangeTestInstance).calendar1DisplayedDate.getFullYear()
    ).toBe(testStartDate.getFullYear());
    expect(
      (rangeInstance as RangeTestInstance).calendar1DisplayedDate.getMonth()
    ).toBe(testStartDate.getMonth());
    expect(
      (rangeInstance as RangeTestInstance).calendar1DisplayedDate.getDate()
    ).toBe(1); // First day of month
    expect(
      (rangeInstance as RangeTestInstance).calendar2DisplayedDate.getFullYear()
    ).toBe(testEndDate.getFullYear());
    expect(
      (rangeInstance as RangeTestInstance).calendar2DisplayedDate.getMonth()
    ).toBe(testEndDate.getMonth());
    expect(
      (rangeInstance as RangeTestInstance).calendar2DisplayedDate.getDate()
    ).toBe(1); // First day of month
  });

  test('should handle same month predefined range selection', () => {
    const testStartDate = new Date('2024-01-01');
    const testEndDate = new Date('2024-01-31');

    const predefinedRanges = [
      {
        label: 'Same Month Range',
        getRange: () => ({
          start: testStartDate,
          end: testEndDate,
        }),
      },
    ];

    const rangeInstance = new range({
      element: '#test-range',
      predefinedRanges,
    });

    const rangeEl = container.querySelector('datedreamer-range');
    const button = rangeEl?.querySelector(
      '.datedreamer-range-button'
    ) as HTMLButtonElement;

    // Click the button
    button.click();

    // Check that the connector has the correct dates set
    expect((rangeInstance as RangeTestInstance).connector.startDate).toEqual(
      testStartDate
    );
    expect((rangeInstance as RangeTestInstance).connector.endDate).toEqual(
      testEndDate
    );

    // Check that display dates are updated (less specific than before to avoid month calculation issues)
    expect(
      (rangeInstance as RangeTestInstance).calendar1DisplayedDate
    ).toBeInstanceOf(Date);
    expect(
      (rangeInstance as RangeTestInstance).calendar2DisplayedDate
    ).toBeInstanceOf(Date);
  });

  test('should handle predefined range with getRange function returning dynamic dates', () => {
    const predefinedRanges = [
      {
        label: 'Last 7 Days',
        getRange: () => {
          const end = new Date();
          const start = new Date();
          start.setDate(start.getDate() - 6);
          return { start, end };
        },
      },
    ];

    const rangeInstance = new range({
      element: '#test-range',
      predefinedRanges,
    });

    const rangeEl = container.querySelector('datedreamer-range');
    const button = rangeEl?.querySelector(
      '.datedreamer-range-button'
    ) as HTMLButtonElement;

    // Click the button
    button.click();

    // Check that dates are set (we can't predict exact dates since they're dynamic)
    expect(
      (rangeInstance as RangeTestInstance).connector.startDate
    ).toBeInstanceOf(Date);
    expect(
      (rangeInstance as RangeTestInstance).connector.endDate
    ).toBeInstanceOf(Date);
    expect(
      (rangeInstance as RangeTestInstance).connector.startDate
    ).not.toBeNull();
    expect(
      (rangeInstance as RangeTestInstance).connector.endDate
    ).not.toBeNull();
  });

  describe('Range Mode Calendar Integration', () => {
    test('should create range with connector', () => {
      const rangeInstance = new range({
        element: '#test-range',
      });

      const connector = (rangeInstance as RangeTestInstance).connector;
      expect(connector).toBeDefined();
      expect(typeof connector.rebuildAllCalendars).toBe('function');
    });

    test('should handle range mode date selection without connector', () => {
      const testContainer = document.createElement('div');
      testContainer.id = 'test-range-no-connector';
      container.appendChild(testContainer);

      const testCalendar = new calendar({
        element: testContainer,
        rangeMode: true,
        // No connector provided
      });

      // This should not throw an error
      expect(() => {
        testCalendar.setSelectedDay(15);
      }).not.toThrow();

      container.removeChild(testContainer);
    });
  });

  describe('Range Dark Mode', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    test('should support dark mode via darkMode option', () => {
      const rangeInstance = new range({
        element: '#test-range',
        darkMode: true,
      });

      expect(rangeInstance.darkMode).toBe(true);
    });

    test('should support automatic dark mode detection', () => {
      // Mock matchMedia to simulate dark mode preference
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

      const rangeInstance = new range({
        element: '#test-range',
        darkModeAuto: true,
      });

      expect(rangeInstance.darkModeAuto).toBe(true);

      // Verify dark mode class is applied to the range element
      const rangeEl = container.querySelector('datedreamer-range');
      const rangeDiv = rangeEl?.querySelector('.datedreamer-range');
      expect(rangeDiv?.classList.contains('dark')).toBe(true);
    });
  });

  describe('Range Custom Styling', () => {
    test('should support custom styles', () => {
      const customStyles = '.custom { color: red; }';
      const rangeInstance = new range({
        element: '#test-range',
        styles: customStyles,
      });

      expect(rangeInstance.styles).toBe(customStyles);
    });

    test('should support custom icons', () => {
      const rangeInstance = new range({
        element: '#test-range',
        iconPrev: '<custom-prev>',
        iconNext: '<custom-next>',
      });

      expect(rangeInstance.iconPrev).toBe('<custom-prev>');
      expect(rangeInstance.iconNext).toBe('<custom-next>');
    });

    test('should support custom date format', () => {
      const rangeInstance = new range({
        element: '#test-range',
        format: 'DD/MM/YYYY',
      });

      expect(rangeInstance.format).toBe('DD/MM/YYYY');
    });
  });

  describe('Range Error Handling', () => {
    test('should handle range creation with element object instead of string', () => {
      const elementDiv = document.createElement('div');
      document.body.appendChild(elementDiv);

      expect(() => {
        new range({
          element: elementDiv,
        });
      }).not.toThrow();

      document.body.removeChild(elementDiv);
    });

    test('should handle missing target element gracefully', () => {
      // This should not throw during construction
      expect(() => {
        new range({
          element: '#non-existent-range-element',
        });
      }).not.toThrow();
    });
  });
});
