// /components/toggles/month/dayGrid.tsx
"use client";

import React from 'react';
import styles from './dayGrid.module.css';
import Day from './day';

interface DayGridProps {
  days: (number | null)[];
  currentMonth: number;
  currentYear: number;
  todayDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onDayHover: (day: number | null) => void;
}

const DayGrid: React.FC<DayGridProps> = ({
  days,
  currentMonth,
  currentYear,
  todayDate,
  selectedDate,
  onSelectDate,
  onDayHover,
}) => {
  return (
    <div className={styles.grid}>
      {days.map((day, index) => (
        <Day
          key={index}
          day={day}
          currentMonth={currentMonth}
          currentYear={currentYear}
          todayDate={todayDate}
          selectedDate={selectedDate}
          setSelectedDate={onSelectDate}
          onDayHover={onDayHover}
        />
      ))}
    </div>
  );
};

export default DayGrid;
