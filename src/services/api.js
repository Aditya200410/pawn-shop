import axios from 'axios';
import config from '../config/config.js';

// Create axios instance with base URL from config
const api = axios.create({
  baseURL: config.API_BASE_URL + '/api',
  headers: config.CORS.HEADERS,
  withCredentials: config.CORS.WITH_CREDENTIALS,
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

// Hero Carousel API endpoints
export const heroCarouselAPI = {
  getActiveItems: () => api.get('/hero-carousel/active'),
};

// Default export for general API usage
export default api; 