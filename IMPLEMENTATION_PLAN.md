# DateDreamer Consumer Improvements - Implementation Plan

## Overview
This document outlines the implementation plan for improving DateDreamer's consumer API, making it more powerful and accessible for library users.

## Current State Analysis

### ✅ Working Well
- Web Components architecture (custom elements)
- Shadow DOM isolation
- Day.js date handling
- Dark mode support
- Theme customization via CSS
- Existing tests (109 passing)

### ❌ Missing Consumer-Facing Features
- No getter methods for selected date/month/year
- Navigation methods are functions, not exposed properly
- No way to disable/enable calendar
- No focus management
- No event listeners (only callbacks in options)
- Missing ARIA accessibility attributes
- Types not exported from main entry
- No utility functions for date validation/manipulation

---

## Priority 1 - Critical: Core API Gaps

### 1.1 Add Getter Methods to Calendar Component
**File:** `src/components/calendar.ts`

#### Methods to Implement:
```typescript
// Getters
getSelectedDate(): Date | null { return this.selectedDate || null; }
getDisplayMonth(): Date { return this.displayedMonthDate; }
getDisplayedYear(): number { return this.displayedMonthDate.getFullYear(); }
getDisplayMonthName(): string { 
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  return months[this.displayedMonthDate.getMonth()];
}
isSelected(date: Date): boolean {
  // Compare dates properly
  return this.selectedDate.getDate() === date.getDate() &&
         this.selectedDate.getMonth() === date.getMonth() &&
         this.selectedDate.getFullYear() === date.getFullYear();
}

// Range checking
isDateInRange(date: Date): boolean {
  if (!this.rangeMode) return false;
  const range = getConnectorRange(this); // helper function
  if (!range.startDate || !range.endDate) return false;
  
  const d = new Date(date);
  return date >= range.startDate && date <= range.endDate;
}

// Control methods
disable(): void { this.disabled = true; }
enable(): void { this.disabled = false; }
focusInput(): void { /* focus date input */ }
focusFirstDay(): void { /* focus first day button */ }
focusLastDay(): void { /* focus last day button */ }

// Clear selection
clearSelection() / resetSelection(): void {
  this.selectedDate = new Date();
  this.displayedMonthDate = new Date(this.selectedDate);
  // Trigger onRender/onChange callbacks
}
```

### 1.2 Improve Navigation Methods
**File:** `src/components/calendar.ts`

Current: Functions attached as properties
Better: Typed methods that can be called programmatically

```typescript
// Instead of: this.goToPrevMonth = () => { ... }
// Make: goToPrevMonth(): void method
goToPrevMonth(): void { goToPrevMonth(this); }
goToNextMonth(): void { goToNextMonth(this); }

// Add typed navigation methods to Calendar interface
interface ICalendarNavigation {
  goToPrevMonth(): void;
  goToNextMonth(): void;
}
```

---

## Priority 2 - High: Accessibility Improvements

### 2.1 Add ARIA Attributes

#### Navigation Buttons (calendar-render.ts or calendar-events.ts)
```typescript
// Previous button
prevButton.setAttribute('aria-label', 'Previous month');
prevButton.setAttribute('role', 'button');

// Next button  
nextButton.setAttribute('aria-label', 'Next month');
nextButton.setAttribute('role', 'button');
```

#### Days Grid (calendar-render.ts in generateDays function)
```typescript
const daysGrid = document.createElement('div');
daysGrid.setAttribute('role', 'grid');
daysGrid.classList.add('datedreamer__calendar_days');
```

#### Day Cells with State
```typescript
// Active (selected) day
day.querySelector('button').setAttribute('aria-selected', 'true');

// Disabled (other month) day
disabledButton.setAttribute('aria-disabled', 'true');
disabledButton.setAttribute('tabindex', '-1');
```

### 2.2 Keyboard Accessibility
#### Escape Key for Toggle Calendar (calendar-toggle.ts)
```typescript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && this.calendarWrapElement) {
    this.calendarWrapElement.classList.remove('active');
  }
});
```

