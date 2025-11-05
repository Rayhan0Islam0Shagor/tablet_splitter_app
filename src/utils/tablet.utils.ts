import { Tablet } from '../types/tablet.types';
import {
  MIN_TABLET_WIDTH,
  MIN_TABLET_HEIGHT,
  MIN_PART_WIDTH,
  MIN_PART_HEIGHT,
  SPLIT_GAP,
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

export interface SplitLines {
  x?: number; // Vertical line at x position
  y?: number; // Horizontal line at y position
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

/**
 * Check if a tablet intersects with a vertical split line
 */
export const intersectsVerticalLine = (
  tablet: Tablet,
  lineX: number,
): boolean => {
  return lineX > tablet.x && lineX < tablet.x + tablet.width;
};

/**
 * Check if a tablet intersects with a horizontal split line
 */
export const intersectsHorizontalLine = (
  tablet: Tablet,
  lineY: number,
): boolean => {
  return lineY > tablet.y && lineY < tablet.y + tablet.height;
};

/**
 * Split a tablet vertically at the given x position
 * Returns array of tablet parts (can be 1 or 2 parts)
 */
export const splitTabletVertically = (
  tablet: Tablet,
  splitX: number,
): Tablet[] => {
  const leftWidth = splitX - tablet.x;
  const rightWidth = tablet.x + tablet.width - splitX;
  const gapOffset = SPLIT_GAP / 2;

  // Check if both parts meet minimum size (accounting for gap)
  const leftValid = leftWidth - gapOffset >= MIN_PART_WIDTH;
  const rightValid = rightWidth - gapOffset >= MIN_PART_WIDTH;

  const parts: Tablet[] = [];

  if (leftValid && rightValid) {
    // Both parts are valid, create both with gap between them
    // Left part ends before the split line (with gap)
    parts.push({
      ...tablet,
      id: `${tablet.id}_left`,
      width: leftWidth - gapOffset, // Reduce width to create gap
      // Keep original x position
    });
    // Right part starts after the split line (with gap)
    parts.push({
      ...tablet,
      id: `${tablet.id}_right`,
      x: splitX + gapOffset, // Start after gap
      width: rightWidth - gapOffset, // Reduce width to create gap
    });
  } else if (leftValid) {
    // Right part too small - keep left part in original position, don't split
    // Return original tablet unchanged
    return [tablet];
  } else if (rightValid) {
    // Left part too small - keep right part in original position, don't split
    // Return original tablet unchanged
    return [tablet];
  } else {
    // Both parts too small - keep original tablet (no split)
    return [tablet];
  }

  return parts;
};

/**
 * Split a tablet horizontally at the given y position
 * Returns array of tablet parts (can be 1 or 2 parts)
 */
export const splitTabletHorizontally = (
  tablet: Tablet,
  splitY: number,
): Tablet[] => {
  const topHeight = splitY - tablet.y;
  const bottomHeight = tablet.y + tablet.height - splitY;
  const gapOffset = SPLIT_GAP / 2;

  // Check if both parts meet minimum size (accounting for gap)
  const topValid = topHeight - gapOffset >= MIN_PART_HEIGHT;
  const bottomValid = bottomHeight - gapOffset >= MIN_PART_HEIGHT;

  const parts: Tablet[] = [];

  if (topValid && bottomValid) {
    // Both parts are valid, create both with gap between them
    // Top part ends before the split line (with gap)
    parts.push({
      ...tablet,
      id: `${tablet.id}_top`,
      height: topHeight - gapOffset, // Reduce height to create gap
      // Keep original y position
    });
    // Bottom part starts after the split line (with gap)
    parts.push({
      ...tablet,
      id: `${tablet.id}_bottom`,
      y: splitY + gapOffset, // Start after gap
      height: bottomHeight - gapOffset, // Reduce height to create gap
    });
  } else if (topValid) {
    // Bottom part too small - keep top part in original position, don't split
    // Return original tablet unchanged
    return [tablet];
  } else if (bottomValid) {
    // Top part too small - keep bottom part in original position, don't split
    // Return original tablet unchanged
    return [tablet];
  } else {
    // Both parts too small - keep original tablet (no split)
    return [tablet];
  }

  return parts;
};

/**
 * Split a tablet along both horizontal and vertical lines
 * Returns array of tablet parts (can be 1-4 parts)
 */
export const splitTabletBothWays = (
  tablet: Tablet,
  splitX: number,
  splitY: number,
): Tablet[] => {
  // First split vertically, then split each part horizontally
  const verticalParts = splitTabletVertically(tablet, splitX);
  const allParts: Tablet[] = [];

  verticalParts.forEach(part => {
    const horizontalParts = splitTabletHorizontally(part, splitY);
    allParts.push(...horizontalParts);
  });

  return allParts;
};

/**
 * Check if a tablet intersects with split lines
 */
export const tabletIntersectsSplitLines = (
  tablet: Tablet,
  splitLines: SplitLines,
): boolean => {
  const intersectsVertical =
    splitLines.x !== undefined && intersectsVerticalLine(tablet, splitLines.x);
  const intersectsHorizontal =
    splitLines.y !== undefined &&
    intersectsHorizontalLine(tablet, splitLines.y);

  return intersectsVertical || intersectsHorizontal;
};

/**
 * Split a tablet based on split lines
 * Returns array of tablet parts
 */
export const splitTablet = (
  tablet: Tablet,
  splitLines: SplitLines,
): Tablet[] => {
  const hasVertical = splitLines.x !== undefined;
  const hasHorizontal = splitLines.y !== undefined;

  if (hasVertical && hasHorizontal) {
    // Split both ways
    return splitTabletBothWays(tablet, splitLines.x!, splitLines.y!);
  } else if (hasVertical) {
    // Split vertically only
    return splitTabletVertically(tablet, splitLines.x!);
  } else if (hasHorizontal) {
    // Split horizontally only
    return splitTabletHorizontally(tablet, splitLines.y!);
  }

  // No split lines, return original
  return [tablet];
};
