"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./subentry.module.css";

interface SubEntryItem {
  text: string;
  done: boolean;
}

const SubEntry: React.FC = () => {
  const [subEntries, setSubEntries] = useState<SubEntryItem[]>([]);
  const [isInputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInputActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isInputActive && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setInputActive(false);
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isInputActive]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      setSubEntries(prev => [...prev, { text: inputValue.trim(), done: false }]);
      setInputValue("");
      setInputActive(false);
    }
  };

  const toggleSubEntryDone = (index: number) => {
    setSubEntries(prev => {
      const newSubs = [...prev];
      newSubs[index] = { ...newSubs[index], done: !newSubs[index].done };
      return newSubs;
    });
  };

  return (
    <div ref={containerRef} className={styles.subEntryContainer}>
      {isInputActive ? (
        <div className={styles.subEntryInput}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="subentry"
          />
        </div>
      ) : (
        <button onClick={() => setInputActive(true)} className={styles.plusButton}>+</button>
      )}
      {/* You can decide to render previously added subentries here if needed */}
      {!isInputActive &&
        subEntries.map((sub, i) => (
          <span
            key={i}
            onClick={() => toggleSubEntryDone(i)}
            className={`${styles.subEntry} ${sub.done ? styles.done : ""}`}
          >
            {sub.text}
          </span>
        ))
      }
    </div>
  );
};

export default SubEntry;
