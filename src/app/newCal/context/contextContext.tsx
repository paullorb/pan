// contextContext.tsx

"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { defaultContexts, ContextConfig } from "./utils";

interface ContextContextType {
  selectedContext: ContextConfig | null;
  setSelectedContext: (context: ContextConfig | null) => void;
  contexts: ContextConfig[];
}

const ContextContext = createContext<ContextContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contexts: ContextConfig[] = defaultContexts;
  const [selectedContext, setSelectedContext] = useState<ContextConfig | null>(null);
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
