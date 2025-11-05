import { Tablet } from '../types/tablet.types';
import {
  MIN_TABLET_WIDTH,
  MIN_TABLET_HEIGHT,
} from '../constants/tablet.constants';

export interface Point {
  x: number;
  y: number;
}

export interface TabletDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if a point is inside a tablet
 */
export const isPointInTablet = (point: Point, tablet: Tablet): boolean => {
  return (
    point.x >= tablet.x &&
    point.x <= tablet.x + tablet.width &&
    point.y >= tablet.y &&
    point.y <= tablet.y + tablet.height
  );
};

/**
 * Check if touch point is on an existing tablet
 */
export const isTouchOnTablet = (
  touchX: number,
  touchY: number,
  tablets: Tablet[],
): boolean => {
  return tablets.some(tablet =>
    isPointInTablet({ x: touchX, y: touchY }, tablet),
  );
};

/**
 * Find the tablet that contains the given touch point
 * Searches from the end of the array to find the topmost tablet (last rendered = topmost)
 * @returns The topmost tablet that contains the point, or null if none found
 */
export const findTabletAtPoint = (
  touchX: number,
  touchY: number,
  tablets: Tablet[],
): Tablet | null => {
  // Search backwards through the array to find the topmost tablet
  // (last in array = rendered on top = highest z-index)
  for (let i = tablets.length - 1; i >= 0; i--) {
    const tablet = tablets[i];
    if (isPointInTablet({ x: touchX, y: touchY }, tablet)) {
      return tablet;
    }
  }
  return null;
};

/**
 * Calculate tablet dimensions from drag positions
 * Ensures minimum size requirements are met
 */
export const calculateTabletDimensions = (
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
): TabletDimensions => {
  const minX = Math.min(startX, currentX);
  const minY = Math.min(startY, currentY);
  const maxX = Math.max(startX, currentX);
  const maxY = Math.max(startY, currentY);

  let width = maxX - minX;
  let height = maxY - minY;

  // Enforce minimum size
  if (width < MIN_TABLET_WIDTH) {
    width = MIN_TABLET_WIDTH;
  }
  if (height < MIN_TABLET_HEIGHT) {
    height = MIN_TABLET_HEIGHT;
  }

  // Adjust position if we had to increase size
  let x = minX;
  let y = minY;

  // If we're dragging left/up, adjust position to maintain minimum size
  if (currentX < startX && width > maxX - minX) {
    x = Math.max(0, startX - width);
  }
  if (currentY < startY && height > maxY - minY) {
    y = Math.max(0, startY - height);
  }

  return { x, y, width, height };
};
