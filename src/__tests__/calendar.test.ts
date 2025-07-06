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
});
