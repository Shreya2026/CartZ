import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import cartSlice from './slices/cartSlice'
import productsSlice from './slices/productsSlice'
import categoriesSlice from './slices/categoriesSlice'
import ordersSlice from './slices/ordersSlice'
import wishlistSlice from './slices/wishlistSlice'
import uiSlice from './slices/uiSlice'
import checkoutSlice from './slices/checkoutSlice'
import adminSlice from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
    categories: categoriesSlice,
    orders: ordersSlice,
    wishlist: wishlistSlice,
    ui: uiSlice,
    checkout: checkoutSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Export types for TypeScript (if needed)
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
