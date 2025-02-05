"use client";
import React from 'react';
import styles from './calendar.module.css';
import { useCalendar } from 'app/components/UI/cal/calendarContext';

const WeekdayDisplay: React.FC = () => {
  const { selectedDate } = useCalendar();
  const weekdayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekday = weekdayNamesFull[selectedDate.getDay()];
  return (
    <div className={styles.calendar}>
      <p>{weekday}</p>
    </div>
  );
};

export default WeekdayDisplay;
