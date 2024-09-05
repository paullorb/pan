// components/Hours.tsx
"use client";
import React from 'react';
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

  return (
    <HoursProvider> {/* Wrap components in the provider */}
      <div className={style.hourly}>
        {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => {
          const hour = validFrom + i;
          return <Hour key={hour} hour={hour} />;
        })}
      </div>
    </HoursProvider>
  );
};

export default Hours;
