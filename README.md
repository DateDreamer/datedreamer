# DateDreamer

## Usage
```typescript
import * as datedreamer from "datedreamer";

new datedreamer.calendar({...options});
```

OR

```typescript
import {calendar} from "datedreamer";

new calendar({...options});
```

### Options

`element`: Sets where to insert the calendar to. Can be either a CSS selector string or an HTMLElement object.

`selectedDate`: Sets the starting date for the calendar. Can be set to a date string, Date object, or null. If null, todays date will be selected by default.