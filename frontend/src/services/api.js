import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor to add admin auth dynamically if needed
api.interceptors.request.use((config) => {
  const adminAuth = localStorage.getItem('adminAuth');
  if (adminAuth && config.url?.includes('/admin')) {
    config.headers.Authorization = `Basic ${adminAuth}`;
  }
  return config;
});

export default api;
