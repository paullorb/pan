"use client";

import React, { useState } from 'react';
import styles from './month.module.css';

const Month = () => {
  const [date, setDate] = useState(new Date());
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const today = new Date().getDate(); // Get today's date to highlight the current day

  const incrementMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const decrementMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  // Helper array for month names
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // Check if the displayed year is the current year
  const isCurrentYear = currentYear === new Date().getFullYear();

  // Calculate the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = (firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay());

  // Prepare an array to hold the dates
  let days = [];
  for (let i = 1; i < startingDayOfWeek; i++) {
    days.push(null); // Fill empty days until the first day of the month
  }
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Calculate filler days to complete the final week
  const totalDays = days.length;
  const fillerDays = 7 - (totalDays % 7);
  if (fillerDays < 7) {
    for (let i = 0; i < fillerDays; i++) {
      days.push(null); // Append nulls to maintain grid structure
    }
  }

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
          <div key={index} className={`${styles.day} ${day === today && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? styles.currentDay : ''}`}>
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Month;
