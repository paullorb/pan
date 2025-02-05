"use client";
import React, { useRef } from 'react';
import styles from './calendar.module.css';
import { getMonthName } from './utils';
import { useCalendar } from 'app/components/UI/cal/calendarContext';

const MonthNavigation: React.FC = () => {
  const { selectedDate, monthScrollAccum, setMonthScrollAccum, handlePrevMonth, handleNextMonth } = useCalendar();
  const monthThreshold = 50;
  const monthTouchStartRef = useRef<number | null>(null);

  const onWheel = (e: React.WheelEvent) => {
    const newAccum = monthScrollAccum + e.deltaX;
    if (newAccum > monthThreshold) {
      handleNextMonth();
      setMonthScrollAccum(newAccum - monthThreshold);
    } else if (newAccum < -monthThreshold) {
      handlePrevMonth();
      setMonthScrollAccum(newAccum + monthThreshold);
    } else {
      setMonthScrollAccum(newAccum);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    monthTouchStartRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (monthTouchStartRef.current !== null) {
      const delta = monthTouchStartRef.current - e.touches[0].clientX;
      const newAccum = monthScrollAccum + delta;
      if (newAccum > monthThreshold) {
        handleNextMonth();
        setMonthScrollAccum(newAccum - monthThreshold);
        monthTouchStartRef.current = e.touches[0].clientX;
      } else if (newAccum < -monthThreshold) {
        handlePrevMonth();
        setMonthScrollAccum(newAccum + monthThreshold);
        monthTouchStartRef.current = e.touches[0].clientX;
      } else {
        setMonthScrollAccum(newAccum);
        monthTouchStartRef.current = e.touches[0].clientX;
      }
    }
  };

  const onTouchEnd = () => {
    monthTouchStartRef.current = null;
    setMonthScrollAccum(0);
  };

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
