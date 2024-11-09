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

  if (!togglesState.main) {
    return null;
  }

  return (
    <div className={style.container}>
      {togglesState.hour && <Hours />}
    </div>
  );
};

export default MainComponent;