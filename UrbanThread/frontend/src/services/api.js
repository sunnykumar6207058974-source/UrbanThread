/**
 * UrbanThread API Service
 * Central fetch layer that connects the React frontend to the Express backend.
 * Falls back gracefully if the backend is unavailable.
 */

const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://urbanthread-xjpv.onrender.com/api';

// ── Token Management ─────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('ut_token');
const setToken = (token) => localStorage.setItem('ut_token', token);
const clearToken = () => localStorage.removeItem('ut_token');

// ── Core Fetch Helper ────────────────────────────────────────────────────────
const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await res.json();

  if (!res.ok) {
    // 401 = token expired — clear it
    if (res.status === 401) clearToken();
    const err = new Error(data.message || 'API request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

// ── Health Check ─────────────────────────────────────────────────────────────
export const checkHealth = () => request('/health');

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  loginPhone: (body) => request('/auth/login-phone', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  updatePassword: (body) => request('/auth/password', { method: 'PUT', body: JSON.stringify(body) }),
  saveToken: setToken,
  clearToken,
  getToken
};

// ── Products ─────────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' })
};

// ── Cart ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => request('/cart'),
  add: (body) => request('/cart', { method: 'POST', body: JSON.stringify(body) }),
  update: (itemId, body) => request(`/cart/${itemId}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (itemId) => request(`/cart/${itemId}`, { method: 'DELETE' }),
  clear: () => request('/cart', { method: 'DELETE' }),
  sync: (items) => request('/cart/sync', { method: 'PUT', body: JSON.stringify({ items }) })
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersAPI = {
  getMyOrders: () => request('/orders'),
  getById: (id) => request(`/orders/${id}`),
  place: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) })
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getProfile: () => request('/users/profile'),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getAddresses: () => request('/users/addresses'),
  addAddress: (body) => request('/users/addresses', { method: 'POST', body: JSON.stringify(body) }),
  deleteAddress: (id) => request(`/users/addresses/${id}`, { method: 'DELETE' }),
  setDefaultAddress: (id) => request(`/users/addresses/${id}/default`, { method: 'PUT' }),
  getNotifications: () => request('/users/notifications'),
  markRead: (id) => request(`/users/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => request('/users/notifications/read-all', { method: 'PUT' }),
  toggleWishlist: (productId) => request(`/users/wishlist/${productId}`, { method: 'POST' })
};

// ── Coupons ───────────────────────────────────────────────────────────────────
export const couponsAPI = {
  validate: (code, cartSubtotal) =>
    request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, cartSubtotal }) })
};

// ── Newsletter ────────────────────────────────────────────────────────────────
export const newsletterAPI = {
  subscribe: (email) =>
    request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) })
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => request('/admin/stats'),
  getAllOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/orders${qs ? '?' + qs : ''}`);
  },
  updateOrderStatus: (id, status, message) =>
    request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, message }) }),
  getAllUsers: () => request('/admin/users'),
  getCoupons: () => request('/admin/coupons')
};
