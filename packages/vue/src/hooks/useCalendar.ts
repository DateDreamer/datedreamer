import { ref, computed, onMounted, onUnmounted } from 'vue';
import { CalendarEngine } from '@datedreamer/core';

export interface UseCalendarOptions {
  initialDate?: Date;
  rangeMode?: boolean;
  darkMode?: boolean;
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const engine = new CalendarEngine({
    selectedDate: options.initialDate || new Date(),
    rangeMode: options.rangeMode || false,
    darkMode: options.darkMode || false,
  });

  const state = ref(engine.getState());
  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    unsubscribe = engine.subscribe((newState) => {
      state.value = { ...newState };
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  const setDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    engine.setDate(d);
  };

  const nextMonth = () => engine.nextMonth();
  const prevMonth = () => engine.prevMonth();
  const goToMonth = (year: number, month: number) => engine.goToMonth(year, month);
  const setRange = (start: Date | string, end: Date | string) => {
    const s = typeof start === 'string' ? new Date(start) : start;
    const e = typeof end === 'string' ? new Date(end) : end;
    engine.setRange(s, e);
  };
  const toggleDarkMode = () => engine.setDarkMode(!state.value.darkMode);

  return {
    state: computed(() => state.value),
    setDate,
    nextMonth,
    prevMonth,
    goToMonth,
    setRange,
    toggleDarkMode,
    getDaysInMonth: (date?: Date) => engine.getDaysInMonth(date || state.value.displayedMonthDate),
  };
}
