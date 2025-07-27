import api from './api'

// Product API
export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/api/products', { params })
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/api/products/${id}`)
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/api/products/featured/list', { 
      params: { limit } 
    })
    return response.data
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8) => {
    const response = await api.get('/api/products/new/arrivals', { 
      params: { limit } 
    })
    return response.data
  },

  // Add product review
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/api/products/${productId}/reviews`, reviewData)
    return response.data
  },

  // Get product reviews
  getReviews: async (productId, params = {}) => {
    const response = await api.get(`/api/products/${productId}/reviews`, { params })
    return response.data
  },
}

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/api/categories')
    return response.data
  },

  // Get single category
  getCategory: async (id) => {
    const response = await api.get(`/api/categories/${id}`)
    return response.data
  },
}

// Order API
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData)
    return response.data
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    const response = await api.get('/api/orders/myorders', { params })
    return response.data
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/api/orders/${id}`)
    return response.data
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    const response = await api.put(`/api/orders/${id}/cancel`, { reason })
    return response.data
  },
}

// User API
export const userAPI = {
  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/api/users/wishlist')
    return response.data
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post(`/api/users/wishlist/${productId}`)
    return response.data
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/api/users/wishlist/${productId}`)
    return response.data
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await api.post('/api/users/addresses', addressData)
    return response.data
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/api/users/addresses/${addressId}`, addressData)
    return response.data
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/api/users/addresses/${addressId}`)
    return response.data
  },
}

// Payment API
export const paymentAPI = {
  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/api/payments/methods')
    return response.data
  },

  // Process payment
  processPayment: async (paymentData) => {
    const response = await api.post('/api/payments/process', paymentData)
    return response.data
  },

  // Validate payment details
  validatePayment: async (paymentData) => {
    const response = await api.post('/api/payments/validate', paymentData)
    return response.data
  },

  // Calculate shipping
  calculateShipping: async (items, address) => {
    const response = await api.post('/api/payments/shipping', { items, shippingAddress: address })
    return response.data
  },

  // Calculate tax
  calculateTax: async (items, address) => {
    const response = await api.post('/api/payments/tax', { items, shippingAddress: address })
    return response.data
  },
}

// Auth API (already covered in authSlice, but keeping for consistency)
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials)
    return response.data
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/auth/profile', profileData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/api/auth/change-password', passwordData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout')
    return response.data
  },
}
