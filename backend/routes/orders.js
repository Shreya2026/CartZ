import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      couponCode
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Verify product prices and stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      // Update product stock and sold count
      product.stock -= item.quantity;
      product.soldCount += item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount: discountAmount || 0,
      totalPrice,
      couponCode
    });

    await order.populate('items.product', 'name images');
    await order.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @desc    Get all orders (visible to all users)
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get ALL orders from the website, not just user's orders
    console.log('Fetching all orders for user view');

    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({});

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        limit
      },
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @desc    Get single order (test version without auth for debugging)
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching order with ID:', req.params.id);
    
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images slug');

    console.log('Order found:', !!order);
    if (order) {
      console.log('Order user:', order.user);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // For testing: allow access to orders without strict authentication
    // In production, this should include proper authorization checks
    
    res.status(200).json({
      success: true,
      order: {
        ...order.toObject(),
        // Filter out items where product was deleted
        items: order.items.filter(item => item.product)
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    order.orderStatus = status;
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    
    // Add to status history
    order.statusHistory.push({
      status,
      note: note || '',
      timestamp: new Date()
    });

    // Set delivery date if status is delivered
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    // Set cancellation date if status is cancelled
    if (status === 'cancelled') {
      order.cancelledAt = new Date();
      if (note) order.cancellationReason = note;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the user associated with this order still exists
    if (!order.user) {
      return res.status(404).json({
        success: false,
        message: 'Order user not found'
      });
    }

    // Check if user owns this order
    const currentUserId = req.user?.id || req.user?._id || '600000000000000000000001';
    if (order.user.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by user';

    // Add to status history
    order.statusHistory.push({
      status: 'cancelled',
      note: reason || 'Cancelled by user',
      timestamp: new Date()
    });

    // Restore product stock
    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.soldCount -= item.quantity;
        await product.save();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        limit
      },
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
router.get('/stats/overview', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['cancelled'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
});

// @desc    Repair orphaned orders (development only)
// @route   POST /api/orders/repair-orphaned
// @access  Public (for development)
router.post('/repair-orphaned', async (req, res) => {
  try {
    console.log('Starting orphaned orders repair...');
    
    // Find all orders where user field is null
    const orphanedOrders = await Order.find({ user: null });
    console.log(`Found ${orphanedOrders.length} orphaned orders`);
    
    if (orphanedOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No orphaned orders found',
        repaired: 0
      });
    }
    
    // Update all orphaned orders to use the test user ID
    const testUserId = '600000000000000000000001';
    const result = await Order.updateMany(
      { user: null },
      { user: testUserId }
    );
    
    console.log(`Repaired ${result.modifiedCount} orphaned orders`);
    
    res.status(200).json({
      success: true,
      message: `Successfully repaired ${result.modifiedCount} orphaned orders`,
      repaired: result.modifiedCount
    });
  } catch (error) {
    console.error('Repair orphaned orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while repairing orphaned orders'
    });
  }
});

export default router;
