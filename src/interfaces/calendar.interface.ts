import CalendarConnector from "../components/connector";

export interface ICalendarOptions {
    element: Element | string,
    selectedDate?: string | Date | undefined,
    theme?: "unstyled" | "lite-purple" | undefined,
    styles?: string | undefined,
    format?: string | undefined,
    iconPrev?: string | undefined,
    iconNext?: string | undefined,
    hidePrevNav?: boolean | undefined,
    hideNextNav?: boolean | undefined,
    inputLabel?: string | undefined,
    inputPlaceholder?: string | undefined,
    hideInputs?: boolean | undefined,
    darkMode?: boolean | undefined,
    hideOtherMonthDays?: boolean | undefined,
    rangeMode?: boolean | undefined,
    connector?: CalendarConnector | undefined;
    onChange?: ((event: CustomEvent) => void) | undefined,
    onRender?: ((event: CustomEvent) => void) | undefined,
    onNextNav?: ((event: CustomEvent) => void) | undefined,
    onPrevNav?: ((event: CustomEvent) => void) | undefined
}