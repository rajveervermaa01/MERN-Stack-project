import axios from 'axios';

const BASE_URL = '/api/v1'; // Vite proxy forwards to http://localhost:5001

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Health check
export const healthCheck = () => api.get('/health');

// Get all tasks with optional filters
export const getTasks = (params = {}) => api.get('/tasks', { params });

// Get a single task
export const getTask = (id) => api.get(`/tasks/${id}`);

// Create a task
export const createTask = (data) => api.post('/tasks', data);

// Full update
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

// Partial update
export const patchTask = (id, data) => api.patch(`/tasks/${id}`, data);

// Delete a task
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;
