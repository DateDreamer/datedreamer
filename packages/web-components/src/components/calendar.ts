import { CalendarEngine } from '@datedreamer/core';
import { A11yManager } from '@datedreamer/core';
import dayjs from 'dayjs';

/**
 * DateDreamer Web Component with full A11y support
 * A standard Web Component that wraps the @datedreamer/core engine.
 */
export class DateDreamerCalendar extends HTMLElement {
  private engine!: CalendarEngine;
  private a11y!: A11yManager;
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.initEngine();
    this.initA11y();
    this.render();
    this.setupListeners();
    this.subscribeToEngine();
  }

  private initEngine() {
    this.engine = new CalendarEngine({
      darkMode: this.hasAttribute('dark-mode'),
    });
  }

  private initA11y() {
    const days = this.engine.getDaysInMonth(this.engine.getState().displayedMonthDate);
    this.a11y = new A11yManager({
      totalDays: days.length,
      cols: 7
    });
  }

  private subscribeToEngine() {
    this.engine.subscribe((state) => {
      this.updateUI(state);
    });
  }

  private setupListeners() {
    // Handle clicks on the shadow DOM (event delegation)
    this.shadow.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.closest('.dd-prev-btn')) {
        this.engine.prevMonth();
      } else if (target.closest('.dd-next-btn')) {
        this.engine.nextMonth();
      } else if (target.closest('.dd-day')) {
        const dayIndex = parseInt(target.getAttribute('data-index') || '0');
        this.a11y.setState({ focusedIndex: dayIndex });
        // Trigger selection logic
      }
    });

    // Handle keyboard navigation
    this.shadow.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.dd-day')) {
        const newIndex = this.a11y.handleGridKeydown(e);
        if (newIndex !== null) {
          const focusedCell = this.shadow.querySelector(`.dd-day[data-index="${newIndex}"]`);
          if (focusedCell) {
            (focusedCell as HTMLElement).focus();
          }
        }
      }
    });
  }

  private updateUI(state: any) {
    this.render();
  }

  private render() {
    const state = this.engine.getState();
    const days = this.engine.getDaysInMonth(state.displayedMonthDate);
    const monthName = dayjs(state.displayedMonthDate).format('MMMM YYYY');

    const headerAria = this.a11y.generateHeaderAria(state.displayedMonthDate);

    this.shadow.innerHTML = `
      <style>
        :host {
          --dd-primary: #7d56da;
          --dd-bg: #ffffff;
          --dd-text: #2d3436;
          --dd-border: #dfe6e9;
          --dd-focus-ring: #0984e3;
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }
        :host([dark-mode]) {
          --dd-bg: #1a1a1a;
          --dd-text: #f5f5f5;
          --dd-border: #333;
        }
        .calendar {
          background: var(--dd-bg);
          color: var(--dd-text);
          border: 1px solid var(--dd-border);
          border-radius: 8px;
          padding: 16px;
          width: 300px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          text-align: center;
        }
        .day {
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          outline: none;
          border: 2px solid transparent;
        }
        .day:hover { background: #f0f0f0; }
        .day:focus { border-color: var(--dd-focus-ring); }
        .day.active { background: var(--dd-primary); color: white; }
        .btn {
          background: none;
          border: 1px solid var(--dd-border);
          cursor: pointer;
          font-size: 1.2rem;
          color: var(--dd-text);
          padding: 4px 8px;
          border-radius: 4px;
        }
      </style>
      <div class="calendar" role="grid" aria-label="Date Calendar">
        <div class="header" ${Object.entries(headerAria).map(([k, v]) => `${k}="${v}"`).join(' ')}>
          <button class="btn dd-prev-btn" aria-label="Previous Month">&lt;</button>
          <div class="month-label">${monthName}</div>
          <button class="btn dd-next-btn" aria-label="Next Month">&gt;</button>
        </div>
        <div class="days-grid">
          ${['S','M','T','W','T','F','S'].map(d => `<div><strong>${d}</strong></div>`).join('')}
          ${days.map((date, i) => {
            const isSelected = state.selectedDate.getTime() === date.getTime();
            const isToday = dayjs(date).isSame(dayjs(), 'day');
            const aria = this.a11y.generateDayAria(date, isSelected, isToday);
            return `
              <div 
                class="day ${isSelected ? 'active' : ''}" 
                data-index="${i}"
                ${Object.entries(aria).map(([k, v]) => `${k}="${v}"`).join(' ')}
              >
                ${date.getDate()}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('date-dreamer-calendar', DateDreamerCalendar);
