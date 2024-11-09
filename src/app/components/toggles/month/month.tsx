// /components/toggles/month/Month.tsx
"use client";

import React, { useContext, useState } from 'react';
import styles from './month.module.css';
import { TogglesContext } from '../../../context/togglesContext';
import { useDate } from '../../../context/dateContext';
import DayGrid from './dayGrid';
import Title from '../../shared/title';
import { getDaysInMonth, getFirstDayOfMonth } from './utils';
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

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error("Month must be used within a TogglesProvider");
  }
  const isWorkWeek = togglesContext.togglesState.workWeek;
  const daysPerWeek = isWorkWeek ? CALENDAR_CONSTANTS.WORK_WEEK : CALENDAR_CONSTANTS.FULL_WEEK;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  const startingDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth) === 0
    ? 7
    : getFirstDayOfMonth(currentYear, currentMonth);
  const days: (number | null)[] = Array(startingDayOfWeek - 1).fill(null);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const dayOfWeek = date.getDay();
    
    if (isWorkWeek && (dayOfWeek === 0 || dayOfWeek === 6)) {
      days.push(null);
    } else {
      days.push(i);
    }
  }

  // Add null cells to complete the last row
  const remainingCells = daysPerWeek - (days.length % daysPerWeek);
  if (remainingCells !== daysPerWeek) {
    days.push(...Array(remainingCells).fill(null));
  }

  const handleDayHover = (day: number | null) => {
    if (day !== null) {
      const hoveredDate = new Date(currentYear, currentMonth, day);
      // Ensure Monday is 0, and Sunday is 6
      const dayIndex = (hoveredDate.getDay() + 6) % 7; // Shift days so Monday is 0
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
        title={`${monthNames[currentMonth]} ${currentYear !== thisYear ? currentYear : ''}`}
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