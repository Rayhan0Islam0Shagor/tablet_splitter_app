/**
 * STEP 2 & 5: Tablet Context API Setup with Splitting
 *
 * This context manages the global state for all tablets in the application.
 * It provides methods to add, update, and split tablets.
 *
 * Features:
 * - Centralized state management using React Context API
 * - Reusable hooks for accessing tablet state
 * - Functions to manipulate tablet data
 * - Split tablets along horizontal and/or vertical lines
 * - Split parts retain original color and corner radius
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Tablet } from '../types/tablet.types';
import { generateUniqueColor } from '../utils/color.utils';
import { DEFAULT_BORDER_RADIUS } from '../constants/tablet.constants';
import { tabletIntersectsSplitLines, splitTablet } from '../utils/tablet.utils';

interface TabletContextType {
  tablets: Tablet[];
  addTablet: (tablet: Omit<Tablet, 'id' | 'color'>) => void;
  updateTablet: (id: string, updates: Partial<Tablet>) => void;
  removeTablet: (id: string) => void;
  splitTablets: (splitLines: { x?: number; y?: number }) => void;
  clearAllTablets: () => void;
  bringToTop: (id: string) => void;
}

const TabletContext = createContext<TabletContextType | undefined>(undefined);

export const TabletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tablets, setTablets] = useState<Tablet[]>([]);

  const addTablet = useCallback((tabletData: Omit<Tablet, 'id' | 'color'>) => {
    setTablets(prev => {
      // Get all currently used colors
      const usedColors = prev.map(tablet => tablet.color);

      // Generate a unique color that hasn't been used
      const uniqueColor = generateUniqueColor(usedColors);

      const newTablet: Tablet = {
        ...tabletData,
        id: `tablet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        color: uniqueColor,
        borderRadius: tabletData.borderRadius ?? DEFAULT_BORDER_RADIUS,
      };

      return [...prev, newTablet];
    });
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
    setTablets(prev => {
      // Early return if no split lines
      if (splitLines.x === undefined && splitLines.y === undefined) {
        return prev;
      }

      const tabletsToSplit: Tablet[] = [];
      const tabletsToKeep: Tablet[] = [];

      // Split all tablets that intersect split lines
      prev.forEach(tablet => {
        if (tabletIntersectsSplitLines(tablet, splitLines)) {
          tabletsToSplit.push(tablet);
        } else {
          tabletsToKeep.push(tablet);
        }
      });

      // If no tablets to split, return unchanged
      if (tabletsToSplit.length === 0) {
        return prev;
      }

      // Split all tablets in the split list
      const splitParts: Tablet[] = [];
      // Generate unique IDs for each part using timestamp and counter
      // Use a more precise timestamp with microsecond precision simulation
      const baseTimestamp = Date.now();
      let partCounter = 0; // Counter to ensure unique IDs across all splits

      tabletsToSplit.forEach((tablet, tabletIndex) => {
        const parts = splitTablet(tablet, splitLines);
        // Generate unique IDs for each part
        parts.forEach(part => {
          // Create unique ID: timestamp + tabletIndex + partCounter + random string
          // This ensures uniqueness even if multiple tablets are split simultaneously
          const uniqueId = `split_${baseTimestamp}_${tabletIndex}_${partCounter++}_${Math.random()
            .toString(36)
            .slice(2, 15)}`;

          splitParts.push({
            ...part,
            // Explicitly set all properties to avoid any ID pollution from split functions
            id: uniqueId,
            x: part.x,
            y: part.y,
            width: part.width,
            height: part.height,
            // Preserve original color and borderRadius from the tablet
            color: tablet.color,
            borderRadius: tablet.borderRadius,
          });
        });
      });

      // Combine kept tablets with split parts
      return [...tabletsToKeep, ...splitParts];
    });
  }, []);

  const clearAllTablets = useCallback(() => {
    setTablets([]);
  }, []);

  const bringToTop = useCallback((id: string) => {
    setTablets(prev => {
      const tabletIndex = prev.findIndex(t => t.id === id);
      if (tabletIndex === -1) return prev;

      // Move the tablet to the end of the array (top z-index)
      const newTablets = [...prev];
      const [tablet] = newTablets.splice(tabletIndex, 1);
      newTablets.push(tablet);

      return newTablets;
    });
  }, []);

  const value: TabletContextType = {
    tablets,
    addTablet,
    updateTablet,
    removeTablet,
    splitTablets,
    clearAllTablets,
    bringToTop,
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
