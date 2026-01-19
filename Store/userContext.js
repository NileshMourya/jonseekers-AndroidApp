// src/context/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/auth';
import { clearTokens, getTokens } from '../utils/store';
import { showMessage } from 'react-native-flash-message';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { getFcmToken } from '../utils/notification';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const navigation = useNavigation();

  /**
   * ✅ Fetch user profile from API
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = await getTokens();
      if (!token?.accessToken) {
        throw new Error('No access token found');
      }

      const response = await API.get('/profile', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      });

      setProfile(response.data || {});
    } catch (error) {
      console.error(
        'Error fetching profile:',
        error?.response || error.message,
      );
      showMessage({
        message: 'Failed to load profile',
        description:
          error?.response?.data?.message || 'Please try again later.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Handle logout safely
   */
  const handleLogout = async () => {
    try {
      await API.get('/logout'); // Optional — remove if backend doesn’t require this
    } catch (err) {
      console.warn('Logout API error (ignored):', err?.response || err.message);
    } finally {
      await clearTokens();
      setProfile(null);
      showMessage({
        message: 'Account logged out successfully',
        type: 'success',
      });

      // Reset navigation stack to Login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
    }
  };

  /**
   * ✅ Send FCM token to backend
   */
  const saveTokenToServer = async userId => {
    try {
      if (!userId) return;

      const token = await getFcmToken();
      if (!token) return;

      await API.post('/firebase/notification-services', { userId, token });
      console.log('FCM token saved successfully');
    } catch (error) {
      console.error(
        'Error saving FCM token:',
        error?.response || error.message,
      );
    }
  };

  /**
   * Fetch profile on mount or when `isEdit` changes
   */
  useEffect(() => {
    fetchProfile();
  }, [isEdit]);

  /**
   * Save FCM token when profile is loaded
   */
  useEffect(() => {
    if (profile?.userId) {
      saveTokenToServer(profile.userId);
    }
  }, [profile?.userId]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        fetchProfile,
        isEdit,
        setEdit,
        handleLogout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * ✅ Custom hook for accessing profile context
 */
export const useProfile = () => useContext(ProfileContext);
