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

  // Fetch entries for the selected date when keyDate changes.
  useEffect(() => {
    if (user) {
      fetchDayEntries(keyDate);
    }
  }, [keyDate, user, fetchDayEntries]);

  // Test: log the entries for the selected date.
  console.log("Entry component - selected date key:", keyDate, "Entries:", entries[keyDate]);

  const handleAddEntry = () => {
    if (input.trim() === "") return;
    addEntry(keyDate, input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddEntry();
  };

  // Filter entries by the logged-in user.
  const selectedEntries = (entries[keyDate] || []).filter(
    (entry) => entry.userId === user?.id
  );

  return (
    <div className={styles.container}>
      <EntryList entries={selectedEntries} />
      <EntryInput input={input} onChange={setInput} onKeyDown={handleKeyDown} inputRef={inputRef} />
    </div>
  );
};

export default Entry;
