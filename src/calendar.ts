import { ICalendarOptions } from "./calendar.interface";
import {monthNames} from "./utils";

class DateDreamerCalendar implements ICalendarOptions {
    element: HTMLElement | string;
    selectedDate: Date = new Date();
    calendarElement: HTMLElement | null = null;
    month: string = "";

    constructor(options: ICalendarOptions) {
        console.log(options);
        this.element = options.element;
        if(typeof options.selectedDate == "string") {
            this.selectedDate = new Date(options.selectedDate);
        } else if(typeof options.selectedDate == "object") {
            this.selectedDate = options.selectedDate;
        }

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

        this.generateHeader();
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
            <div class="datedreamer__calendar_header"></div>

            <div class="datedreamer__calendar_days">
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Su</div>    
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Mo</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Tu</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">We</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Th</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Fr</div>
                <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Sat</div>
            </div>
        </div>`
    }

    private generateHeader():void {
        const prevButton = document.createElement("button");
        prevButton.classList.add("datedreamer__calendar_prev");
        prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Previous');

        const title = document.createElement("span");
        title.classList.add("datedreamer__calendar_title");
        title.innerText = `${monthNames[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;

        const nextButton = document.createElement("button");
        nextButton.classList.add("datedreamer__calendar_next");
        nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Next');

        this.calendarElement?.querySelector(".datedreamer__calendar_header")?.append(prevButton,title,nextButton);
    }

    private generateDays():void {
        const daysElementContainer:HTMLElement | null | undefined = this.calendarElement?.querySelector(".datedreamer__calendar_days");
        
        let offset = 0;
        
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        const today = new Date();
        const month = today.getMonth();
        const day = today.getDate();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1,0).getDate();
        const firstDayOfMonth = new Date(year,month,1);
        const lastDayOfMonth = new Date(year,month,daysInMonth);
        const daysToSkipBefore = weekdays.indexOf(firstDayOfMonth.toString().split(" ")[0]);
        const daysToSkipAfter = 6 - weekdays.indexOf(lastDayOfMonth.toString().split(" ")[0]);

        for(let i = 1; i <= daysToSkipBefore + daysInMonth + daysToSkipAfter; i++) {
            if(i > daysToSkipBefore && i <= daysToSkipBefore + daysInMonth) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.innerText = (i - daysToSkipBefore).toString();
                day.append(button);
                daysElementContainer?.append(day);
            } else if(i <= daysToSkipBefore) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.innerText = new Date(year,month,0-(daysToSkipBefore - i)).getDate().toString();
                day.append(button);
                daysElementContainer?.append(day);
            } else if(i > daysToSkipBefore + daysInMonth) {
                console.log()
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.innerText = new Date(year,month + 1,i).getDate().toString();
                day.append(button);
                daysElementContainer?.append(day);
            }
        }
    }
}

export {DateDreamerCalendar as calendar}