import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// 🔹 Request permission to receive notifications
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Notification permission granted:', authStatus);
  } else {
    Alert.alert(
      'Permission denied',
      'Enable push notifications to get job alerts!',
    );
  }
};

// 🔹 Get device FCM token
export const getFcmToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('📱 FCM Token:', token);
    return token;
  } catch (error) {
    console.log('Error fetching FCM token:', error);
  }
};
