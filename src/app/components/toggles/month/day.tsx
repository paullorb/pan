// components/toggles/month/day.tsx
"use client";

import React from 'react';
import styles from './day.module.css';
import Dots from './dots';
import { useTasks } from '../../../context/tasksContext';
import { useItems } from '../../../context/itemsContext';

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
  const { itemsByDate } = useItems();

  if (day === null) {
    return <div className={styles.day} />;
  }

  const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
  const dayDate = new Date(currentYear, currentMonth, day);

  // Get tasks status
  const tasksForDay = tasksByDate[dateString] || [];
  const hasUncompletedTasks = tasksForDay.some((task) => !task.completed);
  const allTasksCompleted = tasksForDay.length > 0 && tasksForDay.every((task) => task.completed);

  // Get priorities status - directly check completion status
  const prioritiesForDay = (itemsByDate[dateString] || [])
    .filter(item => item.type === 'priority');
    
  const hasPriorityUncompleted = prioritiesForDay.length > 0 && prioritiesForDay.some(item => !item.completed);
  const allPrioritiesCompleted = prioritiesForDay.length > 0 && prioritiesForDay.every(item => item.completed);

  const isCurrentDay = () =>
    day === todayDate.getDate() &&
    currentMonth === todayDate.getMonth() &&
    currentYear === todayDate.getFullYear();

  const isSelectedDay = () =>
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  return (
    <div
      className={styles.day}
      onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
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
        <div className={styles.indicators}>
          <Dots
            hasUncompletedTasks={hasPriorityUncompleted}
            allTasksCompleted={allPrioritiesCompleted}
            isTodo={false}
          />
          <Dots
            hasUncompletedTasks={hasUncompletedTasks}
            allTasksCompleted={allTasksCompleted}
            isTodo={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Day;