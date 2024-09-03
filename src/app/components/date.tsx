"use client";

import { useState } from 'react';
import style from './date.module.css';
import Print from './print';

// TypeScript component with proper typing
const DateComponent: React.FC = () => {
  // State to manage the current date
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Function to format the current date
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
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
  };

  const goToPreviousDay = (): void => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
  };

  return (
    <div className={style.container}>
      <div className={style.weekdays}>
        <h3 className={style.arrow} onClick={goToPreviousDay}>&lt;</h3>
        <h2 className={style.weekday}>{formatWeekday(currentDate)}</h2>
        <h3 className={style.arrow} onClick={goToNextDay}>&gt;</h3>
      </div>
      <div className={style.dates}>
        <Print />
        <h1 className={style.date}>{formatDate(currentDate)}</h1>
      </div>
    </div>
  );
};

export default DateComponent;
