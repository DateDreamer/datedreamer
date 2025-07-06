import { ICalendarConnector } from '../interfaces/connector.interface';
import { calendar } from './calendar';

export default class CalendarConnector implements ICalendarConnector {
  startDate: Date | null;
  endDate: Date | null;
  pickingEndDate: Date | null;
  calendars: Array<calendar> = new Array();
  dateChangedCallback?: ((event: CustomEvent) => void) | undefined;

  constructor() {
    this.startDate = null;
    this.endDate = null;
    this.pickingEndDate = null;
  }

  rebuildAllCalendars(): void {
    this.calendars.forEach(cal => {
      cal.rebuildCalendar();
    });
  }
}
