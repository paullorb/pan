// togglesContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from "react";

// Export the TogglesState interface
export interface TogglesState {
  hours: boolean;
  priorities: boolean;
  tasks: boolean;
  month: boolean;
  date: boolean;
  momentum: boolean;
}

// Define the context type
interface TogglesContextType {
  togglesState: TogglesState;
  setTogglesState: React.Dispatch<React.SetStateAction<TogglesState>>;
}

// Create the context with default undefined value
export const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

// Create the provider component
interface TogglesProviderProps {
  children: ReactNode;
}

export const TogglesProvider: React.FC<TogglesProviderProps> = ({ children }) => {
  const [togglesState, setTogglesState] = useState<TogglesState>({
    hours: false,
    priorities: false,
    tasks: false,
    month: false,
    date: false,
    momentum: false,
  });

  return (
    <TogglesContext.Provider value={{ togglesState, setTogglesState }}>
      {children}
    </TogglesContext.Provider>
  );
};
