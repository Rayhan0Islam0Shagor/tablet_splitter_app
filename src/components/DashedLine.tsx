import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DashedLineProps {
  horizontal: boolean;
  position: number;
}

export const DashedLine: React.FC<DashedLineProps> = ({
  horizontal,
  position,
}) => {
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

const styles = StyleSheet.create({
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
