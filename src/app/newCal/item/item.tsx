"use client";
import React, { useState } from "react";
import { useCalendar } from "../cal/calendarContext";
import styles from "./item.module.css";
import { getDateKey } from "./utils";

const ItemManager: React.FC = () => {
  const [items, setItems] = useState<{ [date: string]: string[] }>({});
  const [contexts, setContexts] = useState<string[]>(["General", "Work", "Personal"]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"item" | "context">("item");

  const { selectedDate } = useCalendar();
  const keyDate = getDateKey(selectedDate);

  const handleAddEntry = () => {
    if (input.trim() === "") return;
    if (mode === "item") {
      setItems((prev) => {
        const prevList = prev[keyDate] || [];
        return { ...prev, [keyDate]: [...prevList, input.trim()] };
      });
    } else {
      setContexts((prev) => [...prev, input.trim()]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddEntry();
  };

  return (
    <div className={styles.container}>
      <div className={styles.modeToggle}>
        <button onClick={() => setMode("item")} className={mode === "item" ? styles.active : ""}>
          Item
        </button>
        <button onClick={() => setMode("context")} className={mode === "context" ? styles.active : ""}>
          Context
        </button>
      </div>
      {mode === "item" ? (
        items[keyDate] && items[keyDate].length > 0 ? (
          <ul>
            {items[keyDate].map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>No items for this day yet.</p>
        )
      ) : contexts.length > 0 ? (
        <ul>
          {contexts.map((context, index) => (
            <li key={index}>{context}</li>
          ))}
        </ul>
      ) : (
        <p>No contexts available.</p>
      )}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "item" ? "new item" : "new context"}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
};

export default ItemManager;
