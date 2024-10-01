// hour.tsx
import React from 'react';
import { useHours } from '../../../context/hoursContext';
import { useDate } from '../../../context/dateContext';
import Adjuster from './adjuster';
import style from './hour.module.css';
import Skeleton from '../../shared/skeleton';

interface HourProps {
  hour: number;
  currentHour: number | null;
}

const Hour: React.FC<HourProps> = ({ hour, currentHour }) => {
  const { activities, handleActivityChange, loading } = useHours();
  const { selectedDate } = useDate();

  const dayKey = selectedDate.toDateString();
  const activityFullKey = `${dayKey}_${hour}:00`;
  const activityFull = activities[activityFullKey] || '';

  const backgroundClass = hour % 2 === 0 ? style.altBackground1 : style.altBackground2;
  const isCurrentHour = currentHour === hour;
  const currentHourClass = isCurrentHour ? style.currentHour : '';

  return (
    <label htmlFor={`activity-${hour}`} className={`${style.frame} ${backgroundClass} ${currentHourClass}`}>
      <div className={`${style.hour} ${backgroundClass}`}>{hour}:00</div>
        <div className={`${style.pan} ${backgroundClass}`}>
          {loading ? (
            <Skeleton /> 
          ) : (
            <>
              <input
                type="text"
                id={`activity-${hour}`}
                className={`${style.input} ${backgroundClass}`}
                placeholder={`🍞 at ${hour}:00`}
                value={activityFull}
                onChange={(e) => handleActivityChange(activityFullKey, e.target.value)}
              />
              <Adjuster
                backgroundClass={backgroundClass}
                onIncrease={() => handleActivityChange(`${hour}:30`, activityFull)}
              />
            </>
          )}
        </div>
    </label>
  );
};

export default Hour;
