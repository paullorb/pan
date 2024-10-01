// components/hours/hour.tsx

import React from 'react';
import { useHours } from '../../../context/hoursContext';
import { useDate } from '../../../context/dateContext';
import Item from '../../shared/item';
import style from './hour.module.css'; // Updated import path
import Skeleton from '../../shared/skeleton';
import { useCurrentHour } from '../../../context/currentHourContext';

interface HourProps {
  hour: number;
}

const Hour: React.FC<HourProps> = ({ hour }) => {
  const { activities, handleActivityChange, loading } = useHours();
  const { selectedDate } = useDate();
  const { currentHour } = useCurrentHour();

  const dayKey = selectedDate.toDateString();
  const activityFullKey = `${dayKey}_${hour}:00`;
  const activityFull = activities[activityFullKey] || '';

  const isCurrentHour = currentHour === hour;

  const backgroundClass = hour % 2 === 0 ? style.altBackground1 : style.altBackground2;
  const currentHourClass = isCurrentHour ? style.currentHour : '';

  return (
    <Item className={`${style.container} ${backgroundClass} ${currentHourClass}`}>
      <label htmlFor={`activity-${hour}`} className={style.label}>
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
            </>
          )}
        </div>
      </label>
    </Item>
  );
};

export default Hour;
