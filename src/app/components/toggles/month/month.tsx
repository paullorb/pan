"use client";
import React, { useContext } from 'react';
import styles from './month.module.css';
import { TogglesContext } from '@/app/context/togglesContext';
import { useDate } from '../../../context/dateContext';
import { useTasks } from '../../../context/tasksContext';
import Dots from './dots';
import Title from '../../shared/title';

const Month = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const { tasksByDate } = useTasks();
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0); // Reset time for accurate comparison
  const thisYear = todayDate.getFullYear();

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

  // Generate days array
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
      const selectedFullDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(selectedFullDate);
    }
  };

  return (
    <div className={styles.container}>
      <Title
        title={`${monthNames[currentMonth]} ${currentYear !== thisYear ? currentYear : ''}`}
        pagination={true}
        onPrevious={decrementMonth}
        onNext={incrementMonth}
      />
      <div className={styles.monthGrid}>
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

            // Set isTodo to true if the day is in the future and has tasks scheduled
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
                  <div className={styles.arriba}>•••</div>
                  <div
                    className={`${styles.dayNumber} ${
                      day !== null && isCurrentDay(day) ? styles.currentDayNumber : ''
                    }`}
                  >
                    {day}
                  </div>
                  <div className={styles.abajo}>
                    <Dots
                      hasUncompletedTasks={hasUncompletedTasks}
                      allTasksCompleted={allTasksCompleted}
                      isTodo={isTodo}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Month;
