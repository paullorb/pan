import React from "react"
import styles from "./entry.module.css"
import { useEntry, Entry } from "./entryContext"
import { useCategory, Category } from "../category/categoryContext"
import { darkenColor } from "../category/utils"
import SubEntry from "./subEntry"
import TodaysExercises from "./todaysExercises"

interface EntryListProps {
  entries: Entry[]
}

const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const { toggleEntryDone, updateEntryCategory } = useEntry()
  const categories = useCategory()

  const sortedEntries = entries
    .map((entry, index) => ({ ...entry, originalIndex: index }))
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1))

  return (
    <>
      <TodaysExercises />
      <ul className={styles.list}>
        {sortedEntries.map((entry) => {
          const key = entry._id || entry.originalIndex.toString()
          const categoryObj = categories.find((cat: Category) => cat.name === entry.category)
          const borderColor = categoryObj ? darkenColor(categoryObj.backgroundColor, 10) : "black"

          return (
            <li
              key={key}
              className={`${styles.item} ${entry.done ? styles.done : ""}`}
              style={{ border: `3px solid ${borderColor}`, position: "relative" }}
            >
              {entry.category ? (
                <span
                  className={styles.categoryFloating}
                  style={{
                    backgroundColor: categoryObj?.backgroundColor,
                    border: `1px solid ${
                      categoryObj ? darkenColor(categoryObj.backgroundColor, 10) : "black"
                    }`
                  }}
                  onClick={() =>
                    updateEntryCategory(entry.date, entry._id || entry.originalIndex, null)
                  }
                >
                  {entry.category}
                </span>
              ) : (
                <div>
                  {categories.map((cat: Category) => (
                    <button
                      key={cat.name}
                      style={{
                        backgroundColor: cat.backgroundColor,
                        border: `1px solid ${darkenColor(cat.backgroundColor, 10)}`
                      }}
                      onClick={() =>
                        updateEntryCategory(entry.date, entry._id || entry.originalIndex, cat.name)
                      }
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
              <div>
                <SubEntry entryId={entry._id || entry.originalIndex.toString()} />
                <span onClick={() => toggleEntryDone(entry.date, entry.originalIndex)}>
                  {entry.text}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default EntryList
