/**
 * STEP 2: Color Utility Functions
 *
 * This file provides utility functions for generating random colors for tablets.
 */

const TABLET_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52BE80',
  '#EC7063',
  '#5DADE2',
  '#F4D03F',
  '#AED6F1',
  '#A9DFBF',
];

export const generateRandomColor = (): string => {
  return TABLET_COLORS[Math.floor(Math.random() * TABLET_COLORS.length)];
};
