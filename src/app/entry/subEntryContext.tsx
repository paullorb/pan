"use client";
import React, { createContext, useContext, useState } from "react";

const SubEntryContext = createContext<any>(null);

export const SubEntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subEntries, setSubEntries] = useState<any[]>([]);

  const fetchSubEntries = async (entryId: string) => {
    const res = await fetch(`/api/subentry?entryId=${entryId}`);
    const data = await res.json();
    setSubEntries(data.subEntries);
  };

  const addSubEntry = async (entryId: string, text: string) => {
    const res = await fetch("/api/subentry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, text })
    });
    if (res.ok) {
      const data = await res.json();
      setSubEntries(prev => [...prev, data.subEntry]);
    }
  };

  const toggleSubEntry = async (subEntryId: string) => {
    const res = await fetch("/api/subentry", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subEntryId })
    });
    if (res.ok) {
      setSubEntries(prev =>
        prev.map(sub => sub._id === subEntryId ? { ...sub, done: !sub.done } : sub)
      );
    }
  };

  const markAllDone = async (entryId: string) => {
    const res = await fetch("/api/subentry/mark-all", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId })
    });
    if (res.ok) {
      setSubEntries(prev =>
        prev.map(sub => sub.entryId === entryId ? { ...sub, done: true } : sub)
      );
    }
  };

  return (
    <SubEntryContext.Provider value={{ subEntries, fetchSubEntries, addSubEntry, toggleSubEntry, markAllDone }}>
      {children}
    </SubEntryContext.Provider>
  );
};

export const useSubEntry = () => {
  const context = useContext(SubEntryContext);
  if (!context) throw new Error("useSubEntry must be used within a SubEntryProvider");
  return context;
};
