import React, { useEffect, useRef } from 'react';
import { useCalendar } from '../hooks/useCalendar';

interface CalendarProps {
  className?: string;
  theme?: 'unstyled' | 'lite-purple';
  darkMode?: boolean;
  selectedDate?: Date;
  onChange?: (date: Date) => void;
  // We can add more props to control the engine through the component
}

/**
 * A React component that provides a high-level, idiomatic interface to the DateDreamer engine.
 * This component can be used in two modes:
 * 1. As a controlled component (via `selectedDate` and `onChange`)
 * 2. As an uncontrolled component (by managing its own internal engine state)
 */
export const Calendar: React.FC<CalendarProps> = ({
  className,
  theme = 'unstyled',
  darkMode = false,
  selectedDate,
  onChange
}) => {
  const { state, engine, nextMonth, prevMonth, setDate } = useCalendar({
    selectedDate,
    darkMode
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync changes from props to the engine
  useEffect(() => {
    if (selectedDate && state.selectedDate.getTime() !== selectedDate.getTime()) {
      engine.setDate(selectedDate);
    }
  }, [selectedDate, engine, state.selectedDate]);

  // Sync engine changes back to the parent via onChange
  useEffect(() => {
    if (onChange) {
      onChange(state.selectedDate);
    }
  }, [state.selectedDate, onChange]);

  // Prepare days for rendering
  const days = engine.getDaysInMonth(state.displayedMonthDate);

  return (
    <div 
      className={`datedreamer-react-wrapper ${className || ''}`}
      style={{ 
        '--dd-primary': 'var(--dd-primary, #7d56da)', // Allow local overrides
      } as React.CSSProperties}
    >
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-btn">{'<'}</button>
        <span className="month-label">
          {state.displayedMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth} className="nav-btn">{'>'}</button>
      </div>

      <div className="calendar-grid">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
        
        {days.map(date => {
          const isSelected = state.selectedDate.getTime() === date.getTime();
          return (
            <div
              key={date.toISOString()}
              className={`day-cell ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setDate(date)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <style>{`
        .datedreamer-react-wrapper {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          width: fit-content;
          background: white;
          color: #333;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .nav-btn {
          background: none;
          border: 1px solid #eee;
          padding: 2px 8px;
          cursor: pointer;
          border-radius: 4px;
        }
        .month-label {
          font-weight: bold;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .weekday {
          text-align: center;
          font-size: 0.8rem;
          color: #666;
          padding: 4px;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 4px;
        }
        .day-cell:hover {
          background-color: #f0f0f0;
        }
        .day-cell.is-selected {
          background-color: var(--dd-primary, #7d56da);
          color: white;
        }
      `}</style>
    </div>
  );
};
