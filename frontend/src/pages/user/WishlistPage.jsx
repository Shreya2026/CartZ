import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { toggleWishlistItem, clearWishlist } from '../../store/slices/wishlistSlice'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'

const WishlistPage = () => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Filter wishlist items
  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const categoryName = item.category?.name || item.category
    const matchesCategory = selectedCategory === 'all' || categoryName === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.name.localeCompare(b.name)
      case 'newest':
      default:
        return new Date(b.addedAt || 0) - new Date(a.addedAt || 0)
    }
  })

  // Get unique categories
  const categories = [...new Set(wishlistItems.map(item => item.category?.name || item.category).filter(Boolean))]

  const handleRemoveFromWishlist = (item) => {
    dispatch(toggleWishlistItem(item))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      product: item,
      quantity: 1
    }))
    toast.success('Added to cart!')
  }

  const handleAddAllToCart = () => {
    const inStockItems = sortedItems.filter(item => (item.stock > 0))
    inStockItems.forEach(item => {
      dispatch(addToCart({
        product: item,
        quantity: 1
      }))
    })
    toast.success(`Added ${inStockItems.length} items to cart!`)
  }

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist())
      toast.success('Wishlist cleared')
    }
  }

  const WishlistItemCard = ({ item, index }) => {
    if (viewMode === 'list') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
        >
          <div className="flex">
            {/* Image */}
            <div className="relative w-48 h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">
              <img
                src={item.images?.[0]?.url || item.images?.[0] || '/placeholder-product.jpg'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                      {item.category?.name || item.category} • {item.brand}
                    </p>
                    <Link 
                      to={`/products/${item._id}`}
                      className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors group-hover:text-purple-600"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${item.price?.toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (item.inStock ?? (item.stock > 0))
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(item.inStock ?? (item.stock > 0)) ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!(item.inStock ?? (item.stock > 0))}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    !(item.inStock ?? (item.stock > 0))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    {(item.inStock ?? (item.stock > 0)) ? 'Add to Cart' : 'Out of Stock'}
                  </div>
                </button>
                
                <Link
                  to={`/products/${item._id}`}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <EyeIcon className="h-5 w-5 text-gray-600" />
                </Link>
                
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <ShareIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )
    }

    // Grid view
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
          <img
            src={item.images?.[0]?.url || item.images?.[0] || '/placeholder-product.jpg'}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg'
            }}
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-3">
              <Link
                to={`/products/${item._id}`}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-white transition-colors"
              >
                <EyeIcon className="h-5 w-5" />
              </Link>
              <button
                onClick={() => handleAddToCart(item)}
                disabled={!(item.inStock ?? (item.stock > 0))}
                className={`p-3 backdrop-blur-sm rounded-full shadow-lg transition-colors ${
                  (item.inStock ?? (item.stock > 0))
                    ? 'bg-purple-600/90 text-white hover:bg-purple-700'
                    : 'bg-gray-400/90 text-gray-200 cursor-not-allowed'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
              </button>
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-white transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={() => handleRemoveFromWishlist(item)}
            className="absolute top-4 right-4 p-2 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg text-white hover:bg-red-600 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          
          {/* Stock Status */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${
            (item.inStock ?? (item.stock > 0))
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {(item.inStock ?? (item.stock > 0)) ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-purple-600 font-medium mb-2 uppercase tracking-wider">
            {item.category?.name || item.category}
          </p>
          
          <Link 
            to={`/products/${item._id}`}
            className="text-lg font-bold text-gray-900 mb-3 block hover:text-purple-600 transition-colors group-hover:text-purple-600 line-clamp-2"
          >
            {item.name}
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${item.price?.toFixed(2)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!(item.inStock ?? (item.stock > 0))}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                !(item.inStock ?? (item.stock > 0))
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {(item.inStock ?? (item.stock > 0)) ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - CartZ | Save Your Favorite Products</title>
        <meta name="description" content="View and manage your saved products in your CartZ wishlist. Add to cart or remove items easily." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <HeartSolidIcon className="h-10 w-10 text-red-500" />
                  My Wishlist
                </h1>
                <p className="text-xl text-gray-600">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                </p>
              </div>
              
              {wishlistItems.length > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={handleAddAllToCart}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Add All to Cart
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="border border-red-300 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {wishlistItems.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-8">
                  Start adding products you love to your wishlist and they'll appear here.
                </p>
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Filters and Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search wishlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                      />
                    </div>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    )}

                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="name">Name A-Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'}
                    </span>
                    <div className="flex border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-gray-600'} rounded-l-lg transition-colors`}
                      >
                        <Squares2X2Icon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-gray-600'} rounded-r-lg transition-colors`}
                      >
                        <ListBulletIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Wishlist Items */}
              <AnimatePresence>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {sortedItems.map((item, index) => (
                    <WishlistItemCard key={item._id} item={item} index={index} />
                  ))}
                </div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default WishlistPage
