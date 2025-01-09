import React, { Component, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const FLUXNET_URL = 'https://fluxnet.com.ng/?view=app';
  const [isOffline, setIsOffline] = useState(false);

  const handleReload = () => {
    setIsOffline(false);
  };

  const handleShouldStartLoad = (event) => {
    const { url } = event;

    // Prevent the WebView from navigating externally, let all links load inside WebView
    return true;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {isOffline ? (
        <View style={styles.offlineContainer}>
          <Text style={styles.message}>No internet connection. Please check your network and try again.</Text>
          <TouchableOpacity style={styles.button} onPress={handleReload}>
            <Text style={styles.buttonText}>Reload</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: FLUXNET_URL }}
          style={styles.webview}
        />
      )}
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
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
