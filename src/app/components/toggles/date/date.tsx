// date.tsx
"use client";

import React, { useState } from 'react';
import { useDate } from '../../../context/dateContext'; 
import style from './date.module.css';

const DateComponent: React.FC = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const [isHovered, setIsHovered] = useState(false); // New hover state

  // Function to format the selected date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatWeekday = (date: Date): string => {
    return date.toLocaleDateString('en-EN', { weekday: 'long' });
  };

  // Function to calculate the difference in days between selectedDate and today
  const getDayDifference = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0); // Reset time

    const diffTime = selected.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays > 0) {
      return `+${diffDays}`;
    } else {
      return `${diffDays}`;
    }
  };

  const goToNextDay = (): void => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay); 
  };

  const goToPreviousDay = (): void => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay); 
  };

  const resetToToday = (): void => {
    // Create a new Date object with time set to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (selectedDate.getTime() !== today.getTime()) {
      setSelectedDate(today);
    } else {
      // Force update by setting selectedDate to a new instance
      setSelectedDate(new Date(today.getTime()));
    }
  };

  return (
    <div 
      className={style.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={style.weekdays}>
        <h3 className={style.arrow} onClick={goToPreviousDay}>&lt;</h3>
        <h2 className={style.weekday} onClick={resetToToday}>
          {isHovered ? getDayDifference(selectedDate) : formatWeekday(selectedDate)}
        </h2>
        <h3 className={style.arrow} onClick={goToNextDay}>&gt;</h3>
      </div>
      <div className={style.dateC}>
          <h3 className={style.date}>{formatDate(selectedDate)}</h3>
      </div>
    </div>
  );
};

export default DateComponent;
