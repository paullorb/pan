"use client"
import React, { useEffect, useMemo } from "react"
import { useCalendar } from "../cal/calendarContext"
import { useEntry } from "./entryContext"
import styles from "./entry.module.css"
import { getDateKey } from "./utils"
import { useAuth } from "../auth/authContext"
import EntryList from "./entryList"

interface EntryProps {
  selectedCategory?: string | null
}

const Entry: React.FC<EntryProps> = ({ selectedCategory = null }) => {
  const { selectedDate } = useCalendar()
  const { entries, fetchDayEntries } = useEntry()
  const { user } = useAuth()
  const keyDate = useMemo(() => getDateKey(selectedDate), [selectedDate])

  useEffect(() => {
    if (user) fetchDayEntries(keyDate)
  }, [keyDate, user, fetchDayEntries])

  const selectedEntries = entries[keyDate] || []
  const filteredEntries = selectedCategory
    ? selectedEntries.filter((entry) => entry.category === selectedCategory)
    : selectedEntries

  return (
    <div className={styles.container}>
      <EntryList entries={filteredEntries} />
    </div>
  )
}

export default Entry
