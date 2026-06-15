import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { CalendarEngine } from '@datedreamer/core';

/**
 * A Vue Composable that provides a reactive interface to the DateDreamer engine.
 */
export function useCalendar(initialState?: any) {
  const engine = new CalendarEngine(initialState);
  const state = ref(engine.getState());

  // Sync engine updates to Vue's reactivity system
  const unsubscribe = engine.subscribe((newState) => {
    state.value = { ...newState };
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const nextMonth = () => engine.nextMonth();
  const prevMonth = () => engine.prevMonth();
  const setDate = (date: Date) => engine.setDate(date);
  const setRange = (start: Date, end: Date) => engine.setRange(start, end);
  const setDarkMode = (enabled: boolean) => engine.setDarkMode(enabled);

  return {
    state,
    engine,
    nextMonth,
    prevMonth,
    setDate,
    setRange,
    setDarkMode
  };
}
