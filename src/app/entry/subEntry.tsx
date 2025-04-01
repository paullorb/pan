"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./subentry.module.css";

interface SubEntryItem {
  _id: string;
  entryId: string;
  text: string;
  done: boolean;
}

interface SubEntryProps {
  entryId: string;
}

const SubEntry: React.FC<SubEntryProps> = ({ entryId }) => {
  const [subEntries, setSubEntries] = useState<SubEntryItem[]>([]);
  const [isInputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSubEntries = async () => {
      const res = await fetch(`/api/subentry?entryId=${entryId}`);
      if (res.ok) {
        const data = await res.json();
        setSubEntries(data.subEntries);
      }
    };
    fetchSubEntries();
  }, [entryId]);

  useEffect(() => {
    if (isInputActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  const handleBlur = () => {
    setInputActive(false);
    setInputValue("");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const res = await fetch("/api/subentry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, text: inputValue.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubEntries(prev => [...prev, data.subEntry]);
      }
      setInputValue("");
      setInputActive(false);
    }
  };

  const toggleSubEntryDone = async (subEntryId: string, index: number) => {
    const res = await fetch("/api/subentry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subEntryId }),
    });
    if (res.ok) {
      const data = await res.json();
      setSubEntries(prev => {
        const newSubs = [...prev];
        newSubs[index] = data.subEntry;
        return newSubs;
      });
    }
  };

  return (
    <div className={styles.subEntryContainer}>
      {isInputActive ? (
        <div className={styles.subEntryInput}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="subentry"
          />
        </div>
      ) : (
        <button onClick={() => setInputActive(true)} className={styles.plusButton}>
          +
        </button>
      )}
      {subEntries.map((sub, i) => (
        <span
          key={sub._id}
          onClick={() => toggleSubEntryDone(sub._id, i)}
          className={`${styles.subEntry} ${sub.done ? styles.done : ""}`}
        >
          {sub.text}
        </span>
      ))}
    </div>
  );
};

export default SubEntry;