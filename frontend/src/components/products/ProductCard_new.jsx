import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleWishlistItem } from '../../store/slices/wishlistSlice'
import { formatCurrency } from '../../utils/helpers'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isInWishlist = wishlistItems.some(item => item._id === product._id)
  
  // Helper function to check if product is in stock
  const isInStock = product.stock > 0 || product.inStock === true

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isInStock || isAddingToCart) return
    
    setIsAddingToCart(true)
    console.log('Product being added to cart:', product)
    console.log('Product images:', product.images)
    dispatch(addToCart({
      product: product,
      quantity: 1
    }))
    
    setTimeout(() => setIsAddingToCart(false), 1500)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlistItem(product))
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={fullStars + i + 1} className="h-4 w-4 text-gray-300" />
      )
    }

    return stars
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/products/${product._id}`} className="block">
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200">
            <div className="flex">
              {/* Image */}
              <div className="relative w-48 h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">
                <img
                  src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.isSale && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      SALE
                    </div>
                  )}
                  {product.isNew && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NEW
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                      {typeof product.category === 'object' ? product.category?.name : product.category} • {product.brand}
                    </p>
                    <button
                      onClick={handleToggleWishlist}
                      className={`p-1 rounded-full transition-colors ${
                        isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      {isInWishlist ? (
                        <HeartSolidIcon className="h-5 w-5" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.rating || 0)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.numReviews || 0})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !isInStock}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      !isInStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isAddingToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    {!isInStock ? 'Out of Stock' : isAddingToCart ? 'Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
            <img
              src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isSale && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  SALE
                </div>
              )}
              {product.isNew && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NEW
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ delay: 0.1 }}
                onClick={handleToggleWishlist}
                className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  isInWishlist 
                    ? 'bg-red-500/90 text-white' 
                    : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </motion.button>
              
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ delay: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
              >
                <EyeIcon className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Quick Add to Cart */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ 
                y: isHovered ? 0 : 100, 
                opacity: isHovered ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isInStock}
                className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  !isInStock
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {!isInStock ? (
                  'Out of Stock'
                ) : isAddingToCart ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Added!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingCartIcon className="h-5 w-5" />
                    Add to Cart
                  </div>
                )}
              </button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-purple-600 font-medium mb-2 uppercase tracking-wider">
              {typeof product.category === 'object' ? product.category?.name : product.category}
            </p>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.numReviews || 0})
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  isInStock ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-xs font-medium ${
                  isInStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
