import axios from 'axios';
import { environment } from '../environment';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: environment.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        window.location.href = '/access-denial';
      } else if (error.response.status === 500) {
        toast.error('Server error occurred');
      }
    } else {
      toast.error('Network or server connection error');
    }
    return Promise.reject(error);
  }
);

export default api;
