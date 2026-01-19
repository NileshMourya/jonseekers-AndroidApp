/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  Alert,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import StackNavigation from './screens/StackNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { requestUserPermission } from './utils/notification';
import { useEffect } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // createing channel
  async function createDefaultChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  // 🔔 Use notifee to show a real popup
  async function onMessageReceived(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    
    // MAKING REQUEST FOR PREMISSION FOR MESSAGE
    await notifee.requestPermission();

    // DEFINING MESSAGE BODY
    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  useEffect(() => {
    // Request notification permissions (iOS + Android 13+)
    createDefaultChannel();
    requestUserPermission();

    // RECIVING NOTIFICATION IN FOREGROUND
    const foregroundListener = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        if (
          remoteMessage.notification?.title &&
          remoteMessage.notification?.body
        ) {
          await onMessageReceived(remoteMessage); // Pass the full remoteMessage
        }
      },
    );

    // RECEVING NOTIFICATION IN BACKGROUND
    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const { notification } = remoteMessage;
        if (notification?.title && notification?.body) {
          await onMessageReceived(remoteMessage);
        }
      },
    );

    return () => {
      foregroundListener();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
