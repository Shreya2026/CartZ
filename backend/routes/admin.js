import express from 'express'
import { protect } from '../middleware/auth.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

const router = express.Router()

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', protect, adminMiddleware, async (req, res) => {
  try {
    // Get statistics
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    
    // Get revenue statistics (only from delivered orders)
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' },
          deliveredOrdersCount: { $sum: 1 }
        }
      }
    ])

    // Also get all orders count for debugging
    const allOrdersCount = await Order.countDocuments()
    const deliveredOrdersCount = await Order.countDocuments({ orderStatus: 'delivered' })
    const paidOrdersCount = await Order.countDocuments({ isPaid: true })

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderNumber totalPrice orderStatus createdAt user')

    // Get monthly revenue for last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue: revenueStats[0]?.totalRevenue || 0,
          averageOrderValue: revenueStats[0]?.averageOrderValue || 0
        },
        recentOrders,
        monthlyRevenue,
        orderStatusStats,
        debug: {
          allOrdersCount,
          deliveredOrdersCount,
          paidOrdersCount,
          revenueStats: revenueStats[0] || null
        }
      }
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    })
  }
})

// @route   GET api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', protect, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalUsers = await User.countDocuments()
    const totalPages = Math.ceil(totalUsers / limit)

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    })
  }
})

// @route   GET api/admin/orders
// @desc    Get all orders with pagination and filtering
// @access  Private (Admin only)
router.get('/orders', protect, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    const status = req.query.status

    // Build filter
    const filter = {}
    if (status && status !== 'all') {
      filter.orderStatus = status
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalOrders = await Order.countDocuments(filter)
    const totalPages = Math.ceil(totalOrders / limit)

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    })
  }
})

// @route   PUT api/admin/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put('/orders/:id/status', protect, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      })
    }

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    order.orderStatus = status
    
    // Set delivered date and mark as paid if status is delivered
    if (status === 'delivered') {
      order.deliveredAt = new Date()
      order.isPaid = true
      order.paidAt = new Date()
    }

    await order.save()

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    })
  }
})

// @route   GET api/admin/products
// @desc    Get all products with pagination
// @access  Private (Admin only)
router.get('/products', protect, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalProducts = await Product.countDocuments()
    const totalPages = Math.ceil(totalProducts / limit)

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    })
  }
})

// @route   DELETE api/admin/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete('/products/:id', protect, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    })
  }
})

// @route   GET api/admin/debug/orders
// @desc    Debug endpoint to check orders
// @access  Private (Admin only)
router.get('/debug/orders', protect, adminMiddleware, async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate('user', 'name email')
      .select('orderNumber totalPrice orderStatus isPaid paidAt deliveredAt createdAt user')
      .sort({ createdAt: -1 })
      .limit(20)

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalPrice' }
        }
      }
    ])

    res.json({
      success: true,
      data: {
        orders: allOrders,
        statusCounts,
        totalOrdersInDB: await Order.countDocuments()
      }
    })
  } catch (error) {
    console.error('Debug orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching debug data',
      error: error.message
    })
  }
})

export default router
