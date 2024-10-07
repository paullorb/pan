// Refactored date.tsx
"use client";

import React, { useState } from 'react';
import { useDate } from '../../../context/dateContext';
import style from './date.module.css';
import Title from '../../shared/title';

const DateComponent: React.FC = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const [isHovered, setIsHovered] = useState(false);

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() !== today.getTime()) {
      setSelectedDate(today);
    } else {
      setSelectedDate(new Date(today.getTime()));
    }
  };

  return (
    <div
      className={style.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Title
        title={isHovered ? getDayDifference(selectedDate) : formatWeekday(selectedDate)}
        pagination={true}
        onPrevious={goToPreviousDay}
        onNext={goToNextDay}
        onClick={resetToToday}
        className={style.weekday}
      />
      <div className={style.dateC}>
          <h3 className={style.date}>{formatDate(selectedDate)}</h3>
      </div>
    </div>
  );
};

export default DateComponent;