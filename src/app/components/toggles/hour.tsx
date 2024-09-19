// hour.tsx
import React from 'react';
import { useHours } from '../../context/hoursContext';
import { useDate } from '../../context/dateContext';
import Adjuster from './adjuster';
import style from './hour.module.css';

interface HourProps {
  hour: number;
}

const Hour: React.FC<HourProps> = ({ hour }) => {
  const { activities, handleActivityChange } = useHours();
  const { selectedDate } = useDate(); // Get selectedDate from DateContext

  const dayKey = selectedDate.toDateString(); // Unique key for each day

  const activityFullKey = `${dayKey}_${hour}:00`;
  const activityHalfKey = `${dayKey}_${hour}:30`;

  const activityFull = activities[activityFullKey] || '';
  const activityHalf = activities[activityHalfKey] || '';

  const handleCopy = (sourceTime: string, destinationTime: string) => {
    handleActivityChange(`${dayKey}_${destinationTime}`, activities[`${dayKey}_${sourceTime}`] || '');
  };

  const backgroundClass = hour % 2 === 0 ? style.altBackground1 : style.altBackground2;

  return (
    <div className={`${style.frame} ${backgroundClass}`}>
      <div className={`${style.hour} ${backgroundClass}`}>{hour}:00</div>
      <div className={style.events}>
        <div className={`${style.pan} ${backgroundClass}`}>
          <input
            type="text"
            className={`${style.event} ${backgroundClass}`}
            placeholder={`🍞 at ${hour}:00`}
            value={activityFull}
            onChange={(e) => handleActivityChange(activityFullKey, e.target.value)}
          />
          <Adjuster backgroundClass={backgroundClass} onIncrease={() => handleCopy(`${hour}:00`, `${hour}:30`)} />
        </div>
        <div className={`${style.pan} ${backgroundClass}`}>
          <input
            type="text"
            className={`${style.event} ${backgroundClass}`}
            placeholder={`🍞 at ${hour}:30`}
            value={activityHalf}
            onChange={(e) => handleActivityChange(activityHalfKey, e.target.value)}
          />
          <Adjuster backgroundClass={backgroundClass} onIncrease={() => handleCopy(`${hour}:30`, `${hour + 1}:00`)} />
        </div>
      </div>
    </div>
  );
};

export default Hour;
