// Hour.tsx
import React from 'react';
import { useHours } from '../hoursContext'; // Adjust the import path as necessary
import Adjuster from './adjuster';
import style from './hour.module.css';

interface HourProps {
  hour: number;
}

const Hour: React.FC<HourProps> = ({ hour }) => {
  const { activities, handleActivityChange } = useHours();
  const activityFull = activities[`${hour}:00`] || '';
  const activityHalf = activities[`${hour}:30`] || '';

  const handleCopyFullToHalf = () => handleActivityChange(`${hour}:30`, activityFull);
  const handleCopyHalfToNext = () => handleActivityChange(`${hour+1}:00`, activityHalf);

  return (
    <div className={style.frame}>
      <div className={style.hour}>{hour}:00</div>
      <div className={style.events}>
        <div className={style.pan}>
          <input
            type="text"
            className={style.event}
            placeholder={`🍞 at ${hour}:00`}
            value={activityFull}
            onChange={(e) => handleActivityChange(`${hour}:00`, e.target.value)}
          />
          <Adjuster onIncrease={handleCopyFullToHalf} />
        </div>
        <div className={style.pan}>
          <input
            type="text"
            className={style.event}
            placeholder={`🍞 at ${hour}:30`}
            value={activityHalf}
            onChange={(e) => handleActivityChange(`${hour}:30`, e.target.value)}
          />
          <Adjuster onIncrease={handleCopyHalfToNext} />
        </div>
      </div>
    </div>
  );
};

export default Hour;
