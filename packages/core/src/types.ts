export interface ICalendarState {
  selectedDate: Date;
  displayedMonthDate: Date;
  rangeMode: boolean;
  startDate?: Date;
  endDate?: Date;
  darkMode: boolean;
  isLoading: boolean;
}

export type CalendarEvent = 
  | { type: 'dateChanged'; value: Date }
  | { type: 'rangeChanged'; start: Date; end: Date }
  | { type: 'monthChanged'; value: Date }
  | { type: 'viewChanged'; value: Date }
  | { type: 'darkModeChanged'; value: boolean };

export type CalendarSubscriber = (state: ICalendarState) => void;
