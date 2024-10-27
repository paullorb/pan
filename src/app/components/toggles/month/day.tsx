// /components/toggles/month/day.tsx
"use client";

import React from 'react';
import styles from './day.module.css';
import Dots from './dots';
import { useTasks } from '../../../context/tasksContext';

interface DayProps {
  day: number | null;
  currentMonth: number;
  currentYear: number;
  todayDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onDayHover: (day: number | null) => void;
}

const Day: React.FC<DayProps> = ({
  day,
  currentMonth,
  currentYear,
  todayDate,
  selectedDate,
  setSelectedDate,
  onDayHover,
}) => {
  const { tasksByDate } = useTasks();

  if (day === null) {
    return <div className={styles.day} />;
  }

  const isCurrentDay = () =>
    day === todayDate.getDate() &&
    currentMonth === todayDate.getMonth() &&
    currentYear === todayDate.getFullYear();

  const isSelectedDay = () =>
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  const handleDayClick = () => {
    const selectedFullDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(selectedFullDate);
  };

  const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
  const tasksForDay = tasksByDate[dateString] || [];

  const dayDate = new Date(currentYear, currentMonth, day);
  dayDate.setHours(0, 0, 0, 0);

  const isFutureDay = dayDate > todayDate;

  const hasUncompletedTasks = tasksForDay.some((task) => !task.completed);
  const allTasksCompleted = tasksForDay.length > 0 && tasksForDay.every((task) => task.completed);
  const isTodo = isFutureDay && tasksForDay.length > 0;

  return (
    <div
      className={styles.day}
      onClick={handleDayClick}
      onMouseEnter={() => onDayHover(day)}
      onMouseLeave={() => onDayHover(null)}
    >
      <div className={styles.content}>
        <div 
          className={`${styles.dayNumber} ${
            isCurrentDay() ? styles.currentDayNumber : ''
          } ${isSelectedDay() ? styles.selectedDayNumber : ''}`}
        >
          {day}
        </div>
        <Dots
          hasUncompletedTasks={hasUncompletedTasks}
          allTasksCompleted={allTasksCompleted}
          isTodo={isTodo}
        />
      </div>
    </div>
  );
};

export default Day;