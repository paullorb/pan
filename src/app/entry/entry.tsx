'use client';
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useCalendar } from "../cal/calendarContext";
import { useEntry } from "./entryContext";
import styles from "./entry.module.css";
import { getDateKey } from "./utils";
import { useAuth } from "../nav/authContext";
import EntryList from "./entryList";
import EntryInput from "./entryInput";
import Filter from "app/filter/filter";

const Entry: React.FC = () => {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
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
      fetch("/api/filter", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setFilter(data.filter))
        .catch((err) =>
          console.error("Error fetching filter preference:", err)
        );
    }
  }, [user]);

  const handleFilterChange = (value: string | null) => {
    setFilter(value);
    if (user) {
      fetch("/api/filter", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ filter: value }),
      }).catch((err) =>
        console.error("Error updating filter preference:", err)
      );
    }
  };

  useEffect(() => {
    if (user) fetchDayEntries(keyDate);
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
  const totalCount = selectedEntries.length;
  const openCount = selectedEntries.filter((entry) => !entry.done).length;
  const filteredEntries =
    filter === "open"
      ? selectedEntries.filter((entry) => !entry.done)
      : selectedEntries;

  return (
    <div className={styles.container}>
      <Filter
        filter={filter}
        onFilterChange={handleFilterChange}
        totalCount={totalCount}
        openCount={openCount}
      />
      <EntryInput
        input={input}
        onChange={setInput}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
      <EntryList entries={filteredEntries} />
    </div>
  );
};

export default Entry;
