// /components/toggles/month/DayGrid.tsx
"use client";

import React from 'react';
import styles from './dayGrid.module.css';
import Dots from './dots';

interface DayGridProps {
  days: (number | null)[];
  currentMonth: number;
  currentYear: number;
  todayDate: Date;
  selectedDate: Date;
  onSelectDate: (day: number) => void;
  onDayHover: (day: number | null) => void;
  tasksByDate: Record<string, any[]>;
  getDateString: (day: number) => string;
}

const DayGrid: React.FC<DayGridProps> = ({
  days,
  currentMonth,
  currentYear,
  todayDate,
  selectedDate,
  onSelectDate,
  onDayHover,
  tasksByDate,
  getDateString,
}) => {
  const isCurrentDay = (day: number) =>
    day === todayDate.getDate() &&
    currentMonth === todayDate.getMonth() &&
    currentYear === todayDate.getFullYear();

  const isSelectedDay = (day: number) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  // Function to calculate the weekday index starting from Monday (0 = Monday, 6 = Sunday)
  const getMondayStartIndex = (date: Date) => {
    const dayIndex = date.getDay();
    return (dayIndex + 5) % 7; 
  };

  return (
    <div className={styles.grid}>
      {days.map((day, index) => (
        <div
          key={index}
          className={`${styles.day} ${
            day !== null && isCurrentDay(day) ? styles.currentDay : ''
          } ${day !== null && isSelectedDay(day) ? styles.selectedDay : ''}`}
          onClick={() => day !== null && onSelectDate(day)}
          onMouseEnter={() =>
            day !== null
              ? onDayHover(getMondayStartIndex(new Date(currentYear, currentMonth, day)))
              : onDayHover(null)
          }
          onMouseLeave={() => onDayHover(null)}
        >
          {day && (
            <div className={styles.content}>
              <Dots 
                hasUncompletedTasks={!!tasksByDate[getDateString(day)]?.some(task => !task.completed)}
                allTasksCompleted={!!tasksByDate[getDateString(day)]?.every(task => task.completed)}
                isTodo={!!tasksByDate[getDateString(day)]?.length}
              />
              <div className={styles.dayNumber}>{day}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DayGrid;
