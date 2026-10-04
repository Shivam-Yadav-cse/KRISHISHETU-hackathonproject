import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('krishisetu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('krishisetu_token');
      localStorage.removeItem('krishisetu_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/farmer/my-products'),
  getPriceRecommendation: (params) => api.get('/products/price-recommendation', { params }),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (productId, data) => api.put(`/cart/item/${productId}`, data),
  remove: (productId) => api.delete(`/cart/item/${productId}`),
  clear: () => api.delete('/cart/clear'),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getFarmerOrders: () => api.get('/orders/farmer-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  releaseEscrow: (id) => api.put(`/orders/${id}/release-escrow`),
  updateStatus: (id, data) => api.put(`/orders/${id}/delivery-status`, data),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  getByFarmer: (farmerId) => api.get(`/reviews/farmer/${farmerId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  assignDelivery: (orderId, data) => api.put(`/admin/orders/${orderId}/assign-delivery`, data),
  getEscrow: () => api.get('/admin/escrow'),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

export const deliveryAPI = {
  getMyDeliveries: () => api.get('/delivery/my-deliveries'),
  updateStatus: (id, data) => api.put(`/delivery/orders/${id}/status`, data),
  getEarnings: () => api.get('/delivery/earnings'),
};

export const paymentAPI = {
  createSession: (data) => api.post('/payment/create-checkout-session', data),
  verify: (sessionId) => api.get(`/payment/verify/${sessionId}`),
  getMandiPrices: (params) => api.get('/payment/mandi-prices', { params }),
};

export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  toggle: (productId) => api.post(`/wishlist/toggle/${productId}`),
};

export default api;
