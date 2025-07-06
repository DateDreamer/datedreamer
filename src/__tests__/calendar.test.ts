import { calendar } from '../components/calendar';

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

  test('should create calendar instance', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: new Date('2024-01-15'),
    });

    expect(calendarInstance).toBeDefined();
    expect(calendarInstance.element).toBe('#test-calendar');
  });

  test('should set selected date correctly', () => {
    const testDate = new Date('2024-01-15');
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: testDate,
    });

    expect(calendarInstance.selectedDate).toEqual(testDate);
  });

  test('should handle string date with format', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: '15/01/2024',
      format: 'DD/MM/YYYY',
    });

    expect(calendarInstance.selectedDate).toBeInstanceOf(Date);
  });

  test('should apply theme correctly', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      theme: 'lite-purple',
    });

    expect(calendarInstance.theme).toBe('lite-purple');
  });

  test('should handle dark mode', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      darkMode: true,
    });

    expect(calendarInstance.darkMode).toBe(true);
  });

  test('should support darkModeAuto', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      darkModeAuto: true,
    });
    expect(calendarInstance.darkModeAuto).toBe(true);
  });

  test('should call onChange callback', () => {
    const onChange = jest.fn();
    const calendarInstance = new calendar({
      element: '#test-calendar',
      onChange,
    });
    calendarInstance.setDate('2024-02-01');
    expect(onChange).toHaveBeenCalled();
    const event = onChange.mock.calls[0][0];
    expect(event.detail).toBeDefined();
  });

  test('should call onRender callback', () => {
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
      selectedDate: new Date('2024-01-15'),
    });
    const initialMonth = calendarInstance.displayedMonthDate.getMonth();
    calendarInstance.goToNextMonth();
    expect(calendarInstance.displayedMonthDate.getMonth()).toBe(
      (initialMonth + 1) % 12
    );
    calendarInstance.goToPrevMonth();
    expect(calendarInstance.displayedMonthDate.getMonth()).toBe(initialMonth);
  });

  test('should handle input field changes and validation', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      format: 'YYYY-MM-DD',
    });

    // Simulate valid input
    const inputEvent = { target: { value: '2024-03-10' } } as unknown as Event;
    calendarInstance.dateInputChanged(inputEvent);
    // Compare only the date part to avoid timezone issues
    const selected = calendarInstance.selectedDate;
    expect(selected.toISOString().slice(0, 10)).toBe('2024-03-10');

    // Store the current date before invalid input
    const dateBeforeInvalidInput = new Date(calendarInstance.selectedDate);

    // Simulate invalid input
    const invalidEvent = {
      target: { value: 'invalid-date' },
    } as unknown as Event;
    calendarInstance.dateInputChanged(invalidEvent);

    // Verify that the date didn't change (because input was invalid)
    expect(calendarInstance.selectedDate).toEqual(dateBeforeInvalidInput);
  });

  test('should handle missing element error', () => {
    expect(() => {
      new calendar({ element: null as unknown as Element });
    }).toThrow();
  });

  test('should handle invalid date string', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: 'not-a-date',
      format: 'YYYY-MM-DD',
    });
    expect(calendarInstance.selectedDate).toBeInstanceOf(Date);
  });

  test('should rebuild calendar without errors', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
    });
    expect(() => calendarInstance.rebuildCalendar()).not.toThrow();
  });

  test('should handle Tab key in input without processing', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      format: 'YYYY-MM-DD',
    });
    const tabEvent = new KeyboardEvent('keyup', { code: 'Tab' });
    const dateBeforeTab = new Date(calendarInstance.selectedDate);
    calendarInstance.dateInputChanged(tabEvent);
    expect(calendarInstance.selectedDate).toEqual(dateBeforeTab);
  });

  test('should set date to today', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      selectedDate: new Date('2024-01-15'),
    });
    const today = new Date();
    calendarInstance.setDateToToday();
    expect(calendarInstance.selectedDate.toDateString()).toBe(
      today.toDateString()
    );
  });

  test('should handle custom icons', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      iconPrev: '<span>←</span>',
      iconNext: '<span>→</span>',
    });
    expect(calendarInstance.iconPrev).toBe('<span>←</span>');
    expect(calendarInstance.iconNext).toBe('<span>→</span>');
  });

  test('should handle hideInputs option', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      hideInputs: true,
    });
    expect(calendarInstance.hideInputs).toBe(true);
  });

  test('should handle hideOtherMonthDays option', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      hideOtherMonthDays: true,
    });
    expect(calendarInstance.hideOtherMonthDays).toBe(true);
  });

  test('should handle range mode', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      rangeMode: true,
    });
    expect(calendarInstance.rangeMode).toBe(true);
  });

  test('should handle custom input label and placeholder', () => {
    const calendarInstance = new calendar({
      element: '#test-calendar',
      inputLabel: 'Custom Label',
      inputPlaceholder: 'Custom Placeholder',
    });
    expect(calendarInstance.inputLabel).toBe('Custom Label');
    expect(calendarInstance.inputPlaceholder).toBe('Custom Placeholder');
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
});
