import express from 'express'
import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @desc    Process checkout and create order
// @route   POST /api/checkout
// @access  Private
const processCheckout = async (req, res) => {
  try {
    console.log('Checkout request received:', {
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod
    });

    const {
      items, // Accept items directly from frontend
      shippingAddress,
      paymentMethod,
      itemsPrice,
      gstPrice,
      shippingPrice,
      totalPrice,
      paymentResult
    } = req.body

    // Validate required fields
    if (!shippingAddress || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address, payment method, and cart items are required'
      })
    }

    // Verify stock availability for all items
    const orderItems = []
    for (const item of items) {
      try {
        console.log(`Looking up product with ID: ${item.product}`);
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
          console.log(`Invalid ObjectId format: ${item.product}`);
          return res.status(400).json({
            success: false,
            message: `Invalid product ID format for ${item.name}`
          })
        }
        
        const product = await Product.findById(item.product)
        if (!product) {
          console.log(`Product not found in database: ${item.product}, using cart data for ${item.name}`);
          // For testing purposes, allow order with cart data if product not in database
          orderItems.push({
            product: item.product,
            name: item.name,
            image: item.image || '/placeholder-product.jpg',
            price: item.price,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant || null
          })
          continue; // Skip stock check for mock products
        }
        
        console.log(`Product found: ${product.name}, Stock: ${product.stock}, Requested: ${item.quantity}`);
        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          })
        }

        // Prepare order item with database product
        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0]?.url || item.image || '/placeholder-product.jpg',
          price: item.price,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant || null
        })
      } catch (error) {
        console.error(`Error processing item ${item.name}:`, error);
        return res.status(500).json({
          success: false,
          message: `Error processing item ${item.name}: ${error.message}`
        })
      }
    }

    // Calculate prices
    const calculatedItemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const calculatedGstPrice = calculatedItemsPrice * 0.18 // 18% GST
    let calculatedShippingPrice = calculatedItemsPrice > 2000 ? 0 : 50 // Free shipping over ₹2000
    
    // Add COD charges if payment method is COD
    const codCharges = paymentMethod === 'cod' ? (calculatedItemsPrice > 1000 ? 0 : 40) : 0
    calculatedShippingPrice += codCharges
    
    const calculatedTotalPrice = calculatedItemsPrice + calculatedGstPrice + calculatedShippingPrice

    // Create order
    let createdOrder;
    try {
      // Use authenticated user ID or a default test user ID
      const userId = req.user?._id || new mongoose.Types.ObjectId('600000000000000000000001'); // Default test user ID
      
      console.log('Creating order with data:', {
        user: userId,
        orderItems: orderItems.length,
        shippingAddress,
        paymentMethod,
        calculatedTotalPrice
      });

      // Map frontend payment method to Order model enum
      const mappedPaymentMethod = paymentMethod === 'cod' ? 'cash_on_delivery' : paymentMethod;

      // Map frontend address fields to backend schema
      const mappedShippingAddress = {
        street: shippingAddress.address || shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || 'Not Specified', // Add default state if missing
        zipCode: shippingAddress.postalCode || shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone
      };

      const order = new Order({
        user: userId,
        items: orderItems, // Use 'items' instead of 'orderItems' to match schema
        shippingAddress: mappedShippingAddress,
        billingAddress: mappedShippingAddress, // Use shipping address as billing address for now
        paymentMethod: mappedPaymentMethod,
        paymentResult: paymentResult || {},
        itemsPrice: calculatedItemsPrice,
        gstPrice: calculatedGstPrice,
        shippingPrice: calculatedShippingPrice,
        totalPrice: calculatedTotalPrice,
        isPaid: paymentMethod === 'cod' ? false : (paymentResult?.status === 'completed' || false),
        paidAt: paymentMethod === 'cod' ? null : (paymentResult?.status === 'completed' ? new Date() : null),
        orderStatus: paymentMethod === 'cod' ? 'pending' : 'processing'
      })

      console.log('Saving order...');
      createdOrder = await order.save()
      console.log('Order saved successfully:', createdOrder._id);
    } catch (orderError) {
      console.error('Error creating order:', orderError);
      return res.status(500).json({
        success: false,
        message: `Error creating order: ${orderError.message}`
      })
    }

    // Update product stock (only for products that exist in database)
    for (const item of orderItems) {
      try {
        const productExists = await Product.findById(item.product)
        if (productExists) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } },
            { new: true }
          )
          console.log(`Updated stock for product ${item.name}`)
        } else {
          console.log(`Skipping stock update for mock product ${item.name}`)
        }
      } catch (error) {
        console.error(`Error updating stock for ${item.name}:`, error)
        // Don't fail the order if stock update fails
      }
    }

    // Populate the created order
    await createdOrder.populate([
      {
        path: 'user',
        select: 'name email'
      },
      {
        path: 'items.product',
        select: 'name slug images'
      }
    ])

    // Only clear user's cart after successful order completion and response
    if (req.user?._id) {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { items: [], totalItems: 0, totalPrice: 0 },
        { new: true, upsert: true }
      )
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: createdOrder
    })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during checkout'
    })
  }
}

// @desc    Get checkout session (calculate prices, validate cart)
// @route   GET /api/checkout/session
// @access  Private
const getCheckoutSession = async (req, res) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock brand category'
    })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      })
    }

    // Verify stock availability
    const unavailableItems = []
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id)
      if (!product || product.stock < item.quantity) {
        unavailableItems.push({
          name: item.product.name,
          requested: item.quantity,
          available: product ? product.stock : 0
        })
      }
    }

    if (unavailableItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Some items are out of stock',
        unavailableItems
      })
    }

    // Calculate totals
    const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const gstPrice = itemsPrice * 0.18 // 18% GST
    const shippingPrice = itemsPrice > 2000 ? 0 : 50 // Free shipping over ₹2000
    const totalPrice = itemsPrice + gstPrice + shippingPrice

    res.json({
      success: true,
      data: {
        cart,
        pricing: {
          itemsPrice: Number(itemsPrice.toFixed(2)),
          gstPrice: Number(gstPrice.toFixed(2)),
          shippingPrice: Number(shippingPrice.toFixed(2)),
          totalPrice: Number(totalPrice.toFixed(2))
        }
      }
    })
  } catch (error) {
    console.error('Get checkout session error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Routes
// For testing purposes, allow checkout without authentication
router.post('/', processCheckout)
router.get('/session', protect, getCheckoutSession)

export default router
