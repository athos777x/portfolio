"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface CursorContextType {
  cursorState: 'default' | 'hover' | 'grabbing';
  setCursorState: (state: 'default' | 'hover' | 'grabbing') => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'grabbing'>('default');

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
