// /components/toggles/month/WeekDaysHeader.tsx
"use client";

import React from 'react';
import styles from './weekDaysHeader.module.css';

interface WeekDaysHeaderProps {
  className?: string;
  hoveredDayIndex: number | null;
}

const WeekDaysHeader: React.FC<WeekDaysHeaderProps> = ({ className, hoveredDayIndex }) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']; // Monday to Sunday
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {weekDays.map((day, index) => (
        <div
          key={index}
          className={`${styles.dayHeader} ${
            hoveredDayIndex === index ? styles.highlighted : ''
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekDaysHeader;
