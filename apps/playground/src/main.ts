import '@datedreamer/web-components/components/calendar';
import '@datedreamer/web-components/components/range';
import '@datedreamer/web-components/components/calendar-toggle';
import '../../../packages/theme/src/calendar.css';

const calendar = document.getElementById('calendar') as HTMLElement;
const status = document.getElementById('status') as HTMLElement;

// Listen for date changes
calendar?.addEventListener('dd-date-change', (e: CustomEvent) => {
  const date = e.detail;
  status.textContent = `Selected: ${date.toDateString()}`;
});

// Theme switching via CSS custom property
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
    const cal = calendar as HTMLElement & { goToToday?: () => void };
    if (cal.goToToday) {
      cal.goToToday();
    } else {
      // Fallback: dispatch custom event
      calendar.dispatchEvent(new CustomEvent('dd-set-today'));
    }
    status.textContent = `Date set to today`;
  }
};

console.log('DateDreamer Playground initialized');
