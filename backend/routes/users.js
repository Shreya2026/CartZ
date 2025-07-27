import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'wishlist',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist'
    });
  }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist'
    });
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.wishlist = user.wishlist.filter(
      item => item.toString() !== req.params.productId
    );
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist'
    });
  }
});

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', protect, async (req, res) => {
  try {
    const { street, city, state, zipCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.user.id);

    // If this is set as default, unset others
    if (isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      street,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault: isDefault || user.address.length === 0 // First address is default
    };

    user.address.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.address
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding address'
    });
  }
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.address.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, unset others
    if (req.body.isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.address.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = address.isDefault;
    user.address.pull(req.params.addressId);

    // If deleted address was default, make first remaining address default
    if (wasDefault && user.address.length > 0) {
      user.address[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.address
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        limit
      },
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user role'
    });
  }
});

export default router;
