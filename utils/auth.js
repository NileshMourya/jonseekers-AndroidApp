import axios from 'axios';
import { getTokens, saveTokens, clearTokens } from './store';

const API = axios.create({
  baseURL: 'http://192.168.1.5:8000/api', // 🔧 change to your backend URL
});

// ✅ Request Interceptor → attach Access Token
API.interceptors.request.use(async config => {
  const tokens = await getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// 🚨 Response Interceptor → auto-refresh when 401
API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If unauthorized and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const tokens = await getTokens();
      if (!tokens?.refreshToken) {
        await clearTokens();
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const res = await axios.post(
          'http://192.168.1.5:8000/api/refresh-token',
          {},
          { headers: { Authorization: `Bearer ${tokens.refreshToken}` } },
        );

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken || tokens.refreshToken;

        // Save new tokens securely
        await saveTokens(newAccessToken, newRefreshToken);

        // Retry the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError.response);
        await clearTokens();
      }
    }

    return Promise.reject(error);
  },
);

export default API;
