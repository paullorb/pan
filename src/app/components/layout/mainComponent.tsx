"use client";

import React from 'react';
import Month from '../toggles/month/month';
import Priority from '../toggles/priorities/priorities';
import style from './mainComponent.module.css';

const Main: React.FC = () => {

  return (
    <main className={style.container}>
      <Month />
      <Priority />
    </main>
  );
};

export default Main;