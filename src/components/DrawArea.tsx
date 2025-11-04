/**
 * STEP 3: DrawArea Component - Split Lines Visualization
 *
 * This component displays horizontal and vertical split lines when the user
 * presses or drags on the screen. The lines appear at the touch point.
 */

import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DrawAreaProps {
  // Future props will be added here
}

const DashedLine: React.FC<{
  horizontal: boolean;
  position: number;
}> = ({ horizontal, position }) => {
  const dashLength = 8;
  const dashGap = 4;
  const lineLength = horizontal ? SCREEN_WIDTH : SCREEN_HEIGHT;
  const dashCount = Math.floor(lineLength / (dashLength + dashGap));

  return (
    <View
      style={[
        horizontal
          ? styles.horizontalLineContainer
          : styles.verticalLineContainer,
        horizontal ? styles.horizontalPosition : styles.verticalPosition,
        horizontal ? { top: position } : { left: position },
      ]}
    >
      {Array.from({ length: dashCount }).map((_, index) => (
        <View
          key={index}
          style={[
            horizontal ? styles.horizontalDash : styles.verticalDash,
            index > 0 &&
              (horizontal
                ? styles.horizontalDashMargin
                : styles.verticalDashMargin),
          ]}
        />
      ))}
    </View>
  );
};

export const DrawArea: React.FC<DrawAreaProps> = () => {
  // State to track the current split line position
  const [splitLines, setSplitLines] = useState<{
    x?: number;
    y?: number;
  } | null>(null);

  /**
   * Gesture handler for press and drag events
   * Shows split lines at the touch point
   */
  const gesture = Gesture.Pan()
    .onStart(event => {
      // Show split lines when user starts pressing
      setSplitLines({
        x: event.x,
        y: event.y,
      });
    })
    .onUpdate(event => {
      // Update split lines position during drag
      setSplitLines({
        x: event.x,
        y: event.y,
      });
    })
    .onEnd(() => {
      // Hide split lines after a short delay when user releases
      setTimeout(() => {
        setSplitLines(null);
      }, 300);
    })
    .onFinalize(() => {
      // Ensure lines are hidden when gesture ends
      setTimeout(() => {
        setSplitLines(null);
      }, 300);
    });

  return (
    <GestureDetector gesture={gesture}>
      <View style={styles.drawArea}>
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
  horizontalLineContainer: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    width: SCREEN_WIDTH,
  },
  verticalLineContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'column',
    height: SCREEN_HEIGHT,
  },
  horizontalPosition: {
    // Dynamic top position will be applied inline
  },
  verticalPosition: {
    // Dynamic left position will be applied inline
  },
  horizontalDash: {
    width: 8,
    height: 1,
    backgroundColor: '#000000',
  },
  verticalDash: {
    width: 1,
    height: 8,
    backgroundColor: '#000000',
  },
  horizontalDashMargin: {
    marginLeft: 4,
  },
  verticalDashMargin: {
    marginTop: 4,
  },
});
