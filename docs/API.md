# DateDreamer API Documentation

## Overview

DateDreamer is a lightweight, customizable JavaScript calendar library built with Web Components and TypeScript. It provides three main components: standalone calendar, toggle calendar, and range calendar.

## Installation

```bash
npm install datedreamer
# or
yarn add datedreamer
```

## Components

### Calendar

The main calendar component that provides date selection functionality.

#### Basic Usage

```javascript
import { calendar } from 'datedreamer';

const myCalendar = new calendar({
  element: '#calendar-container',
  selectedDate: new Date(),
  theme: 'lite-purple',
  darkMode: true
});
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `element` | `Element \| string` | **Required** | DOM element or CSS selector where calendar will be rendered |
| `selectedDate` | `Date \| string \| null` | `new Date()` | Initial selected date |
| `theme` | `'unstyled' \| 'lite-purple'` | `'unstyled'` | Visual theme for the calendar |
| `styles` | `string` | `''` | Custom CSS styles to apply |
| `format` | `string` | `undefined` | Date format for parsing and displaying dates |
| `iconNext` | `string` | `undefined` | Custom icon for next month navigation |
| `iconPrev` | `string` | `undefined` | Custom icon for previous month navigation |
| `hidePrevNav` | `boolean` | `false` | Whether to hide the previous month button |
| `hideNextNav` | `boolean` | `false` | Whether to hide the next month button |
| `inputLabel` | `string` | `'Set a date'` | Label for the date input field |
| `inputPlaceholder` | `string` | `'Enter a date'` | Placeholder text for the date input field |
| `hideInputs` | `boolean` | `false` | Whether to hide the input field and today button |
| `darkMode` | `boolean` | `false` | Whether to enable dark mode styling |
| `darkModeAuto` | `boolean` | `false` | Whether to automatically detect user's system preference for dark mode |
| `hideOtherMonthDays` | `boolean` | `false` | Whether to hide days from other months |
| `rangeMode` | `boolean` | `false` | Whether to enable range selection mode |
| `connector` | `CalendarConnector` | `undefined` | Calendar connector for linking multiple calendars |
| `onChange` | `function` | `undefined` | Callback function triggered when date changes |
| `onRender` | `function` | `undefined` | Callback function triggered when calendar renders |
| `onNextNav` | `function` | `undefined` | Callback function triggered when navigating to next month |
| `onPrevNav` | `function` | `undefined` | Callback function triggered when navigating to previous month |

#### Methods

##### `setDate(date: Date | string)`

Sets the selected date in the calendar.

```javascript
myCalendar.setDate(new Date('2024-01-15'));
myCalendar.setDate('2024-01-15');
```

##### `setDateToToday()`

Sets the selected date to today.

```javascript
myCalendar.setDateToToday();
```

##### `setDisplayedMonthDate(date: Date)`

Changes the displayed month without changing the selected date.

```javascript
myCalendar.setDisplayedMonthDate(new Date('2024-06-01'));
```

---

## Calendar Control Methods (Public API)

### Getter Methods

#### `getSelectedDate(): Date | null`

Gets the currently selected date in the calendar.

```javascript
const selected = myCalendar.getSelectedDate(); // Date object or null
console.log(selected.getDate(), selected.getMonth(), selected.getFullYear());
```

#### `getDisplayMonth(): Date`

Gets the currently displayed month.

```javascript
const displayedMonth = myCalendar.getDisplayMonth();
console.log(displayedMonth.getFullYear(), displayedMonth.getMonth());
```

#### `getDisplayedYear(): number`

Gets the year of the currently displayed month.

```javascript
const year = myCalendar.getDisplayedYear(); // 2024
```

#### `getDisplayMonthName(): string`

Gets the full name of the currently displayed month.

```javascript
console.log(myCalendar.getDisplayMonthName()); // "January", "February", etc.
```

#### `isSelected(date: Date): boolean`

Checks if the given date matches the currently selected date.

```javascript
const today = new Date();
const isTodaySelected = myCalendar.isSelected(today);
```

#### `getIsInRangeMode(): boolean`

Gets whether the calendar is in range selection mode (only for range calendars).

```javascript
console.log(myCalendar.getIsInRangeMode()); // true or false
```

---

### Control Methods

#### `disable(): void`

Disables user interaction with the calendar.

```javascript
myCalendar.disable(); // Prevents clicks, keyboard navigation, etc.
```

#### `enable(): void`

Enables user interaction with the calendar.

```javascript
myCalendar.enable(); // Re-enables all interactions
```

#### `focusInput(): void`

Focuses the date input field (if visible).

```javascript
myCalendar.focusInput();
```

#### `focusFirstDay(): void`

Focuses the first clickable day button in the calendar grid.

```javascript
myCalendar.focusFirstDay();
```

#### `focusLastDay(): void`

Focuses the last clickable day button in the calendar grid.

```javascript
myCalendar.focusLastDay();
```

#### `clearSelection(): void`

Clears the current date selection and resets to today's date.

```javascript
myCalendar.clearSelection(); // Resets to today
myCalendar.getSelectedDate(); // Now returns today's date
```

#### `resetSelection(): void`

Resets the displayed month to match the currently selected date (without changing the selection itself).

```javascript
myCalendar.resetSelection(); // Display matches selected date again
```

---

### Helper Navigation Methods

#### `goToMonth(year: number, month: number): void`

Navigates to a specific month by year and month index (0-11).

```javascript
// Go to June 2024
myCalendar.goToMonth(2024, 5); // month is 0-indexed (0 = January)
```

#### `goToPrevWeek(): void`

Navigates back one week (7 days) from the currently selected date.

```javascript
myCalendar.goToPrevWeek();
```

#### `goToNextWeek(): void`

Navigates forward one week (7 days) from the currently selected date.

```javascript
myCalendar.goToNextWeek();
```

#### `jumpToStartOfMonth(): void`

Jumps to the first day of the displayed month.

```javascript
myCalendar.jumpToStartOfMonth(); // Goes to 1st of current month
```

#### `jumpToEndOfMonth(): void`

Jumps to the last day of the displayed month.

```javascript
myCalendar.jumpToEndOfMonth(); // Goes to last day of current month
```

#### `isTodayVisible(): boolean`

Checks if today's date is visible in the current calendar view.

```javascript
console.log(myCalendar.isTodayVisible()); // true if today falls within displayed month
```

---

## Event System

DateDreamer supports addEventListener for event-based interaction:

### EVENT_CHANGE

Triggered when a date is selected or changed.

```javascript
const myCalendar = new calendar({
  element: '#calendar',
  onChange: (event) => {
    console.log('Date changed:', event.detail); // Date object
  }
});

