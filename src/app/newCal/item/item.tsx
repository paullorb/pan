"use client";
import React, { useState } from "react";
import { useCalendar } from "../cal/calendarContext";
import styles from "./item.module.css";
import { getDateKey } from "./utils";

const Item: React.FC = () => {
  const [items, setItems] = useState<{ [date: string]: string[] }>({});
  const [input, setInput] = useState("");

  const { selectedDate } = useCalendar();
  const keyDate = getDateKey(selectedDate);

  const handleAddItem = () => {
    if (input.trim() === "") return;
    setItems((prevItems) => {
      const prevList = prevItems[keyDate] || [];
      return { ...prevItems, [keyDate]: [...prevList, input.trim()] };
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
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
