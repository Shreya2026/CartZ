import React, { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

// Redux actions
import { loadUser } from './store/slices/authSlice'
import { loadCartFromStorage } from './store/slices/cartSlice'

// Layout components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Loading components
import LoadingSpinner from './components/ui/LoadingSpinner'
import PageLoader from './components/ui/PageLoader'

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'))
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'))
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'))
const CartPage = React.lazy(() => import('./pages/CartPage'))
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'))
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'))
const ProfilePage = React.lazy(() => import('./pages/user/ProfilePage'))
const OrdersPage = React.lazy(() => import('./pages/user/OrdersPage'))
const OrderDetailPage = React.lazy(() => import('./pages/user/OrderDetailPage'))
const WishlistPage = React.lazy(() => import('./pages/user/WishlistPage'))
const AboutPage = React.lazy(() => import('./pages/AboutPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))

// Admin pages (protected)
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'))
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'))

// Protected route component
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  if (loading) {
    return <PageLoader />
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />
  }

  return children
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
}

// Animated page wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="min-h-screen"
  >
    {children}
  </motion.div>
)

function App() {
  const dispatch = useDispatch()
  const { loading: authLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Load user from token if exists
    dispatch(loadUser())
    // Load cart from localStorage
    dispatch(loadCartFromStorage())
  }, [dispatch])

  if (authLoading) {
    return <PageLoader />
  }

  return (
    <>
      <Helmet>
        <title>CartZ - Premium E-commerce Store</title>
        <meta name="description" content="Discover amazing products at CartZ - Your premium online shopping destination with the best deals and fastest delivery." />
        <meta name="keywords" content="ecommerce, online shopping, fashion, electronics, deals, discounts" />
        <link rel="canonical" href="https://cartz.com" />
      </Helmet>

      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route 
                    path="/" 
                    element={
                      <AnimatedPage>
                        <HomePage />
                      </AnimatedPage>
                    } 
                  />
                  <Route 
                    path="/products" 
                    element={
                      <AnimatedPage>
                        <ProductsPage />
                      </AnimatedPage>
                    } 
                  />
                  <Route 
                    path="/products/:slug" 
                    element={
                      <AnimatedPage>
                        <ProductDetailPage />
                      </AnimatedPage>
                    } 
                  />
                  <Route 
                    path="/cart" 
                    element={
                      <AnimatedPage>
                        <CartPage />
                      </AnimatedPage>
                    } 
                  />
                  <Route 
                    path="/about" 
                    element={
                      <AnimatedPage>
                        <AboutPage />
                      </AnimatedPage>
                    } 
                  />
                  <Route 
                    path="/contact" 
                    element={
                      <AnimatedPage>
                        <ContactPage />
                      </AnimatedPage>
                    } 
                  />

                  {/* Auth routes */}
                  <Route 
                    path="/login" 
                    element={
                      <AnimatedPage>
                        <LoginPage />
                      </AnimatedPage>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <AnimatedPage>
                        <RegisterPage />
                      </AnimatedPage>
                    } 
                  />

                  {/* Protected user routes */}
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <AnimatedPage>
                          <CheckoutPage />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <AnimatedPage>
                          <ProfilePage />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <AnimatedPage>
                          <OrdersPage />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders/:id" 
                    element={
                      <ProtectedRoute>
                        <AnimatedPage>
                          <OrderDetailPage />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/wishlist" 
                    element={
                      <ProtectedRoute>
                        <AnimatedPage>
                          <WishlistPage />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AnimatedPage>
                          <AdminDashboard />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/products" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AnimatedPage>
                          <AdminProducts />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AnimatedPage>
                          <AdminOrders />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AnimatedPage>
                          <AdminUsers />
                        </AnimatedPage>
                      </ProtectedRoute>
                    } 
                  />

                  {/* 404 route */}
                  <Route 
                    path="*" 
                    element={
                      <AnimatedPage>
                        <NotFoundPage />
                      </AnimatedPage>
                    } 
                  />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App
