import { ICalendarOptions } from "./calendar.interface";

class DateDreamerCalendar implements ICalendarOptions {
    element: HTMLElement | string;
    selectedDate: string | Date | null;

    constructor(options: ICalendarOptions) {
        console.log(options);
        this.element = options.element;
        this.selectedDate = options.selectedDate;

        this.init();
    }
    

    private init() {
         // Check if element is defined
         // exits function and logs error if false
        if(this.element == null){
            console.error("No element was provided to calendar. Initializing aborted");
            return;
        }


        // Generate calendar
        const calendar:string = this.renderCalendar()||"";

        // Insert calendar DOM based on type of element provided.
        switch(typeof this.element) {
            case "string":
                this.insertCalendarBySelector(calendar);
                break;
            case "object":
                console.log("element");
                break;
            case "undefined":
                    break;
        }
    }

    private renderCalendar():string {
        return `<div class="datedreamer_calendar">Calendar</div>`
    }

    /**
     * Inserts calendar HTML into the element via query selector.
     * @param calendar Calendar HTML
     */
    private insertCalendarBySelector(calendar:string) {
        const selectedElement = document.querySelector(this.element as string);
        if(selectedElement) {
            selectedElement.innerHTML = calendar;
        } else {
            console.error(`Could not find ${this.element} in DOM.`);
        }
    }
}

export {DateDreamerCalendar as calendar}