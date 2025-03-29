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
        const borderColor = selectedCat ? darkenColor(selectedCat.backgroundColor, 10) : "black";

        return (
          <li
            key={key}
            className={`${styles.item} ${entry.done ? styles.done : ""}`}
            style={{ border: `3px solid ${borderColor}`, position: "relative" }}
          >
            {selectedCategory && selectedCat && !openCategories[key] && (
              <span
                className={styles.categoryFloating}
                style={{
                  backgroundColor: selectedCat.backgroundColor,
                  border: `1px solid ${darkenColor(selectedCat.backgroundColor, 10)}`,
                }}
                onClick={() =>
                  setOpenCategories((prev) => ({ ...prev, [key]: true }))
                }
              >
                {selectedCategory}
              </span>
            )}
            <span
              className={styles.entryText}
              onClick={() => toggleEntryDone(entry.date, entry.originalIndex)}
            >
              {entry.text}
            </span>
            <div className={styles.categoryContainer}>
              {(selectedCategory === null || openCategories[key]) &&
                categories.map((cat: Category) => (
                  <button
                    key={cat.name}
                    className={styles.categoryButton}
                    style={{
                      backgroundColor: cat.backgroundColor,
                      border: `1px solid ${darkenColor(cat.backgroundColor, 10)}`,
                    }}
                    onClick={() => {
                      updateEntryCategory(
                        entry.date,
                        entry._id || entry.originalIndex,
                        cat.name
                      );
                      setOpenCategories((prev) => ({ ...prev, [key]: false }));
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default EntryList;
