// entryList.tsx
import React from "react";
import styles from "./entry.module.css";
import { useEntry, Entry } from "./entryContext";

interface EntryListProps {
  entries: Entry[];
}

const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const { toggleEntryDone } = useEntry();
  if (entries.length === 0) return <p>No entries yet.</p>;

  const sortedEntries = entries
    .map((entry, index) => ({ ...entry, originalIndex: index }))
    .sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));

  return (
    <ul className={styles.list}>
      {sortedEntries.map((entry, sortedIndex) => (
        <li
          key={sortedIndex}
          className={`${styles.item} ${entry.done ? styles.done : ""}`}
          onClick={() => toggleEntryDone(entry.date, entry.originalIndex)}
        >
          <span className={styles.entryText}>{entry.text}</span>
        </li>
      ))}
    </ul>
  );
};

export default EntryList;
