import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
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
import productsAPI from '../services/productsAPI'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State for products and loading
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Available options (will be loaded from API)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  // Initialize filters from URL parameters and load initial data
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    const brandParam = searchParams.get('brand')
    const sortParam = searchParams.get('sort')
    
    if (categoryParam) setSelectedCategory(categoryParam)
    if (searchParam) setSearchQuery(searchParam)
    if (brandParam) setSelectedBrand(brandParam)
    if (sortParam) setSortBy(sortParam)
    
    // Load categories once
    loadCategories()
  }, [searchParams])

  // Load products when filters change (including initial load)
  useEffect(() => {
    loadProducts()
  }, [currentPage, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy])

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getCategories()
      if (response.success) {
        setCategories(response.categories || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      }

      // Add search query
      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim()
      }

      // Add category filter
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory
      }

      // Add brand filter
      if (selectedBrand && selectedBrand !== 'all') {
        params.brand = selectedBrand
      }

      // Add price range filter
      if (priceRange[0] > 0) {
        params.minPrice = priceRange[0]
      }
      if (priceRange[1] < 1000) {
        params.maxPrice = priceRange[1]
      }

      const response = await productsAPI.getProducts(params)
      
      if (response.success) {
        setProducts(response.products || [])
        setTotalPages(response.pagination?.pages || 1)
        setTotalProducts(response.total || 0)
        
        // Extract brands from products for filter
        const uniqueBrands = [...new Set(response.products.map(p => p.brand).filter(Boolean))]
        setBrands(uniqueBrands)
      } else {
        setError(response.message || 'Failed to load products')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const [inStockOnly, setInStockOnly] = useState(false)

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams)
    if (e.target.value.trim()) {
      newParams.set('search', e.target.value.trim())
    } else {
      newParams.delete('search')
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams)
    if (category === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', category)
    }
    newParams.delete('page') // Reset page when filtering
    setSearchParams(newParams)
  }

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand)
    setCurrentPage(1)
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams)
    if (brand === 'all') {
      newParams.delete('brand')
    } else {
      newParams.set('brand', brand)
    }
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    setCurrentPage(1)
    
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', sort)
    newParams.delete('page')
    setSearchParams(newParams)
  }

  const handlePriceRangeChange = (range) => {
    setPriceRange(range)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedBrand('all')
    setPriceRange([0, 1000])
    setSortBy('newest')
    setCurrentPage(1)
  }

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                      onChange={handleSearch}
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
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id || category.name || category} value={category._id || category.name || category}>
                        {category.name || category}
                      </option>
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
                    onChange={(e) => handleBrandChange(e.target.value)}
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
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
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
                      {totalProducts} products found
                    </span>
                    {currentPage > 1 && (
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="newest">Newest First</option>
                        <option value="name-a-z">Name A-Z</option>
                        <option value="name-z-a">Name Z-A</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="popularity">Most Popular</option>
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
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                      onClick={loadProducts}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              ) : products.length === 0 ? (
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
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                  >
                    <AnimatePresence>
                      {products.map((product, index) => (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex justify-center mt-12"
                    >
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-2">
                          {/* Previous button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Previous
                          </button>

                          {/* Page numbers */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          {/* Next button */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductsPage
