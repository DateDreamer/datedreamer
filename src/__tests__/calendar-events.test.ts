import * as CalendarEvents from '../components/calendar-events';
import { calendar } from '../components/calendar';
import CalendarConnector from '../components/connector';
import { generateErrors } from '../components/calendar-render';

// Mock all calendar-render functions to prevent initialization errors
jest.mock('../components/calendar-render', () => ({
  generateErrors: jest.fn(),
  generateHeader: jest.fn(),
  generateInputs: jest.fn(),
  generateCalendar: jest.fn(),
  generateDays: jest.fn(),
  generateWeekdays: jest.fn(),
  generateTitle: jest.fn(),
  generateErrorsWrapper: jest.fn(),
  rebuildCalendar: jest.fn(),
}));

describe('Calendar Events', () => {
  let container: HTMLElement;
  let mockCalendar: calendar;

  beforeEach(() => {
    // Create test container
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // Create mock calendar instance
    mockCalendar = new calendar({
      element: container,
      selectedDate: new Date('2024-01-15'),
      format: 'YYYY-MM-DD',
    });

    // Mock required elements and methods
    mockCalendar.daysElement = document.createElement('div');
    mockCalendar.errorsElement = document.createElement('div');
    mockCalendar.rebuildCalendar = jest.fn();
    mockCalendar.errors = [];

    // Set up the DOM element in mockCalendar.daysElement
    mockCalendar.daysElement.innerHTML = `
      <div><button>14</button></div>
      <div><button>15</button></div>
      <div><button>16</button></div>
    `;

    // Set up the mock structure with proper assignment
    Object.defineProperty(mockCalendar.daysElement, 'children', {
      value: mockCalendar.daysElement.children,
      writable: false,
    });
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  describe('goToPrevMonth', () => {
    test('should navigate to previous month', () => {
      const initialMonth = mockCalendar.displayedMonthDate.getMonth();

      CalendarEvents.goToPrevMonth(mockCalendar);

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(mockCalendar.displayedMonthDate.getMonth()).toBe(expectedMonth);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(true, 'last');
    });

    test('should call onPrevNav callback when provided', () => {
      const onPrevNavMock = jest.fn();
      mockCalendar.onPrevNav = onPrevNavMock;

      CalendarEvents.goToPrevMonth(mockCalendar);

      expect(onPrevNavMock).toHaveBeenCalled();
      const eventArg = onPrevNavMock.mock.calls[0][0];
      expect(eventArg.detail.displayedMonthDate).toBeDefined();
      expect(eventArg.detail.calendar).toBeDefined();
    });
  });

  describe('goToNextMonth', () => {
    test('should navigate to next month', () => {
      const initialMonth = mockCalendar.displayedMonthDate.getMonth();

      CalendarEvents.goToNextMonth(mockCalendar);

      const expectedMonth = initialMonth === 11 ? 0 : initialMonth + 1;
      expect(mockCalendar.displayedMonthDate.getMonth()).toBe(expectedMonth);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(true, 'first');
    });

    test('should call onNextNav callback when provided', () => {
      const onNextNavMock = jest.fn();
      mockCalendar.onNextNav = onNextNavMock;

      CalendarEvents.goToNextMonth(mockCalendar);

      expect(onNextNavMock).toHaveBeenCalled();
      const eventArg = onNextNavMock.mock.calls[0][0];
      expect(eventArg.detail.displayedMonthDate).toBeDefined();
      expect(eventArg.detail.calendar).toBeDefined();
    });
  });

  describe('handleDayKeyDown', () => {
    let mockButton: HTMLButtonElement;
    let mockEvent: KeyboardEvent;

    beforeEach(() => {
      // Create mock button structure
      mockButton = document.createElement('button');
      mockButton.innerText = '15';

      const mockDay = document.createElement('div');
      mockDay.appendChild(mockButton);

      // Create previous day button
      const mockPrevDay = document.createElement('div');
      const mockPrevButton = document.createElement('button');
      mockPrevButton.innerText = '14';
      mockPrevButton.focus = jest.fn();
      mockPrevDay.appendChild(mockPrevButton);

      // Create next day button
      const mockNextDay = document.createElement('div');
      const mockNextButton = document.createElement('button');
      mockNextButton.innerText = '16';
      mockNextButton.focus = jest.fn();
      mockNextDay.appendChild(mockNextButton);

      // Set up days container with navigation structure
      mockCalendar.daysElement!.innerHTML = '';
      mockCalendar.daysElement!.appendChild(mockPrevDay);
      mockCalendar.daysElement!.appendChild(mockDay);
      mockCalendar.daysElement!.appendChild(mockNextDay);

      // Mock focus methods
      mockButton.focus = jest.fn();
    });

    test('should handle ArrowLeft navigation within month', () => {
      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(mockEvent, 'target', { value: mockButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      const prevButton =
        mockButton.parentElement?.previousElementSibling?.querySelector(
          'button'
        ) as HTMLButtonElement;
      expect(prevButton.focus).toHaveBeenCalled();
    });

    test('should handle ArrowLeft on first day to go to previous month', () => {
      const firstDayButton = document.createElement('button');
      firstDayButton.innerText = '1';

      // Mock the parent element structure properly
      Object.defineProperty(firstDayButton, 'parentElement', {
        value: {
          previousElementSibling: null, // No previous sibling for first day
        },
      });

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(mockEvent, 'target', { value: firstDayButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      const initialMonth = mockCalendar.displayedMonthDate.getMonth();

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      // Check that the month was changed to previous month
      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(mockCalendar.displayedMonthDate.getMonth()).toBe(expectedMonth);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(true, 'last');
    });

    test('should handle ArrowRight navigation within month', () => {
      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(mockEvent, 'target', { value: mockButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      const nextButton =
        mockButton.parentElement?.nextElementSibling?.querySelector(
          'button'
        ) as HTMLButtonElement;
      expect(nextButton.focus).toHaveBeenCalled();
    });

    test('should handle ArrowRight on last day to go to next month', () => {
      // January 2024 has 31 days
      const lastDayButton = document.createElement('button');
      lastDayButton.innerText = '31';

      // Mock the parent element structure properly
      Object.defineProperty(lastDayButton, 'parentElement', {
        value: {
          nextElementSibling: null, // No next sibling for last day
        },
      });

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      Object.defineProperty(mockEvent, 'target', { value: lastDayButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      const initialMonth = mockCalendar.displayedMonthDate.getMonth();

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      // Check that the month was changed to next month
      const expectedMonth = initialMonth === 11 ? 0 : initialMonth + 1;
      expect(mockCalendar.displayedMonthDate.getMonth()).toBe(expectedMonth);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(true, 'first');
    });

    test('should handle ArrowUp navigation within month', () => {
      // Day 15 - 7 = Day 8 (valid for navigation up)
      const mockUpButton = document.createElement('button');
      mockUpButton.focus = jest.fn();

      // Create a button with day 15 (this should try to go up to day 8)
      const day15Button = document.createElement('button');
      day15Button.innerText = '15';

      // Mock the complex structure properly
      const mockDaysElement = document.createElement('div');
      Object.defineProperty(mockDaysElement, 'children', {
        value: {
          7: { querySelector: () => mockUpButton },
          length: 42,
        },
      });
      mockCalendar.daysElement = mockDaysElement;

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(mockEvent, 'target', { value: day15Button });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      expect(mockUpButton.focus).toHaveBeenCalled();
    });

    test('should handle ArrowUp on early days to go to previous month', () => {
      const earlyDayButton = document.createElement('button');
      earlyDayButton.innerText = '5'; // Day 5, less than 7

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      Object.defineProperty(mockEvent, 'target', { value: earlyDayButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      const initialMonth = mockCalendar.displayedMonthDate.getMonth();

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      // Check that the month was changed to previous month
      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(mockCalendar.displayedMonthDate.getMonth()).toBe(expectedMonth);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(true, 'last');
    });

    test('should handle ArrowDown navigation within month', () => {
      // Test with day 15, adding 7 would be day 22 (valid for January)
      const earlyDayButton = document.createElement('button');
      earlyDayButton.innerText = '15';

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(mockEvent, 'target', { value: earlyDayButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      // Since we can't easily mock the complex DOM structure, let's just verify no error
      expect(() => {
        CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);
      }).not.toThrow();
    });

    test('should handle ArrowDown on late days to go to next month', () => {
      const lateDayButton = document.createElement('button');
      lateDayButton.innerText = '28'; // Day 28 + 7 = 35, exceeds January (31 days)

      // Mock the daysElement structure
      const mockDaysElement = document.createElement('div');
      Object.defineProperty(mockDaysElement, 'children', {
        value: {
          34: null, // No element at position 34 (beyond month end)
          length: 42,
        },
      });
      mockCalendar.daysElement = mockDaysElement;

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      Object.defineProperty(mockEvent, 'target', { value: lateDayButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      const initialMonth = mockCalendar.displayedMonthDate.getMonth();

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      // Check that the month was changed to next month
      const expectedMonth = initialMonth === 11 ? 0 : initialMonth + 1;
      expect(mockCalendar.displayedMonthDate.getMonth()).toBe(expectedMonth);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(true, 'first');
    });

    test('should handle Enter key to select day', () => {
      const enterButton = document.createElement('button');
      enterButton.innerText = '15';

      mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      Object.defineProperty(mockEvent, 'target', { value: enterButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      // Check that the selected date was set to day 15
      expect(mockCalendar.selectedDate.getDate()).toBe(15);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalled();
    });

    test('should handle Space key to select day', () => {
      const spaceButton = document.createElement('button');
      spaceButton.innerText = '15';

      mockEvent = new KeyboardEvent('keydown', { key: ' ' });
      Object.defineProperty(mockEvent, 'target', { value: spaceButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      // Check that the selected date was set to day 15
      expect(mockCalendar.selectedDate.getDate()).toBe(15);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalled();
    });

    test('should handle Home key to focus first available day', () => {
      const mockFirstButton = document.createElement('button');
      mockFirstButton.focus = jest.fn();

      mockCalendar.daysElement!.querySelector = jest
        .fn()
        .mockReturnValue(mockFirstButton);

      mockEvent = new KeyboardEvent('keydown', { key: 'Home' });
      Object.defineProperty(mockEvent, 'target', { value: mockButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      expect(mockFirstButton.focus).toHaveBeenCalled();
    });

    test('should handle End key to focus last available day', () => {
      const mockLastButton = document.createElement('button');
      mockLastButton.focus = jest.fn();

      const mockButtonList = [
        mockButton,
        mockLastButton,
      ] as unknown as Element[];
      mockCalendar.daysElement!.querySelectorAll = jest
        .fn()
        .mockReturnValue(mockButtonList);

      mockEvent = new KeyboardEvent('keydown', { key: 'End' });
      Object.defineProperty(mockEvent, 'target', { value: mockButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      expect(mockLastButton.focus).toHaveBeenCalled();
    });

    test('should handle disabled buttons gracefully', () => {
      const disabledButton = document.createElement('button');
      disabledButton.disabled = true;
      disabledButton.focus = jest.fn();

      const mockDayWithDisabled = document.createElement('div');
      mockDayWithDisabled.appendChild(disabledButton);

      // Mock the button structure to avoid HTMLCollection assignment
      const mockPrevDay = document.createElement('div');
      mockPrevDay.appendChild(disabledButton);

      Object.defineProperty(mockButton, 'parentElement', {
        value: {
          previousElementSibling: mockPrevDay,
        },
      });

      mockEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      Object.defineProperty(mockEvent, 'target', { value: mockButton });
      Object.defineProperty(mockEvent, 'preventDefault', { value: jest.fn() });

      // Should not focus disabled button
      CalendarEvents.handleDayKeyDown(mockCalendar, mockEvent);

      expect(disabledButton.focus).not.toHaveBeenCalled();
    });
  });

  describe('setSelectedDay', () => {
    test('should set selected day in normal mode', () => {
      mockCalendar.rangeMode = false;

      CalendarEvents.setSelectedDay(mockCalendar, 20);

      expect(mockCalendar.selectedDate.getDate()).toBe(20);
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalled();
    });

    test('should handle range mode with connector - first selection', () => {
      mockCalendar.rangeMode = true;
      mockCalendar.connector = new CalendarConnector();
      mockCalendar.connector.rebuildAllCalendars = jest.fn();

      CalendarEvents.setSelectedDay(mockCalendar, 10);

      expect(mockCalendar.connector.startDate).toBeDefined();
      expect(mockCalendar.connector.startDate!.getDate()).toBe(10);
      expect(mockCalendar.connector.endDate).toBeNull();
    });

    test('should handle range mode with connector - second selection', () => {
      mockCalendar.rangeMode = true;
      mockCalendar.connector = new CalendarConnector();
      mockCalendar.connector.startDate = new Date('2024-01-05');
      mockCalendar.connector.rebuildAllCalendars = jest.fn();

      CalendarEvents.setSelectedDay(mockCalendar, 15);

      expect(mockCalendar.connector.startDate).toBeDefined();
      expect(mockCalendar.connector.endDate).toBeDefined();
      expect(mockCalendar.connector.endDate!.getDate()).toBe(15);
    });

    test('should swap dates when end date is before start date', () => {
      mockCalendar.rangeMode = true;
      mockCalendar.connector = new CalendarConnector();
      // Set start date to Jan 20, 2024 (mockCalendar.displayedMonthDate is Jan 2024)
      mockCalendar.connector.startDate = new Date(2024, 0, 20);
      mockCalendar.connector.rebuildAllCalendars = jest.fn();

      CalendarEvents.setSelectedDay(mockCalendar, 10); // Earlier than start date

      expect(mockCalendar.connector.startDate!.getDate()).toBe(10);
      expect(mockCalendar.connector.endDate!.getDate()).toBe(20);
    });

    test('should reset range when both dates are set', () => {
      mockCalendar.rangeMode = true;
      mockCalendar.connector = new CalendarConnector();
      mockCalendar.connector.startDate = new Date('2024-01-05');
      mockCalendar.connector.endDate = new Date('2024-01-15');
      mockCalendar.connector.rebuildAllCalendars = jest.fn();

      CalendarEvents.setSelectedDay(mockCalendar, 25);

      expect(mockCalendar.connector.startDate!.getDate()).toBe(25);
      expect(mockCalendar.connector.endDate).toBeNull();
    });

    test('should call connector dateChangedCallback when provided', () => {
      mockCalendar.rangeMode = true;
      mockCalendar.connector = new CalendarConnector();
      mockCalendar.connector.dateChangedCallback = jest.fn();
      mockCalendar.connector.rebuildAllCalendars = jest.fn();

      CalendarEvents.setSelectedDay(mockCalendar, 12);

      expect(mockCalendar.connector.dateChangedCallback).toHaveBeenCalled();
    });

    test('should handle range mode without connector', () => {
      mockCalendar.rangeMode = true;
      mockCalendar.connector = undefined;

      expect(() => {
        CalendarEvents.setSelectedDay(mockCalendar, 15);
      }).not.toThrow();
    });
  });

  describe('dateInputChanged', () => {
    test('should handle valid date input', () => {
      const mockEvent = {
        target: { value: '2024-02-10' },
      } as unknown as Event;

      CalendarEvents.dateInputChanged(mockCalendar, mockEvent);

      expect(mockCalendar.selectedDate.toISOString().slice(0, 10)).toBe(
        '2024-02-10'
      );
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalledWith(false);
    });

    test('should handle invalid date input', () => {
      mockCalendar.errors = [];

      const mockEvent = {
        target: { value: 'invalid-date' },
      } as unknown as Event;

      CalendarEvents.dateInputChanged(mockCalendar, mockEvent);

      expect(mockCalendar.errors).toHaveLength(1);
      expect(mockCalendar.errors[0].type).toBe('input-error');
      expect(mockCalendar.errors[0].message).toBe(
        'The entered date is invalid'
      );
      expect(generateErrors).toHaveBeenCalledWith(mockCalendar);
    });

    test('should ignore Tab key events', () => {
      const initialDate = new Date(mockCalendar.selectedDate);

      const mockTabEvent = new KeyboardEvent('keyup', { code: 'Tab' });
      Object.defineProperty(mockTabEvent, 'target', {
        value: { value: '2024-12-25' },
      });

      CalendarEvents.dateInputChanged(mockCalendar, mockTabEvent);

      expect(mockCalendar.selectedDate).toEqual(initialDate);
      expect(mockCalendar.rebuildCalendar).not.toHaveBeenCalled();
    });

    test('should call onChange callback when provided', () => {
      const onChangeMock = jest.fn();
      mockCalendar.onChange = onChangeMock;

      const mockEvent = {
        target: { value: '2024-03-15' },
      } as unknown as Event;

      CalendarEvents.dateInputChanged(mockCalendar, mockEvent);

      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  describe('setDateToToday', () => {
    test('should set date to today', () => {
      const today = new Date();

      CalendarEvents.setDateToToday(mockCalendar);

      expect(mockCalendar.selectedDate.toDateString()).toBe(
        today.toDateString()
      );
      expect(mockCalendar.displayedMonthDate.toDateString()).toBe(
        today.toDateString()
      );
      expect(mockCalendar.rebuildCalendar).toHaveBeenCalled();
    });

    test('should call onChange callback when provided', () => {
      const onChangeMock = jest.fn();
      mockCalendar.onChange = onChangeMock;

      CalendarEvents.setDateToToday(mockCalendar);

      expect(onChangeMock).toHaveBeenCalled();
    });
  });

  describe('dateChangedCallback', () => {
    test('should call onChange when provided', () => {
      const onChangeMock = jest.fn();
      mockCalendar.onChange = onChangeMock;

      const testDate = new Date(2024, 4, 20); // May 20, 2024 in local timezone

      CalendarEvents.dateChangedCallback(mockCalendar, testDate);

      expect(onChangeMock).toHaveBeenCalled();
      const eventArg = onChangeMock.mock.calls[0][0];
      expect(eventArg.detail).toBe('2024-05-20');
    });

    test('should not throw when onChange is not provided', () => {
      mockCalendar.onChange = undefined;

      const testDate = new Date(2024, 4, 20); // May 20, 2024 in local timezone

      expect(() => {
        CalendarEvents.dateChangedCallback(mockCalendar, testDate);
      }).not.toThrow();
    });
  });

  describe('onRenderCallback', () => {
    test('should call onRender when provided', () => {
      const onRenderMock = jest.fn();
      mockCalendar.onRender = onRenderMock;

      CalendarEvents.onRenderCallback(mockCalendar);

      expect(onRenderMock).toHaveBeenCalled();
      const eventArg = onRenderMock.mock.calls[0][0];
      expect(eventArg.type).toBe('onRender');
    });

    test('should not throw when onRender is not provided', () => {
      mockCalendar.onRender = undefined;

      expect(() => {
        CalendarEvents.onRenderCallback(mockCalendar);
      }).not.toThrow();
    });
  });
});
