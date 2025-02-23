import React, { useState } from "react";
import styles from "./entry.module.css";
import { useEntry, Entry } from "./entryContext";
import { useCategory, Category } from "../category/categoryContext";
import { darkenColor } from "../category/utils";

interface EntryListProps {
  entries: Entry[];
}

const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const { toggleEntryDone, updateEntryCategory } = useEntry();
  const categories = useCategory();
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  const sortedEntries = entries
    .map((entry, index) => ({ ...entry, originalIndex: index }))
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  return (
    <ul className={styles.list}>
      {sortedEntries.map((entry) => {
        const key = entry._id || entry.originalIndex.toString();
        const selectedCategory = entry.category;
        const selectedCat = categories.find((cat: Category) => cat.name === selectedCategory);
        return (
          <li key={key} className={`${styles.item} ${entry.done ? styles.done : ""}`}>
            <span
              className={styles.entryText}
              onClick={() => toggleEntryDone(entry.date, entry.originalIndex)}
            >
              {entry.text}
            </span>
            <div className={styles.categoryContainer}>
              {(selectedCategory === null || openCategories[key]) ? (
                categories.map((cat: Category) => (
                  <button
                    key={cat.name}
                    className={styles.categoryButton}
                    style={{
                      backgroundColor: cat.backgroundColor,
                      border: `1px solid ${darkenColor(cat.backgroundColor, 10)}`,
                    }}
                    onClick={() => {
                      updateEntryCategory(entry.date, entry._id || entry.originalIndex, cat.name);
                      setOpenCategories((prev) => ({ ...prev, [key]: false }));
                    }}
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <button
                  className={styles.categoryButton}
                  style={
                    selectedCat
                      ? {
                          backgroundColor: selectedCat.backgroundColor,
                          border: `1px solid ${darkenColor(selectedCat.backgroundColor, 10)}`,
                        }
                      : {}
                  }
                  onClick={() => {
                    // Unselect the category: send PATCH with null and show full list
                    updateEntryCategory(entry.date, entry._id || entry.originalIndex, null);
                    setOpenCategories((prev) => ({ ...prev, [key]: true }));
                  }}
                >
                  {selectedCategory}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default EntryList;
