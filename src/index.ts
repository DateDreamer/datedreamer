import { calendarToggle } from "./components/calendar-toggle";
import { calendar } from "./components/calendar";
import {range}from "./components/range";

// Components
export {calendar, calendarToggle, range};

// Interfaces for typescript consumers
export type { ICalendarOptions, NavigationEventDetail } from './interfaces/calendar.interface';
export type { IRangeOptions, IPredefinedRange } from './interfaces/range.interface';

export { Utils } from './utils/date-utils';