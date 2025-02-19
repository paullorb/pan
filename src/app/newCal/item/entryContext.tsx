'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "../nav/authContext";
import { getDateKey } from "../item/utils"; 

export interface Entry {
  text: string;
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
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<{ [date: string]: Entry[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMonthEntries = useCallback(
    async (month: number, year: number) => {
      if (!user) return;
      try {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        const startStr = getDateKey(startDate);
        const endStr = getDateKey(endDate);
        const res = await fetch(
          `/api/entry?startDate=${startStr}&endDate=${endStr}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch entries");
        const data: Entry[] = await res.json();
        const grouped: { [date: string]: Entry[] } = {};
        data.forEach((entry) => {
          const key = entry.date;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(entry);
        });
        setEntries(grouped);
      } catch (error) {
        console.error("Error fetching month entries:", error);
      }
    },
    [user]
  );

  const fetchDayEntries = useCallback(
    async (dateStr: string) => {
      if (!user) return;
      try {
        // Ensure the date is formatted correctly.
        const dayDate = new Date(dateStr);
        const formattedDate = getDateKey(dayDate);
        const res = await fetch(
          `/api/entry?startDate=${formattedDate}&endDate=${formattedDate}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch day entries");
        const data: Entry[] = await res.json();
        setEntries((prev) => ({ ...prev, [formattedDate]: data }));
      } catch (error) {
        console.error("Error fetching day entries:", error);
      }
    },
    [user]
  );

  const addEntry = async (date: string, text: string) => {
    if (!user) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newEntry = { date, text, context: null };
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
