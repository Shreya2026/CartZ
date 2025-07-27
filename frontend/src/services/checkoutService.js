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

// Checkout API functions
export const checkoutAPI = {
  // Get checkout session with pricing
  getCheckoutSession: async () => {
    try {
      const response = await api.get('/checkout/session');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Process checkout and create order
  processCheckout: async (checkoutData) => {
    try {
      const response = await api.post('/checkout', checkoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
