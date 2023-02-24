export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const leftChevron = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`;
export const rightChevron = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;

/**
 * The HTML for the calendar element.
 */
export function calendarRoot(theme: string, styles: string = "", darkMode: boolean | undefined):string {
  return `
  <style>
      ${unstyledTheme}
      ${theme == "lite-purple" ? litePurple : ""}
      
      ${styles}
  </style>
  <div class="datedreamer__calendar ${darkMode ? "dark": ""}">
      <div class="datedreamer__calendar_header"></div>
  
      <div class="datedreamer__calendar_inputs"></div>
      <div class="datedreamer__calendar_errors"></div>
  
      <div class="datedreamer__calendar_days-wrap">
          <div class="datedreamer__calendar_days-header">
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Su</div>    
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Mo</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Tu</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">We</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Th</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Fr</div>
              <div class="datedreamer__calendar_day datedreamer__calendar_day-header">Sat</div>
          </div>
  
          <div class="datedreamer__calendar_days"></div>
      </div>
  </div>
  `
}

export function calendarToggleRoot(theme: string | undefined, styles: string = "", inputPlaceholder: string | undefined, selectedDate: string | Date | undefined):string {
  return `
    <style>
        .datedreamer__calendar-toggle {
            position: relative;
        }
        .datedreamer__calendar-toggle__calendar {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
        }

        .datedreamer__calendar-toggle__calendar.active {
            display: block;
        }

        ${theme == "lite-purple" ? `
        .datedreamer__calendar-toggle__input input {
            font-weight: 500;
            border-radius: 4px;
            border: 1px solid #e9e8ec;
            font-size: 12px;
            background: white;
            display: block;
            padding: 4px 4px 4px 8px;
            margin-right: 8px;
        }
        ` : ""}

        ${styles}
    </style>
    <div class="datedreamer__calendar-toggle">
        <div class="datedreamer__calendar-toggle__input">
            <input id="date-input" placeholder="${inputPlaceholder}" value="${selectedDate}" readonly/>
        </div>

        <div class="datedreamer__calendar-toggle__calendar"></div>
    </div>
  `
}

export const unstyledTheme = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.datedreamer__calendar {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: 'Roboto', sans-serif;
    width: 100%;
    max-width: 240px;
    padding: 14px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    background: #fff;
    z-index: 0;
    position: relative;
    box-sizing: border-box;
}

.datedreamer__calendar.dark {
  background: #2c3e50;
}

.datedreamer__calendar_header {
    width: 100%;
    display: flex;
    align-items: center;
}

.datedreamer__calendar_prev,.datedreamer__calendar_next {
    background: none;
    border: none;
    width: 16px;
    height: 16px;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#2d3436;
}

.dark .datedreamer__calendar_prev, .dark .datedreamer__calendar_next {
  color: #fff;
}

.datedreamer__calendar_prev svg, .datedreamer__calendar_next svg {
    transform: scale(2.875);
}

.dark .datedreamer__calendar_prev svg, .dark .datedreamer__calendar_next svg {
  fill: #fff;
}

.datedreamer__calendar_title {
    width: 100%;
    display: block;
    flex-grow: 1;
    text-align: center;
    color: #2d3436;
    font-weight: 600;
    font-size: 0.875rem;
}

.dark .datedreamer__calendar_title {
  color: #fff;
}

.datedreamer__calendar_inputs {
    margin-top: 12px;
}

.datedreamer__calendar_inputs label {
  width: 100%;
}

.dark .datedreamer__calendar_inputs label {
  color: #fff;
}

.datedreamer__calendar__inputs-wrap {
  display: flex;
}

.datedreamer__calendar_inputs input {
  width: 100%;
}

.datedreamer__calendar_inputs input.error {
   border: 2px solid #d63031;
}

.datedreamer__calendar_errors {
  margin: 8px 0;
  color: #d63031;
}

.datedreamer__calendar_days, .datedreamer__calendar_days-header {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(7,1fr);
    text-align: center;
}

.datedreamer__calendar_days-header {
  color: #2d3436;
  font-size: 1rem;
}

.dark .datedreamer__calendar_days-header {
  color: #fff;
}

.datedreamer__calendar_day {
    width: 100%;
    height: 100%;
    display: block;
}

.datedreamer__calendar_day button {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.datedreamer__calendar_day.active button {
    background: blue;
    color: white;
}

.datedreamer__calendar_day.highlight button {
  background: #236bb9;
  color: white;
}
`;

export const litePurple = `
.datedreamer__calendar {
  border-radius: 8px;
}

.datedreamer__calendar_prev svg, .datedreamer__calendar_next svg {
  transform: scale(2);
}

.datedreamer__calendar_title {
  font-size: 12px;
}

.datedreamer__calendar_inputs input, .datedreamer__calendar_inputs button {
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid #e9e8ec;
  font-size: 12px;
  background: white;
}

.datedreamer__calendar_inputs label {
  font-size: 12px;
}

.datedreamer__calendar_inputs input {
  flex-grow: 1;
  width: calc(100% - 8px);
  display: block;
  padding: 4px 4px 4px 8px;
  margin-right: 8px;
}

.dark .datedreamer__calendar_inputs input {
  background: #4b6584;
  border: #4b6584;
  color: #fff;
}

.datedreamer__calendar_inputs button {
  padding: 6px 12px;
  display: inline-block;
  cursor: pointer;
}

.dark .datedreamer__calendar_inputs button {
  background: #4b6584;
  border: #4b6584;
  color: #fff;
}

.datedreamer__calendar_errors {
  font-size: 12px;
  font-weight: bold;
}

.datedreamer__calendar_day-header.datedreamer__calendar_day {
  font-size: 12px;
}

.datedreamer__calendar_days {
  margin-top: 8px;
}

.datedreamer__calendar_days .datedreamer__calendar_day {
  margin: 2px;
}

.datedreamer__calendar_days .datedreamer__calendar_day.disabled button{
  color: #767676;
  cursor: default;
  font-weight: normal;
}

.datedreamer__calendar_days .datedreamer__calendar_day.active, .datedreamer__calendar_days .datedreamer__calendar_day.highlight {
  position: relative;
}

.datedreamer__calendar_day.highlight:before{
  content: "";
  width: 100%;
  height: 100%;
  background: #BFA9F3;
  position: absolute;
  display: block;
  z-index: -1;
  top: 50%;
  right: 0;
  left: 0;
  transform: translateY(-50%);
}


.datedreamer__calendar_days .datedreamer__calendar_day.active:before {
  content: "";
  width: 100%;
  height: 100%;
  background: #7d56da;
  border-radius: 2px;
  position: absolute;
  display: block;
  z-index: -1;
  top: 50%;
  right: 0;
  left: 0;
  transform: translateY(-50%);
}

.datedreamer__calendar_days .datedreamer__calendar_day button {
  background: transparent;
  border: none;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
}

.dark .datedreamer__calendar_days .datedreamer__calendar_day button {
  color: #ecf0f1;
}
`