#### Focus Management
- Add CSS `.focus-visible` styles for better keyboard indicators
- Ensure tab order is logical (nav buttons → today button → days)

---

## Priority 3 - Medium: Developer Experience

### 3.1 Type Exports in `src/index.ts`
```typescript
import { calendarToggle } from "./components/calendar-toggle";
import { calendar } from "./components/calendar";
import {range} from "./components/range";

// Interfaces for typescript consumers
export { IPredefinedRange } from './interfaces/range';
export type { NavigationEventDetail, ICalendarOptions } from './interfaces/calendar';
export type { IRangeOptions } from './interfaces/range';
export { CalendarConnector } from './components/connector';
```

### 3.2 Event System with addEventListener
Add to all component classes:

**calendar.ts:**
```typescript
declare class DateDreamerCalendar extends HTMLElement implements ICalendarOptions, EventTarget {
  // ... existing code
  
  addEventListener<K extends keyof DateDreamerCalendarEventMap>(
    type: K,
    listener: DateDreamerCalendarEventMap[K]
  ): void;

  removeEventListener<K extends keyof DateDreamerCalendarEventMap>(
    type: K,
    listener: DateDreamerCalendarEventMap[K]
  ): void;

  // Event types
  static readonly EVENT_CHANGE = 'change';
  static readonly EVENT_NAVIGATE = 'navigate';
  static readonly EVENT_RENDER = 'render';
}
```

**Usage by consumers:**
```typescript
const calendar = new datedreamer.calendar({ element: '#calendar' });

// Listen to events
calendar.addEventListener(datedreamer.calendar.EVENT_CHANGE, (e) => {
  console.log('Date changed:', e.detail);
});

calendar.addEventListener(datedreamer.calendar.EVENT_NAVIGATE, (e) => {
  console.log('Navigated to:', new Date(e.detail.displayedMonthDate));
});
```

### 3.3 Date Validation Utilities

**New file:** `src/utils/date-utils.ts`

```typescript
import dayjs from 'dayjs';

export namespace Utils {
  /** Check if a value is a valid Date */
  export function isValidDate(date: unknown): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /** Check if date is within a range (inclusive) */
  export function isInRange(start: Date, end: Date, date: Date): boolean {
    return date >= start && date <= end;
  }

  /** Format a date using DayJS format string */
  export function formatDate(
    date: Date,
    format?: string
  ): string {
    return dayjs(date).format(format);
  }

  /** Check if two dates represent the same day */
  export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  /** Add days to a date */
  export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /** Check if date is a weekend */
  export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }

  /** Get ISO week number */
  export function getWeekNumber(date: Date): number {
    const d = new Date(date);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  /** Get week day name */
  export function getWeekdayName(date: Date): string {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
  }

  /** Get week day short name */
  export function getWeekdayShort(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
}
```

**Usage in components:**
```typescript
// Instead of manual validation in dateInputChanged:
import { Utils } from '../utils/date-utils';

export function dateInputChanged(context: calendar, e: Event | KeyboardEvent): void {
  if (e instanceof KeyboardEvent && e.code === 'Tab') return;

  const inputValue = (e.target as HTMLInputElement).value;
  
  if (!Utils.isValidDate(inputValue)) {
    // Show error message
  } else {
    // Process date...
  }
}
```

---

## Priority 4 - Nice-to-Have: Additional Features

### 4.1 Enhanced Documentation Updates

**Update README.md:**
- Add section for new getter methods with examples
- Document `disable()`/`enable()` use cases
- Show event listener usage pattern
- Add A11y usage example with keyboard navigation

**Update docs/API.md:**
- Add all new methods to the API reference
- Include return types and examples
- Add Events section listing all available events

### 4.2 Helper Methods for Common Patterns

Add to Calendar component:

