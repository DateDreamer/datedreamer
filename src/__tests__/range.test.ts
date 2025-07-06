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
});
