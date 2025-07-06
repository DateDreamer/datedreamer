import dayjs from 'dayjs';
import {
  leftChevron,
  rightChevron,
  monthNames,
  weekdays,
} from '../utils/calendar-utils';

/**
 * Generates the Previous, Title, and Next header elements.
 */
export function generateHeader(context: any): void {
  // Previous Button
  if (!context.hidePrevNav) {
    const prevButton = document.createElement('button');
    prevButton.classList.add('datedreamer__calendar_prev');
    prevButton.innerHTML = context.iconPrev ? context.iconPrev : leftChevron;
    prevButton.setAttribute('aria-label', 'Previous');
    prevButton.addEventListener('click', () => context.goToPrevMonth());
    context.headerElement?.append(prevButton);
  }

  // Title
  const title = document.createElement('span');
  title.classList.add('datedreamer__calendar_title');
  title.innerText = `${monthNames[context.displayedMonthDate.getMonth()]} ${context.displayedMonthDate.getFullYear()}`;
  context.headerElement?.append(title);

  // Next Button
  if (!context.hideNextNav) {
    const nextButton = document.createElement('button');
    nextButton.classList.add('datedreamer__calendar_next');
    nextButton.innerHTML = context.iconNext ? context.iconNext : rightChevron;
    nextButton.setAttribute('aria-label', 'Next');
    nextButton.addEventListener('click', () => context.goToNextMonth());
    context.headerElement?.append(nextButton);
  }
}

/**
 * Generates the date field and today button.
 */
export function generateInputs(context: any): void {
  if (context.hideInputs) return;

  // Date input label
  const dateInputLabel = document.createElement('label');
  dateInputLabel.setAttribute('for', 'date-input');
  dateInputLabel.textContent = context.inputLabel;

  const inputButtonWrap = document.createElement('div');
  inputButtonWrap.classList.add('datedreamer__calendar__inputs-wrap');

  // Date input
  const dateField = document.createElement('input');
  dateField.id = 'date-input';
  dateField.placeholder = context.inputPlaceholder;
  dateField.value = dayjs(context.selectedDate).format(context.format);
  dateField.addEventListener('keyup', (e: any) => context.dateInputChanged(e));
  dateField.setAttribute('title', 'Set a date');

  // Today button
  const todayButton = document.createElement('button');
  todayButton.innerText = 'Today';
  todayButton.addEventListener('click', () => context.setDateToToday());

  inputButtonWrap.append(dateField, todayButton);

  context.inputsElement?.append(dateInputLabel, inputButtonWrap);
}

/**
 * Generates errors pushed to the errors array.
 */
export function generateErrors(context: any): void {
  const dateInput = context.inputsElement?.querySelector('input');
  if (dateInput) {
    dateInput.classList.remove('error');
  }

  if (context.errorsElement) context.errorsElement.innerHTML = '';

  context.errors.forEach(
    ({ type, message }: { type: string; message: string }) => {
      const errEl = document.createElement('span');
      errEl.innerText = message;

      if (type == 'input-error') {
        if (dateInput) {
          dateInput.classList.add('error');
        }
      }

      context.errorsElement?.append(errEl);
    }
  );

  context.errors = [];
}

/**
 * Generates the day buttons for the calendar grid.
 */
