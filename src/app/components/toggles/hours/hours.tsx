// hours.tsx
"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useHours } from '../../../context/hoursContext';
import Hour from './hour';
import style from './hour.module.css';
import { TogglesContext } from '../../../context/togglesContext';
import Controls from './controls'; 

const Hours: React.FC = () => {
  const { from, until } = useHours();
  const validFrom = Math.max(0, Math.min(23, from));
  const validUntil = Math.max(validFrom, Math.min(23, until));

  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentHour = () => {
      const now = new Date();
      const nowHour = now.getHours();
      setCurrentHour(nowHour);
    };

    updateCurrentHour();
    const intervalId = setInterval(updateCurrentHour, 60000);

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
    <div className={style.hoursContainer}>
      <div className={style.modal}>
      <Controls /> 
      </div>
      <div className={style.hourly}>
        {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => (
          <Hour key={validFrom + i} hour={validFrom + i} currentHour={currentHour} />
        ))}
      </div>
    </div>
  );
};

export default Hours;
