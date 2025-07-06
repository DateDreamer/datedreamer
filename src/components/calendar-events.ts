import dayjs from 'dayjs';
import { generateErrors } from './calendar-render';
import { calendar } from './calendar';

/**
 * Handles navigation to the previous month
 */
export function goToPrevMonth(context: calendar): void {
  const newDate = new Date(context.displayedMonthDate);
  newDate.setMonth(newDate.getMonth() - 1);
  context.displayedMonthDate = newDate;
  context.rebuildCalendar(true, 'last');

  // Trigger navigation callback
  if (context.onPrevNav) {
    const customEvent = new CustomEvent('onPrevNav', {
      detail: {
        displayedMonthDate: context.displayedMonthDate,
        calendar: context.calendarElement,
      },
    });
    context.onPrevNav(customEvent);
  }
}

/**
 * Handles navigation to the next month
 */
export function goToNextMonth(context: calendar): void {
  const newDate = new Date(context.displayedMonthDate);
  newDate.setMonth(newDate.getMonth() + 1);
  context.displayedMonthDate = newDate;
  context.rebuildCalendar(true, 'first');

  // Trigger navigation callback
  if (context.onNextNav) {
    const customEvent = new CustomEvent('onNextNav', {
      detail: {
        displayedMonthDate: context.displayedMonthDate,
        calendar: context.calendarElement,
      },
    });
    context.onNextNav(customEvent);
  }
}

/**
 * Handles keyboard navigation within the calendar days
 */
export function handleDayKeyDown(
  context: calendar,
  event: KeyboardEvent
): void {
  const target = event.target as HTMLButtonElement;
  const currentDay = parseInt(target.innerText);
  const currentDate = new Date(context.displayedMonthDate);
  currentDate.setDate(currentDay);

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      if (currentDay > 1) {
        const prevDay =
          target.parentElement?.previousElementSibling?.querySelector(
            'button'
          ) as HTMLButtonElement;
        if (prevDay && !prevDay.disabled) {
          prevDay.focus();
        }
      } else {
        goToPrevMonth(context);
      }
      break;

    case 'ArrowRight': {
      event.preventDefault();
      const daysInMonth = new Date(
        context.displayedMonthDate.getFullYear(),
        context.displayedMonthDate.getMonth() + 1,
        0
      ).getDate();
      if (currentDay < daysInMonth) {
        const nextDay = target.parentElement?.nextElementSibling?.querySelector(
          'button'
        ) as HTMLButtonElement;
        if (nextDay && !nextDay.disabled) {
          nextDay.focus();
        }
      } else {
        goToNextMonth(context);
      }
      break;
    }

    case 'ArrowUp':
      event.preventDefault();
      if (currentDay > 7) {
        const weekUp = currentDay - 7;
        const upButton = context.daysElement?.children[
          weekUp - 1
        ]?.querySelector('button') as HTMLButtonElement;
        if (upButton && !upButton.disabled) {
          upButton.focus();
        }
      } else {
        goToPrevMonth(context);
      }
      break;

    case 'ArrowDown': {
      event.preventDefault();
      const daysInCurrentMonth = new Date(
        context.displayedMonthDate.getFullYear(),
        context.displayedMonthDate.getMonth() + 1,
        0
      ).getDate();
      if (currentDay + 7 <= daysInCurrentMonth) {
        const weekDown = currentDay + 7;
        const downButton = context.daysElement?.children[
          weekDown - 1
        ]?.querySelector('button') as HTMLButtonElement;
        if (downButton && !downButton.disabled) {
          downButton.focus();
        }
      } else {
        goToNextMonth(context);
      }
      break;
    }

    case 'Enter':
    case ' ':
      event.preventDefault();
      setSelectedDay(context, currentDay);
      break;

    case 'Home': {
      event.preventDefault();
      const firstDay = context.daysElement?.querySelector(
        'button:not([disabled])'
      ) as HTMLButtonElement;
      if (firstDay) {
        firstDay.focus();
      }
      break;
    }

    case 'End': {
      event.preventDefault();
      const allButtons = context.daysElement?.querySelectorAll(
        'button:not([disabled])'
      );
      if (allButtons && allButtons.length > 0) {
        (allButtons[allButtons.length - 1] as HTMLButtonElement).focus();
      }
      break;
    }
  }
}

/**
 * Sets the selected day of the viewable month.
 * @param context - The calendar context
 * @param day - The day of the month in number format
 */
export function setSelectedDay(context: calendar, day: number): void {
  const newSelectedDate = new Date(context.displayedMonthDate);
  newSelectedDate.setDate(day);

  if (context.rangeMode) {
    if (context.connector) {
      // If both dates are already set, reset and start new range
      if (
        context.connector.startDate !== null &&
        context.connector.endDate !== null
      ) {
        context.connector.startDate = new Date(newSelectedDate);
        context.connector.endDate = null;
      } else if (context.connector.startDate == null) {
        context.connector.startDate = new Date(newSelectedDate);
      } else if (context.connector.endDate == null) {
        context.connector.endDate = new Date(newSelectedDate);

        // Swap start and end date if start date is larger than end date
        if (context.connector.startDate > context.connector.endDate) {
          const temp = context.connector.startDate;
          context.connector.startDate = context.connector.endDate;
          context.connector.endDate = temp;
        }
      }

      if (context.connector.dateChangedCallback) {
        context.connector.dateChangedCallback(new CustomEvent('dateChanged'));
      }

      // Rebuild all calendars to update visual highlighting across range
      context.connector.rebuildAllCalendars();
    }
  } else {
    context.selectedDate = new Date(newSelectedDate);
    context.rebuildCalendar();
    dateChangedCallback(context, context.selectedDate);
  }
}

/**
 * Handles the KeyUp event in the date textbox.
 * @param context - The calendar context
 * @param e - KeyUp event
 */
export function dateInputChanged(
  context: calendar,
  e: Event | KeyboardEvent
): void {
  if (e instanceof KeyboardEvent && e.code === 'Tab') return;

  const newDate = dayjs(
    (e.target as HTMLInputElement).value,
    context.format
  ).toDate();

  if (!isNaN(newDate.getUTCMilliseconds())) {
    context.selectedDate = newDate;
    context.displayedMonthDate = new Date(newDate);
    context.rebuildCalendar(false);
    dateChangedCallback(context, context.selectedDate);
  } else {
    context.errors.push({
      type: 'input-error',
      message: 'The entered date is invalid',
    });
    // Call generateErrors from calendar-render
    generateErrors(context);
  }
}

/**
 * Sets the selected and viewable month to today.
 * @param context - The calendar context
 */
export function setDateToToday(context: calendar): void {
  context.selectedDate = new Date();
  context.displayedMonthDate = new Date();
  context.rebuildCalendar();
  dateChangedCallback(context, context.selectedDate);
}

/**
 * Triggers the onChange callback that was passed into the calendar options.
 * @param context - The calendar context
 * @param date - The new date that has been selected in the calendar
 */
export function dateChangedCallback(context: calendar, date: Date): void {
  if (context.onChange) {
    const customEvent = new CustomEvent('onChange', {
      detail: dayjs(date).format(context.format),
    });
    context.onChange(customEvent);
  }
}

/**
 * Triggers the onRender callback that was passed into the calendar options.
 * @param context - The calendar context
 */
export function onRenderCallback(context: calendar): void {
  if (context.onRender) {
    const customEvent = new CustomEvent('onRender', {
      detail: {
        calendar: context.calendarElement,
      },
    });
    context.onRender(customEvent);
  }
}
