import { ICalendarOptions } from "./calendar.interface";
import {calendarRoot, leftChevron, monthNames, rightChevron, weekdays} from "./utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat)

class DateDreamerCalendar extends HTMLElement implements ICalendarOptions {
    element: HTMLElement | string;
    calendarElement: HTMLElement | null | undefined = null;
    headerElement: HTMLElement | null | undefined = null;
    inputsElement: HTMLElement | null | undefined = null;
    format: string;
    iconNext: string | undefined;
    iconPrev: string | undefined;
    onChange: ((event: CustomEvent) => CallableFunction) | undefined;
    onRender: ((event: CustomEvent) => CallableFunction) | undefined;

    daysElement: HTMLElement | null | undefined = null;
    selectedDate: Date = new Date();
    displayedMonthDate: Date = new Date();

    theme: "unstyled" | "lite-purple" = "unstyled";
    styles: string = "";

    constructor(options: ICalendarOptions) {
        super();
        this.element = options.element;
        this.format = options.format;
        if(options.theme) {
            this.theme = options.theme;
        }

        if(options.styles) {
            this.styles = options.styles;
        }

        if(options.iconNext) {
            this.iconNext = options.iconNext;
        }

        if(options.iconPrev) {
            this.iconPrev = options.iconPrev;
        }

        if(typeof options.selectedDate == "string") {
            this.selectedDate = dayjs(options.selectedDate,options.format).toDate();
        } else if(typeof options.selectedDate == "object") {
            this.selectedDate = options.selectedDate;
        }

        this.attachShadow({mode: "open"});

        // Get callbacks from options
        this.onChange = options.onChange;
        this.onRender = options.onRender;

        // Instanciate display date from initially selected date.
        this.displayedMonthDate = new Date(this.selectedDate);

        this.init();
    }
        
    private init() {
         // Check if element is defined
         // exits function and logs error if false
        if(this.element == null) {
            console.error("No element was provided to calendar. Initializing aborted");
            return;
        }


        // Generate calendar
        const calendar:string = calendarRoot(this.theme, this.styles);

        // Insert calendar into DOM
        this.insertCalendarIntoSelector(calendar);

        this.headerElement = this.shadowRoot?.querySelector(".datedreamer__calendar_header");
        this.daysElement = this.shadowRoot?.querySelector(".datedreamer__calendar_days");
        this.inputsElement = this.shadowRoot?.querySelector(".datedreamer__calendar_inputs");

        // Generate the previous, title, next buttons.
        this.generateHeader();

        // Generate the inputs section
        this.generateInputs();

        // Generate the days buttons
        this.generateDays();

        // Trigger onRender callback
        this.onRenderCallback();
    }

    /**
     * Inserts calendar HTML into the element via query selector.
     * @param calendar Calendar HTML
     */
    private insertCalendarIntoSelector(calendar:string) {
        let selectedElement = undefined;
        if(typeof this.element == "string"){
            selectedElement = document.querySelector(this.element as string);
        } else if(typeof this.element == "object"){
            selectedElement = this.element;
        }
    
        if(selectedElement) {
            if(this.shadowRoot){
                this.shadowRoot.innerHTML = calendar;
            }
            selectedElement.append(this);
        } else {
            console.error(`Could not find ${this.element} in DOM.`);
        }
    }

    /**
     * Generates the Previous, Title, and Next header elements.
     */
    private generateHeader():void {
        // Previous Button
        const prevButton = document.createElement("button");
        prevButton.classList.add("datedreamer__calendar_prev");
        prevButton.innerHTML = this.iconPrev ? this.iconPrev : leftChevron;
        prevButton.setAttribute('aria-label', 'Previous');
        prevButton.addEventListener("click", this.goToPrevMonth);

        // Title
        const title = document.createElement("span");
        title.classList.add("datedreamer__calendar_title");
        title.innerText = `${monthNames[this.displayedMonthDate.getMonth()]} ${this.displayedMonthDate.getFullYear()}`;

        // Next Button
        const nextButton = document.createElement("button");
        nextButton.classList.add("datedreamer__calendar_next");
        nextButton.innerHTML = this.iconNext ? this.iconNext : rightChevron;
        nextButton.setAttribute('aria-label', 'Next');
        nextButton.addEventListener("click", this.goToNextMonth);

        this.headerElement?.append(prevButton,title,nextButton);
    }

    /**
     * Generates the date field and today button
     */
    private generateInputs():void {
        // Date input
        const dateField = document.createElement("input");
        dateField.placeholder = "Enter a date";
        dateField.value = dayjs(this.selectedDate).format(this.format);
        dateField.addEventListener('keyup', (e) => this.dateInputChanged(e));
        dateField.setAttribute("title", "Set a date");
        
        // Today button
        const todayButton = document.createElement("button");
        todayButton.innerText = "Today";
        todayButton.addEventListener("click", () => this.setDateToToday());

        this.inputsElement?.append(dateField, todayButton);
    }

