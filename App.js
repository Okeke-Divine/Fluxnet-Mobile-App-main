import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const FLUXNET_URL = 'https://fluxnet.com.ng/?view=app';
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView 
        source={{ uri: FLUXNET_URL }} 
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
