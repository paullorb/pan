'use client'
import React, { useEffect, useMemo } from "react"
import styles from "./calendar.module.css"
import { getCalendarWeeks, Cell, WEEKDAY_NAMES_FULL, WEEKDAY_HEADER_LENGTH } from "./utils"
import { darkenColor } from "app/category/utils"
import { useCalendar } from "./calendarContext"
import { getDateKey } from "../entry/utils"
import { useEntry } from "../entry/entryContext"
import { useAuth } from "../auth/authContext"
import { useCategory } from "app/category/categoryContext"

interface CalendarWeekProps {
  selectedCategory?: string | null
}

const CalendarWeek: React.FC<CalendarWeekProps> = ({ selectedCategory = null }) => {
  const { selectedDate, setSelectedDate } = useCalendar()
  const { entries, fetchMonthEntries } = useEntry()
  const { user } = useAuth()
  const categories = useCategory()
  const weeks = useMemo(() => getCalendarWeeks(selectedDate), [selectedDate])
  const today = new Date()
  const headerNames = WEEKDAY_NAMES_FULL.slice(1).concat(WEEKDAY_NAMES_FULL.slice(0, 1))
  const rowWithSelected = weeks.find(row =>
    row.some(cell =>
      cell.date.getFullYear() === selectedDate.getFullYear() &&
      cell.date.getMonth() === selectedDate.getMonth() &&
      cell.date.getDate() === selectedDate.getDate()
    )
  )

  useEffect(() => {
    if (user) {
      const month = selectedDate.getMonth()
      const year = selectedDate.getFullYear()
      fetchMonthEntries(month, year)
    }
  }, [user, fetchMonthEntries, selectedDate])

  if (!rowWithSelected) return null

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
        <tr className={styles.tr}>
          {rowWithSelected.map((cell: Cell, j) => {
            const cellDay = cell.date.getDate()
            const cellMonth = cell.date.getMonth()
            const cellYear = cell.date.getFullYear()
            const isSelected =
              cellYear === selectedDate.getFullYear() &&
              cellMonth === selectedDate.getMonth() &&
              cellDay === selectedDate.getDate()
            const isToday =
              cellYear === today.getFullYear() &&
              cellMonth === today.getMonth() &&
              cellDay === today.getDate()
            const dateKey = getDateKey(cell.date)
            let previews = entries[dateKey] ? entries[dateKey].filter(e => !e.done) : []
            if (selectedCategory) {
              previews = previews.filter(e => e.category === selectedCategory)
            }
            previews = previews.slice(0, 10)
            const dayNumberContent = isSelected ? (
              <div className={`${styles.dayNumber} ${styles.selectedCircle}`}>{cellDay}</div>
            ) : isToday ? (
              <div className={`${styles.dayNumber} ${styles.todayCircle}`}>{cellDay}</div>
            ) : (
              <div className={styles.dayNumber}>{cellDay}</div>
            )
            return (
              <td
                key={j}
                className={`${styles.td} ${!cell.inCurrentMonth ? styles.outside : ''}`}
                onClick={() => setSelectedDate(cell.date)}
              >
                <div className={styles.cellWrapper}>
                  {dayNumberContent}
                  {previews.length > 0 && (
                    <div className={styles.itemPreviews}>
                      {previews.map((entry, k) => {
                        const categoryForEntry = entry.category
                          ? categories.find(c => c.name === entry.category)
                          : null
                        const previewClass = categoryForEntry
                          ? `${styles.itemPreview} ${styles.itemPreviewCategory}`
                          : styles.itemPreview
                        return (
                          <div
                            key={k}
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
                        )
                      })}
                    </div>
                  )}
                </div>
              </td>
            )
          })}
        </tr>
      </tbody>
    </table>
  )
}

export default CalendarWeek
