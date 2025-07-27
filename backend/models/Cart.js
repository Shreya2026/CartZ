import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selectedVariant: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Update totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  this.updatedAt = new Date()
  next()
})

// Virtual for cart item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.length
})

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, selectedVariant = null, price) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() && 
    item.selectedVariant === selectedVariant
  )

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    this.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      selectedVariant,
      price
    })
  }

  return this.save()
}

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString())
  return this.save()
}

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.find(item => item._id.toString() === itemId.toString())
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(itemId)
    } else {
      item.quantity = quantity
      return this.save()
    }
  }
  throw new Error('Item not found in cart')
}

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = []
  return this.save()
}

export default mongoose.model('Cart', cartSchema)
