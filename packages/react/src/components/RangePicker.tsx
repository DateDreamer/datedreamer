import { useRef, useEffect, useCallback } from 'react';

export interface RangePickerProps {
  /** Show the preset ranges sidebar */
  showSidebar?: boolean;
  /** Dark theme */
  darkMode?: boolean;
  /** Named theme override */
  theme?: 'lite-purple' | 'forest' | 'ocean' | 'sunset';
  /** Connector ID for syncing with other calendars */
  connectorId?: string;
  /** Callback when range changes */
  onRangeChange?: (detail: { start: Date; end: Date }) => void;
}

/**
 * React RangePicker component — wraps <dd-range> web component.
 * Dual-calendar range picker with sidebar presets and connector sync.
 */
export function RangePicker({
  showSidebar = true,
  darkMode = false,
  theme,
  connectorId,
  onRangeChange,
}: RangePickerProps) {
  const rangeRef = useRef<HTMLDivElement>(null);

  // Ensure web component is registered
  useEffect(() => {
    import('@datedreamer/web-components').catch(() => {});
  }, []);

  const handleChange = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail;
    onRangeChange?.(detail);
  }, [onRangeChange]);

  useEffect(() => {
    const el = rangeRef.current;
    if (!el) return;

    el.addEventListener('range-change', handleChange);
    return () => el.removeEventListener('range-change', handleChange);
  }, [handleChange]);

  return (
    <div ref={rangeRef}>
      <dd-range
        {...(showSidebar && { 'show-sidebar': '' })}
        {...(darkMode && { 'dark-mode': '' })}
        {...(theme && { theme })}
        {...(connectorId && { 'connector-id': connectorId })}
      />
    </div>
  );
}

export default RangePicker;
