import { StyleSheet, View } from 'react-native';
import { DEFAULT_BORDER_RADIUS } from '../constants/tablet.constants';

interface PreviewTabletProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PreviewTablet: React.FC<PreviewTabletProps> = ({
  x,
  y,
  width,
  height,
}) => {
  return (
    <View
      style={[
        styles.previewTablet,
        {
          left: x,
          top: y,
          width: width,
          height: height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  previewTablet: {
    position: 'absolute',
    backgroundColor: 'rgba(100, 150, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#6495ED',
    borderRadius: DEFAULT_BORDER_RADIUS,
  },
});
