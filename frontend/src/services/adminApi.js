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

export const createProduct = (data) => {
  // If data is FormData, change Content-Type
  const config = data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : {};
  
  return adminApi.post('/products/create/', data, config);
};

export const updateProduct = (id, data) => {
  const config = data instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : {};
  
  return adminApi.put(`/products/${id}/update/`, data, config);  // ✅ Fixed: added ( before backtick
};

export const deleteProduct = (id) => adminApi.delete(`/products/${id}/delete/`);  // ✅ Fixed: added ( before backtick

export const getAllOrders = () => adminApi.get('/orders/');

export const updateOrderStatus = (id, status) => adminApi.put(`/orders/${id}/status/`, { status });  // ✅ Fixed: added ( before backtick

export default adminApi;