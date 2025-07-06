import { calendar } from '../components/calendar';

export interface ICalendarConnector {
  startDate: Date | null;
  endDate: Date | null;
  pickingEndDate: Date | null;
  calendars: Array<calendar>;
  dateChangedCallback?: ((event: CustomEvent) => void) | undefined;
}
