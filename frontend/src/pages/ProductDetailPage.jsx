import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { toggleWishlistItem } from '../store/slices/wishlistSlice'
import productsAPI from '../services/productsAPI'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ProductCard from '../components/products/ProductCard_new'
import { formatCurrency } from '../utils/helpers'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [activeTab, setActiveTab] = useState('description')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { items: cartItems } = useSelector((state) => state.cart)

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productsAPI.getProduct(id)
      
      if (response.success) {
        setProduct(response.product)
        setRelatedProducts(response.relatedProducts || [])
        
        // Initialize selected variants
        if (response.product.variants?.length > 0) {
          const defaultVariants = {}
          response.product.variants.forEach(variant => {
            if (variant.options?.length > 0) {
              defaultVariants[variant.name] = variant.options[0].value
            }
          })
          setSelectedVariants(defaultVariants)
        }
      } else {
        setError('Product not found')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = product && wishlistItems.some(item => item._id === product._id)
  const isInStock = product && (product.stock > 0 || product.inStock === true)
  
  const handleAddToCart = async () => {
    if (!product || !isInStock || isAddingToCart) return
    
    setIsAddingToCart(true)
    dispatch(addToCart({
      product: product,
      quantity: quantity,
      variants: selectedVariants
    }))
    
    setTimeout(() => setIsAddingToCart(false), 1500)
  }

  const handleToggleWishlist = () => {
    if (!product) return
    dispatch(toggleWishlistItem(product))
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  const handleVariantChange = (variantName, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }))
  }

  const renderStars = (rating, size = 'w-4 h-4') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarSolidIcon key={i} className={`${size} text-yellow-400`} />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className={`${size} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarSolidIcon className={`${size} text-yellow-400`} />
          </div>
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className={`${size} text-gray-300`} />
      )
    }

    return stars
  }

  const getDiscountPercentage = () => {
    if (!product?.originalPrice || !product?.price) return 0
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - CartZ</title>
        <meta name="description" content={product.shortDescription || product.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
              <span className="text-gray-400">/</span>
              {product.category && (
                <>
                  <Link 
                    to={`/products?category=${product.category._id}`} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.category.name}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              )}
              <span className="text-gray-900 font-medium truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]?.url}
                    alt={product.images[selectedImage]?.alt || product.name}
                    className={`w-full h-full object-cover cursor-pointer ${isImageZoomed ? 'scale-150' : ''}`}
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xl">No Image</span>
                  </div>
                )}
                
                {/* Navigation arrows for multiple images */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.isNewProduct && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      New
                    </span>
                  )}
                  {getDiscountPercentage() > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      -{getDiscountPercentage()}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                
                {/* Rating and Reviews */}
                {product.rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)} ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-gray-600 mb-6">{product.shortDescription}</p>
                )}

                {/* Stock Status */}
                <div className="mb-6">
                  {isInStock ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckIcon className="w-5 h-5" />
                      <span>In Stock ({product.stock} available)</span>
                    </div>
                  ) : (
                    <div className="text-red-600 font-medium">Out of Stock</div>
                  )}
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {product.variants.map((variant) => (
                      <div key={variant.name}>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {variant.name}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleVariantChange(variant.name, option.value)}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                selectedVariants[variant.name] === option.value
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock || 1)}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isAddingToCart ? (
                      <LoadingSpinner size="small" color="white" />
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-3 border rounded-lg transition-colors ${
                      isInWishlist
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {isInWishlist ? (
                      <HeartSolidIcon className="w-6 h-6" />
                    ) : (
                      <HeartIcon className="w-6 h-6" />
                    )}
                  </button>

                  <button className="p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <ShareIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-3 text-sm">
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <Link 
                        to={`/products?category=${product.category._id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {product.category.name}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Shipping Info */}
                <div className="border-t pt-6 space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <TruckIcon className="w-5 h-5 text-green-600" />
                    <span>Free shipping on orders over ₹2,000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <ArrowPathIcon className="w-5 h-5 text-blue-600" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                    <span>2-year warranty included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: product.description?.replace(/\n/g, '<br>') || 'No description available.' }} />
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-gray-900">{spec.name}:</span>
                          <span className="text-gray-600">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No specifications available.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                              <div className="flex items-center">
                                {renderStars(review.rating, 'w-4 h-4')}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-gray-700">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <ProductCard 
                    key={relatedProduct._id} 
                    product={relatedProduct} 
                    viewMode="grid"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage
