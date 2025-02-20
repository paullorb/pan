'use client';
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useCalendar } from "../cal/calendarContext";
import { useEntry } from "./entryContext";
import styles from "./entry.module.css";
import { getDateKey } from "./utils";
import { useAuth } from "../nav/authContext";
import EntryList from "./entryList";
import EntryInput from "./entryInput";

const Entry: React.FC = () => {
  const [input, setInput] = useState("");
  const { selectedDate } = useCalendar();
  const { addEntry, entries, fetchDayEntries } = useEntry();
  const { user } = useAuth();
  const keyDate = useMemo(() => getDateKey(selectedDate), [selectedDate]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedDate]);

  useEffect(() => {
    if (user) {
      fetchDayEntries(keyDate);
    }
  }, [keyDate, user, fetchDayEntries]);

  const handleAddEntry = () => {
    if (input.trim() === "") return;
    addEntry(keyDate, input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddEntry();
  };

  const selectedEntries = entries[keyDate] || [];

  return (
    <div className={styles.container}>
      <EntryList entries={selectedEntries} />
      <EntryInput
        input={input}
        onChange={setInput}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
    </div>
  );
};

export default Entry;
