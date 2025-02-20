// weekDay.tsx

"use client";
import React from 'react';
import styles from './calendar.module.css';
import { useCalendar } from './calendarContext';
import { WEEKDAY_NAMES_FULL } from './utils';

const Weekday: React.FC = () => {
  const { selectedDate } = useCalendar();
  const weekday = WEEKDAY_NAMES_FULL[selectedDate.getDay()];
  return (
    <div className={styles.weekday}>
      <p>{weekday}, </p>
    </div>
  );
};

export default Weekday;
