"use client"
import React, { useState } from "react"
import styles from "./entry.module.css"
import { Entry } from "./entryContext"
import { Category } from "../category/categoryContext"
import { darkenColor } from "../category/utils"

interface EntryItemProps {
  entry: Entry
  subEntries: Entry[]
  categories: Category[]
  addEntry: (date: string, text: string, parentId?: string) => Promise<void>
  toggleDone: (id: string) => Promise<void>
  updateCat: (id: string, category: string | null) => Promise<void>
}

const EntryItem: React.FC<EntryItemProps> = ({
  entry,
  subEntries,
  categories,
  addEntry,
  toggleDone,
  updateCat
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newText, setNewText] = useState("")

  const catObj = categories.find(c => c.name === entry.category)
  const borderColor = catObj ? darkenColor(catObj.backgroundColor, 10) : "black"

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newText.trim()) {
      addEntry(entry.date, newText.trim(), entry._id)
      setNewText("")
      setIsAdding(false)
    }
  }

  return (
    <li
      className={`${styles.item} ${entry.done ? styles.done : ""}`}
      style={{ border: `3px solid ${borderColor}`, position: "relative" }}
    >
      {entry.category ? (
        <span
          className={styles.categoryFloating}
          style={{
            backgroundColor: catObj?.backgroundColor,
            border: `1px solid ${borderColor}`
          }}
          onClick={() => updateCat(entry._id!, null)}
        >
          {entry.category}
        </span>
      ) : (
        <div className={styles.categoryButtons}>
          {categories.map(cat => (
            <button
              key={cat.name}
              className={styles.categoryButton}
              onClick={() => updateCat(entry._id!, cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
      <div className={styles.entryContent}>
        <span
          className={styles.entryText}
          onClick={() => toggleDone(entry._id!)}
        >
          {entry.text}
        </span>
        {subEntries.map(sub => (
          <span
            key={sub._id}
            className={`${styles.subEntry} ${sub.done ? styles.done : ""}`}
            onClick={() => toggleDone(sub._id!)}
          >
            {sub.text}
          </span>
        ))}
        {isAdding ? (
          <input
            autoFocus
            className={styles.subEntryInput}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onBlur={() => {
              setIsAdding(false)
              setNewText("")
            }}
            onKeyDown={handleKeyDown}
            placeholder="sub‑step"
          />
        ) : (
          <button
            className={styles.plusButton}
            onClick={() => setIsAdding(true)}
          >
            +
          </button>
        )}
      </div>
    </li>
  )
}

export default EntryItem