export function generateDays(
  context: any,
  focusFirstorLastDay: false | 'first' | 'last' = false
): void {
  const selectedDay = context.selectedDate.getDate();
  const month = context.displayedMonthDate.getMonth();
  const year = context.displayedMonthDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month, daysInMonth);
  const daysToSkipBefore = weekdays.indexOf(
    firstDayOfMonth.toString().split(' ')[0]
  );
  const daysToSkipAfter =
    6 - weekdays.indexOf(lastDayOfMonth.toString().split(' ')[0]);

  for (let i = 1; i <= daysToSkipBefore + daysInMonth + daysToSkipAfter; i++) {
    if (i > daysToSkipBefore && i <= daysToSkipBefore + daysInMonth) {
      const day = document.createElement('div');
      day.classList.add('datedreamer__calendar_day');
      const button = document.createElement('button');
      button.addEventListener('click', () =>
        context.setSelectedDay(i - daysToSkipBefore)
      );
      button.addEventListener('keydown', (e: KeyboardEvent) =>
        context.handleDayKeyDown(e)
      );
      button.innerText = (i - daysToSkipBefore).toString();
      button.setAttribute('type', 'button');

      if (context.rangeMode) {
        if (
          context.displayedMonthDate.getMonth() ==
            context.connector?.startDate?.getMonth() &&
          context.displayedMonthDate.getFullYear() ==
            context.connector.startDate.getFullYear() &&
          i - daysToSkipBefore == context.connector.startDate.getDate()
        ) {
          day.classList.add('active');
        }
        if (
          context.displayedMonthDate.getMonth() ==
            context.connector?.endDate?.getMonth() &&
          context.displayedMonthDate.getFullYear() ==
            context.connector.endDate.getFullYear() &&
          i - daysToSkipBefore == context.connector.endDate.getDate()
        ) {
          day.classList.add('active');
        }
        const selectedDate = new Date(context.displayedMonthDate);
        selectedDate.setDate(i - daysToSkipBefore);
        if (context.connector?.startDate && context.connector.endDate) {
          const startDate = context.connector.startDate;
          const endDate = context.connector.endDate;

          // Check if current date should be highlighted in range
          const shouldHighlight =
            // Date is between start and end (exclusive)
            (startDate < selectedDate && endDate > selectedDate) ||
            // Date is on or after start date in the start month
            (selectedDate.getMonth() === startDate.getMonth() &&
              selectedDate.getFullYear() === startDate.getFullYear() &&
              selectedDate >= startDate &&
              selectedDate < endDate) ||
            // Date is on or before end date in the end month
            (selectedDate.getMonth() === endDate.getMonth() &&
              selectedDate.getFullYear() === endDate.getFullYear() &&
              selectedDate <= endDate &&
              selectedDate > startDate) ||
            // Date is in a month completely between start and end months
            (selectedDate > startDate && selectedDate < endDate);

          if (shouldHighlight) {
            day.classList.add('highlight');
          }
        }
      } else {
        if (
          i == daysToSkipBefore + selectedDay &&
          context.displayedMonthDate.getMonth() ==
            context.selectedDate.getMonth() &&
          context.displayedMonthDate.getFullYear() ==
            context.selectedDate.getFullYear()
        ) {
          day.classList.add('active');
        }
      }
      day.append(button);
      context.daysElement?.append(day);
      if (focusFirstorLastDay) {
        if (focusFirstorLastDay === 'first' && i === daysToSkipBefore + 1) {
          button.focus();
        } else if (
          focusFirstorLastDay === 'last' &&
          i === daysToSkipBefore + daysInMonth
        ) {
          button.focus();
        }
      } else if (
        i == daysToSkipBefore + selectedDay &&
        context.displayedMonthDate.getMonth() ==
          context.selectedDate.getMonth() &&
        context.displayedMonthDate.getFullYear() ==
          context.selectedDate.getFullYear()
      ) {
        button.focus();
      }
    } else if (i <= daysToSkipBefore) {
      const day = document.createElement('div');
      day.classList.add('datedreamer__calendar_day', 'disabled');
      if (!context.hideOtherMonthDays) {
        const button = document.createElement('button');
        button.innerText = new Date(year, month, 0 - (daysToSkipBefore - i))
          .getDate()
          .toString();
        button.setAttribute('disabled', 'true');
        button.setAttribute('type', 'button');
        day.append(button);
      }
      context.daysElement?.append(day);
    } else if (i > daysToSkipBefore + daysInMonth) {
      const dayNumber =
        i -
        (daysToSkipBefore + daysToSkipAfter + daysInMonth) +
        daysToSkipAfter;
      const day = document.createElement('div');
      day.classList.add('datedreamer__calendar_day', 'disabled');
      if (!context.hideOtherMonthDays) {
        const button = document.createElement('button');
        button.innerText = new Date(year, month + 1, dayNumber)
          .getDate()
          .toString();
        button.setAttribute('disabled', 'true');
        button.setAttribute('type', 'button');
        day.append(button);
      }
      context.daysElement?.append(day);
    }
  }
}
