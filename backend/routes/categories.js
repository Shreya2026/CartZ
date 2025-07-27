import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Category from '../models/Category.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories')
      .sort({ featuredOrder: -1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    let category;
    
    // Check if the parameter is a MongoDB ObjectId or a slug
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(req.params.id);
    } else {
      category = await Category.findOne({ slug: req.params.id });
    }

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.populate('subcategories');

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Soft delete - just mark as inactive
    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
});

export default router;
