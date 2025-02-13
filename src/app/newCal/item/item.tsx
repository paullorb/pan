"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCalendar } from "../cal/calendarContext";
import { useItems } from "./itemContext";
import styles from "./item.module.css";
import { getDateKey } from "./utils";
import EntryContext from "../context/entryContext";
import { useContextContext } from "../context/contextContext";

const Item: React.FC = () => {
  const [input, setInput] = useState("");
  const { selectedDate } = useCalendar();
  const { addItem, items, updateItemContext } = useItems();
  const { selectedContext } = useContextContext();
  const keyDate = getDateKey(selectedDate);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedDate]);

  const handleAddItem = () => {
    if (input.trim() === "") return;
    addItem(keyDate, input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddItem();
  };

  const allItems = items[keyDate] || [];
  const filteredItems = selectedContext
    ? allItems.filter(item => item.context === selectedContext)
    : allItems;

  return (
    <div className={styles.container}>
      {filteredItems.length > 0 ? (
        <ul className={styles.list}>
          {filteredItems.map((item, index) => (
            <li key={index} className={styles.item}>
              <div className={styles.itemContent}>
                <EntryContext
                  entryContext={item.context}
                  onContextChange={(newContext) =>
                    updateItemContext(keyDate, index, newContext)
                  }
                />
                <span className={styles.itemText}>{item.text}</span>
              </div>
            </li>
          ))}
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
  );
};

export default Item;
