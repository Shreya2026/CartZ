import { createSlice } from '@reduxjs/toolkit'

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
