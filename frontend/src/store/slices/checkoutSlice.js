import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { checkoutAPI } from '../../services/checkoutService'

// Async thunks
export const getCheckoutSession = createAsyncThunk(
  'checkout/getSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkoutAPI.getCheckoutSession()
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get checkout session')
    }
  }
)

export const processCheckout = createAsyncThunk(
  'checkout/process',
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await checkoutAPI.processCheckout(checkoutData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to process checkout')
    }
  }
)

const initialState = {
  // Checkout session data
  cart: null,
  pricing: {
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0
  },
  
  // Shipping information
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  },
  
  // Payment information
  paymentMethod: 'cod', // Default to COD for convenience
  
  // Order information
  currentOrder: null,
  
  // UI states
  loading: false,
  processing: false,
  error: null,
  step: 'shipping', // shipping, payment, review, complete
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    // Set shipping address
    setShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload }
    },
    
    // Set payment method
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
    },
    
    // Set checkout step
    setCheckoutStep: (state, action) => {
      state.step = action.payload
    },
    
    // Reset checkout state
    resetCheckout: (state) => {
      state.cart = null
      state.pricing = initialState.pricing
      state.currentOrder = null
      state.loading = false
      state.processing = false
      state.error = null
      state.step = 'shipping'
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get checkout session
      .addCase(getCheckoutSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCheckoutSession.fulfilled, (state, action) => {
        state.loading = false
        state.cart = action.payload.cart
        state.pricing = action.payload.pricing
      })
      .addCase(getCheckoutSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Process checkout
      .addCase(processCheckout.pending, (state) => {
        state.processing = true
        state.error = null
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.processing = false
        state.currentOrder = action.payload.data || action.payload
        state.step = 'complete'
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.processing = false
        state.error = action.payload
      })
  },
})

export const {
  setShippingAddress,
  setPaymentMethod,
  setCheckoutStep,
  resetCheckout,
  clearError,
} = checkoutSlice.actions

export default checkoutSlice.reducer

// Selectors
export const selectCheckoutCart = (state) => state.checkout.cart
export const selectCheckoutPricing = (state) => state.checkout.pricing
export const selectShippingAddress = (state) => state.checkout.shippingAddress
export const selectPaymentMethod = (state) => state.checkout.paymentMethod
export const selectCheckoutStep = (state) => state.checkout.step
export const selectCurrentOrder = (state) => state.checkout.currentOrder
export const selectCheckoutLoading = (state) => state.checkout.loading
export const selectCheckoutProcessing = (state) => state.checkout.processing
export const selectCheckoutError = (state) => state.checkout.error
