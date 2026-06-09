export interface DateDreamerCalendarEventMap {
  [DateDreamerCalendar.EVENT_CHANGE]: CustomEvent<unknown>;
  [DateDreamerCalendar.EVENT_NAVIGATE]: CustomEvent<{ displayedMonthDate: Date }>;
  [DateDreamerCalendar.EVENT_RENDER]: CustomEvent<unknown>;
}
