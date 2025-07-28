import { createSlice } from '@reduxjs/toolkit'

// Load cart from localStorage
const loadStoredCart = () => {
  try {
    const cartData = localStorage.getItem('cart')
    if (cartData) {
      const parsedCart = JSON.parse(cartData)
      return {
        items: parsedCart.items || [],
        totalItems: parsedCart.totalItems || 0,
        totalAmount: parsedCart.totalAmount || parsedCart.totalPrice || 0,
        shippingAddress: parsedCart.shippingAddress || null,
        paymentMethod: parsedCart.paymentMethod || null,
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  
  return {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    shippingAddress: null,
    paymentMethod: null,
  }
}

// Save cart to localStorage
const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartState))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Calculate cart totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalAmount = items.reduce((total, item) => {
    const price = item.selectedVariant?.price || item.price
    return total + (price * item.quantity)
  }, 0)
  
  return { totalItems, totalAmount }
}

// Initial state
const initialState = {
  ...loadStoredCart(),
  isOpen: false,
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Load cart from storage
    loadCartFromStorage: (state) => {
      const cartData = loadStoredCart()
      state.items = cartData.items
      state.totalItems = cartData.totalItems
      state.totalAmount = cartData.totalAmount
      state.shippingAddress = cartData.shippingAddress
      state.paymentMethod = cartData.paymentMethod
    },

    // Add item to cart
    addToCart: (state, action) => {
      const { product, quantity = 1, selectedVariant = null } = action.payload
      
      const existingItemIndex = state.items.findIndex(item => {
        const isSameProduct = item.id === product._id
        const isSameVariant = selectedVariant
          ? item.selectedVariant?.value === selectedVariant.value
          : !item.selectedVariant
        return isSameProduct && isSameVariant
      })

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        state.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        const newItem = {
          id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg',
          quantity,
          selectedVariant,
          stock: product.stock,
          brand: product.brand,
          category: product.category?.name,
        }
        state.items.push(newItem)
      }

      // Recalculate totals
      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalAmount = totals.totalAmount

      // Save to localStorage
      saveCartToStorage({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      })
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const { id, selectedVariant } = action.payload
      
      state.items = state.items.filter(item => {
        const isSameProduct = item.id === id
        const isSameVariant = selectedVariant
          ? item.selectedVariant?.value === selectedVariant.value
          : !item.selectedVariant
        return !(isSameProduct && isSameVariant)
      })

      // Recalculate totals
      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalAmount = totals.totalAmount

      // Save to localStorage
      saveCartToStorage({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      })
    },

    // Update item quantity
    updateQuantity: (state, action) => {
      const { id, quantity, selectedVariant } = action.payload
      
      const itemIndex = state.items.findIndex(item => {
        const isSameProduct = item.id === id
        const isSameVariant = selectedVariant
          ? item.selectedVariant?.value === selectedVariant.value
          : !item.selectedVariant
        return isSameProduct && isSameVariant
      })

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1)
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity
        }

        // Recalculate totals
        const totals = calculateTotals(state.items)
        state.totalItems = totals.totalItems
        state.totalAmount = totals.totalAmount

        // Save to localStorage
        saveCartToStorage({
          items: state.items,
          totalItems: state.totalItems,
          totalAmount: state.totalAmount,
          shippingAddress: state.shippingAddress,
          paymentMethod: state.paymentMethod,
        })
      }
    },

    // Clear cart
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
      
      // Save to localStorage
      saveCartToStorage({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      })
    },

    // Toggle cart drawer
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },

    // Open cart drawer
    openCart: (state) => {
      state.isOpen = true
    },

    // Close cart drawer
    closeCart: (state) => {
      state.isOpen = false
    },

    // Set shipping address
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
      
      // Save to localStorage
      saveCartToStorage({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      })
    },

    // Set payment method
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
      
      // Save to localStorage
      saveCartToStorage({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        shippingAddress: state.shippingAddress,
        paymentMethod: state.paymentMethod,
      })
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loadCartFromStorage,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setShippingAddress,
  setPaymentMethod,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => state.cart.totalAmount
export const selectCartItemsCount = (state) => state.cart.totalItems
export const selectCartIsOpen = (state) => state.cart.isOpen
export const selectShippingAddress = (state) => state.cart.shippingAddress
export const selectPaymentMethod = (state) => state.cart.paymentMethod

// Helper function to get item from cart
export const selectCartItem = (state, productId, selectedVariant = null) => {
  return state.cart.items.find(item => {
    const isSameProduct = item.id === productId
    const isSameVariant = selectedVariant
      ? item.selectedVariant?.value === selectedVariant.value
      : !item.selectedVariant
    return isSameProduct && isSameVariant
  })
}
