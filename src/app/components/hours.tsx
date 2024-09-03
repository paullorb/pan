// components/Hours.tsx
"use client";
import React, { useState } from 'react';
import Hour from './hour';
import style from './hour.module.css';

interface HoursProps {
  from: number;
  until: number;
}

const Hours: React.FC<HoursProps> = ({ from, until }) => {
  const [activities, setActivities] = useState<{ [key: string]: string }>({});

  const validFrom = Math.max(0, Math.min(23, from));
  const validUntil = Math.max(validFrom, Math.min(23, until));

  const handleActivityChange = (hourKey: string, value: string) => {
    setActivities(prevActivities => ({
      ...prevActivities,
      [hourKey]: value,
    }));
  };

  return (
    <div className={style.hourly}>
      {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => {
        const hour = validFrom + i;
        return (
          <Hour
            key={hour}
            hour={hour}
            activityFull={activities[`${hour}:00`] || ''}
            activityHalf={activities[`${hour}:30`] || ''}
            onActivityChange={handleActivityChange}
          />
        );
      })}
    </div>
  );
};

export default Hours;
