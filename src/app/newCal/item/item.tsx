"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCalendar } from "../cal/calendarContext";
import { useItems } from "./itemContext";
import styles from "./item.module.css";
import { getDateKey } from "./utils";
import Context from "../context/context";

const Item: React.FC = () => {
  const [input, setInput] = useState("");
  const { selectedDate } = useCalendar();
  const { addItem, items } = useItems();
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

  const itemList = items[keyDate] || [];

  return (
    <div className={styles.container}>
      {itemList.length > 0 ? (
        <ul>
          {itemList.map((item, index) => (
            <li key={index} className={styles.item}>
              <span className={styles.itemText}>{item.toString()}</span>
              <Context />
            </li>
          ))}
        </ul>
      ) : (
        <p>No items yet.</p>
      )}
      <div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="new item"
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Item;
