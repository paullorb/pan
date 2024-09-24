// date.tsx
"use client";

import React, { useContext } from 'react';
import { useDate } from '../../../context/dateContext'; 
import { TogglesContext } from '../../../context/togglesContext'; 
import style from './date.module.css';

const DateComponent: React.FC = () => {
  const { selectedDate, setSelectedDate } = useDate();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("DateComponent must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.date) {
    return null;
  }

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
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay); 
  };

  const goToPreviousDay = (): void => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay); 
  };

  const resetToToday = (): void => {
    setSelectedDate(new Date()); 
  };

  return (
    <div className={style.container}>
      <div className={style.weekdays}>
        <h3 className={style.arrow} onClick={goToPreviousDay}>&lt;</h3>
        <h2 className={style.weekday} onClick={resetToToday}>
          {formatWeekday(selectedDate)}
        </h2>
        <h3 className={style.arrow} onClick={goToNextDay}>&gt;</h3>
      </div>
      <div>
        <div className={style.dateC}>
          <h3 className={style.date}>{formatDate(selectedDate)}</h3>
        </div>
      </div>
    </div>
  );
};

export default DateComponent;
