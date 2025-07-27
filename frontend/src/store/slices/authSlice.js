import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// API Base URL
const API_URL = '/api/auth'

// Configure axios defaults
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${API_URL}/login`, { email, password })
      
      // Store token and user info
      if (data.token) {
        Cookies.set('token', data.token, { expires: 30 })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`${API_URL}/register`, {
        name,
        email,
        password,
      })
      
      // Store token and user info
      if (data.token) {
        Cookies.set('token', data.token, { expires: 30 })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No token found')
      }

      const { data } = await api.get(`${API_URL}/me`)
      return data.user
    } catch (error) {
      // Clear invalid token
      Cookies.remove('token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load user'
      )
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${API_URL}/profile`, profileData)
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      
      return data.user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Profile update failed'
      )
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${API_URL}/change-password`, {
        currentPassword,
        newPassword,
      })
      
      return data.message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Password change failed'
      )
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post(`${API_URL}/logout`)
    } catch (error) {
      console.log('Logout error:', error)
    } finally {
      // Always clear local storage
      Cookies.remove('token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
)

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: Cookies.get('token') || localStorage.getItem('token') || null,
  isAuthenticated: !!(Cookies.get('token') || localStorage.getItem('token')),
  loading: false,
  error: null,
  message: null,
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.message = action.payload.message
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.message = action.payload.message
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })

    // Load user
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
        state.error = null
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
      })

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.message = 'Profile updated successfully'
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload
        state.error = null
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = null
        state.message = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = null
        state.message = null
      })
  },
})

export const { clearError, clearMessage, setLoading } = authSlice.actions
export default authSlice.reducer