    /**
     * Generates the day buttons
     */
    private generateDays():void {

        // Dates
        const selectedDay = this.selectedDate.getDate();
        const month = this.displayedMonthDate.getMonth();
        const year = this.displayedMonthDate.getFullYear();
        const daysInMonth = new Date(year, month + 1,0).getDate();
        const firstDayOfMonth = new Date(year,month,1);
        const lastDayOfMonth = new Date(year,month,daysInMonth);
        const daysToSkipBefore = weekdays.indexOf(firstDayOfMonth.toString().split(" ")[0]);
        const daysToSkipAfter = 6 - weekdays.indexOf(lastDayOfMonth.toString().split(" ")[0]);

        // Loop through the days and create a day element with button
        for(let i = 1; i <= daysToSkipBefore + daysInMonth + daysToSkipAfter; i++) {
            // Days of the current month
            if(i > daysToSkipBefore && i <= daysToSkipBefore + daysInMonth) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day");
                const button = document.createElement("button");
                button.addEventListener("click", () => this.setSelectedDay(i - daysToSkipBefore))
                button.innerText = (i - daysToSkipBefore).toString();
                button.setAttribute('type', 'button');
                
                if((i == daysToSkipBefore + selectedDay) &&
                this.displayedMonthDate.getMonth() == this.selectedDate.getMonth() &&
                this.displayedMonthDate.getFullYear() == this.selectedDate.getFullYear()) {
                    day.classList.add("active");
                }

                day.append(button);
                this.daysElement?.append(day);

            // Days that should show before the first day of the current month.
            } else if(i <= daysToSkipBefore) {
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day", "disabled");
                const button = document.createElement("button");
                button.innerText = new Date(year,month,0-(daysToSkipBefore - i)).getDate().toString();
                button.setAttribute("disabled", "true");
                button.setAttribute('type', 'button');
                day.append(button);
                this.daysElement?.append(day);

            // Days that should show of the next month
            } else if(i > daysToSkipBefore + daysInMonth) {
                const dayNumber = i - (daysToSkipBefore + daysToSkipAfter + daysInMonth) + daysToSkipAfter;
                const day = document.createElement("div");
                day.classList.add("datedreamer__calendar_day", "disabled");
                const button = document.createElement("button");
                button.innerText = new Date(year,month + 1,dayNumber).getDate().toString();
                button.setAttribute("disabled", "true");
                button.setAttribute('type', 'button');
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
    private rebuildCalendar(rebuildInput = true) {
        if(this.daysElement) {
            this.daysElement.innerHTML = "";
        }

        if(this.headerElement) {
            this.headerElement.innerHTML = "";
        }

        this.generateDays();
        this.generateHeader();
        if(rebuildInput) {
            if(this.inputsElement) {
                this.inputsElement.innerHTML = "";
            }
            this.generateInputs();
        }
    }   

    /**
     * Sets the selected day of the viewable month.
     * @param day The day of the month in number format.
     */
    private setSelectedDay = (day: number) => {
        const newSelectedDate = new Date(this.displayedMonthDate);
        newSelectedDate.setDate(day);
        this.selectedDate = new Date(newSelectedDate);
        this.rebuildCalendar();
        this.dateChangedCallback(this.selectedDate)
    }

    /**
     * Sets the given date as selected in the calendar.
     * @param date The new date to select in the calendar.
     */
    setDate(date: string | Date) {
        if(typeof date == "string") {
            this.selectedDate = new Date(date);
        } else if(typeof date == "object") {
            this.selectedDate = date;
        }

        this.displayedMonthDate = this.selectedDate;

        this.rebuildCalendar();

        this.dateChangedCallback(this.selectedDate);
    }

    /**
     * Sets the selected and viewable month to today.
     */
    setDateToToday() {
        this.selectedDate = new Date();
        this.displayedMonthDate = new Date();
        this.rebuildCalendar();
        this.dateChangedCallback(this.selectedDate)
    }

    /**
     * Handles the KeyUp event in the date textbox.
     * @param e KeyUp event
     */
    dateInputChanged(e: Event) {
        const newDate = dayjs((e.target as HTMLInputElement).value,this.format).toDate();
        if(!isNaN(newDate.getUTCMilliseconds())) {
            this.selectedDate = newDate;
            this.displayedMonthDate = new Date(newDate);
            this.rebuildCalendar(false);
            this.dateChangedCallback(this.selectedDate);
        } else {
            // TODO: Date is invalid. Need to show err
        }
    }

    /**
     * Triggers the onChange callback that was passed into the calendar options.
     * @param date The new date that has been selected in the calendar.
     */
    private dateChangedCallback(date: Date) {
        if(this.onChange) {
            const customEvent = new CustomEvent("onChange",{
                detail: dayjs(date).format(this.format)
            })
            this.onChange(customEvent);
        }
    }

    /**
     * Triggers the onRender callback that was passed into the calendar options.
     */
    private onRenderCallback() {
        if(this.onRender) {
            const customEvent = new CustomEvent("onRender",{
                detail: {
                    calendar: this.calendarElement
                }
            })
            this.onRender(customEvent);
        }
    }
}

customElements.define("datedreamer-calendar", DateDreamerCalendar)

export {DateDreamerCalendar as calendar}