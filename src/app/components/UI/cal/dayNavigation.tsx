"use client";
import React from 'react';
import styles from './calendar.module.css';
import { formatDate, DAY_THRESHOLD } from './utils';
import { useCalendar } from './calendarContext';
import { useSwipeNavigation } from './useSwipeNavigation';

const DayNavigation: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    dayScrollAccum,
    setDayScrollAccum,
    handlePrevDay,
    handleNextDay
  } = useCalendar();

  const handleReset = () => {
    setSelectedDate(new Date());
  };

  const { onWheel, onTouchStart, onTouchMove, onTouchEnd } = useSwipeNavigation(
    DAY_THRESHOLD,
    dayScrollAccum,
    setDayScrollAccum,
    handlePrevDay,
    handleNextDay
  );

  return (
    <div className={styles.dayNavigation}>
      <button onClick={handlePrevDay}>‹</button>
      <p
        className={styles.formattedDate}
        onClick={handleReset}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {formatDate(selectedDate)}
      </p>
      <button onClick={handleNextDay}>›</button>
    </div>
  );
};

export default DayNavigation;
