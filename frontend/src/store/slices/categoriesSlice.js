import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
}

const categoriesSlice = createSlice({
  name: 'categories',
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
    setCategories: (state, action) => {
      state.categories = action.payload
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setCategories,
  setCurrentCategory,
} = categoriesSlice.actions

export default categoriesSlice.reducer
