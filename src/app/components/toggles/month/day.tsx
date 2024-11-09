"use client";

import React from 'react';
import styles from './day.module.css';
import Dots from './dots';
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
  const { itemsByDate } = useItems();

  if (day === null) {
    return <div className={styles.day} />;
  }

  const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];

  // Get items for the day
  const itemsForDay = itemsByDate[dateString] || [];
  
  // Get priorities status
  const prioritiesForDay = itemsForDay.filter(item => item.type === 'priority');
  const hasPriorityUncompleted = prioritiesForDay.some(item => !item.completed);
  const allPrioritiesCompleted = prioritiesForDay.length > 0 && prioritiesForDay.every(item => item.completed);
  const hasPriorities = prioritiesForDay.length > 0;

  // Get tasks status
  const tasksForDay = itemsForDay.filter(item => item.type === 'task');
  const hasTasksUncompleted = tasksForDay.some(item => !item.completed);
  const allTasksCompleted = tasksForDay.length > 0 && tasksForDay.every(item => item.completed);
  const hasTasks = tasksForDay.length > 0;

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
          {/* Only show dots if there are items */}
          {hasPriorities && (
            <Dots
              hasUncompletedTasks={hasPriorityUncompleted}
              allTasksCompleted={allPrioritiesCompleted}
              isTodo={false}
            />
          )}
          {hasTasks && (
            <Dots
              hasUncompletedTasks={hasTasksUncompleted}
              allTasksCompleted={allTasksCompleted}
              isTodo={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Day;