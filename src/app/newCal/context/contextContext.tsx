"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type ContextType = "personal" | "work" | "social";

interface ContextContextType {
  selectedContext: ContextType | null;
  setSelectedContext: (context: ContextType | null) => void;
  contexts: ContextType[];
}

const ContextContext = createContext<ContextContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contexts: ContextType[] = ["personal", "work", "social"];
  const [selectedContext, setSelectedContext] = useState<ContextType | null>(null);
  return (
    <ContextContext.Provider value={{ selectedContext, setSelectedContext, contexts }}>
      {children}
    </ContextContext.Provider>
  );
};

export const useContextContext = (): ContextContextType => {
  const context = useContext(ContextContext);
  if (!context) {
    throw new Error("useContextContext must be used within a ContextProvider");
  }
  return context;
};
