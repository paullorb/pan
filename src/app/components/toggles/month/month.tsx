// /components/toggles/month/Month.tsx
"use client";

import React, { useContext, useState } from 'react';
import styles from './month.module.css';
import { TogglesContext } from '@/app/context/togglesContext';
import { useDate } from '../../../context/dateContext';
import DayGrid from './dayGrid';
import Title from '../../shared/Title';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
} from './utils';
import WeekDaysHeader from './weekDaysHeader';

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

  const { togglesState } = togglesContext;
  if (!togglesState.month) {
    return null;
  }

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
    days.push(i);
  }

  const totalDays = days.length;
  const fillerDays = (7 - (totalDays % 7)) % 7;
  if (fillerDays > 0) {
    for (let i = 0; i < fillerDays; i++) {
      days.push(null);
    }
  }

  // Adjusted function to fix the off-by-one error
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
