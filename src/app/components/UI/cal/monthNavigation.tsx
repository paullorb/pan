"use client";
import React from 'react';
import styles from './calendar.module.css';
import { getMonthName, MONTH_THRESHOLD } from './utils';
import { useCalendar } from './calendarContext';
import { useSwipeNavigation } from './useSwipeNavigation';

const MonthNavigation: React.FC = () => {
  const { selectedDate, monthScrollAccum, setMonthScrollAccum, handlePrevMonth, handleNextMonth } = useCalendar();

  const { onWheel, onTouchStart, onTouchMove, onTouchEnd } = useSwipeNavigation(
    MONTH_THRESHOLD,
    monthScrollAccum,
    setMonthScrollAccum,
    handlePrevMonth,
    handleNextMonth
  );

  return (
    <div className={styles.monthNavigation}>
      <button onClick={handlePrevMonth}>‹</button>
      <p
        className={styles.monthName}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {getMonthName(selectedDate.getMonth())}
      </p>
      <button onClick={handleNextMonth}>›</button>
    </div>
  );
};

export default MonthNavigation;
