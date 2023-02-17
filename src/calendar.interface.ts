export interface ICalendarOptions {
    element: HTMLElement | string,
    selectedDate: string | Date,
    theme: "unstyled" | "lite-purple",
    styles: string,
    format: string,
    iconPrev: string | undefined,
    iconNext: string | undefined,
    onChange: ((event: CustomEvent) => CallableFunction) | undefined
    onRender: ((event: CustomEvent) => CallableFunction) | undefined
}