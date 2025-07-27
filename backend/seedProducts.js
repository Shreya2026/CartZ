import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import Category from './models/Category.js'
import User from './models/User.js'

dotenv.config()

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "High-quality wireless Bluetooth headphones with noise cancellation and long battery life.",
    price: 99.99,
    originalPrice: 129.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop"
    ],
    stock: 50,
    brand: "TechSound",
    sku: "TS-WBH-001",
    weight: 0.3,
    dimensions: {
      length: 20,
      width: 18,
      height: 8
    },
    tags: ["wireless", "bluetooth", "headphones", "audio"],
    specifications: [
      { name: "Battery Life", value: "30 hours" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Weight", value: "300g" }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description: "Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance.",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop"
    ],
    stock: 30,
    brand: "FitTech",
    sku: "FT-SFW-002",
    weight: 0.1,
    dimensions: {
      length: 4.5,
      width: 3.8,
      height: 1.2
    },
    tags: ["smartwatch", "fitness", "health", "GPS"],
    specifications: [
      { name: "Display", value: "1.4 inch AMOLED" },
      { name: "Battery Life", value: "7 days" },
      { name: "Water Resistance", value: "5ATM" }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    name: "Portable Laptop Stand",
    slug: "portable-laptop-stand",
    description: "Adjustable aluminum laptop stand for better ergonomics and heat dissipation.",
    price: 49.99,
    originalPrice: 69.99,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop"
    ],
    stock: 75,
    brand: "ErgoDesk",
    sku: "ED-PLS-003",
    weight: 0.8,
    dimensions: {
      length: 28,
      width: 22,
      height: 5
    },
    tags: ["laptop", "stand", "ergonomic", "aluminum"],
    specifications: [
      { name: "Material", value: "Aluminum Alloy" },
      { name: "Compatibility", value: "11-17 inch laptops" },
      { name: "Weight Capacity", value: "10kg" }
    ],
    isActive: true,
    isFeatured: false
  },
  {
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop"
    ],
    stock: 100,
    brand: "ChargeTech",
    sku: "CT-WCP-004",
    weight: 0.2,
    dimensions: {
      length: 10,
      width: 10,
      height: 1
    },
    tags: ["wireless", "charging", "qi", "fast-charge"],
    specifications: [
      { name: "Output", value: "10W Fast Charging" },
      { name: "Compatibility", value: "Qi-enabled devices" },
      { name: "LED Indicator", value: "Yes" }
    ],
    isActive: true,
    isFeatured: false
  }
]

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartz')
    console.log('Connected to MongoDB')

    // Create a default category if none exists
    let category = await Category.findOne({ name: 'Electronics' })
    if (!category) {
      category = await Category.create({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        isActive: true
      })
      console.log('Created default category: Electronics')
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Add category to products
    const productsWithCategory = sampleProducts.map(product => ({
      ...product,
      category: category._id
    }))

    // Insert sample products
    const createdProducts = await Product.insertMany(productsWithCategory)
    console.log(`Created ${createdProducts.length} sample products`)

    console.log('Sample products:')
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (${product.slug}) - $${product.price}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