// Or using addEventListener
myCalendar.addEventListener(calendar.EVENT_CHANGE, (e) => {
  console.log('Selected date:', e.detail);
});
```

### EVENT_NAVIGATE

Triggered when navigating between months.

```javascript
myCalendar.addEventListener(calendar.EVENT_NAVIGATE, (e) => {
  console.log('Navigated to:', new Date(e.detail.displayedMonthDate));
});
```

### EVENT_RENDER

Triggered when the calendar completes rendering.

```javascript
myCalendar.addEventListener(calendar.EVENT_RENDER, (e) => {
  console.log('Calendar rendered');
});
```

---

## Utilities Module

DateDreamer exports a `Utils` namespace with helpful date manipulation functions:

```javascript
import { Utils } from 'datedreamer';
```

### Date Validation

#### `Utils.isValidDate(value): boolean`

Checks if a value is a valid Date object.

```javascript
Utils.isValidDate(new Date()); // true
Utils.isValidDate('not-a-date'); // false
```

#### `Utils.isInRange(start: Date, end: Date, date: Date): boolean`

Checks if a date falls within a range (inclusive).

```javascript
const start = new Date('2024-01-01');
const end = new Date('2024-12-31');
Utils.isInRange(start, end, new Date('2024-06-15')); // true
```

### Date Formatting

#### `Utils.formatDate(date: Date, format?: string): string`

Formats a date using DayJS format tokens.

```javascript
Utils.formatDate(new Date(), 'MM/DD/YYYY'); // "06/08/2024"
Utils.formatDate(new Date()); // Uses default format
```

### Date Comparison

#### `Utils.isSameDay(date1: Date, date2: Date): boolean`

Checks if two dates represent the same day.

```javascript
Utils.isSameDay(
  new Date('2024-06-08'),
  new Date('2024-06-08')
); // true
```

### Date Manipulation

#### `Utils.addDays(date: Date, days: number): Date`

Adds a number of days to a date.

```javascript
const tomorrow = Utils.addDays(new Date(), 1);
const nextWeek = Utils.addDays(new Date(), 7);
```

### Week Helpers

#### `Utils.getWeekNumber(date: Date): number`

Gets the ISO week number for a date.

```javascript
Utils.getWeekNumber(new Date()); // e.g., 24
```

#### `Utils.isWeekend(date: Date): boolean`

Checks if a date falls on a weekend (Saturday or Sunday).

```javascript
Utils.isWeekend(new Date()); // true or false
```

#### `Utils.getWeekdayName(date: Date): string`

Gets the full weekday name.

```javascript
Utils.getWeekdayName(new Date()); // "Monday", "Tuesday", etc.
```

#### `Utils.getWeekdayShort(date: Date): string`

Gets the short weekday name.

```javascript
Utils.getWeekdayShort(new Date()); // "Mon", "Tue", etc.
```

##### `onChange`

Triggered when a date is selected or changed.

```javascript
const myCalendar = new calendar({
  element: '#calendar',
  onChange: (event) => {
    console.log('Selected date:', event.detail);
  }
});
```

##### `onRender`

Triggered when the calendar is rendered.

```javascript
const myCalendar = new calendar({
  element: '#calendar',
  onRender: (event) => {
    console.log('Calendar rendered:', event.detail.calendar);
  }
});
```

### Calendar Toggle

A calendar that shows/hides when an input is clicked.

#### Usage

```javascript
import { calendarToggle } from 'datedreamer';

