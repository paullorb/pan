// Calendar.tsx

"use client";

import React, { useState, useRef } from 'react';
import WeekdayDisplay from './weekDayDisplay';
import DayNavigation from './dayNavigation';
import MonthNavigation from './monthNavigation';
import CalendarTable, { Cell } from './calendarTable';
import { formatDate } from './utils';
import styles from './calendar.module.css';

const Calendar: React.FC = () => {
  const initialToday = new Date();
  const [selectedDate, setSelectedDate] = useState(initialToday);
  const [dayScrollAccum, setDayScrollAccum] = useState(0);
  const [monthScrollAccum, setMonthScrollAccum] = useState(0);
  const dayThreshold = 50;
  const monthThreshold = 50;
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7;

  // Build an array of cells for the calendar grid
  const cells: Cell[] = [];
  if (startDay > 0) {
    const lastDatePrevMonth = new Date(year, month, 0).getDate();
    const prevMonthDate = new Date(year, month - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();
    for (let i = 0; i < startDay; i++) {
      const day = lastDatePrevMonth - startDay + i + 1;
      const cellDate = new Date(prevYear, prevMonth, day);
      cells.push({ date: cellDate, inCurrentMonth: false });
    }
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    cells.push({ date: cellDate, inCurrentMonth: true });
  }
  const remaining = cells.length % 7;
  if (remaining > 0) {
    const daysToAdd = 7 - remaining;
    const nextMonthDate = new Date(year, month + 1, 1);
    const nextMonth = nextMonthDate.getMonth();
    const nextYear = nextMonthDate.getFullYear();
    for (let i = 1; i <= daysToAdd; i++) {
      const cellDate = new Date(nextYear, nextMonth, i);
      cells.push({ date: cellDate, inCurrentMonth: false });
    }
  }
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Helper functions for date changes
  const addDays = (date: Date, days: number): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

  const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + months, 1);
    const daysInNewMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
    const newDay = Math.min(date.getDate(), daysInNewMonth);
    return new Date(newDate.getFullYear(), newDate.getMonth(), newDay);
  };

  const handlePrevDay = () => setSelectedDate(addDays(selectedDate, -1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handlePrevMonth = () => setSelectedDate(addMonths(selectedDate, -1));
  const handleNextMonth = () => setSelectedDate(addMonths(selectedDate, 1));

  // Day navigation wheel and touch events
  const handleDayWheel = (e: React.WheelEvent) => {
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

  const dayTouchStartRef = useRef<number | null>(null);
  const handleDayTouchStart = (e: React.TouchEvent) => {
    dayTouchStartRef.current = e.touches[0].clientX;
  };
  const handleDayTouchMove = (e: React.TouchEvent) => {
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
  const handleDayTouchEnd = () => {
    dayTouchStartRef.current = null;
    setDayScrollAccum(0);
  };

  // Month navigation wheel and touch events
  const handleMonthWheel = (e: React.WheelEvent) => {
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

  const monthTouchStartRef = useRef<number | null>(null);
  const handleMonthTouchStart = (e: React.TouchEvent) => {
    monthTouchStartRef.current = e.touches[0].clientX;
  };
  const handleMonthTouchMove = (e: React.TouchEvent) => {
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
  const handleMonthTouchEnd = () => {
    monthTouchStartRef.current = null;
    setMonthScrollAccum(0);
  };

  const weekdayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const selectedWeekday = weekdayNamesFull[selectedDate.getDay()];

  return (
    <div className={styles.calendar}>
      <WeekdayDisplay weekday={selectedWeekday} />
      <div className={styles.navigationContainer}>
        <DayNavigation
          formattedDate={formatDate(selectedDate)}
          onPrev={handlePrevDay}
          onNext={handleNextDay}
          onReset={() => setSelectedDate(new Date())}
          onWheel={handleDayWheel}
          onTouchStart={handleDayTouchStart}
          onTouchMove={handleDayTouchMove}
          onTouchEnd={handleDayTouchEnd}
        />
        <MonthNavigation
          month={month}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          onWheel={handleMonthWheel}
          onTouchStart={handleMonthTouchStart}
          onTouchMove={handleMonthTouchMove}
          onTouchEnd={handleMonthTouchEnd}
        />
      </div>
      <CalendarTable
        weeks={weeks}
        selectedDate={selectedDate}
        initialToday={initialToday}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
};

export default Calendar;
