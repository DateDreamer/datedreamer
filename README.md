# DateDreamer
## Usage
 
 ```html
<script src="node_modules/datedreamer/datedreamer.js">

<div id="calendar"></div>

<script>
    window.onload = () => {
        new datedreamer.calendar({...options})
    }
</script>s
 ```

OR

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


## Development

### Install dependencies using yarn
```yarn install```

### Run development server
```yarn start```