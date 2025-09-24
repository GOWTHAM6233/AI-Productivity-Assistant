import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Using proxy configuration from vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Tasks API
export const tasksAPI = {
  getTasks: () => api.get('/tasks'),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.post(`/tasks/${id}/complete`),
  getStats: () => api.get('/tasks/stats/overview'),
};

// AI API
export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  getSuggestions: () => api.post('/ai/suggestions'),
  getInsights: () => api.post('/ai/insights'),
  getHistory: () => api.get('/ai/history'),
};

export default api;
