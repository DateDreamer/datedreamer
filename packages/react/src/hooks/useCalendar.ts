import { useState, useCallback, useEffect, useRef } from 'react';
import { CalendarEngine } from '@datedreamer/core';

export interface UseCalendarOptions {
  /** Initial selected date */
  initialDate?: Date;
  /** Enable range selection mode */
  rangeMode?: boolean;
  /** Dark theme */
  darkMode?: boolean;
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const engineRef = useRef<CalendarEngine>(new CalendarEngine({
    selectedDate: options.initialDate || new Date(),
    rangeMode: options.rangeMode || false,
    darkMode: options.darkMode || false,
  }));

  const [state, setState] = useState(engineRef.current.getState());

  useEffect(() => {
    const engine = engineRef.current;
    const unsubscribe = engine.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const setDate = useCallback((date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    engineRef.current.setDate(d);
  }, []);

  const nextMonth = useCallback(() => {
    engineRef.current.nextMonth();
  }, []);

  const prevMonth = useCallback(() => {
    engineRef.current.prevMonth();
  }, []);

  const goToMonth = useCallback((year: number, month: number) => {
    engineRef.current.goToMonth(year, month);
  }, []);

  const setRange = useCallback((start: Date | string, end: Date | string) => {
    const s = typeof start === 'string' ? new Date(start) : start;
    const e = typeof end === 'string' ? new Date(end) : end;
    engineRef.current.setRange(s, e);
  }, []);

  const toggleDarkMode = useCallback(() => {
    engineRef.current.setDarkMode(!state.darkMode);
  }, [state.darkMode]);

  return {
    ...state,
    setDate,
    nextMonth,
    prevMonth,
    goToMonth,
    setRange,
    toggleDarkMode,
    getDaysInMonth: (date?: Date) => engineRef.current.getDaysInMonth(date || state.displayedMonthDate),
  };
}
