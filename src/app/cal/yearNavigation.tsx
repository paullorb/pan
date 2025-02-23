"use client";
import React from 'react';
import styles from './calendar.module.css';
import { useCalendar } from './calendarContext';

const YearNavigation: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const year = selectedDate.getFullYear();
  const handleClick = () => {
    setSelectedDate(new Date());
  };
  return (
    <div className={styles.yearNavigation} onClick={handleClick}>
      <p>{year}</p>
    </div>
  );
};

export default YearNavigation;
