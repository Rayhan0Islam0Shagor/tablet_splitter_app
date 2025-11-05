/**
 * STEP 5: Tablet Splitting Functionality
 *
 * This step implements the complete tablet splitting feature:
 * - Single press/tap splits tablets intersecting split lines
 * - Split parts retain original color and corner radius
 * - Minimum part size enforcement (20x10 dpi)
 * - Small parts are moved to one side of split line
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabletProvider } from './src/context/TabletContext';
import { DrawArea } from './src/components/DrawArea';
import { BottomActionBar } from './src/components/BottomActionBar';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <TabletProvider>
          <AppContent />
        </TabletProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <DrawArea />
      <BottomActionBar />
    </View>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
