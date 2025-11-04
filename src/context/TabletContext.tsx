/**
 * STEP 2: Tablet Context API Setup
 *
 * This context manages the global state for all tablets in the application.
 * It provides methods to add, update, and split tablets.
 *
 * Features:
 * - Centralized state management using React Context API
 * - Reusable hooks for accessing tablet state
 * - Functions to manipulate tablet data
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Tablet } from '../types/tablet.types';
import { generateRandomColor } from '../utils/color.utils';
import { DEFAULT_BORDER_RADIUS } from '../constants/tablet.constants';

interface TabletContextType {
  tablets: Tablet[];
  addTablet: (tablet: Omit<Tablet, 'id' | 'color'>) => void;
  updateTablet: (id: string, updates: Partial<Tablet>) => void;
  removeTablet: (id: string) => void;
  splitTablets: (splitLines: { x?: number; y?: number }) => void;
  clearAllTablets: () => void;
}

const TabletContext = createContext<TabletContextType | undefined>(undefined);

export const TabletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tablets, setTablets] = useState<Tablet[]>([]);

  const addTablet = useCallback((tabletData: Omit<Tablet, 'id' | 'color'>) => {
    const newTablet: Tablet = {
      ...tabletData,
      id: `tablet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      color: generateRandomColor(),
      borderRadius: tabletData.borderRadius ?? DEFAULT_BORDER_RADIUS,
    };

    setTablets(prev => [...prev, newTablet]);
  }, []);

  const updateTablet = useCallback((id: string, updates: Partial<Tablet>) => {
    setTablets(prev =>
      prev.map(tablet =>
        tablet.id === id ? { ...tablet, ...updates } : tablet,
      ),
    );
  }, []);

  const removeTablet = useCallback((id: string) => {
    setTablets(prev => prev.filter(tablet => tablet.id !== id));
  }, []);

  const splitTablets = useCallback((splitLines: { x?: number; y?: number }) => {
    // TODO: Implement splitting logic in next step
    console.log('Split tablets at:', splitLines);
  }, []);

  const clearAllTablets = useCallback(() => {
    setTablets([]);
  }, []);

  const value: TabletContextType = {
    tablets,
    addTablet,
    updateTablet,
    removeTablet,
    splitTablets,
    clearAllTablets,
  };

  return (
    <TabletContext.Provider value={value}>{children}</TabletContext.Provider>
  );
};

export const useTablets = (): TabletContextType => {
  const context = useContext(TabletContext);
  if (context === undefined) {
    throw new Error('useTablets must be used within a TabletProvider');
  }
  return context;
};
