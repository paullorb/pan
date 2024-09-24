"use client";

import React, { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';
import Hours from '../toggles/hours';
import style from './main.module.css';

const Main: React.FC = () => {
  const context = useContext(TogglesContext);

  if (!context) {
    return null;
  }

  const { togglesState } = context;

  if (!togglesState.hours) {
    return null;
  }

  return (
    <main className={style.main}>
      {togglesState.hours && <Hours />}
    </main>
  );
};

export default Main;