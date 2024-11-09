// /components/toggles/month/WeekDaysHeader.tsx
"use client";

import React, { useContext } from 'react';
import styles from './weekDaysHeader.module.css';
import { CALENDAR_CONSTANTS } from 'app/lib/constants/calendar';
import { TogglesContext } from 'app/context/togglesContext';

interface WeekDaysHeaderProps {
  className?: string;
  hoveredDayIndex: number | null;
}

const WeekDaysHeader: React.FC<WeekDaysHeaderProps> = ({ className, hoveredDayIndex }) => {

const togglesContext = useContext(TogglesContext);
  const isWorkWeek = togglesContext?.togglesState.workWeek;
  
  const fullWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekDays = isWorkWeek ? fullWeek.slice(0, CALENDAR_CONSTANTS.WORK_WEEK) : fullWeek;


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
