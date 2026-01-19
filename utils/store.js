import axios from 'axios';
import * as Keychain from 'react-native-keychain';

// Save tokens securely
export const saveTokens = async (accessToken, refreshToken) => {
  console.log('running');
  try {
    await Keychain.setGenericPassword(
      'tokens',
      JSON.stringify({ accessToken, refreshToken }),
    );
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Get tokens
export const getTokens = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const tokens = JSON.parse(credentials.password);
      return tokens;
    }
    return null;
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
};

// Clear tokens
export const clearTokens = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export const fetchJobs = async accessToken => {
  try {
    const response = await axios.get('http://192.168.1.5:8000/api/getJobs', {
      headers: { Authorization: `Bearer${accessToken}` },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
