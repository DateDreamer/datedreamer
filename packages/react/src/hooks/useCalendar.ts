import { useState, useEffect, useMemo, useCallback } from 'react';
import { CalendarEngine, ICalendarState } from '@datedreamer/core';

/**
 * A React hook that provides a reactive interface to the DateDreamer engine.
 * 
 * @param initialState - Optional initial configuration for the engine.
 * @returns An object containing the current state, the engine instance, and update functions.
 */
export function useCalendar(initialState?: Partial<ICalendarState>) {
  // We use useMemo to ensure we only create one engine per component lifecycle
  const engine = useMemo(() => new CalendarEngine(initialState), [initialState]);
  const [state, setState] = useState<ICalendarState>(engine.getState());

  useEffect(() => {
    // Subscribe to engine changes and sync to React state
    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, [engine]);

  // Wrap engine methods in useCallback to prevent unnecessary re-renders in child components
  const nextMonth = useCallback(() => engine.nextMonth(), [engine]);
  const prevMonth = useCallback(() => engine.prevMonth(), [engine]);
  const setDate = useCallback((date: Date) => engine.setDate(date), [engine]);
  const setRange = useCallback((start: Date, end: Date) => engine.setRange(start, end), [engine]);
  const setDarkMode = useCallback((enabled: boolean) => engine.setDarkMode(enabled), [engine]);

  return {
    state,
    engine,
    nextMonth,
    prevMonth,
    setDate,
    setRange,
    setDarkMode,
  };
}
