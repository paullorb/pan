'use client';
import React from "react";
import styles from "./entry.module.css";

interface EntryItem {
  text: string;
}

interface EntryListProps {
  entries: EntryItem[];
}

const EntryList: React.FC<EntryListProps> = ({ entries }) => {

  if (entries.length === 0) return <p>No entries yet.</p>;
  return (
    <ul className={styles.list}>
      {entries.map((entry, index) => (
        <li key={index} className={styles.item}>
          <span className={styles.entryText}>{entry.text}</span>
        </li>
      ))}
    </ul>
  );
};

export default EntryList;
