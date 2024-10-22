import React from 'react';
import { useHours } from '../../../context/hoursContext';
import { useDate } from '../../../context/dateContext';
import Item from '../../shared/item';
import style from './hour.module.css';
import Skeleton from '../../shared/skeleton';
import { useCurrentHour } from '../../../context/currentHourContext';

interface HourProps {
  hour: number;
}

const Hour: React.FC<HourProps> = ({ hour }) => {
  const { activities, handleActivityChange, loading } = useHours();
  const { selectedDate } = useDate();
  const { currentHour, currentMinutes } = useCurrentHour();

  const dayKey = selectedDate.toDateString();
  const activityFullKey = `${dayKey}_${hour}:00`;
  const activityFull = activities[activityFullKey] || '';

  const isCurrentHour = currentHour === hour;

  const backgroundClass = hour % 2 === 0 ? style.altBackground1 : style.altBackground2;
  const currentHourClass = isCurrentHour ? style.currentHour : '';

  // Update the hour label to show current minutes if it's the current hour
  const hourLabel = isCurrentHour
    ? `${hour}:${currentMinutes !== null ? currentMinutes.toString().padStart(2, '0') : '00'}`
    : `${hour}:00`;

  return (
    <>
      <label htmlFor={`activity-${hour}`} className={`${style.label}`}>
        <div className={`${style.hour} ${isCurrentHour ? style.boldHour : ''}`}>
          {hourLabel}
        </div>
        <Item className={`${style.container} ${backgroundClass} ${currentHourClass}`}>
          <div className={`${style.pan} ${backgroundClass}`}>
            {loading ? (
              <Skeleton />
            ) : (
                <input
                  type="text"
                  id={`activity-${hour}`}
                  className={`${style.input} ${backgroundClass}`}
                  placeholder={`🍞 at ${hour}:00`}
                  value={activityFull}
                  onChange={(e) => handleActivityChange(activityFullKey, e.target.value)}
                />
            )}
          </div>
        </Item>
      </label>
    </>
  );
};

export default Hour;
