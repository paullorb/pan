"use client";
import React from 'react';
import styles from './calendar.module.css';
import { getCalendarWeeks, Cell } from './utils';
import { useCalendar } from 'app/components/UI/cal/calendarContext';

const CalendarTable: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const weeks = getCalendarWeeks(selectedDate);
  const today = new Date();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
            <th key={index} className={styles.th}>
              {dayName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((weekRow, i) => (
          <tr key={i} className={styles.tr}>
            {weekRow.map((cell: Cell, j) => {
              const cellDay = cell.date.getDate();
              const cellMonth = cell.date.getMonth();
              const cellYear = cell.date.getFullYear();
              const isSelected =
                cellYear === selectedDate.getFullYear() &&
                cellMonth === selectedDate.getMonth() &&
                cellDay === selectedDate.getDate();
              const isToday =
                cellYear === today.getFullYear() &&
                cellMonth === today.getMonth() &&
                cellDay === today.getDate();
              return (
                <td
                  key={j}
                  className={`${styles.td} ${isSelected ? styles.selected : ''} ${
                    isToday && cell.inCurrentMonth ? styles.today : ''
                  } ${!cell.inCurrentMonth ? styles.outside : ''}`}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  {cellDay}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CalendarTable;
