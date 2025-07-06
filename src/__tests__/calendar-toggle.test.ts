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
    (toggleInstance as any).dateChangedHandler(event);
    expect(input.value).toBe('2024-02-01');
  });
});
