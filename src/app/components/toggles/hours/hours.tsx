// components/hours/hours.tsx
"use client";

import React, { useContext, useState, useEffect } from 'react';
import Hour from './hour';
import style from './hours.module.css';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../shared/title';
import { CurrentHourProvider } from '../../../context/currentHourContext';

const Hours: React.FC = () => {

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
        <div className={style.hourly}>
          {Array.from({ length: 23 - 5 + 1 }, (_, i) => (
            <Hour key={5 + i} hour={5 + i} />
          ))}
        </div>
      </div>
    </CurrentHourProvider>
  );
};

export default Hours;
