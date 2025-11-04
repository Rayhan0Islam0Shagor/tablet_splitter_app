/**
 * STEP 2: Tablet Type Definitions
 *
 * This file defines the TypeScript interfaces and types for tablets.
 * Each tablet represents a box with rounded corners that can be split and moved.
 */

export interface Tablet {
  id: string;
  x: number; // X coordinate position (top-left corner)
  y: number; // Y coordinate position (top-left corner)
  width: number; // Width of the tablet
  height: number; // Height of the tablet
  color: string;
  borderRadius: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface SplitLines {
  x?: number; // Vertical line at x position
  y?: number; // Horizontal line at y position
}
