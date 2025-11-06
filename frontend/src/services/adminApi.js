import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin API calls
export const checkAdmin = () => adminApi.get('/check/');
export const getDashboardStats = () => adminApi.get('/stats/');
export const getAllProducts = () => adminApi.get('/products/');
export const createProduct = (data) => adminApi.post('/products/create/', data);
export const updateProduct = (id, data) => adminApi.put(`/products/${id}/update/`, data);
export const deleteProduct = (id) => adminApi.delete(`/products/${id}/delete/`);
export const getAllOrders = () => adminApi.get('/orders/');
export const updateOrderStatus = (id, status) => adminApi.put(`/orders/${id}/status/`, { status });

export default adminApi;