"use client"
import React, { useEffect, useMemo } from "react"
import { useCalendar } from "../cal/calendarContext"
import { useEntry } from "./entryContext"
import styles from "./entry.module.css"
import { getDateKey } from "./utils"
import { useAuth } from "../auth/authContext"
import EntryList from "./entryList"

const Entry: React.FC = () => {
  const { selectedDate } = useCalendar()
  const { entries, fetchDayEntries } = useEntry()
  const { user } = useAuth()
  const keyDate = useMemo(() => getDateKey(selectedDate), [selectedDate])

  useEffect(() => {
    if (user) fetchDayEntries(keyDate)
  }, [keyDate, user, fetchDayEntries])

  const selectedEntries = entries[keyDate] || []

  return (
    <div className={styles.container}>
      <EntryList entries={selectedEntries} />
    </div>
  )
}

export default Entry
