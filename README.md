# DateDreamer
An easy to use lightweight javascript calendar library.

## Install & Usage

### Install
Install DateDreamer with either yarn or npm.

```bash
npm install datedreamer
```

```bash
yarn install datedreamer
```
 
 ### Use
 
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

## Standalone Calendar
Use this if you want a standalone calendar that comes with an input filled and a Today button.

* `element`: Sets where to insert the calendar to. Can be either a CSS selector string or an HTMLElement object.

* `selectedDate`: Sets the starting date for the calendar. Can be set to a date string, Date object, or null. If null, todays date will be selected by default. If a string is passed, the `format` option should also be passed in order for the calendar to know the format of the `selectedDate` that you are passing.

* `format`: Use this to specify the input AND output format of the date. Please see the available formats from [DayJS](https://day.js.org/docs/en/display/format). <br>Example: `'DD/MM/YYYY'`

* `iconNext`: Sets the next arrow icon. You can pass it either text or an svg.

* `iconPrev`: Sets the previous arrow icon. You can pass it either text or an svg.

* `inputLabel`: Sets the label of the date input element.

* `inputPlaceholder`: Sets the placeholder of the date input element.

* `hideInputs`: Hides the input and today button from the UI.

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
    
        ![Unstyled Calendar](readme-images/unstyled.png?raw=true)
    
    * `lite-purple`: 
    
        ![Calendar using lite-purple theme](readme-images/lite-purple.png?raw=true)

* `darkMode`: Enable dark mode styling for the calendar. Works with both `unstyled` and `lite-purple` themes.
    ```javascript
        new datedreamer.calendar({
            ...,
            darkMode: true
        })
    ```

* `darkModeAuto`: Automatically detect and follow the user's system preference for dark mode. When enabled, the calendar will automatically switch between light and dark mode based on the user's system settings. This takes precedence over the `darkMode` setting when enabled.
    ```javascript
        new datedreamer.calendar({
            ...,
            darkModeAuto: true
        })
    ```
    
    **Note**: The calendar will listen for system preference changes and update automatically when the user changes their system's dark mode setting.

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

## Toggle Calendar
The toggle calendar has the same options as the Standalone Calendar, however the input is a standalone input element which when clicked, triggers the calendar to show.

![Toggle Calendar Input](readme-images/toggleCalendarInput.png?raw=true)

![Toggle Calendar](readme-images/toggleCalendar.png?raw=true)

```javascript
new datedreamer.calendarToggle({
    ...options
});
```

## Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/DateDreamer/DateDreamer.git
cd DateDreamer

# Run the setup script (macOS/Linux)
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Or manually:
yarn install
npx husky install
yarn format
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start development server |
| `yarn build` | Build for production |
| `yarn test` | Run tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Run tests with coverage report |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix ESLint errors automatically |
| `yarn format` | Format code with Prettier |
| `yarn type-check` | Run TypeScript type checking |

### Code Quality

This project uses several tools to maintain code quality:

- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **Jest** - Unit testing framework
- **TypeScript** - Type checking

### Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`yarn test && yarn lint`)
5. Commit your changes (`yarn commit`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Documentation

- [API Documentation](./docs/API.md) - Complete API reference
- [Examples](./examples/) - Usage examples and demos

<br /><br />
[Developed with love by Jorge Felico](https://jorgefelico.com)
