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

#### Events

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