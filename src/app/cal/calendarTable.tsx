'use client';
import React, { useEffect } from 'react';
import styles from './calendar.module.css';
import { getCalendarWeeks, Cell, WEEKDAY_NAMES_FULL, WEEKDAY_HEADER_LENGTH } from './utils';
import { darkenColor } from 'app/category/utils';
import { useCalendar } from './calendarContext';
import { getDateKey } from '../entry/utils';
import { useEntry } from '../entry/entryContext';
import { useAuth } from '../auth/authContext';
import { useCategory } from 'app/category/categoryContext';

const TotalEntriesCounter: React.FC<{ total: number }> = React.memo(({ total }) => <span>{total}</span>, (prev, next) => prev.total === next.total);
const CompletedEntriesCounter: React.FC<{ completed: number }> = React.memo(({ completed }) => <span>{completed}</span>, (prev, next) => prev.completed === next.completed);

const CalendarTable: React.FC = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { entries, fetchMonthEntries } = useEntry();
  const { user } = useAuth();
  const categories = useCategory();
  const weeks = getCalendarWeeks(selectedDate);
  const today = new Date();
  const headerNames = WEEKDAY_NAMES_FULL.slice(1).concat(WEEKDAY_NAMES_FULL.slice(0, 1));

  useEffect(() => {
    if (user) {
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      fetchMonthEntries(month, year);
    }
  }, [user, fetchMonthEntries, selectedDate]);

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
              const dayEntries = entries[dateKey] || [];
              const totalCount = dayEntries.length;
              const completedCount = dayEntries.filter(entry => entry.done).length;
              let dayNumberContent;
              if (isSelected) {
                dayNumberContent = (
                  <div className={`${styles.dayNumber} ${styles.selectedCircle}`}>
                    {cellDay}
                  </div>
                );
              } else if (isToday) {
                dayNumberContent = (
                  <div className={`${styles.dayNumber} ${styles.todayCircle}`}>
                    {cellDay}
                  </div>
                );
              } else {
                dayNumberContent = <div className={styles.dayNumber}>{cellDay}</div>;
              }
              return (
                <td
                  key={j}
                  className={`${styles.td} ${!cell.inCurrentMonth ? styles.outside : ''}`}
                  onClick={() => setSelectedDate(cell.date)}
                >
                  <div className={styles.cellWrapper}>
                    <div className={styles.dayNumberWrapper}>
                      <div className={styles.side}></div>
                      <div>{dayNumberContent}</div>
                      <div className={styles.side}></div>
                    </div>
                    <div className={styles.counter}>
                      <TotalEntriesCounter total={totalCount} /> / <CompletedEntriesCounter completed={completedCount} />
                    </div>
                    {dayEntries.length > 0 && (
                      <div className={styles.itemPreviews}>
                        {dayEntries
                          .filter(entry => !entry.done)
                          .slice(0, 10)
                          .map((entry, index) => {
                            const categoryForEntry = entry.category
                              ? categories.find(c => c.name === entry.category)
                              : null;
                            const previewClass = categoryForEntry
                              ? `${styles.itemPreview} ${styles.itemPreviewCategory}`
                              : styles.itemPreview;
                            return (
                              <div
                                key={index}
                                className={previewClass}
                                style={
                                  categoryForEntry
                                    ? ({
                                        '--bg-color': categoryForEntry.backgroundColor,
                                        '--border-color': darkenColor(categoryForEntry.backgroundColor, 10)
                                      } as React.CSSProperties)
                                    : undefined
                                }
                              >
                                {entry.text.split(' ')[0]}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
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
