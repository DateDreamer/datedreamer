export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const leftChevron = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`;
export const rightChevron = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`;

export const unstyledTheme = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.datedreamer__calendar {
    font-family: 'Roboto', sans-serif;
    width: 100%;
    max-width: 220px;
    padding: 14px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
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

.datedreamer__calendar_prev svg, .datedreamer__calendar_next svg {
    transform: scale(2.875);
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

.datedreamer__calendar_inputs {
    display: flex;
    margin-top: 12px;
}

.datedreamer__calendar_days, .datedreamer__calendar_days-header {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(7,1fr);
    text-align: center;
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
`;

/**
 * The HTML for the calendar element.
 */
export function calendarRoot(theme: "unstyled" = "unstyled", styles: string = ""):string {
  return `
  <style>
      ${theme == "unstyled" ? unstyledTheme : ""}
      
      ${styles}
  </style>
  <div class="datedreamer__calendar">
      <div class="datedreamer__calendar_header"></div>
  
      <div class="datedreamer__calendar_inputs"></div>
  
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

