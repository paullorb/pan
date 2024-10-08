// components/layout/main.tsx
"use client";

import React, { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';
import Hours from '../toggles/hours/hours';
import style from './main.module.css';

const MainComponent: React.FC = () => {
  const context = useContext(TogglesContext);

  if (!context) {
    return null;
  }

  const { togglesState } = context;

  return (
    <div className={style.container}>
      {togglesState.hours && <Hours />}
    </div>
  );
};

export default MainComponent;
