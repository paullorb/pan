// /components/toggles/month/DayGrid.tsx
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

  const handleDayClick = (day: number | null) => {
    if (day !== null) {
      onSelectDate(day);
    }
  };

  return (
    <div className={styles.grid}>
      {days.map((day, index) => {
        let hasUncompletedTasks = false;
        let allTasksCompleted = false;
        let isTodo = false;

        if (day !== null) {
          const dateString = getDateString(day);
          const tasksForDay = tasksByDate[dateString] || [];

          // Create Date object for the day
          const dayDate = new Date(currentYear, currentMonth, day);
          dayDate.setHours(0, 0, 0, 0);

          // Determine if the day is in the future
          const isFutureDay = dayDate > todayDate;

          if (tasksForDay.length > 0) {
            hasUncompletedTasks = tasksForDay.some((task) => !task.completed);
            allTasksCompleted = tasksForDay.every((task) => task.completed);
          }

          isTodo = isFutureDay && tasksForDay.length > 0;
        }

        return (
          <div
            key={index}
            className={`${styles.day} ${
              day !== null && isCurrentDay(day) ? styles.currentDay : ''
            } ${day !== null && isSelectedDay(day) ? styles.selectedDay : ''}`}
            onClick={() => handleDayClick(day)}
          >
            {day ? (
              <div className={styles.content}>
                <div className={styles.dots}>
                  <Dots
                    hasUncompletedTasks={hasUncompletedTasks}
                    allTasksCompleted={allTasksCompleted}
                    isTodo={isTodo}
                  />
                </div>
                <div className={styles.dayNumber}>
                  {day}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default DayGrid;
