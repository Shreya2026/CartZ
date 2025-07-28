import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'admin/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data')
    }
  }
)

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async ({ page = 1, limit = 20, status = 'all' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders?page=${page}&limit=${limit}&status=${status}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status')
    }
  }
)

export const fetchAllProducts = createAsyncThunk(
  'admin/fetchAllProducts',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/products?page=${page}&limit=${limit}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/products/${productId}`)
      return productId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product')
    }
  }
)

const initialState = {
  // Dashboard
  dashboardData: null,
  dashboardLoading: false,
  dashboardError: null,
  
  // Users
  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: null,
  
  // Orders
  orders: [],
  ordersLoading: false,
  ordersError: null,
  ordersPagination: null,
  
  // Products
  products: [],
  productsLoading: false,
  productsError: null,
  productsPagination: null,
  
  // General
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.dashboardError = null
      state.usersError = null
      state.ordersError = null
      state.productsError = null
    },
    clearDashboardData: (state) => {
      state.dashboardData = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardLoading = true
        state.dashboardError = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardLoading = false
        state.dashboardData = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.dashboardLoading = false
        state.dashboardError = action.payload
      })
      
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true
        state.usersError = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false
        state.users = action.payload.users
        state.usersPagination = action.payload.pagination
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false
        state.usersError = action.payload
      })
      
      // Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.ordersLoading = true
        state.ordersError = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordersLoading = false
        state.orders = action.payload.orders
        state.ordersPagination = action.payload.pagination
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.ordersLoading = false
        state.ordersError = action.payload
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        // Update the order in the list
        const orderIndex = state.orders.findIndex(order => order._id === action.payload._id)
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsLoading = true
        state.productsError = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsLoading = false
        state.products = action.payload.products
        state.productsPagination = action.payload.pagination
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsLoading = false
        state.productsError = action.payload
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        // Remove the product from the list
        state.products = state.products.filter(product => product._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearDashboardData } = adminSlice.actions

// Selectors
export const selectDashboardData = (state) => state.admin.dashboardData
export const selectDashboardLoading = (state) => state.admin.dashboardLoading
export const selectDashboardError = (state) => state.admin.dashboardError

export const selectAdminUsers = (state) => state.admin.users
export const selectUsersLoading = (state) => state.admin.usersLoading
export const selectUsersError = (state) => state.admin.usersError
export const selectUsersPagination = (state) => state.admin.usersPagination

export const selectAdminOrders = (state) => state.admin.orders
export const selectOrdersLoading = (state) => state.admin.ordersLoading
export const selectOrdersError = (state) => state.admin.ordersError
export const selectOrdersPagination = (state) => state.admin.ordersPagination

export const selectAdminProducts = (state) => state.admin.products
export const selectProductsLoading = (state) => state.admin.productsLoading
export const selectProductsError = (state) => state.admin.productsError
export const selectProductsPagination = (state) => state.admin.productsPagination

export const selectAdminLoading = (state) => state.admin.loading
export const selectAdminError = (state) => state.admin.error

export default adminSlice.reducer
