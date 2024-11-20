// components/toggles/month/day.tsx
"use client";

import React, { useContext } from 'react';
import styles from './day.module.css';
import Dots from './dots';
import { useItems } from '../../../context/itemsContext';
import { CALENDAR_CONSTANTS } from 'app/lib/constants/calendar';
import { TogglesContext } from 'app/context/togglesContext';

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
  const togglesContext = useContext(TogglesContext);
  const isWorkWeek = togglesContext?.togglesState.workWeek;
  
  const daysPerWeek = isWorkWeek ? CALENDAR_CONSTANTS.WORK_WEEK : CALENDAR_CONSTANTS.FULL_WEEK;
  const dayStyle = {
    flex: `1 1 ${100 / daysPerWeek}%`
  };

  const dateString = day !== null ? new Date(currentYear, currentMonth, day).toISOString().split('T')[0] : '';

  // Get items for the day and separate by type
  const itemsForDay = itemsByDate[dateString] || [];
  
  // Get priorities status
  const prioritiesForDay = itemsForDay.filter(item => item.type === 'priority');
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
      style={dayStyle}
      onClick={() => day !== null && setSelectedDate(new Date(currentYear, currentMonth, day))}
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
        </div>
      </div>
    </div>
  );
};

export default Day;