/**
 * Bottom Action Bar Component
 *
 * Displays action buttons at the bottom of the screen for tablet management.
 */

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTablets } from '../context/TabletContext';

export const BottomActionBar: React.FC = () => {
  const { clearAllTablets, tablets } = useTablets();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          styles.clearButton,
          tablets.length === 0 && styles.buttonDisabled,
        ]}
        onPress={clearAllTablets}
        disabled={tablets.length === 0}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            styles.clearButtonText,
            tablets.length === 0 && styles.buttonTextDisabled,
          ]}
        >
          Clear All
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clearButton: {
    backgroundColor: '#ff4444',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  clearButtonText: {
    color: '#ffffff',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
});
