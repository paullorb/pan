"use client"

import React, { useEffect, useState } from 'react';
import { useHours } from '../../context/hoursContext'; 
import Hour from './hour';
import style from './hour.module.css';

const Hours: React.FC = () => {
  const { from, until } = useHours(); // Retrieve from context
  const validFrom = Math.max(0, Math.min(23, from));
  const validUntil = Math.max(validFrom, Math.min(23, until));

  const [currentPosition, setCurrentPosition] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentPosition = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (currentHour >= from && currentHour <= until) {
        const totalHours = validUntil - validFrom + 1;
        const position = ((currentHour - validFrom) + currentMinute / 60) / totalHours * 100;
        setCurrentPosition(position);
      } else {
        setCurrentPosition(null);
      }
    };

    updateCurrentPosition();
    const intervalId = setInterval(updateCurrentPosition, 60000); 

    return () => clearInterval(intervalId);
  }, [from, until, validFrom, validUntil]);

  return (
    <div className={style.hourly}>
      {currentPosition !== null && (
        <div
          className={style.timeBar}
          style={{ top: `calc(${currentPosition}% - 4px)` }}
        />
      )}
      {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => (
        <Hour key={validFrom + i} hour={validFrom + i} />
      ))}
    </div>
  );
};

export default Hours;
