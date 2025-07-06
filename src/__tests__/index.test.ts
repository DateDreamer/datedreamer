import { calendar, calendarToggle, range } from '../index';

describe('Module Exports', () => {
  test('should export calendar component', () => {
    expect(calendar).toBeDefined();
    expect(typeof calendar).toBe('function');
  });

  test('should export calendarToggle component', () => {
    expect(calendarToggle).toBeDefined();
    expect(typeof calendarToggle).toBe('function');
  });

  test('should export range component', () => {
    expect(range).toBeDefined();
    expect(typeof range).toBe('function');
  });

  test('should be able to instantiate exported components', () => {
    const testElement = document.createElement('div');
    testElement.id = 'test-exports';
    document.body.appendChild(testElement);

    expect(() => {
      new calendar({ element: testElement });
    }).not.toThrow();

    expect(() => {
      new calendarToggle({ element: testElement });
    }).not.toThrow();

    expect(() => {
      new range({ element: testElement });
    }).not.toThrow();

    document.body.removeChild(testElement);
  });
});
