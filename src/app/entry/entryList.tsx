"use client"
import React from "react"
import styles from "./entry.module.css"
import { useEntry, Entry } from "./entryContext"
import { useCategory } from "../category/categoryContext"
import TodaysExercises from "./todaysExercises"
import EntryItem from "./entryItem"

interface EntryListProps {
  entries: Entry[]
}

const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const { addEntry, toggleEntryDone, updateEntryCategory } = useEntry()
  const categories = useCategory()

  const sortedEntries = entries
    .map((entry, index) => ({ ...entry, originalIndex: index }))
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))

  const roots = sortedEntries.filter(e => !e.parentId)
  const childrenMap: Record<string, Entry[]> = {}
  sortedEntries
    .filter(e => e.parentId)
    .forEach(e => {
      childrenMap[e.parentId!] = childrenMap[e.parentId!] || []
      childrenMap[e.parentId!]!.push(e)
    })

  return (
    <>
      <TodaysExercises />
      <ul className={styles.list}>
        {roots.map(entry => (
          <EntryItem
            key={entry._id || entry.originalIndex}
            entry={entry}
            subEntries={childrenMap[entry._id!] || []}
            categories={categories}
            addEntry={addEntry}
            toggleDone={toggleEntryDone}
            updateCat={updateEntryCategory}
          />
        ))}
      </ul>
    </>
  )
}

export default EntryList
