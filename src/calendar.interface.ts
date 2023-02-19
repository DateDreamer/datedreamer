export interface ICalendarOptions {
    element: Element | string,
    selectedDate?: string | Date | undefined,
    theme?: "unstyled" | "lite-purple" | undefined,
    styles?: string | undefined,
    format?: string | undefined,
    iconPrev?: string | undefined,
    iconNext?: string | undefined,
    inputLabel?: string | undefined,
    inputPlaceholder?: string | undefined,
    hideInputs?: boolean | undefined,
    onChange?: ((event: CustomEvent) => void) | undefined
    onRender?: ((event: CustomEvent) => void) | undefined
}