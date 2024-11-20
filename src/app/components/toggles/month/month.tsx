// components/toggles/month/Month.tsx
"use client";

import React, { useState } from 'react';
import styles from './month.module.css';
import { useDate } from '../../../context/dateContext';
import DayGrid from './dayGrid';
import Title from '../../shared/title';
import { generateMonthDays, fillRemainingDays } from './utils';
import WeekDaysHeader from './weekDaysHeader';
import { CALENDAR_CONSTANTS } from 'app/lib/constants/calendar';

const Month: React.FC = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const thisYear = todayDate.getFullYear();

  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const incrementMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth + 1);
    setSelectedDate(newDate);
  };

  const decrementMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(currentMonth - 1);
    setSelectedDate(newDate);
  };

  let days = generateMonthDays(currentYear, currentMonth);
  days = fillRemainingDays(days, CALENDAR_CONSTANTS.FULL_WEEK);

  const handleDayHover = (day: number | null) => {
    if (day !== null) {
      const hoveredDate = new Date(currentYear, currentMonth, day);
      const dayIndex = (hoveredDate.getDay() + 6) % 7;
      setHoveredDayIndex(dayIndex);
    } else {
      setHoveredDayIndex(null);
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.container}>
      <Title
        title={`${CALENDAR_CONSTANTS.MONTH_NAMES[currentMonth]} ${currentYear !== thisYear ? currentYear : ''}`}
        pagination={true}
        onPrevious={decrementMonth}
        onNext={incrementMonth}
        className={styles.title}
      />
      <WeekDaysHeader className={styles.weekDaysHeader} hoveredDayIndex={hoveredDayIndex} />
      <DayGrid
        days={days}
        currentMonth={currentMonth}
        currentYear={currentYear}
        todayDate={todayDate}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onDayHover={handleDayHover}
      />
    </div>
  );
};

export default Month;