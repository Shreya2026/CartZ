import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
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
    setWishlist: (state, action) => {
      state.items = action.payload
    },
    addToWishlist: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload)
    },
    toggleWishlistItem: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id)
      if (exists) {
        state.items = state.items.filter(item => item._id !== action.payload._id)
      } else {
        state.items.push(action.payload)
      }
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} = wishlistSlice.actions

export default wishlistSlice.reducer

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectIsInWishlist = (state, productId) => 
  state.wishlist.items.some(item => item._id === productId)
