/**
 * STEP 4: Tablet Drawing Functionality
 *
 * Main component that orchestrates tablet drawing, rendering, and interaction.
 * This component uses smaller, reusable components and hooks for better maintainability.
 *
 * Features:
 * - Detect empty area touches (not on existing tablets)
 * - Create tablets by dragging on empty areas
 * - Show preview tablet while dragging
 * - Enforce minimum tablet size (40x20 dpi)
 * - Display split lines during press/drag
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useTablets } from '../context/TabletContext';
import { Tablet } from './Tablet';
import { PreviewTablet } from './PreviewTablet';
import { DashedLine } from './DashedLine';
import { useTabletDrawing } from '../hooks/useTabletDrawing';

export const DrawArea: React.FC = () => {
  const { tablets } = useTablets();
  const { gesture, splitLines, previewTablet, draggedTabletId } =
    useTabletDrawing();

  // Sort tablets so the dragged one renders on top
  const sortedTablets = [...tablets].sort((a, b) => {
    if (a.id === draggedTabletId) return 1; // Dragged tablet goes to end (top)
    if (b.id === draggedTabletId) return -1;
    return 0; // Keep original order for others
  });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.drawArea}>
        {/* Render existing tablets */}
        {sortedTablets.map(tablet => (
          <Tablet
            key={tablet.id}
            tablet={tablet}
            isDragging={tablet.id === draggedTabletId}
          />
        ))}

        {/* Render preview tablet while drawing */}
        {previewTablet && (
          <PreviewTablet
            x={previewTablet.x}
            y={previewTablet.y}
            width={previewTablet.width}
            height={previewTablet.height}
          />
        )}

        {/* Render split lines */}
        {splitLines?.y !== undefined && (
          <DashedLine horizontal={true} position={splitLines.y} />
        )}

        {splitLines?.x !== undefined && (
          <DashedLine horizontal={false} position={splitLines.x} />
        )}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  drawArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
});
