// entryContext.tsx
'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useAuth } from "../auth/authContext";
import { getDateKey } from "./utils";

export interface Entry {
  _id?: string;
  text: string;
  done: boolean;
  context: string | null;
  userId: string;
  date: string;
}

interface EntryContextType {
  entries: { [date: string]: Entry[] };
  addEntry: (date: string, text: string) => Promise<void>;
  updateEntryContext: (date: string, index: number, context: string | null) => void;
  fetchMonthEntries: (month: number, year: number) => Promise<void>;
  fetchDayEntries: (date: string) => Promise<void>;
  toggleEntryDone: (date: string, index: number) => Promise<void>;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<{ [date: string]: Entry[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMonthEntries = useCallback(async (month: number, year: number) => {
    if (!user) return;
    try {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      const startStr = getDateKey(startDate);
      const endStr = getDateKey(endDate);
      const res = await fetch(`/api/entry?startDate=${startStr}&endDate=${endStr}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data: Entry[] = await res.json();
      const grouped: { [date: string]: Entry[] } = {};
      data.forEach((entry) => {
        const key = getDateKey(new Date(entry.date));
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push({ ...entry, date: key });
      });
      setEntries(grouped);
    } catch (error) {
      console.error("Error fetching month entries:", error);
    }
  }, [user]);

  const fetchDayEntries = useCallback(async (dateStr: string) => {
    if (!user) return;
    try {
      const dayDate = new Date(dateStr);
      const formattedDate = getDateKey(dayDate);
      const res = await fetch(`/api/entry?startDate=${formattedDate}&endDate=${formattedDate}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch day entries");
      const data: Entry[] = await res.json();
      const normalizedEntries = data.map((entry) => ({ ...entry, date: formattedDate }));
      setEntries((prev) => ({ ...prev, [formattedDate]: normalizedEntries }));
    } catch (error) {
      console.error("Error fetching day entries:", error);
    }
  }, [user]);

  const addEntry = async (date: string, text: string) => {
    if (!user) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newEntry = { date, text, context: null, done: false };
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error("Failed to save entry");
      await fetchDayEntries(date);
    } catch (error) {
      console.error("Error in addEntry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEntryContext = (date: string, index: number, context: string | null) => {
    setEntries((prev) => {
      const prevList = prev[date] || [];
      const newList = [...prevList];
      if (newList[index]) newList[index] = { ...newList[index], context };
      return { ...prev, [date]: newList };
    });
  };

  const toggleEntryDone = async (date: string, index: number) => {
    if (!user) return;
    const list = entries[date] || [];
    if (!list[index]) return;
    const entry = list[index];
    const newDone = !entry.done;
    try {
      const res = await fetch("/api/entry", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ id: entry._id, done: newDone }),
      });
      if (!res.ok) throw new Error("Error updating entry");
      setEntries((prev) => {
        const list = prev[date] || [];
        const newList = [...list];
        newList[index] = { ...newList[index], done: newDone };
        return { ...prev, [date]: newList };
      });
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

  useEffect(() => {
    if (!user) setEntries({});
  }, [user]);

  return (
    <EntryContext.Provider
      value={{
        entries,
        addEntry,
        updateEntryContext,
        fetchMonthEntries,
        fetchDayEntries,
        toggleEntryDone,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntry = (): EntryContextType => {
  const context = useContext(EntryContext);
  if (!context) throw new Error("useEntry must be used within an EntryProvider");
  return context;
};
