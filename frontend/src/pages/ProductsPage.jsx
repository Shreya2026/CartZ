import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'
import ProductCard from '../components/products/ProductCard_new'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ProductsPage = () => {
  // Mock data - replace with API call
  const mockProducts = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      numReviews: 256,
      category: 'Electronics',
      brand: 'AudioMax',
      inStock: true,
      isNew: true,
      isSale: true,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.5,
      numReviews: 189,
      category: 'Electronics',
      brand: 'FitTech',
      inStock: true,
      isNew: false,
      isSale: true,
      images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
      description: 'Advanced fitness tracking with heart rate monitoring'
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Designer Leather Jacket',
      price: 449.99,
      originalPrice: null,
      rating: 4.9,
      numReviews: 124,
      category: 'Fashion',
      brand: 'StyleCo',
      inStock: true,
      isNew: true,
      isSale: false,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
      description: 'Premium leather jacket with modern design'
    },
    {
      _id: '507f1f77bcf86cd799439014',
      name: 'Organic Coffee Beans',
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.7,
      numReviews: 89,
      category: 'Food',
      brand: 'BrewMaster',
      inStock: true,
      isNew: false,
      isSale: true,
      images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
      description: 'Single-origin organic coffee beans, medium roast'
    },
    {
      _id: '507f1f77bcf86cd799439015',
      name: 'Yoga Mat Pro',
      price: 89.99,
      originalPrice: null,
      rating: 4.6,
      numReviews: 167,
      category: 'Sports',
      brand: 'ZenFit',
      inStock: false,
      isNew: false,
      isSale: false,
      images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
      description: 'Professional-grade yoga mat with superior grip'
    },
    {
      _id: '507f1f77bcf86cd799439016',
      name: 'Wireless Gaming Mouse',
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.4,
      numReviews: 203,
      category: 'Electronics',
      brand: 'GamePro',
      inStock: true,
      isNew: false,
      isSale: true,
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
      description: 'High-precision wireless gaming mouse with RGB lighting'
    }
  ]

  const [products, setProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [inStockOnly, setInStockOnly] = useState(false)

  // Get unique categories and brands
  const categories = useMemo(() => 
    [...new Set(products.map(p => p.category))], [products]
  )
  
  const brands = useMemo(() => 
    [...new Set(products.map(p => p.brand))], [products]
  )

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesStock = !inStockOnly || product.inStock
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return b.isNew - a.isNew
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, inStockOnly])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setPriceRange([0, 1000])
    setSortBy('name')
    setInStockOnly(false)
  }

  return (
    <>
      <Helmet>
        <title>Products - CartZ | Premium Shopping Collection</title>
        <meta name="description" content="Discover our extensive collection of premium products. From electronics to fashion, find everything you need at CartZ." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Products
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Discover amazing products carefully curated for quality and style.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-80"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* In Stock Filter */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-8"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {filteredProducts.length} products found
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="name">Name A-Z</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>

                    {/* View Mode */}
                    <div className="flex border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'} rounded-l-lg transition-colors`}
                      >
                        <Squares2X2Icon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'} rounded-r-lg transition-colors`}
                      >
                        <ListBulletIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-12">
                    <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                >
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductsPage
