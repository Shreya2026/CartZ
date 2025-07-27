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
      taxPrice,
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
    const calculatedTaxPrice = calculatedItemsPrice * 0.08 // 8% tax
    let calculatedShippingPrice = calculatedItemsPrice > 100 ? 0 : 10 // Free shipping over $100
    
    // Add COD charges if payment method is COD
    const codCharges = paymentMethod === 'cod' ? (calculatedItemsPrice > 500 ? 0 : 40) : 0
    calculatedShippingPrice += codCharges
    
    const calculatedTotalPrice = calculatedItemsPrice + calculatedTaxPrice + calculatedShippingPrice

    // Create order
    let createdOrder;
    try {
      console.log('Creating order with data:', {
        user: req.user._id,
        orderItems: orderItems.length,
        shippingAddress,
        paymentMethod,
        calculatedTotalPrice
      });

      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        paymentResult: paymentResult || {},
        itemsPrice: calculatedItemsPrice,
        taxPrice: calculatedTaxPrice,
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

    // Clear user's cart (optional - since we're using frontend cart)
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true, upsert: true }
    )

    // Populate the created order
    await createdOrder.populate([
      {
        path: 'user',
        select: 'name email'
      },
      {
        path: 'orderItems.product',
        select: 'name slug images'
      }
    ])

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
    const taxPrice = itemsPrice * 0.08 // 8% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10 // Free shipping over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice

    res.json({
      success: true,
      data: {
        cart,
        pricing: {
          itemsPrice: Number(itemsPrice.toFixed(2)),
          taxPrice: Number(taxPrice.toFixed(2)),
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
router.post('/', protect, processCheckout)
router.get('/session', protect, getCheckoutSession)

export default router
