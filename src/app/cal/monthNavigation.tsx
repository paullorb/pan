"use client";
import React from 'react';
import styles from './calendar.module.css';
import { getMonthName } from './utils';
import { useCalendar } from './calendarContext';

const MonthNavigation: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const day = selectedDate.getDate();
  const monthName = getMonthName(selectedDate.getMonth());
  const handleClick = () => {
    setSelectedDate(new Date());
  };
  return (
    <div className={styles.monthNavigation} onClick={handleClick}>
      <p>{day} {monthName}</p>
    </div>
  );
};

export default MonthNavigation;
