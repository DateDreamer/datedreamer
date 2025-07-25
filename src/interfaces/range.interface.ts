export interface IPredefinedRange {
  label: string;
  getRange: () => { start: Date; end: Date };
}

export interface IRangeOptions {
  element: Element | string;
  selectedDate?: string | Date | undefined;
  theme?: 'unstyled' | 'lite-purple' | undefined;
  styles?: string | undefined;
  format?: string | undefined;
  iconPrev?: string | undefined;
  iconNext?: string | undefined;
  inputLabel?: string | undefined;
  inputPlaceholder?: string | undefined;
  hideInputs?: boolean | undefined;
  darkMode?: boolean | undefined;
  darkModeAuto?: boolean | undefined;
  predefinedRanges?: IPredefinedRange[] | undefined;
  onChange?: ((event: CustomEvent) => void) | undefined;
  onRender?: ((event: CustomEvent<Record<string, never>>) => void) | undefined;
}
