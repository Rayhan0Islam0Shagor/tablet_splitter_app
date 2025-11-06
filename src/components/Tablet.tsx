import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Tablet as TabletType } from '../types/tablet.types';

interface TabletProps {
  tablet: TabletType;
  isDragging?: boolean;
}

export const Tablet: React.FC<TabletProps> = ({
  tablet,
  isDragging = false,
}) => {
  // Create animated values for position
  const animatedX = useRef(new Animated.Value(tablet.x)).current;
  const animatedY = useRef(new Animated.Value(tablet.y)).current;

  // Update animated values when tablet position changes
  useEffect(() => {
    if (!isDragging) {
      // Animate to new position when not dragging (smooth transition)
      Animated.parallel([
        Animated.spring(animatedX, {
          toValue: tablet.x,
          useNativeDriver: false, // Cannot use native driver for layout properties
          tension: 50,
          friction: 7,
        }),
        Animated.spring(animatedY, {
          toValue: tablet.y,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    } else {
      // Update immediately during drag (no animation delay)
      animatedX.setValue(tablet.x);
      animatedY.setValue(tablet.y);
    }
  }, [tablet.x, tablet.y, isDragging, animatedX, animatedY]);

  return (
    <Animated.View
      style={[
        styles.tablet,
        isDragging && styles.draggingTablet,
        {
          left: animatedX,
          top: animatedY,
          width: tablet.width,
          height: tablet.height,
          backgroundColor: tablet.color,
          borderRadius: tablet.borderRadius,
        },
      ]}
    >
      {isDragging && (
        <Animated.View
          style={[
            styles.draggingOverlay,
            {
              borderRadius: tablet.borderRadius,
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tablet: {
    position: 'absolute',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  draggingTablet: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  draggingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
});
