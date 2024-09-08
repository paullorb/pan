"use client"

import React, { useState, useEffect } from 'react';
import { HoursProvider } from '../hoursContext'; // Adjust the import path as necessary
import Hour from './hour';
import style from './hour.module.css';

interface HoursProps {
  from: number;
  until: number;
}

const Hours: React.FC<HoursProps> = ({ from, until }) => {
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
        const timeFraction = (currentHour - validFrom) + currentMinute / 60;
        const position = (timeFraction / totalHours) * 100;
        setCurrentPosition(position);
      } else {
        setCurrentPosition(null);
      }
    };

    updateCurrentPosition();
    const intervalId = setInterval(updateCurrentPosition, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [from, until]);

  return (
    <HoursProvider> {/* Wrap components in the provider */}
      <div className={style.hourly}>
        {currentPosition !== null && (
          <div
            className={style.timeBar}
            style={{ top: `${currentPosition}%` }} // Position the bar dynamically
          />
        )}
        {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => {
          const hour = validFrom + i;
          return <Hour key={hour} hour={hour} />;
        })}
      </div>
    </HoursProvider>
  );
};

export default Hours;
