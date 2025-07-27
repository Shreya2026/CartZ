import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  notifications: [],
  modals: {
    quickView: {
      isOpen: false,
      product: null,
    },
    auth: {
      isOpen: false,
      mode: 'login', // 'login' or 'register'
    },
    confirmation: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
    },
  },
  toast: {
    isVisible: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
    message: '',
    duration: 4000,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      }
      state.notifications.unshift(notification)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    openModal: (state, action) => {
      const { modalType, data } = action.payload
      if (state.modals[modalType]) {
        state.modals[modalType].isOpen = true
        if (data) {
          Object.assign(state.modals[modalType], data)
        }
      }
    },
    closeModal: (state, action) => {
      const modalType = action.payload
      if (state.modals[modalType]) {
        state.modals[modalType].isOpen = false
        // Reset modal data
        if (modalType === 'quickView') {
          state.modals[modalType].product = null
        } else if (modalType === 'confirmation') {
          state.modals[modalType].title = ''
          state.modals[modalType].message = ''
          state.modals[modalType].onConfirm = null
        }
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalType => {
        state.modals[modalType].isOpen = false
      })
    },
    showToast: (state, action) => {
      const { type = 'info', message, duration = 4000 } = action.payload
      state.toast = {
        isVisible: true,
        type,
        message,
        duration,
      }
    },
    hideToast: (state) => {
      state.toast.isVisible = false
    },
    setAuthMode: (state, action) => {
      state.modals.auth.mode = action.payload
    },
  },
})

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setSearchOpen,
  toggleSearch,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  openModal,
  closeModal,
  closeAllModals,
  showToast,
  hideToast,
  setAuthMode,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectTheme = (state) => state.ui.theme
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectSearchOpen = (state) => state.ui.searchOpen
export const selectNotifications = (state) => state.ui.notifications
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read)
export const selectModal = (state, modalType) => state.ui.modals[modalType]
export const selectToast = (state) => state.ui.toast
