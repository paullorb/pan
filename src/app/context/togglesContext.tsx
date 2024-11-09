// context/togglesContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { TogglesState, DEFAULT_TOGGLE_STATE } from '../lib/models/types';

interface TogglesContextType {
  togglesState: TogglesState;
  setTogglesState: React.Dispatch<React.SetStateAction<TogglesState>>;
  isInitialized: boolean;
}

export const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

export const TogglesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [togglesState, setTogglesState] = useState<TogglesState>(DEFAULT_TOGGLE_STATE);

  useEffect(() => {
    const storedToggles = localStorage.getItem('togglesState');
    if (storedToggles) {
      setTogglesState(JSON.parse(storedToggles));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('togglesState', JSON.stringify(togglesState));
    }
  }, [togglesState, isInitialized]);

  return (
    <TogglesContext.Provider value={{ togglesState, setTogglesState, isInitialized }}>
      {children}
    </TogglesContext.Provider>
  );
};