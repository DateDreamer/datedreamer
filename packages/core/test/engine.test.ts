import { CalendarEngine } from '../src/engine';

describe('CalendarEngine', () => {
  let engine: CalendarEngine;

  beforeEach(() => {
    engine = new CalendarEngine();
  });

  test('initial state is correct', () => {
    const state = engine.getState();
    expect(state.selectedDate).toBeInstanceOf(Date);
    expect(state.displayedMonthDate).toBeInstanceOf(Date);
    expect(state.rangeMode).toBe(false);
    expect(state.darkMode).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  test('nextMonth updates displayedMonthDate', () => {
    const initialMonth = engine.getState().displayedMonthDate.getMonth();
    engine.nextMonth();
    expect(engine.getState().displayedMonthDate.getMonth()).toBe((initialMonth + 1) % 12);
  });

  test('setDate updates selectedDate and displayedMonthDate', () => {
    const newDate = new Date(2024, 5, 15); // June 15, 2024
    engine.setDate(newDate);
    expect(engine.getState().selectedDate).toEqual(newDate);
    expect(engine.getState().displayedMonthDate).toEqual(newDate);
  });

  test('setRange sets start and end dates', () => {
    const start = new Date(2024, 5, 1);
    const end = new Date(2024, 5, 15);
    engine.setRange(start, end);
    expect(engine.getState().rangeMode).toBe(true);
    expect(engine.getState().startDate).toEqual(start);
    expect(engine.getState().endDate).toEqual(end);
  });

  test('getDaysInMonth returns correct number of days', () => {
    // Test for a standard 31-day month
    const june = new Date(2024, 5, 1); 
    const days = engine.getDaysInMonth(june);
    // 1 June 2024 is a Saturday. 
    // Sun (26 May) to 30 June = ~35 days in the array to cover the grid
    expect(days.length).toBeGreaterThan(30);
    expect(days.length).toBeLessThan(40);
  });
});
