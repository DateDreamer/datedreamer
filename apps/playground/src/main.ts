import '@datedreamer/web-components/components/calendar';
import { generateDefaultThemeCSS } from '@datedreamer/theme';

// Apply default theme
document.head.insertAdjacentHTML('beforeend', `<style>${generateDefaultThemeCSS()}</style>`);

const calendar = document.getElementById('calendar') as HTMLElement;
const status = document.getElementById('status') as HTMLElement;

// Listen for date changes (using custom events from the calendar)
calendar?.addEventListener('dd-date-change', (e: CustomEvent) => {
  const date = e.detail;
  status.textContent = `Selected: ${date.toDateString()}`;
});

// Theme switching
window.setTheme = (theme: string) => {
  const themes = {
    default: '#7d56da',
    forest: '#2ecc71',
    ocean: '#3498db',
    sunset: '#e67e22'
  };
  if (calendar && themes[theme]) {
    calendar.style.setProperty('--dd-primary', themes[theme]);
    status.textContent = `Theme: ${theme}`;
  }
};

// Dark mode toggle
window.toggleDarkMode = () => {
  if (calendar) {
    if (calendar.hasAttribute('dark-mode')) {
      calendar.removeAttribute('dark-mode');
    } else {
      calendar.setAttribute('dark-mode', '');
    }
    status.textContent = `Dark Mode: ${calendar.hasAttribute('dark-mode')}`;
  }
};

// Set to today
window.setDateToToday = () => {
  if (calendar) {
    // Trigger a custom event or method to set date to today
    calendar.dispatchEvent(new CustomEvent('dd-set-today'));
    status.textContent = `Date set to today`;
  }
};

// Listen for set-today event
calendar?.addEventListener('dd-set-today', () => {
  // In a real implementation, the calendar would handle this internally
  status.textContent = `Calendar updated to today`;
});

console.log('DateDreamer Playground initialized');
