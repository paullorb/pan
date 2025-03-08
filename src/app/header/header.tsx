'use client'
import React, { useState, useRef } from 'react'
import Weekday from '../cal/weekDay'
import MonthNavigation from '../cal/monthNavigation'
import YearNavigation from '../cal/yearNavigation'
import Category from '../category/category'
import styles from './header.module.css'
import Categories from '../category/categories'
import { useAuth } from '../auth/authContext'
import EntryInput from 'app/entry/entryInput'
import { useCalendar } from 'app/cal/calendarContext'
import { useEntry } from 'app/entry/entryContext'
import { getDateKey } from 'app/entry/utils'

const Header: React.FC = () => {
  const [showCategories, setShowCategories] = useState(false)
  const { user } = useAuth()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { selectedDate } = useCalendar()
  const { addEntry } = useEntry()
  const keyDate = getDateKey(selectedDate)

  const handleAddEntry = () => {
    if (input.trim() === "") return
    addEntry(keyDate, input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddEntry()
  }

  return (
    <header className={styles.header}>
      {user && (
        <div>
          <EntryInput
            input={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
          />
        </div>
      )}
      <div className={styles.top}>
        <div className={styles.calNavigation}>
          <Weekday />
          <MonthNavigation />
          <YearNavigation />
        </div>
        <Category isShown={showCategories} onToggle={() => setShowCategories(prev => !prev)} />
      </div>
      {showCategories && (
        <div className={styles.bottom}>
          <Categories />
        </div>
      )}
    </header>
  )
}

export default Header
