// dayNavigation.tsx

"use client";
import React from 'react';
import styles from './calendar.module.css';
import { formatDate } from './utils';
import { useCalendar } from './calendarContext';

const DayNavigation: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
  } = useCalendar();

  const handleReset = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className={styles.dayNavigation}>
      <p
        className={styles.formattedDate}
        onClick={handleReset}
      >
        {formatDate(selectedDate)}
      </p>
    </div>
  );
};

export default DayNavigation;
