'use client'
import React, { useState, useRef, useEffect } from "react"
import { useCalendar } from "../cal/calendarContext"
import { useItems } from "./entryContext"
import styles from "./item.module.css"
import { getDateKey } from "./utils"
import ContextEntry from "../context/contextEntry"
import { useContextContext } from "../context/contextContext"
import { ContextConfig } from "../context/utils"
import { useAuth } from "../nav/authContext";

const Entry: React.FC = () => {
  const [input, setInput] = useState("")
  const { selectedDate } = useCalendar()
  const { addItem, items, updateItemContext } = useItems()
  const { selectedContext, contexts } = useContextContext()
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
  const filteredItems = selectedContext
    ? allItems.filter(item => item.context === selectedContext.id)
    : allItems
  return (
    <div className={styles.container}>
      {filteredItems.length > 0 ? (
        <ul className={styles.list}>
          {filteredItems.map((item, index) => {
            const entryConfig: ContextConfig | null = item.context
              ? contexts.find((c: ContextConfig) => c.id === item.context) || null
              : null
            return (
              <li key={index} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemText}>{item.text}</span>
                  <ContextEntry
                    entryContext={entryConfig}
                    onContextChange={(newContext) =>
                      updateItemContext(keyDate, index, newContext ? newContext.id : null)
                    }
                  />
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>No items yet.</p>
      )}
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="new item"
          onKeyDown={handleKeyDown}
          autoFocus
          className={styles.input}
        />
      </div>
    </div>
  )
}

export default Entry
