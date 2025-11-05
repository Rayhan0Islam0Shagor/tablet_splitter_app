import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tablet as TabletType } from '../types/tablet.types';

interface TabletProps {
  tablet: TabletType;
  isDragging?: boolean;
}

export const Tablet: React.FC<TabletProps> = ({ tablet, isDragging = false }) => {
  return (
    <View
      style={[
        styles.tablet,
        isDragging && styles.draggingTablet,
        {
          left: tablet.x,
          top: tablet.y,
          width: tablet.width,
          height: tablet.height,
          backgroundColor: tablet.color,
          borderRadius: tablet.borderRadius,
        },
      ]}
    >
      {isDragging && (
        <View
          style={[
            styles.draggingOverlay,
            {
              borderRadius: tablet.borderRadius,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tablet: {
    position: 'absolute',
    overflow: 'hidden', // Ensure clean rounded corners
    // Android elevation
    elevation: 4,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  draggingTablet: {
    // Enhanced elevation when dragging
    elevation: 12,
    // Enhanced shadow for iOS
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
