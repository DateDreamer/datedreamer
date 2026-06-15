import dayjs from 'dayjs';
import { ICalendarState, CalendarSubscriber } from './types';

export class CalendarEngine {
  private state: ICalendarState;
  private subscribers: Set<CalendarSubscriber> = new Set();

  constructor(initialState: Partial<ICalendarState> = {}) {
    const baseState: ICalendarState = {
      selectedDate: new Date(),
      displayedMonthDate: new Date(),
      rangeMode: false,
      darkMode: false,
      isLoading: false,
    };

    this.state = { ...baseState, ...initialState };
    
    // Ensure displayedMonth is synced with selectedDate if not provided
    if (initialState.selectedDate) {
      this.state.displayedMonthDate = new Date(initialState.selectedDate);
    }
  }

  // --- Getters ---

  public getState(): ICalendarState {
    return { ...this.state };
  }

  public subscribe(callback: CalendarSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => this.subscribers.delete(callback);
  }

  private emit() {
    this.subscribers.forEach((cb) => cb(this.getState()));
  }

  // --- State Mutations (The "Brain") ---

  public setDate(date: Date) {
    this.state.selectedDate = date;
    this.state.displayedMonthDate = new Date(date);
    this.emit();
  }

  public nextMonth() {
    const next = dayjs(this.state.displayedMonthDate).add(1, 'month').toDate();
    this.state.displayedMonthDate = next;
    this.emit();
  }

  public prevMonth() {
    const prev = dayjs(this.state.displayedMonthDate).subtract(1, 'month').toDate();
    this.state.displayedMonthDate = prev;
    this.emit();
  }

  public setRange(start: Date, end: Date) {
    this.state.rangeMode = true;
    this.state.startDate = start;
    this.state.endDate = end;
    this.state.selectedDate = start;
    this.emit();
  }

  public toggleRangeMode(enabled: boolean) {
    this.state.rangeMode = enabled;
    if (!enabled) {
      this.state.startDate = undefined;
      this.state.endDate = undefined;
    }
    this.emit();
  }

  public setDarkMode(enabled: boolean) {
    this.state.darkMode = enabled;
    this.emit();
  }

  public setLoading(loading: boolean) {
    this.state.isLoading = loading;
    this.emit();
  }

  // --- Computed Logic (Helpers for the UI) ---

  public getDaysInMonth(date: Date): Date[] {
    const startOfMonth = dayjs(date).startOf('month').toDate();
    const endOfMonth = dayjs(date).endOf('month').toDate();
    
    const days = [];
    let current = startOfMonth;

    // Align to the first day of the week (Sunday)
    const startDay = current.getDay();
    current.setDate(current.getDate() - startDay);

    while (current <= endOfMonth) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }
}
