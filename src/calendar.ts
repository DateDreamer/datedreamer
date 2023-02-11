import { ICalendarOptions } from "./calendar.interface";

class DateDreamerCalendar implements ICalendarOptions {
    element: HTMLElement | null;
    selectedDate: String | Date | null;

    constructor(options: ICalendarOptions) {
        console.log(options);
        this.element = options.element;
        this.selectedDate = options.selectedDate;

        this.init();
    }
    

    init() {
        if(this.element == null)
            console.error("No element was provided to calendar. Initializing aborted");
            return;
    }
}

export {DateDreamerCalendar as calendar}