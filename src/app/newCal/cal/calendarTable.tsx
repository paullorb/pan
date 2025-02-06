"use client";
import React from 'react';
import styles from './calendar.module.css';
import { getCalendarWeeks, Cell, WEEKDAY_NAMES_FULL, WEEKDAY_HEADER_LENGTH } from './utils';
import { useCalendar } from './calendarContext';
import { getDateKey } from '../item/utils';
import { useItems } from '../item/itemContext';

const CalendarTable: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { items } = useItems();
  const weeks = getCalendarWeeks(selectedDate);
  const today = new Date();

  const headerNames = WEEKDAY_NAMES_FULL.slice(1).concat(WEEKDAY_NAMES_FULL.slice(0, 1));

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headerNames.map((dayName, index) => (
            <th key={index} className={styles.th}>
              {dayName.slice(0, WEEKDAY_HEADER_LENGTH)}
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

              const dateKey = getDateKey(cell.date);
              const previews = items[dateKey]
                ? items[dateKey].slice(0, 5).map((item) => item.split(" ")[0])
                : [];

              return (
                <td
                  key={j}
                  className={`${styles.td} ${isSelected ? styles.selected : ''} ${
                    isToday && cell.inCurrentMonth ? styles.today : ''
                  } ${!cell.inCurrentMonth ? styles.outside : ''}`}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  <div>{cellDay}</div>
                  {previews.length > 0 && (
                    <div className={styles.itemPreviews}>
                      {previews.map((preview, index) => (
                        <div key={index} className={styles.itemPreview}>
                          {preview}
                        </div>
                      ))}
                    </div>
                  )}
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
