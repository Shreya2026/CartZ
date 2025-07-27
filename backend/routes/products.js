import express from 'express';
import { protect, admin, optionalAuth } from '../middleware/auth.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    let query = { isActive: true };

    // Search by keyword
    if (req.query.keyword) {
      query.$text = { $search: req.query.keyword };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by subcategory
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }

    // Filter by brand
    if (req.query.brand) {
      query.brand = { $regex: req.query.brand, $options: 'i' };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Filter by rating
    if (req.query.rating) {
      query.rating = { $gte: parseFloat(req.query.rating) };
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }

    // Filter featured products
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Filter new products
    if (req.query.isNew === 'true') {
      query.isNew = true;
    }

    // Filter by stock status
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sort options
    let sortQuery = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sortQuery = { price: 1 };
          break;
        case 'price-high':
          sortQuery = { price: -1 };
          break;
        case 'rating':
          sortQuery = { rating: -1 };
          break;
        case 'newest':
          sortQuery = { createdAt: -1 };
          break;
        case 'oldest':
          sortQuery = { createdAt: 1 };
          break;
        case 'name-a-z':
          sortQuery = { name: 1 };
          break;
        case 'name-z-a':
          sortQuery = { name: -1 };
          break;
        case 'popularity':
          sortQuery = { soldCount: -1, viewCount: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
    } else {
      sortQuery = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page,
        pages: totalPages,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
        limit
      },
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    let product;
    
    // Check if the parameter is a MongoDB ObjectId or a slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    } else {
      product = await Product.findOne({ slug: req.params.id });
    }

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Populate references
    await product.populate('category', 'name slug');
    await product.populate('subcategory', 'name slug');
    await product.populate('reviews.user', 'name avatar');

    // Increment view count
    product.viewCount += 1;
    await product.save();

    // Get related products
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category._id,
      isActive: true
    })
    .populate('category', 'name slug')
    .limit(8)
    .lean();

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    // Generate SKU if not provided
    if (!req.body.sku) {
      const timestamp = Date.now().toString();
      req.body.sku = `CZ${timestamp.slice(-8)}`;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Add new review
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment: comment || ''
    };

    product.reviews.push(review);
    product.updateRating();
    await product.save();

    // Populate the user field in the new review
    await product.populate('reviews.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      reviews: product.reviews
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Paginate reviews
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const reviews = product.reviews.slice(startIndex, endIndex);
    const total = product.reviews.length;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit
      },
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
router.get('/new/arrivals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({ 
      isNew: true, 
      isActive: true 
    })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching new arrivals'
    });
  }
});

export default router;
