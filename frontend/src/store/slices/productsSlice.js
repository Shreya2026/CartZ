import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  currentProduct: null,
  categories: [],
  filters: {
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    brand: '',
    sortBy: 'newest',
    searchQuery: '',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
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
    setProducts: (state, action) => {
      state.products = action.payload
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload
    },
    setNewArrivals: (state, action) => {
      state.newArrivals = action.payload
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload
    },
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setProducts,
  setFeaturedProducts,
  setNewArrivals,
  setCurrentProduct,
  setCategories,
  updateFilters,
  resetFilters,
  setPagination,
} = productsSlice.actions

export default productsSlice.reducer
