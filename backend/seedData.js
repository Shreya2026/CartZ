import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import Category from './models/Category.js'

dotenv.config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartz')
    console.log('Connected to MongoDB')

    // Clear existing data
    await Product.deleteMany({})
    await Category.deleteMany({})
    console.log('Cleared existing data')

    // Create categories
    const electronicsCategory = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets'
    })

    const clothingCategory = await Category.create({
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel'
    })

    const homeCategory = await Category.create({
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies'
    })

    // Create sample products
    const products = [
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone with advanced camera system and A17 Pro chip',
        price: 79999,
        originalPrice: 99999,
        category: electronicsCategory._id,
        brand: 'Apple',
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
        ],
        rating: 4.8,
        numReviews: 324,
        features: ['A17 Pro chip', '48MP camera', '6.1-inch display'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Powerful Android smartphone with AI capabilities',
        price: 64999,
        originalPrice: 74999,
        category: electronicsCategory._id,
        brand: 'Samsung',
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        ],
        rating: 4.6,
        numReviews: 156,
        features: ['Snapdragon 8 Gen 3', '50MP camera', '6.2-inch display'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Ultra-thin laptop with M3 chip and all-day battery life',
        price: 109999,
        originalPrice: 124999,
        category: electronicsCategory._id,
        brand: 'Apple',
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        ],
        rating: 4.9,
        numReviews: 89,
        features: ['M3 chip', '13.6-inch display', '18-hour battery'],
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Premium Cotton T-Shirt',
        slug: 'premium-cotton-tshirt',
        description: 'Comfortable 100% organic cotton t-shirt',
        price: 2499,
        originalPrice: 3299,
        category: clothingCategory._id,
        brand: 'EcoWear',
        stock: 100,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        ],
        rating: 4.4,
        numReviews: 67,
        features: ['100% organic cotton', 'Pre-shrunk', 'Multiple colors'],
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 16999,
        originalPrice: 20999,
        category: electronicsCategory._id,
        brand: 'AudioTech',
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        ],
        rating: 4.5,
        numReviews: 203,
        features: ['Active noise cancellation', '30-hour battery', 'Bluetooth 5.3'],
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Smart Home Speaker',
        slug: 'smart-home-speaker',
        description: 'Voice-controlled smart speaker with premium sound',
        price: 10999,
        originalPrice: 12499,
        category: homeCategory._id,
        brand: 'SmartTech',
        stock: 60,
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        ],
        rating: 4.3,
        numReviews: 145,
        features: ['Voice control', 'Multi-room audio', 'Smart home integration'],
        isFeatured: false,
        isActive: true
      }
    ]

    await Product.insertMany(products)
    console.log('Sample products created successfully!')

    console.log(`
    ✅ Seeding completed successfully!
    
    📱 ${products.length} products created
    📂 3 categories created
    
    Products created:
    ${products.map(p => `- ${p.name} ($${p.price})`).join('\n    ')}
    `)

  } catch (error) {
    console.error('Error seeding data:', error)
  } finally {
    mongoose.connection.close()
  }
}

seedData()
