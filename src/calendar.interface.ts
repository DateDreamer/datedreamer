export interface ICalendarOptions {
    element: HTMLElement | string,
    selectedDate: string | Date,
    theme: "unstyled",
    styles: string,
    onChange: ((event: CustomEvent) => CallableFunction) | undefined
    onRender: ((event: CustomEvent) => CallableFunction) | undefined
}