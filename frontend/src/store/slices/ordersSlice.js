import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ordersAPI from '../../services/ordersService'

// Async thunks
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getMyOrders(page, limit)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders')
    }
  }
)

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrderById(orderId)
      return response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.cancelOrder(orderId)
      return { orderId, ...response }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order')
    }
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  orderStats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setOrders: (state, action) => {
      state.orders = action.payload
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
    },
    setOrderStats: (state, action) => {
      state.orderStats = action.payload
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload)
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(order => order._id === action.payload._id)
      if (index !== -1) {
        state.orders[index] = action.payload
      }
      if (state.currentOrder && state.currentOrder._id === action.payload._id) {
        state.currentOrder = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.pagination = action.payload.pagination
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get Order By ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false
        // Update the order in the orders list
        const orderIndex = state.orders.findIndex(order => order._id === action.payload.orderId)
        if (orderIndex !== -1) {
          state.orders[orderIndex].orderStatus = 'cancelled'
        }
        // Update current order if it's the one being cancelled
        if (state.currentOrder && state.currentOrder._id === action.payload.orderId) {
          state.currentOrder.orderStatus = 'cancelled'
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setOrders,
  setCurrentOrder,
  setOrderStats,
  setPagination,
  addOrder,
  updateOrder,
} = ordersSlice.actions

export default ordersSlice.reducer

// Selectors
export const selectOrders = (state) => state.orders.orders
export const selectCurrentOrder = (state) => state.orders.currentOrder
export const selectOrdersPagination = (state) => state.orders.pagination
export const selectOrdersLoading = (state) => state.orders.loading
export const selectOrdersError = (state) => state.orders.error
