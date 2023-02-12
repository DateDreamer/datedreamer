import { ICalendarOptions } from "./calendar.interface";

class DateDreamerCalendar implements ICalendarOptions {
    element: HTMLElement | string;
    selectedDate: string | Date | null;
    calendarElement: HTMLElement | null = null;

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

        this.generateDays();
    }

    /**
     * Inserts calendar HTML into the element via query selector.
     * @param calendar Calendar HTML
     */
    private insertCalendarBySelector(calendar:string) {
        const selectedElement = document.querySelector(this.element as string);
        if(selectedElement) {
            selectedElement.innerHTML = calendar;
            this.calendarElement = selectedElement.querySelector(".datedreamer__calendar");
        } else {
            console.error(`Could not find ${this.element} in DOM.`);
        }
    }

    /**
     * 
     * @returns {string} The HTML for the calendar element.
     */
    private renderCalendar():string {
        return `<div class="datedreamer__calendar">
            <div class="datedreamer__calendar_header">
                <button class="datedreamer__calendar_prev" aria-label="Previous">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <span class="datedreamer__calendar_title">January 2022</span>
                <button class="datedreamer__calendar_next" aria-label="Next">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div class="datedreamer__calendar_days">
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Mo</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Tu</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">We</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Th</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Fr</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Sat</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Su</div>
            </div>
        </div>`
    }

    private generateDays():string {
        const daysElementContainer:HTMLElement | null | undefined = this.calendarElement?.querySelector(".datedreamer__calendar_days");
        
        let offset = 0;
        
        const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

        const today = new Date();
        const month = today.getMonth();
        const day = today.getDate();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1,0).getDate();
        const firstDayOfMonth = new Date(year,month,1);
        const daysToSkip = weekdays.indexOf(firstDayOfMonth.toString().split(" ")[0]);
        
        for(let i = 1; i <= daysToSkip + daysInMonth; i++) {
            if(i > daysToSkip) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                day.innerText = (i - daysToSkip).toString();
                daysElementContainer?.append(day);
            } else {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                day.innerText = "0";
                daysElementContainer?.append(day);
            }
        }

        return "";
    }
}

export {DateDreamerCalendar as calendar}