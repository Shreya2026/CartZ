import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import Button from '../ui/Button'

const ProductFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange,
  categories = [],
  priceRange = { min: 0, max: 1000 },
  onPriceRangeChange,
  onClearFilters 
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  const handlePriceChange = (type, value) => {
    const newRange = { ...localPriceRange, [type]: parseFloat(value) }
    setLocalPriceRange(newRange)
    onPriceRangeChange(newRange)
  }

  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Best Rating', value: 'rating' },
    { label: 'Best Selling', value: 'sales' }
  ]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sort || 'featured'}
                onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
              {Object.keys(filters).length > 1 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {Object.keys(filters).length - 1}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <motion.div
          initial={false}
          animate={{ height: isFiltersOpen ? 'auto' : 0, opacity: isFiltersOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories?.includes(category._id) || false}
                        onChange={(e) => {
                          const currentCategories = filters.categories || []
                          const newCategories = e.target.checked
                            ? [...currentCategories, category._id]
                            : currentCategories.filter(id => id !== category._id)
                          onFilterChange({ ...filters, categories: newCategories })
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localPriceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localPriceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => onFilterChange({ ...filters, rating })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock || false}
                      onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale || false}
                      onChange={(e) => onFilterChange({ ...filters, onSale: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Sale</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={onClearFilters}
                variant="outline"
                size="sm"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductFilters
