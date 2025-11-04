/**
 * STEP 2: Integrate Context API
 *
 * This step integrates the TabletContext Provider to enable state management
 * throughout the application.
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabletProvider } from './src/context/TabletContext';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TabletProvider>
        <AppContent />
      </TabletProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <View style={styles.drawArea}>
        {/* Draw area ready for tablet functionality */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  drawArea: {
    flex: 1,
    position: 'relative',
  },
});

export default App;
