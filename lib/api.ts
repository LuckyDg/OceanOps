import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token from memory store
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = (window as Window & { __oceanops_token?: string }).__oceanops_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        delete (window as Window & { __oceanops_token?: string }).__oceanops_token;
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token: string) {
  (window as Window & { __oceanops_token?: string }).__oceanops_token = token;
}

export function clearAuthToken() {
  delete (window as Window & { __oceanops_token?: string }).__oceanops_token;
}

export default api;
