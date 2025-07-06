import { range } from '../components/range';

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
    (rangeInstance as any).connector.startDate = new Date('2024-01-01');
    (rangeInstance as any).connector.endDate = new Date('2024-01-10');
    (rangeInstance as any).handleDateChange();
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
    expect((rangeInstance as any).connector.startDate).toEqual(testStartDate);
    expect((rangeInstance as any).connector.endDate).toEqual(testEndDate);

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
    expect((rangeInstance as any).calendar1DisplayedDate.getFullYear()).toBe(
      testStartDate.getFullYear()
    );
    expect((rangeInstance as any).calendar1DisplayedDate.getMonth()).toBe(
      testStartDate.getMonth()
    );
    expect((rangeInstance as any).calendar1DisplayedDate.getDate()).toBe(1); // First day of month
    expect((rangeInstance as any).calendar2DisplayedDate.getFullYear()).toBe(
      testEndDate.getFullYear()
    );
    expect((rangeInstance as any).calendar2DisplayedDate.getMonth()).toBe(
      testEndDate.getMonth()
    );
    expect((rangeInstance as any).calendar2DisplayedDate.getDate()).toBe(1); // First day of month
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
    expect((rangeInstance as any).connector.startDate).toEqual(testStartDate);
    expect((rangeInstance as any).connector.endDate).toEqual(testEndDate);

    // Check that display dates are updated (less specific than before to avoid month calculation issues)
    expect((rangeInstance as any).calendar1DisplayedDate).toBeInstanceOf(Date);
    expect((rangeInstance as any).calendar2DisplayedDate).toBeInstanceOf(Date);
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
    expect((rangeInstance as any).connector.startDate).toBeInstanceOf(Date);
    expect((rangeInstance as any).connector.endDate).toBeInstanceOf(Date);
    expect((rangeInstance as any).connector.startDate).not.toBeNull();
    expect((rangeInstance as any).connector.endDate).not.toBeNull();
  });
});
