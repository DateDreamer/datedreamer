import { useRef, useEffect, useCallback } from 'react';
import { useCalendar } from '../hooks/useCalendar';

export interface CalendarProps {
  /** Initial selected date (ISO string or Date) */
  initialDate?: Date | string;
  /** Enable range selection mode */
  rangeMode?: boolean;
  /** Dark theme */
  darkMode?: boolean;
  /** Named theme override */
  theme?: 'lite-purple' | 'forest' | 'ocean' | 'sunset';
  /** Connector ID for syncing multiple calendars */
  connectorId?: string;
  /** Show date input field above the grid */
  showInput?: boolean;
  /** Date format for input display */
  inputFormat?: string;
  /** Disable weekend day clicks */
  hideWeekends?: boolean;
  /** Earliest selectable date (ISO) */
  minDate?: string;
  /** Latest selectable date (ISO) */
  maxDate?: string;
  /** Comma-separated ISO dates to disable */
  disabledDates?: string;
  /** Custom previous icon SVG */
  prevIcon?: string;
  /** Custom next icon SVG */
  nextIcon?: string;
  /** Callback when date changes */
  onDateChange?: (detail: { selectedDate?: Date; startDate?: Date; endDate?: Date; rangeMode?: boolean }) => void;
  /** Callback when navigation changes */
  onNavChange?: (detail: { displayedMonthDate: Date }) => void;
}

/**
 * React Calendar component — wraps <dd-calendar> web component.
 * Supports both controlled and uncontrolled modes.
 */
export function Calendar({
  initialDate,
  rangeMode = false,
  darkMode = false,
  theme,
  connectorId,
  showInput = false,
  inputFormat,
  hideWeekends = false,
  minDate,
  maxDate,
  disabledDates,
  prevIcon,
  nextIcon,
  onDateChange,
  onNavChange,
}: CalendarProps) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const { setDate } = useCalendar({ initialDate: typeof initialDate === 'string' ? new Date(initialDate) : initialDate });

  // Ensure web component is registered
  useEffect(() => {
    import('@datedreamer/web-components').catch(() => {});
  }, []);

  // Forward date changes to callback
  const handleDateChange = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    onDateChange?.(detail);
  }, [onDateChange]);

  const handleNavChange = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    onNavChange?.(detail);
  }, [onNavChange]);

  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;

    el.addEventListener('dd-date-change', handleDateChange);
    el.addEventListener('dd-nav-change', handleNavChange);

    return () => {
      el.removeEventListener('dd-date-change', handleDateChange);
      el.removeEventListener('dd-nav-change', handleNavChange);
    };
  }, [handleDateChange, handleNavChange]);

  // Expose programmatic API via ref
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;

    (window as any).__calendarApi = {
      setDate: (date: Date | string) => {
        el.dispatchEvent(new CustomEvent('dd-set-date', { detail: date }));
      },
    };
  }, []);

  return (
    <div ref={calendarRef}>
      <dd-calendar
        {...(initialDate && { selected: typeof initialDate === 'string' ? initialDate : initialDate.toISOString() })}
        {...(rangeMode && { 'range-mode': '' })}
        {...(darkMode && { 'dark-mode': '' })}
        {...(theme && { theme })}
        {...(connectorId && { 'connector-id': connectorId })}
        {...(showInput && { 'show-input': '' })}
        {...(inputFormat && { 'input-format': inputFormat })}
        {...(hideWeekends && { 'hide-weekends': '' })}
        {...(minDate && { 'min-date': minDate })}
        {...(maxDate && { 'max-date': maxDate })}
        {...(disabledDates && { 'disabled-dates': disabledDates })}
        {...(prevIcon && { 'prev-icon': prevIcon })}
        {...(nextIcon && { 'next-icon': nextIcon })}
      />
    </div>
  );
}

export default Calendar;
