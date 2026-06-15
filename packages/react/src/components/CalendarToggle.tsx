import { useRef, useEffect, useCallback } from 'react';

export interface CalendarToggleProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Date format (DD/MM/YYYY, YYYY-MM-DD, etc.) */
  format?: string;
  /** Initial value as ISO date string */
  value?: string;
  /** Dark theme */
  darkMode?: boolean;
  /** Named theme override */
  theme?: 'lite-purple' | 'forest' | 'ocean' | 'sunset';
  /** Callback when date changes */
  onDateChange?: (detail: { date?: Date; formatted?: string }) => void;
}

/**
 * React CalendarToggle component — wraps <dd-calendar-toggle> web component.
 * Provides a text input that opens a popup calendar on focus/click.
 */
export function CalendarToggle({
  placeholder = 'Select a date',
  format,
  value,
  darkMode = false,
  theme,
  onDateChange,
}: CalendarToggleProps) {
  const toggleRef = useRef<HTMLDivElement>(null);

  // Ensure web component is registered
  useEffect(() => {
    import('@datedreamer/web-components').catch(() => {});
  }, []);

  const handleChange = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    onDateChange?.(detail);
  }, [onDateChange]);

  useEffect(() => {
    const el = toggleRef.current;
    if (!el) return;

    el.addEventListener('date-change', handleChange);
    return () => el.removeEventListener('date-change', handleChange);
  }, [handleChange]);

  return (
    <div ref={toggleRef}>
      <dd-calendar-toggle
        {...(placeholder && { placeholder })}
        {...(format && { format })}
        {...(value && { value })}
        {...(darkMode && { 'dark-mode': '' })}
        {...(theme && { theme })}
      />
    </div>
  );
}

export default CalendarToggle;
