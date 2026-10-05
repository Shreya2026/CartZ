import api from './api'

// Product API
export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured/list', { 
      params: { limit } 
    })
    return response.data
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8) => {
    const response = await api.get('/products/new/arrivals', { 
      params: { limit } 
    })
    return response.data
  },

  // Add product review
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  },

  // Get product reviews
  getReviews: async (productId, params = {}) => {
    const response = await api.get(`/products/${productId}/reviews`, { params })
    return response.data
  },
}

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  // Get single category
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },
}

// Order API
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    const response = await api.get('/orders/myorders', { params })
    return response.data
  },

  // Get single order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    const response = await api.put(`/orders/${id}/cancel`, { reason })
    return response.data
  },
}

// User API
export const userAPI = {
  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/users/wishlist')
    return response.data
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post(`/users/wishlist/${productId}`)
    return response.data
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/users/wishlist/${productId}`)
    return response.data
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await api.post('/users/addresses', addressData)
    return response.data
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/users/addresses/${addressId}`, addressData)
    return response.data
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/addresses/${addressId}`)
    return response.data
  },
}

// Payment API
export const paymentAPI = {
  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods')
    return response.data
  },

  // Process payment
  processPayment: async (paymentData) => {
    const response = await api.post('/payments/process', paymentData)
    return response.data
  },

  // Validate payment details
  validatePayment: async (paymentData) => {
    const response = await api.post('/payments/validate', paymentData)
    return response.data
  },

  // Calculate shipping
  calculateShipping: async (items, address) => {
    const response = await api.post('/payments/shipping', { items, shippingAddress: address })
    return response.data
  },

  // Calculate tax
  calculateTax: async (items, address) => {
    const response = await api.post('/payments/tax', { items, shippingAddress: address })
    return response.data
  },
}

// Auth API (already covered in authSlice, but keeping for consistency)
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
}
