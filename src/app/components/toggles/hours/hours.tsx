// components/hours/hours.tsx
"use client";

import React, { useContext, useState, useEffect } from 'react';
import { useHours } from '../../../context/hoursContext';
import Hour from './hour';
import style from './hours.module.css';
import { TogglesContext } from '../../../context/togglesContext';
import Controls from './controls';
import Title from '../../shared/title';
import { CurrentHourProvider } from '../../../context/currentHourContext';

const Hours: React.FC = () => {
  const { from, until } = useHours();
  const validFrom = Math.max(0, Math.min(23, from));
  const validUntil = Math.max(validFrom, Math.min(23, until));

  const togglesContext = useContext(TogglesContext);

  // Hydration check to ensure consistency
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prevent rendering until the component is hydrated
  if (!isHydrated) {
    return null; // or return a loading spinner or placeholder if needed
  }

  if (!togglesContext) {
    throw new Error("Hours must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.hours) {
    return null;
  }

  return (
    <CurrentHourProvider>
      <div className={style.container}>
        <Title title="Hours" />
        <div className={style.modal}>
          <Controls />
        </div>
        <div className={style.hourly}>
          {Array.from({ length: validUntil - validFrom + 1 }, (_, i) => (
            <Hour key={validFrom + i} hour={validFrom + i} />
          ))}
        </div>
      </div>
    </CurrentHourProvider>
  );
};

export default Hours;
