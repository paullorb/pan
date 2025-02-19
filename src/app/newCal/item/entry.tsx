'use client'
import React, { useState, useRef, useEffect } from "react"
import { useCalendar } from "../cal/calendarContext"
import { useItems } from "./entryContext"
import styles from "./entry.module.css"
import { getDateKey } from "./utils"
import { useAuth } from "../nav/authContext"
import EntryList from "./entryList"
import EntryInput from "./entryInput"

const Entry: React.FC = () => {
  const [input, setInput] = useState("")
  const { selectedDate } = useCalendar()
  const { addItem, items } = useItems()
  const { user } = useAuth()
  const keyDate = getDateKey(selectedDate)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [selectedDate])
  const handleAddItem = () => {
    if (input.trim() === "") return
    addItem(keyDate, input.trim())
    setInput("")
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddItem()
  }
  const allItems = (items[keyDate] || []).filter(item => item.userId === user?.id)
  return (
    <div className={styles.container}>
      <EntryList items={allItems} />
      <EntryInput input={input} onChange={setInput} onKeyDown={handleKeyDown} inputRef={inputRef} />
    </div>
  )
}

export default Entry
