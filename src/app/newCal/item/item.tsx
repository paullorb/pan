"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCalendar } from "../cal/calendarContext";
import { useItems } from "./itemContext";
import styles from "./item.module.css";
import { getDateKey } from "./utils";

const Item: React.FC = () => {
  const [input, setInput] = useState("");
  const { selectedDate } = useCalendar();
  const { addItem, items } = useItems();
  const keyDate = getDateKey(selectedDate);
  
  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Whenever the selected date changes, focus the input field
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
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p></p>
      )}
      <div>
        <input
          ref={inputRef}  // Attach the ref here
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="new item"
          onKeyDown={handleKeyDown}
          autoFocus  // Optional: still have autoFocus on initial mount
        />
      </div>
    </div>
  );
};

export default Item;
