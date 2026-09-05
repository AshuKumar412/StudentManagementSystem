import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — distinguish true network error from HTTP status codes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or backend server unreachable
      error.friendlyMessage = 'Unable to connect to the server. Please make sure the backend is running.';
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const serverMessage = data?.message || data?.error || (typeof data === 'string' ? data : null);

    if (status === 400) {
      error.friendlyMessage = serverMessage || 'Invalid request. Please check the submitted data.';
    } else if (status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      error.friendlyMessage = serverMessage || 'Invalid email or password.';
    } else if (status === 403) {
      error.friendlyMessage = serverMessage || 'Access denied. You do not have permission for this action.';
    } else if (status === 404) {
      error.friendlyMessage = serverMessage || 'Requested resource or API endpoint was not found.';
    } else if (status === 409) {
      error.friendlyMessage = serverMessage || 'A conflict occurred. The record may already exist.';
    } else if (status >= 500) {
      error.friendlyMessage = serverMessage || 'Something went wrong on the server. Please try again.';
    } else {
      error.friendlyMessage = serverMessage || error.message || 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);

export default api;