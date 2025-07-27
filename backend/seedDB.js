import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import Category from './models/Category.js'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartz')
    console.log('MongoDB connected for seeding')
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronics and gadgets'
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel'
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books and educational materials'
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home and garden essentials'
  }
]

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality wireless headphones with noise cancellation and superior sound quality.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
    ],
    category: 'electronics',
    brand: 'AudioTech',
    stock: 50,
    inStock: true,
    featured: true,
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    specifications: [
      { name: 'Battery Life', value: '20 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.0' },
      { name: 'Weight', value: '250g' }
    ]
  },
  {
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-t-shirt',
    description: 'Comfortable premium cotton t-shirt available in multiple colors and sizes.',
    price: 24.99,
    originalPrice: 34.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'
    ],
    category: 'clothing',
    brand: 'ComfortWear',
    stock: 100,
    inStock: true,
    featured: false,
    tags: ['cotton', 't-shirt', 'casual', 'comfort'],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Black', 'White', 'Navy', 'Gray'] }
    ]
  },
  {
    name: 'JavaScript: The Complete Guide',
    slug: 'javascript-complete-guide',
    description: 'Comprehensive guide to modern JavaScript programming from basics to advanced concepts.',
    price: 39.99,
    originalPrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop'
    ],
    category: 'books',
    brand: 'TechBooks',
    stock: 25,
    inStock: true,
    featured: true,
    tags: ['javascript', 'programming', 'web development', 'education']
  },
  {
    name: 'Smart LED Light Bulb',
    slug: 'smart-led-light-bulb',
    description: 'WiFi-enabled smart LED bulb with color changing capabilities and voice control.',
    price: 19.99,
    originalPrice: 29.99,
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76c2d7b6?w=500&h=500&fit=crop'
    ],
    category: 'home-garden',
    brand: 'SmartHome',
    stock: 75,
    inStock: true,
    featured: false,
    tags: ['smart', 'led', 'wifi', 'lighting'],
    specifications: [
      { name: 'Wattage', value: '9W' },
      { name: 'Connectivity', value: 'WiFi 2.4GHz' },
      { name: 'Lifespan', value: '25,000 hours' }
    ]
  },
  {
    name: 'Wireless Charging Pad',
    slug: 'wireless-charging-pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop'
    ],
    category: 'electronics',
    brand: 'ChargeTech',
    stock: 40,
    inStock: true,
    featured: true,
    tags: ['wireless', 'charging', 'qi', 'smartphone']
  },
  {
    name: 'Ceramic Coffee Mug',
    slug: 'ceramic-coffee-mug',
    description: 'Beautiful handcrafted ceramic coffee mug perfect for your morning brew.',
    price: 14.99,
    originalPrice: 19.99,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop'
    ],
    category: 'home-garden',
    brand: 'HomeWare',
    stock: 60,
    inStock: true,
    featured: false,
    tags: ['ceramic', 'coffee', 'mug', 'handcrafted']
  }
]

const seedDB = async () => {
  try {
    await connectDB()
    
    // Clear existing data
    await Product.deleteMany({})
    await Category.deleteMany({})
    console.log('Cleared existing data')

    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories)
    console.log('Categories created:', createdCategories.length)

    // Create a category map for easy lookup
    const categoryMap = {}
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id
    })

    // Add category IDs to products
    const productsWithCategories = sampleProducts.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }))

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategories)
    console.log('Products created:', createdProducts.length)

    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDB()
