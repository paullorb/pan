'use client'
import React, { useState, useEffect, useMemo } from "react"
import { useCalendar } from "../cal/calendarContext"
import { useEntry } from "./entryContext"
import styles from "./entry.module.css"
import { getDateKey } from "./utils"
import { useAuth } from "../auth/authContext"
import EntryList from "./entryList"
import Filter from "app/filter/filter"

const Entry: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null)
  const { selectedDate } = useCalendar()
  const { entries, fetchDayEntries } = useEntry()
  const { user } = useAuth()
  const keyDate = useMemo(() => getDateKey(selectedDate), [selectedDate])

  useEffect(() => {
    if (user) fetchDayEntries(keyDate)
  }, [keyDate, user, fetchDayEntries])

  const selectedEntries = entries[keyDate] || []
  const totalCount = selectedEntries.length
  const openCount = selectedEntries.filter((entry) => !entry.done).length
  const filteredEntries =
    filter === "open"
      ? selectedEntries.filter((entry) => !entry.done)
      : selectedEntries

  return (
    <div className={styles.container}>
      <Filter
        filter={filter}
        totalCount={totalCount}
        openCount={openCount}
      />
      <EntryList entries={filteredEntries} />
    </div>
  )
}

export default Entry
