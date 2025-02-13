// monthNavigation.tsx

"use client";
import React from 'react';
import styles from './calendar.module.css';
import { getMonthName } from './utils';
import { useCalendar } from './calendarContext';

const MonthNavigation: React.FC = () => {
  const { selectedDate } = useCalendar();


  return (
    <div className={styles.monthNavigation}>
      <p className={styles.monthName}>
        {getMonthName(selectedDate.getMonth())}
      </p>
    </div>
  );
};

export default MonthNavigation;
