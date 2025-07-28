import api from './api'

const ordersAPI = {
  // Get user orders with pagination
  getMyOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/orders/myorders?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Cancel order (if implemented in backend)
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}

export default ordersAPI
