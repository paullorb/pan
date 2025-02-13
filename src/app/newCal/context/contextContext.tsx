"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContextContextType {
  selectedContext: string | null;
  setSelectedContext: (context: string | null) => void;
  contexts: string[];
}

const ContextContext = createContext<ContextContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contexts = ["personal", "work", "social"];
  const [selectedContext, setSelectedContext] = useState<string | null>(null);

  return (
    <ContextContext.Provider value={{ selectedContext, setSelectedContext, contexts }}>
      {children}
    </ContextContext.Provider>
  );
};

export const useContextContext = (): ContextContextType => {
  const context = useContext(ContextContext);
  if (context === undefined) {
    throw new Error("useContextContext must be used within a ContextProvider");
  }
  return context;
};
