import React from "react"
import styles from "./entry.module.css"

interface EntryItem {
  text: string
}

interface EntryListProps {
  items: EntryItem[]
}

const EntryList: React.FC<EntryListProps> = ({ items }) => {
  if (items.length === 0) return <p>No items yet.</p>
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          <span className={styles.itemText}>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

export default EntryList
