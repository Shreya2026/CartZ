import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

import { logoutUser } from '../../store/slices/authSlice'
import { selectCartItemsCount } from '../../store/slices/cartSlice'
import { setMobileMenuOpen, selectMobileMenuOpen } from '../../store/slices/uiSlice'
import { selectWishlistItems } from '../../store/slices/wishlistSlice'
import Avatar from '../ui/Avatar'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const cartItemsCount = useSelector(selectCartItemsCount)
  const wishlistItems = useSelector(selectWishlistItems)
  const mobileMenuOpen = useSelector(selectMobileMenuOpen)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    setUserMenuOpen(false)
    navigate('/')
  }

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Products', href: '/products', current: location.pathname === '/products' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
  ]

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
  ]

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CartZ
                </span>
              </motion.div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    item.current
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  {item.current && (
                    <motion.div
                      layoutId="activeNavItem"
                      className="absolute inset-0 bg-purple-100 rounded-xl -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <span>Categories</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to={`/products?category=${encodeURIComponent(category)}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600 transition-colors duration-150"
                        >
                          {category}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              {isAuthenticated && (
                <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200">
                  <HeartIcon className="h-6 w-6" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-1 text-gray-700 hover:text-primary-600 transition-colors duration-200 rounded-full hover:bg-gray-100"
                  >
                    <Avatar 
                      user={user} 
                      size="sm" 
                      showOnlineStatus={true}
                    />
                    <ChevronDownIcon className="h-4 w-4 hidden md:block" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <Avatar user={user} size="md" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                              {user?.role === 'admin' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        >
                          Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="btn btn-outline btn-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              {/* Mobile Search */}
              <div className="px-4 py-3 border-b border-gray-200">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                    className={`${
                      item.current
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/products?category=${encodeURIComponent(category)}`}
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      {category}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth */}
                {isAuthenticated ? (
                  <div className="border-t border-gray-200 pt-3 mt-2">
                    <div className="flex items-center px-3 py-2 mb-3">
                      <Avatar user={user} size="md" />
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="flex items-center justify-between px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      <span>Cart</span>
                      {cartItemsCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      Wishlist
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => dispatch(setMobileMenuOpen(false))}
                        className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        dispatch(setMobileMenuOpen(false))
                      }}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="block px-3 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          />
        )}
      </AnimatePresence>

      {/* Click outside handlers */}
      {(userMenuOpen || categoriesOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setUserMenuOpen(false)
            setCategoriesOpen(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar
