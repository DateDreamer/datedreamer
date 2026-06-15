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
      startDate: undefined,
      endDate: undefined,
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

  /** Navigate to a specific month */
  public goToMonth(year: number, month: number) {
    const d = new Date(this.state.displayedMonthDate);
    d.setFullYear(year);
    d.setMonth(month);
    this.state.displayedMonthDate = d;
    this.emit();
  }

  /** Navigate to a specific date */
  public goToDate(date: Date) {
    this.state.displayedMonthDate = new Date(date);
    this.emit();
  }

  public setRange(start: Date, end: Date) {
    this.state.rangeMode = true;
    this.state.startDate = start;
    this.state.endDate = end;
    this.state.selectedDate = start;
    this.emit();
  }

  /** Set only the start date of a range (partial selection) */
  public setRangeStart(date: Date) {
    this.state.rangeMode = true;
    this.state.startDate = date;
    this.state.endDate = undefined;
    this.state.selectedDate = date;
    this.emit();
  }

  /** Complete a range by setting the end date */
  public setRangeEnd(date: Date) {
    if (!this.state.startDate) return;
    // Ensure start <= end
    const start = this.state.startDate;
    const end = date.getTime() < start.getTime() ? start : date;
    const s = date.getTime() < start.getTime() ? date : start;
    this.state.startDate = s;
    this.state.endDate = end;
    this.state.selectedDate = s;
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

  /** Clear all selections */
  public clearSelection() {
    this.state.selectedDate = new Date();
    this.state.displayedMonthDate = new Date(this.state.selectedDate);
    if (this.state.rangeMode) {
      this.state.startDate = undefined;
      this.state.endDate = undefined;
    }
    this.emit();
  }

  /** Reset view to currently selected date */
  public resetSelection() {
    this.state.displayedMonthDate = new Date(this.state.selectedDate);
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
    
    const days: Date[] = [];
    let current = new Date(startOfMonth);

    // Align to the first day of the week (Sunday)
    const startDay = current.getDay();
    current.setDate(current.getDate() - startDay);

    while (current <= endOfMonth || days.length < 7 * 5) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      // Stop after we have enough rows (max 6 weeks = 42 days)
      if (days.length >= 42) break;
    }
    return days;
  }

  /** Get the number of days in a given month */
  public getDaysCount(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  /** Check if two dates are the same calendar day */
  public isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  /** Check if a date falls within the current range */
  public isInRange(date: Date): boolean {
    if (!this.state.startDate || !this.state.endDate) return false;
    const time = date.getTime();
    return time >= this.state.startDate!.getTime() && time <= this.state.endDate!.getTime();
  }

  /** Check if a date is the start of the range */
  public isRangeStart(date: Date): boolean {
    if (!this.state.startDate) return false;
    return (
      date.getFullYear() === this.state.startDate.getFullYear() &&
      date.getMonth() === this.state.startDate.getMonth() &&
      date.getDate() === this.state.startDate.getDate()
    );
  }

  /** Check if a date is the end of the range */
  public isRangeEnd(date: Date): boolean {
    if (!this.state.endDate) return false;
    return (
      date.getFullYear() === this.state.endDate.getFullYear() &&
      date.getMonth() === this.state.endDate.getMonth() &&
      date.getDate() === this.state.endDate.getDate()
    );
  }

  /** Check if a date is today */
  public isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  /** Check if a date belongs to the displayed month */
  public isCurrentMonth(date: Date): boolean {
    return (
      date.getFullYear() === this.state.displayedMonthDate.getFullYear() &&
      date.getMonth() === this.state.displayedMonthDate.getMonth()
    );
  }
}
