"use client";
import React, { useState } from 'react';
import styles from './month.module.css';
import { useDate } from '../context/dateContext'; // Import the DateContext

const Month = () => {
  const [date, setDate] = useState(new Date());
  const { selectedDate, setSelectedDate } = useDate(); // Get both selectedDate and setSelectedDate from context
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const today = new Date().getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const isCurrentYear = currentYear === new Date().getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = (firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay());

  let days = [];
  for (let i = 1; i < startingDayOfWeek; i++) {
    days.push(null); // Empty slots for days before the first day of the month
  }
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const totalDays = days.length;
  const fillerDays = 7 - (totalDays % 7);
  if (fillerDays < 7) {
    for (let i = 0; i < fillerDays; i++) {
      days.push(null); // Empty slots after the last day of the month
    }
  }

  const incrementMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const decrementMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const isCurrentDay = (day: number) =>
    day === today && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

  const isSelectedDay = (day: number) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    currentMonth === selectedDate.getMonth() &&
    currentYear === selectedDate.getFullYear();

  const handleDayClick = (day: number | null) => {
    if (day !== null) {
      const selectedFullDate = new Date(currentYear, currentMonth, day); // Create full date object
      setSelectedDate(selectedFullDate); // Update the date in DateContext
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <button onClick={decrementMonth} className={styles.navButton}>{"<"}</button>
        <span className={styles.monthYear}>
          {monthNames[currentMonth]} {isCurrentYear ? '' : currentYear}
        </span>
        <button onClick={incrementMonth} className={styles.navButton}>{">"}</button>
      </div>
      <div className={styles.monthGrid}>
        {days.map((day, index) => (
          <div
            key={index}
            className={`${styles.day} ${
              day !== null && isCurrentDay(day) ? styles.currentDay : ''
            } ${day !== null && isSelectedDay(day) ? styles.selectedDay : ''}`} // Apply styles based on the current day or selected day
            onClick={() => handleDayClick(day)} // Set selected day on click
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Month;
