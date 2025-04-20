'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useAuth } from "../auth/authContext";
import { getDateKey } from "./utils";

export interface Entry {
  _id: string;
  text: string;
  done: boolean;
  category: string | null;
  userId: string;
  date: string;
  parentId?: string | null;
}

interface EntryContextType {
  entries: { [date: string]: Entry[] };
  addEntry: (date: string, text: string, parentId?: string) => Promise<void>;
  updateEntryCategory: (id: string, newCategory: string | null) => Promise<void>;
  fetchMonthEntries: (month: number, year: number) => Promise<void>;
  fetchDayEntries: (date: string) => Promise<void>;
  toggleEntryDone: (id: string) => Promise<void>;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<{ [date: string]: Entry[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMonthEntries = useCallback(async (month: number, year: number) => {
    if (!user) return;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const startStr = getDateKey(startDate);
    const endStr = getDateKey(endDate);
    const res = await fetch(`/api/entry?startDate=${startStr}&endDate=${endStr}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    if (!res.ok) return;
    const data: Entry[] = await res.json();
    const grouped: { [date: string]: Entry[] } = {};
    data.forEach(entry => {
      const key = getDateKey(new Date(entry.date));
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ ...entry, date: key });
    });
    setEntries(grouped);
  }, [user]);

  const fetchDayEntries = useCallback(async (dateStr: string) => {
    if (!user) return;
    const formatted = getDateKey(new Date(dateStr));
    const res = await fetch(`/api/entry?startDate=${formatted}&endDate=${formatted}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    if (!res.ok) return;
    const data: Entry[] = await res.json();
    const normalized = data.map(entry => ({ ...entry, date: formatted }));
    setEntries(prev => ({ ...prev, [formatted]: normalized }));
  }, [user]);

  const addEntry = async (date: string, text: string, parentId?: string) => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    const payload: any = { date, text, done: false, category: null };
    if (parentId) payload.parentId = parentId;
    await fetch("/api/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify(payload)
    });
    await fetchDayEntries(date);
    setIsSubmitting(false);
  };

  const updateEntryCategory = async (id: string, newCategory: string | null) => {
    setEntries(prev => {
      const updated: { [date: string]: Entry[] } = {};
      Object.keys(prev).forEach(date => {
        updated[date] = prev[date].map(entry => entry._id === id ? { ...entry, category: newCategory } : entry);
      });
      return updated;
    });
    if (!user) return;
    await fetch("/api/entry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ id, category: newCategory })
    });
  };

  const toggleEntryDone = async (id: string) => {
    const entry = Object.values(entries).flat().find(e => e._id === id);
    if (!user || !entry) return;
    const newDone = !entry.done;
    await fetch("/api/entry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ id, done: newDone })
    });
    setEntries(prev => {
      const updated: { [date: string]: Entry[] } = {};
      Object.keys(prev).forEach(date => {
        updated[date] = prev[date].map(e => e._id === id ? { ...e, done: newDone } : e);
      });
      return updated;
    });
  };

  useEffect(() => { if (!user) setEntries({}); }, [user]);

  return (
    <EntryContext.Provider value={{ entries, addEntry, updateEntryCategory, fetchMonthEntries, fetchDayEntries, toggleEntryDone }}>
      {children}
    </EntryContext.Provider>
  );
};

export const useEntry = (): EntryContextType => {
  const context = useContext(EntryContext);
  if (!context) throw new Error("useEntry must be used within an EntryProvider");
  return context;
};
