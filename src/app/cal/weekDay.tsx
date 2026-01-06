"use client";
import React from 'react';
import styles from './calendar.module.css';
import { WEEKDAY_NAMES_FULL } from './utils';
import { useCalendar } from './calendarContext';

const Weekday: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const weekday = WEEKDAY_NAMES_FULL[selectedDate.getDay()];
  const handleClick = () => {
    setSelectedDate(new Date());
  };
  return (
    <div className={styles.weekday} onClick={handleClick}>
      <p>{weekday}</p>
    </div>
  );
};

export default Weekday;
