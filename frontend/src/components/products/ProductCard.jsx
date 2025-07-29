import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleWishlistItem } from '../../store/slices/wishlistSlice'

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch()
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isInWishlist = wishlistItems.some(item => item._id === product._id)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAddingToCart(true)
    dispatch(addToCart({
      product: product,
      quantity: 1
    }))
    
    // Add a small delay for visual feedback
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
        <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.discount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  -{product.discount}%
                </motion.div>
              )}
              
              {product.isFeatured && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
                >
                  <SparklesIcon className="h-3 w-3" />
                  Featured
                </motion.div>
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
              
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isHovered ? 1 : 0, 
                  opacity: isHovered ? 1 : 0 
                }}
                transition={{ delay: 0.2 }}
              >
                <div
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EyeIcon className="h-5 w-5" />
                </div>
              </motion.div>
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
              <motion.button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-2xl font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isAddingToCart
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {product.stock === 0 ? (
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
              </motion.button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category */}
            <p className="text-sm text-purple-600 font-medium mb-2 uppercase tracking-wider">
              {product.category?.name || product.category}
            </p>
            
            {/* Product Name */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-green-500' :
                  product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className={`text-xs font-medium ${
                  product.stock > 10 ? 'text-green-600' :
                  product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.stock > 10 ? 'In Stock' :
                   product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
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
