// monthNavigation.tsx

"use client";

import React from 'react';
import styles from './calendar.module.css';
import { getMonthName } from './utils';

interface MonthNavigationProps {
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onWheel: (e: React.WheelEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  month,
  onPrev,
  onNext,
  onWheel,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => (
  <div className={styles.monthNavigation}>
    <button onClick={onPrev}>‹</button>
    <p
      className={styles.monthName}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {getMonthName(month)}
    </p>
    <button onClick={onNext}>›</button>
  </div>
);

export default MonthNavigation;