```typescript
/** Navigate to specific month */
goToMonth(year: number, month: number): void {
  const d = new Date(this.displayedMonthDate);
  d.setFullYear(year);
  d.setMonth(month);
  this.displayedMonthDate = d;
  this.rebuildCalendar(true, 'first');
}

/** Navigate to previous/next week */
goToPrevWeek(): void { /* implementation */ }
goToNextWeek(): void { /* implementation */ }

/** Jump to beginning of month */
jumpToStartOfMonth(): void {
  const d = new Date(this.displayedMonthDate);
  d.setDate(1);
  this.displayedMonthDate = d;
}

/** Jump to end of month */
jumpToEndOfMonth(): void {
  const d = new Date(this.displayedMonthDate);
  d.setDate(d.getDate() - (d.getDay() || 7) + Math.ceil(d.getDate()));
  // Adjust logic as needed
  this.displayedMonthDate = d;
}

/** Is today visible in current view? */
isTodayVisible(): boolean {
  const today = new Date();
  return this.isDateInRange(today);
}
```

### 4.3 Localization Support (Future)
Create locale management system:
```typescript
calendar.setLocale({
  months: ['Enero', 'Febrero', ...],
  weekdays: ['Dom', 'Lun', 'Mar', ...]
});
```

---

## Verification Checklist

After each implementation step, verify with:

### Unit Tests
```bash
yarn test src/components/calendar.test.ts
yarn test src/components/range.test.ts
```

### Linting
```bash
yarn lint
# Should have 0 errors (warnings OK for non-null assertions)
```

### Type Checking
```bash
yarn type-check
# Must pass with no errors
```

### Build
```bash
yarn build
# Verify dist/datedreamer.js exists and is valid UMD bundle
```

---

## Rollout Order Recommendation

1. **Week 1:** Priority 1 (API methods) + Priority 2 (A11y attributes)
   - Add all getter/control methods to Calendar
   - Update calendar-render.ts with ARIA
   - Add escape key handler to toggle
   - Run full test suite

2. **Week 2:** Priority 3 (Dev experience)
   - Add type exports to index.ts
   - Implement event system
   - Create date-utils.ts and add utility functions
   - Update documentation

3. **Week 3:** Priority 4 (Nice-to-haves) + Polish
   - Add helper navigation methods
   - Review all public APIs
   - Update README with new features
   - Consider adding a CHANGELOG.md entry for each release

---

## Breaking Changes to Avoid

⚠️ **DO NOT change:**
- Existing method signatures (don't break existing consumers)
- Public event detail structures
- CSS class names used by consumers
- Shadow DOM structure

✅ **Safe changes:**
- Add new properties/methods
- Add ARIA attributes (doesn't break existing functionality)
- Export additional types/interfaces
- Add utility functions in separate module

---

## Testing Strategy

### Existing Tests (Don't Break)
All 109 existing tests must continue to pass:
- `yarn test` - Full suite
- `yarn jest src/__tests__/calendar.test.ts` - Single file

### New Test Coverage
Add tests for new methods in appropriate test files:
- Calendar getters in `src/__tests__/calendar.test.ts`
- Navigation helpers (new test file or existing)
- Event listeners in integration tests

---

## Final Deliverables

After complete implementation:

1. **Updated Source Files:**
   - ✅ `src/components/calendar.ts` - Enhanced with getters/control methods
   - ✅ `src/components/calendar-render.ts` - ARIA attributes added
   - ✅ `src/components/calendar-toggle.ts` - Keyboard accessibility
   - ✅ `src/index.ts` - All types exported
   - ✅ `src/utils/date-utils.ts` - New utility module

2. **Updated Documentation:**
   - ✅ README.md - Updated with new API usage examples
   - ✅ docs/API.md - Complete reference with all methods
   - ✅ CHANGELOG.md (recommended) - Document breaking/non-breaking changes

3. **CI Updates:**
   - Tests passing (109 + new ones)
   - Lint passing (0 errors)
   - Type-check passing
   - Build producing valid bundle
