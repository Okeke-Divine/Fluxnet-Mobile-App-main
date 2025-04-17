import React, { Component, useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, BackHandler, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';

export default function App() {
  const FLUXNET_URL = 'https://fluxinet.com/?view=app';
  const [isOffline, setIsOffline] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    const handleDeepLink = (event) => {
      if (event.url.startsWith('com.fluxinet.fluxinet//callback')) {
        // Extract token/parameters from URL
        const token = new URL(event.url).searchParams.get('token');
        
        // Pass it back to your WebView
        webViewRef.current.injectJavaScript(`
          window.handleAuthCallback('${token}');
        `);
      }
    };
  
    Linking.addEventListener('url', handleDeepLink);
    return () => Linking.removeEventListener('url', handleDeepLink);
  }, []);

  const handleGoogleAuth = async (url) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(url, 'com.fluxinet.fluxinet//callback', {
          // Android options
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#ffffff',
          preferredControlTintColor: '#007BFF',
          // iOS options
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalEnabled: true,
          enableBarCollapsing: false,
        });

        if (result.type === 'success' && result.url) {
          // Handle successful auth
          webViewRef.current.injectJavaScript(`
            window.location.href = '${result.url}';
          `);
        }
      } else {
        // Fallback to regular browser if InAppBrowser not available
        Linking.openURL(url);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleReload = () => {
    setIsOffline(false);
  };

  const handleShouldStartLoad = (event) => {
    const { url } = event;
    return true;
  };

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        webViewRef.current.goBack();
        return true; // Prevent default behavior
      }
      return false; // Default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

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
          ref={webViewRef}
          source={{ uri: FLUXNET_URL }}
          style={styles.webview}
          onNavigationStateChange={onNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              color='black'
              size='large'
              style={styles.flexContainer}
            />
          )}
          onShouldStartLoadWithRequest={(request) => {
            // Detect Google auth URLs
            if (request.url.includes('accounts.google.com') ||
              request.url.includes('oauth2/auth') ||
              request.url.includes('signin/oauth')) {
              handleGoogleAuth(request.url);
              return false;
            }
            return true;
          }}
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