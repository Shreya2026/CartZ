import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cart API functions
export const cartAPI = {
  // Get user cart
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variant = null) => {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        variant,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update item quantity
  updateCartItem: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Sync cart with backend
  syncCart: async (cartItems) => {
    try {
      const response = await api.post('/cart/sync', {
        items: cartItems,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
