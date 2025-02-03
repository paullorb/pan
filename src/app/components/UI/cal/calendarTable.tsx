// calendarTable.tsx

"use client";

import React from 'react';
import styles from './calendar.module.css';

export type Cell = {
  date: Date;
  inCurrentMonth: boolean;
};

interface CalendarTableProps {
  weeks: Cell[][];
  selectedDate: Date;
  initialToday: Date;
  onSelectDate: (date: Date) => void;
}

const CalendarTable: React.FC<CalendarTableProps> = ({
  weeks,
  selectedDate,
  initialToday,
  onSelectDate,
}) => (
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
          {weekRow.map((cell, j) => {
            const cellDay = cell.date.getDate();
            const cellMonth = cell.date.getMonth();
            const cellYear = cell.date.getFullYear();
            const isSelected =
              cellYear === selectedDate.getFullYear() &&
              cellMonth === selectedDate.getMonth() &&
              cellDay === selectedDate.getDate();
            const isToday =
              cellYear === initialToday.getFullYear() &&
              cellMonth === initialToday.getMonth() &&
              cellDay === initialToday.getDate();
            return (
              <td
                key={j}
                className={`${styles.td} ${isSelected ? styles.selected : ''} ${
                  isToday && cell.inCurrentMonth ? styles.today : ''
                } ${!cell.inCurrentMonth ? styles.outside : ''}`}
                onClick={() => onSelectDate(cell.date)}
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

export default CalendarTable;
