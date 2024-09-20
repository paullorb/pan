// hours.tsx
"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useHours } from '../../context/hoursContext'; 
import Hour from './hour';
import style from './hour.module.css';
import { TogglesContext } from '../../context/togglesContext';

const Hours: React.FC = () => {
  const { from, until } = useHours(); // Retrieve from context
  const validFrom = Math.max(0, Math.min(23, from));
  const validUntil = Math.max(validFrom, Math.min(23, until));

  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [currentHour, setCurrentHour] = useState<number | null>(null);
  const [currentMinute, setCurrentMinute] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentPosition = () => {
      const now = new Date();
      const nowHour = now.getHours();
      const nowMinute = now.getMinutes();
      setCurrentHour(nowHour);
      setCurrentMinute(nowMinute);

      if (nowHour >= from && nowHour <= until) {
        const totalHours = validUntil - validFrom + 1;
        const position = ((nowHour - validFrom) + nowMinute / 60) / totalHours * 100;
        setCurrentPosition(position);
      } else {
        setCurrentPosition(null);
      }
    };

    updateCurrentPosition();
    const intervalId = setInterval(updateCurrentPosition, 60000); 

    return () => clearInterval(intervalId);
  }, [from, until, validFrom, validUntil]);

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Hours must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.hours) {
    return null;
  }

  return (
    <div className={style.hourly}>
      {currentPosition !== null && (
        <div
          className={style.timeBar}
          style={{ top: `calc(${currentPosition}% - 4px)` }}
        />
      )}
      {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => (
        <Hour key={validFrom + i} hour={validFrom + i} currentHour={currentHour} />
      ))}
    </div>
  );
};

export default Hours;
