"use client";
import React, { useRef } from 'react';
import styles from './calendar.module.css';
import { formatDate } from './utils';
import { useCalendar } from 'app/components/UI/cal/calendarContext';

const DayNavigation: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    dayScrollAccum,
    setDayScrollAccum,
    handlePrevDay,
    handleNextDay
  } = useCalendar();

  const dayThreshold = 50;
  const dayTouchStartRef = useRef<number | null>(null);

  const handleReset = () => {
    setSelectedDate(new Date());
  };

  const onWheel = (e: React.WheelEvent) => {
    const newAccum = dayScrollAccum + e.deltaX;
    if (newAccum > dayThreshold) {
      handleNextDay();
      setDayScrollAccum(newAccum - dayThreshold);
    } else if (newAccum < -dayThreshold) {
      handlePrevDay();
      setDayScrollAccum(newAccum + dayThreshold);
    } else {
      setDayScrollAccum(newAccum);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    dayTouchStartRef.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (dayTouchStartRef.current !== null) {
      const delta = dayTouchStartRef.current - e.touches[0].clientX;
      const newAccum = dayScrollAccum + delta;
      if (newAccum > dayThreshold) {
        handleNextDay();
        setDayScrollAccum(newAccum - dayThreshold);
        dayTouchStartRef.current = e.touches[0].clientX;
      } else if (newAccum < -dayThreshold) {
        handlePrevDay();
        setDayScrollAccum(newAccum + dayThreshold);
        dayTouchStartRef.current = e.touches[0].clientX;
      } else {
        setDayScrollAccum(newAccum);
        dayTouchStartRef.current = e.touches[0].clientX;
      }
    }
  };

  const onTouchEnd = () => {
    dayTouchStartRef.current = null;
    setDayScrollAccum(0);
  };

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
