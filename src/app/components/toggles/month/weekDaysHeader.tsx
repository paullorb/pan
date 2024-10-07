// /components/toggles/month/WeekDaysHeader.tsx
"use client";

import React from 'react';
import styles from './weekDaysHeader.module.css';

interface WeekDaysHeaderProps {
  className?: string;
}

const WeekDaysHeader: React.FC<WeekDaysHeaderProps> = ({ className }) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {weekDays.map((day, index) => (
        <div key={index} className={styles.dayHeader}>
          {day}
        </div>
      ))}
    </div>
  );
};

export default WeekDaysHeader;
