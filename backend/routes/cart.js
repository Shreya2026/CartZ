import express from 'express'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock brand category'
    })

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
      await cart.save()
    }

    res.json({
      success: true,
      data: cart
    })
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariant = null } = req.body

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      })
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      })
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      })
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId.toString() && 
      item.selectedVariant === selectedVariant
    )

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity
      
      // Check total stock availability
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Cannot add more items. Stock limit exceeded'
        })
      }
      
      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        selectedVariant,
        price: product.price
      })
    }

    await cart.save()

    // Populate cart for response
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock brand category'
    })

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    const item = cart.items.find(item => item._id.toString() === itemId)
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }

    // Check stock availability
    const product = await Product.findById(item.product)
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      })
    }

    item.quantity = quantity
    await cart.save()

    // Populate cart for response
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock brand category'
    })

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    })
  } catch (error) {
    console.error('Update cart item error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    const initialLength = cart.items.length
    cart.items = cart.items.filter(item => item._id.toString() !== itemId)

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      })
    }

    await cart.save()

    // Populate cart for response
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock brand category'
    })

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    })
  } catch (error) {
    console.error('Remove from cart error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    cart.items = []
    await cart.save()

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    })
  } catch (error) {
    console.error('Clear cart error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Sync cart from frontend
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] })
    }

    // Validate and sync items
    const validItems = []
    for (const item of items) {
      const product = await Product.findById(item.productId || item.id)
      if (product && product.stock >= item.quantity) {
        validItems.push({
          product: product._id,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant || null,
          price: product.price
        })
      }
    }

    cart.items = validItems
    await cart.save()

    // Populate cart for response
    await cart.populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock brand category'
    })

    res.json({
      success: true,
      message: 'Cart synced successfully',
      data: cart
    })
  } catch (error) {
    console.error('Sync cart error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Routes
router.get('/', protect, getCart)
router.post('/add', protect, addToCart)
router.put('/update/:itemId', protect, updateCartItem)
router.delete('/remove/:itemId', protect, removeFromCart)
router.delete('/clear', protect, clearCart)
router.post('/sync', protect, syncCart)

export default router