const toggleCalendar = new calendarToggle({
  element: '#toggle-input',
  selectedDate: new Date(),
  theme: 'lite-purple'
});
```

#### Configuration

Uses the same configuration options as the main calendar component.

### Range Calendar

A calendar component for selecting date ranges.

#### Usage

```javascript
import { range } from 'datedreamer';

const rangeCalendar = new range({
  element: '#range-container',
  selectedDate: new Date(),
  theme: 'lite-purple'
});
```

#### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `element` | `Element \| string` | **Required** | DOM element or CSS selector where range calendar will be rendered |
| `selectedDate` | `Date \| string \| null` | `new Date()` | Initial selected date |
| `theme` | `'unstyled' \| 'lite-purple'` | `'unstyled'` | Visual theme for the calendar |
| `styles` | `string` | `''` | Custom CSS styles to apply |
| `format` | `string` | `undefined` | Date format for parsing and displaying dates |
| `iconNext` | `string` | `undefined` | Custom icon for next month navigation |
| `iconPrev` | `string` | `undefined` | Custom icon for previous month navigation |
| `inputLabel` | `string` | `'Set a date'` | Label for the date input field |
| `inputPlaceholder` | `string` | `'Enter a date'` | Placeholder text for the date input field |
| `hideInputs` | `boolean` | `false` | Whether to hide the input field and today button |
| `darkMode` | `boolean` | `false` | Whether to enable dark mode styling |
| `darkModeAuto` | `boolean` | `false` | Whether to automatically detect user's system preference for dark mode |
| `predefinedRanges` | `IPredefinedRange[]` | `undefined` | Array of predefined range buttons to display |
| `onChange` | `function` | `undefined` | Callback function triggered when date range changes |
| `onRender` | `function` | `undefined` | Callback function triggered when calendar renders |

#### Predefined Ranges

The range calendar supports predefined range buttons that provide quick access to common date ranges. These appear as buttons on the left side of the calendar.

##### IPredefinedRange Interface

```typescript
interface IPredefinedRange {
  label: string;
  getRange: () => { start: Date; end: Date };
}
```

##### Example Usage

```javascript
const rangeCalendar = new range({
  element: '#range-container',
  predefinedRanges: [
    {
      label: 'Last 7 Days',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { start, end };
      }
    },
    {
      label: 'This Month',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
      }
    },
    {
      label: 'Last Month',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { start, end };
      }
    }
  ]
});
```

## Date Formats

DateDreamer uses DayJS for date formatting. Common formats include:

- `'YYYY-MM-DD'` - 2024-01-15
- `'DD/MM/YYYY'` - 15/01/2024
- `'MM/DD/YYYY'` - 01/15/2024
- `'MMMM D, YYYY'` - January 15, 2024

For a complete list of format tokens, see the [DayJS documentation](https://day.js.org/docs/en/display/format).

## Themes

### Unstyled Theme

The default theme with minimal styling. You can customize it with your own CSS.

### Lite Purple Theme

A pre-styled theme with purple accents and modern design.

## Dark Mode

DateDreamer supports both manual and automatic dark mode detection.

### Manual Dark Mode

Enable dark mode by setting `darkMode: true` in the configuration. This works with both themes.

```javascript
const calendar = new calendar({
  element: '#calendar',
  darkMode: true,
  theme: 'lite-purple'
});
```

### Automatic Dark Mode Detection

Enable automatic dark mode detection by setting `darkModeAuto: true`. The calendar will automatically follow the user's system preference and update in real-time when the system setting changes.

```javascript
const calendar = new calendar({
  element: '#calendar',
  darkModeAuto: true,
  theme: 'lite-purple'
});
```

**Note**: When `darkModeAuto` is enabled, it takes precedence over the `darkMode` setting. The calendar will listen for system preference changes using the `prefers-color-scheme` media query.

## Custom Styling

You can add custom CSS styles using the `styles` option:

```javascript
const calendar = new calendar({
  element: '#calendar',
  styles: `
    .datedreamer__calendar {
      border: 2px solid #007bff;
      border-radius: 8px;
    }
    .datedreamer__calendar_day button {
      background-color: #f8f9fa;
    }
  `
});
```

## Browser Support

DateDreamer supports all modern browsers that support Web Components:

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## TypeScript Support

DateDreamer is written in TypeScript and includes type definitions:

```typescript
import { calendar, calendarToggle, range } from 'datedreamer';

const myCalendar: calendar = new calendar({
  element: '#calendar',
  selectedDate: new Date()
});
``` 