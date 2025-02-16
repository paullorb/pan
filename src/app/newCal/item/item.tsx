"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCalendar } from "../cal/calendarContext";
import { useItems } from "./itemContext";
import styles from "./item.module.css";
import { getDateKey } from "./utils";
import EntryContext from "../context/entryContext";
import { useContextContext } from "../context/contextContext";
import { ContextConfig } from "../context/utils";

const Item: React.FC = () => {
  const [input, setInput] = useState("");
  const { selectedDate } = useCalendar();
  const { addItem, items, updateItemContext } = useItems();
  const { selectedContext, contexts } = useContextContext();
  const keyDate = getDateKey(selectedDate);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedDate]);

  const handleAddItem = async () => {
    if (input.trim() === "") return;
    const newEntry = {
      date: keyDate,
      text: input.trim(),
      context: selectedContext ? selectedContext.id : null,
    };
    try {
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error("Failed to save entry");
      addItem(keyDate, input.trim());
      setInput("");
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddItem();
  };

  const allItems = items[keyDate] || [];
  const filteredItems = selectedContext
    ? allItems.filter(item => item.context === selectedContext.id)
    : allItems;

  return (
    <div className={styles.container}>
      {filteredItems.length > 0 ? (
        <ul className={styles.list}>
          {filteredItems.map((item, index) => {
            const entryConfig: ContextConfig | null = item.context
              ? contexts.find(c => c.id === item.context) || null
              : null;
            return (
              <li key={index} className={styles.item}>
                <div className={styles.itemContent}>
                  <span className={styles.itemText}>{item.text}</span>
                  <EntryContext
                    entryContext={entryConfig}
                    onContextChange={(newContext) =>
                      updateItemContext(keyDate, index, newContext ? newContext.id : null)
                    }
                  />
                </div>
              </li>
            );
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
  );
};

export default Item;
