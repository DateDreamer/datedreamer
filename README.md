# DateDreamer
An easy to use lightweight javascript calendar plugin.

## Usage
 
 ```html
<script src="node_modules/datedreamer/datedreamer.js">

<div id="calendar"></div>

<script>
    window.onload = () => {
        new datedreamer.calendar({...options})
    }
</script>
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

* `selectedDate`: Sets the starting date for the calendar. Can be set to a date string, Date object, or null. If null, todays date will be selected by default. If a string is passed, the `format` option should also be passed in order for the calendar to know the format of the `selectedDate` that you are passing.

* `format`: Use this to specify the input AND output format of the date. Please see the available formats from [DayJS](https://day.js.org/docs/en/display/format). <br>Example: `'DD/MM/YYYY'`

* `iconNext`: Sets the next arrow icon. You can pass it either text or an svg.

* `iconPrev`: Sets the previous arrow icon. You can pass it either text or an svg.

* `inputLabel`: Sets the label of the date input element.

* `inputPlaceholder`: Sets the placeholder of the date input element.

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

* `theme`: Sets the style template to use. Options are `unstyled` and `lite-purple`.

    * `unstyled`:
    
        ![Unstyled Calendar](readme-images/unstyled.png?raw=true "Title")
    
    * `lite-purple`: 
    
        ![Calendar using lite-purple theme](readme-images/lite-purple.png?raw=true "Title")

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