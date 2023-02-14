export interface ICalendarOptions {
    element: HTMLElement | string,
    selectedDate: string | Date,
    onChange: ((event: CustomEvent) => CallableFunction) | undefined
    onRender: ((event: CustomEvent) => CallableFunction) | undefined
}