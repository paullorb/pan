// month.tsx
"use client";
import React, { useContext } from 'react';
import styles from './month.module.css';
import { TogglesContext } from '@/app/context/togglesContext';
import { useDate } from '../../../context/dateContext';
import { useTasks } from '../../../context/tasksContext';
import Dots from './dots';

const Month = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const { tasksByDate } = useTasks();
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Month must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.month) {
    return null;
  }

  const getDateString = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split('T')[0];
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay();

  let days: (number | null)[] = [];
  for (let i = 1; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
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

  const isCurrentDay = (day: number) =>
    day === today &&
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear();

  const isSelectedDay = (day: number) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  const handleDayClick = (day: number | null) => {
    if (day !== null) {
      const selectedFullDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(selectedFullDate);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <button onClick={decrementMonth} className={styles.navButton}>
          {"<"}
        </button>
        <span className={styles.monthYear}>
          {monthNames[currentMonth]} {currentYear !== thisYear && currentYear}
        </span>
        <button onClick={incrementMonth} className={styles.navButton}>
          {">"}
        </button>
      </div>
      <div className={styles.monthGrid}>
        {days.map((day, index) => {
          let hasUncompletedTasks = false;
          if (day !== null) {
            const dateString = getDateString(day);
            const tasksForDay = tasksByDate[dateString] || [];
            hasUncompletedTasks = tasksForDay.some((task) => !task.completed);
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
                  <div className={styles.arriba}>•••</div>
                  <div className={styles.dayNumber}>{day}</div>
                  <Dots hasUncompletedTasks={hasUncompletedTasks} />
                </div>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Month;
