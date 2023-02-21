import { calendarStyles } from "../utils/range-utils";
import { calendar } from "./calendar";
import CalendarConnector from "./connector";

class DateDreamerRange extends HTMLElement {
    options: any;
    calendar1: calendar | undefined;
    calendar2: calendar | undefined;
    calendar1DisplayedDate: Date = new Date();
    calendar2DisplayedDate: Date = new Date();

    selectedStartDate: Date | undefined;
    selectedEndDate: Date | undefined;

    connector: CalendarConnector | undefined;

    constructor(options: any) {
        super();
        this.options = options;
        this.connector = new CalendarConnector();

        this.connector.dateChangedCallback = this.handleDateChange;
        this.init();

        // setInterval(() => {
        //     console.log(this.connector)
        // },500)
    }

    init():void {
        this.addStyles();

        this.calendar1DisplayedDate.setDate(1);
        this.calendar2DisplayedDate.setDate(1);
        this.calendar2DisplayedDate.setMonth(this.calendar2DisplayedDate.getMonth() + 1);

        const rangeElement = document.createElement("div");
        rangeElement.classList.add("datedreamer-range");
        
        const calendar1WrapElement = document.createElement("div");
        const calendar2WrapElement = document.createElement("div");

        rangeElement.append(calendar1WrapElement,calendar2WrapElement);

        this.calendar1 = new calendar({
            element: calendar1WrapElement,
            theme: "lite-purple",
            format: "MM/DD/YYYY",
            hideInputs: true,
            hideNextNav: true,
            styles: calendarStyles,
            onPrevNav: (e) => this.prevHandler(e),
            rangeMode: true,
            hideOtherMonthDays: true,
            connector: this.connector
        });

        
        this.calendar2 = new calendar({
            element: calendar2WrapElement,
            theme: "lite-purple",
            format: "MM/DD/YYYY",
            hideInputs: true,
            hidePrevNav: true,
            styles: calendarStyles,
            onNextNav: (e) => this.nextHandler(e),
            rangeMode: true,
            hideOtherMonthDays: true,
            connector: this.connector
        });

        this.calendar2.setDisplayedMonthDate(this.calendar2DisplayedDate);

        this.append(rangeElement);

        if(typeof this.options.element == "string") {
            const parentElement = document.querySelector(this.options.element);
            if(parentElement) {
                parentElement.append(this);
            }
        } else if(typeof this.options.element == "object"){
            this.options.element.append(this);
        }
    }

    addStyles():void {
        const styles = `
            .datedreamer-range {
                display: inline-flex;
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%);
            }
            ${this.options.styles ? this.options.styles : ""}
        `

        const styleLink = document.createElement("style");
        styleLink.innerHTML = styles;

        this.append(styleLink);
    }

    prevHandler(e: CustomEvent) {
        this.calendar1DisplayedDate = e.detail;
        this.calendar2DisplayedDate.setMonth(this.calendar2DisplayedDate.getMonth() - 1);
        this.resetViewedDated();
    }

    nextHandler(e: CustomEvent) {
        this.calendar2DisplayedDate = e.detail;
        this.calendar1DisplayedDate.setMonth(this.calendar1DisplayedDate.getMonth() + 1);
        this.resetViewedDated();
    }

    resetViewedDated() {
        this.calendar1?.setDisplayedMonthDate(this.calendar1DisplayedDate);
        this.calendar2?.setDisplayedMonthDate(this.calendar2DisplayedDate);
    }

    handleDateChange = (e: CustomEvent) => {
        console.log(this.connector?.startDate, this.connector?.endDate);
    }
}

customElements.define("datedreamer-range", DateDreamerRange);
export {DateDreamerRange as range}