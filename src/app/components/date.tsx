"use client";

import { useDate } from '../context/dateContext'; // Import the useDate hook
import style from './date.module.css';

const DateComponent: React.FC = () => {
  // Get selectedDate from the context
  const { selectedDate, setSelectedDate } = useDate();

  // Function to format the selected date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatWeekday = (date: Date): string => {
    return date.toLocaleDateString('en-EN', { weekday: 'long' });
  };

  const goToNextDay = (): void => {
    const nextDay = new Date(selectedDate.setDate(selectedDate.getDate() + 1));
    setSelectedDate(nextDay); // Update the selectedDate in the context
  };

  const goToPreviousDay = (): void => {
    const previousDay = new Date(selectedDate.setDate(selectedDate.getDate() - 1));
    setSelectedDate(previousDay); // Update the selectedDate in the context
  };

  const resetToToday = (): void => {
    setSelectedDate(new Date()); // Reset to current day
  };

  return (
    <div className={style.container}>
      <div className={style.weekdays}>
        <h3 className={style.arrow} onClick={goToPreviousDay}>&lt;</h3>
        <h2 className={style.weekday} onClick={resetToToday}>
          {formatWeekday(selectedDate)}
        </h2> {/* Clicking this will reset the date to today */}
        <h3 className={style.arrow} onClick={goToNextDay}>&gt;</h3>
      </div>
      <div className={style.dates}>
        <h1 className={style.date}>{formatDate(selectedDate)}</h1>
      </div>
    </div>
  );
};

export default DateComponent;
