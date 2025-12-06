import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://127.0.0.1:8000/api';

// DEBUG - Remove after fixing
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Using API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
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

// ========================================
// PRODUCT API CALLS
// ========================================
export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}/`);
export const createProduct = (data) => api.post('/products/', data);
export const updateProduct = (id, data) => api.put(`/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}/`);

// ========================================
// DELIVERY ZONES
// ========================================
export const getDeliveryZones = () => api.get('/delivery-zones/');

// ========================================
// ORDER API CALLS
// ========================================
export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);
export const createOrder = (data) => api.post('/orders/create/', data);
export const getUserOrders = () => api.get('/orders/user/');

// Admin orders
export const getAdminOrders = () => api.get('/admin/orders/');
export const updateOrderStatus = (id, data) => api.put(`/admin/orders/${id}/status/`, data);

export default api;