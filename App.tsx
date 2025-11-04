/**
 * STEP 3: Integrate Draw Area Component
 *
 * This step integrates the DrawArea component that displays split lines
 * when the user presses or drags on the screen.
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabletProvider } from './src/context/TabletContext';
import { DrawArea } from './src/components/DrawArea';

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
