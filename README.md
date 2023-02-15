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

* `element`: Sets where to insert the calendar to. Can be either a CSS selector string or an HTMLElement object.

* `selectedDate`: Sets the starting date for the calendar. Can be set to a date string, Date object, or null. If null, todays date will be selected by default.

* `onChange`: Use this to provide a callback function that the calendar will call when the date is changed. The callback function will receive a `CustomEvent` argument that will include the chosen date inside the detail property.
    ```javascript
    new datedreamer.calendar({
        ...,
        onChange: (e) => {
            // Get Date object from event
            console.log(e.detail);
        }
    })
    ```

* `onRender`: Use this to provide a callback function that the calendar will call when the calendar is rendered. The callback function will receive a `CustomEvent` argument that will include a `calendar` property inside of the event `detail` property.
    ```javascript
        new datedreamer.calendar({
            ...,
            onRender: (e) => {
                // Calendar has rendered
                console.log(e.detail.calendar);
            }
        })
    ```

* `styles`: Use this property to pass css styles that will be passed into the components style tag.
    ```javascript
        new datedreamer.calendar({
            ...,
            styles: `
                button {
                    color: blue
                }
            `
        })
    ```

## Development

### Install dependencies using yarn
```yarn install```

### Run development server
```yarn start```