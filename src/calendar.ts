import { ICalendarOptions } from "./calendar.interface";
import {monthNames, weekdays} from "./utils";

class DateDreamerCalendar implements ICalendarOptions {
    element: HTMLElement | string;
    calendarElement: HTMLElement | null = null;
    headerElement: HTMLElement | null | undefined = null;
    inputsElement: HTMLElement | null | undefined = null;

    daysElement: HTMLElement | null | undefined = null;
    selectedDate: Date = new Date();
    displayedMonthDate: Date = new Date();

    constructor(options: ICalendarOptions) {
        console.log(options);
        this.element = options.element;
        if(typeof options.selectedDate == "string") {
            this.selectedDate = new Date(options.selectedDate);
        } else if(typeof options.selectedDate == "object") {
            this.selectedDate = options.selectedDate;
        }

        this.displayedMonthDate = this.selectedDate;

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

        this.headerElement = this.calendarElement?.querySelector(".datedreamer__calendar_header");
        this.daysElement = this.calendarElement?.querySelector(".datedreamer__calendar_days");
        this.inputsElement = this.calendarElement?.querySelector(".datedreamer__calendar_inputs");

        // Generate the previous, title, next buttons.
        this.generateHeader();

        // Generate the inputs section
        this.generateInputs();

        // Generate the days buttons
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

            <div class="datedreamer__calendar_inputs"></div>

            <div class="datedreamer__calendar_days-wrap">
                <div class="datedreamer__calendar_days-header">
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Su</div>    
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Mo</div>
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Tu</div>
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">We</div>
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Th</div>
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Fr</div>
                    <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Sat</div>
                </div>

                <div class="datedreamer__calendar_days"></div>
            </div>
        </div>`
    }

    /**
     * Generates the Previous, Title, and Next header elements.
     */
    private generateHeader():void {
        // Previous Button
        const prevButton = document.createElement("button");
        prevButton.classList.add("datedreamer__calendar_prev");
        prevButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Previous');
        prevButton.addEventListener("click", this.goToPrevMonth);

        // Title
        const title = document.createElement("span");
        title.classList.add("datedreamer__calendar_title");
        title.innerText = `${monthNames[this.selectedDate.getMonth()]} ${this.selectedDate.getFullYear()}`;

        // Next Button
        const nextButton = document.createElement("button");
        nextButton.classList.add("datedreamer__calendar_next");
        nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Next');
        nextButton.addEventListener("click", this.goToNextMonth);

        this.headerElement?.append(prevButton,title,nextButton);
    }

    /**
     * Generates the date field and today button
     */
    private generateInputs():void {
        const dateField = document.createElement("input");
        dateField.placeholder = "Enter a date";

        const todayButton = document.createElement("button");
        todayButton.innerText = "Today";

        this.inputsElement?.append(dateField, todayButton);
    }

    /**
     * Generates the day buttons
     */
    private generateDays():void {        
        // Offset to use for going forward and backwards.
        let offset = 0;

        // Dates
        const month = this.displayedMonthDate.getMonth();
        const year = this.displayedMonthDate.getFullYear();
        const daysInMonth = new Date(year, month + 1,0).getDate();
        const firstDayOfMonth = new Date(year,month,1);
        const lastDayOfMonth = new Date(year,month,daysInMonth);
        const daysToSkipBefore = weekdays.indexOf(firstDayOfMonth.toString().split(" ")[0]);
        const daysToSkipAfter = 6 - weekdays.indexOf(lastDayOfMonth.toString().split(" ")[0]);

        // Loop through the days and create a day element with button
        for(let i = 1; i <= daysToSkipBefore + daysInMonth + daysToSkipAfter; i++) {
            // Days that should show before the first day of the current month.
            if(i > daysToSkipBefore && i <= daysToSkipBefore + daysInMonth) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.innerText = (i - daysToSkipBefore).toString();
                day.append(button);
                this.daysElement?.append(day);

            // Days of the current month
            } else if(i <= daysToSkipBefore) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.innerText = new Date(year,month,0-(daysToSkipBefore - i)).getDate().toString();
                day.append(button);
                this.daysElement?.append(day);

            // Days that should show of the next month
            } else if(i > daysToSkipBefore + daysInMonth) {
                const dayNumber = i - (daysToSkipBefore + daysToSkipAfter + daysInMonth) + daysToSkipAfter;
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.innerText = new Date(year,month + 1,dayNumber).getDate().toString();
                day.append(button);
                this.daysElement?.append(day);
            }
        }
    }

    /**
     * Go to previous month
     */
    goToPrevMonth = () => {
        this.displayedMonthDate.setMonth(this.displayedMonthDate.getMonth() - 1);
        this.rebuildCalendar();
    }

    /**
     * Go to next month
     */
    goToNextMonth = () => {
        this.displayedMonthDate.setMonth(this.displayedMonthDate.getMonth() + 1);
        this.rebuildCalendar();
    }

    /**
     * Rebuild calendar
     */
    rebuildCalendar() {
        if(this.daysElement) {
            this.daysElement.innerHTML = "";
        }

        if(this.headerElement) {
            this.headerElement.innerHTML = "";
        }

        this.generateDays();
        this.generateHeader();
    }
}

export {DateDreamerCalendar as calendar}