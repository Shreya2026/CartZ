import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

dotenv.config();

// Sample categories
const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic gadgets and devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all styles',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Home decor and living essentials',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
  }
];

// Sample products
const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 99.99,
    originalPrice: 149.99,
    images: [
      {
        public_id: 'headphones_1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        alt: 'Wireless Bluetooth Headphones'
      }
    ],
    category: 'electronics',
    brand: 'AudioTech',
    stock: 50,
    featured: true,
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    specifications: [
      { name: 'Battery Life', value: '30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.0' },
      { name: 'Noise Cancellation', value: 'Active' }
    ]
  },
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
    price: 199.99,
    originalPrice: 249.99,
    images: [
      {
        public_id: 'smartwatch_1',
        url: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400',
        alt: 'Smart Fitness Watch'
      }
    ],
    category: 'electronics',
    brand: 'FitTech',
    stock: 30,
    featured: true,
    tags: ['smartwatch', 'fitness', 'health', 'gps'],
    specifications: [
      { name: 'Display', value: '1.4 inch AMOLED' },
      { name: 'Battery', value: '7 days' },
      { name: 'Water Resistance', value: '5ATM' }
    ]
  },
  {
    name: 'Premium Cotton T-Shirt',
    slug: 'premium-cotton-t-shirt',
    description: 'Comfortable and stylish 100% organic cotton t-shirt available in multiple colors.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      {
        public_id: 'tshirt_1',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        alt: 'Premium Cotton T-Shirt'
      }
    ],
    category: 'clothing',
    brand: 'ComfortWear',
    stock: 100,
    featured: false,
    tags: ['t-shirt', 'cotton', 'casual', 'comfort'],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Black', 'White', 'Gray', 'Navy'] }
    ]
  },
  {
    name: 'Modern Table Lamp',
    slug: 'modern-table-lamp',
    description: 'Elegant minimalist table lamp with adjustable brightness and USB charging port.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      {
        public_id: 'lamp_1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        alt: 'Modern Table Lamp'
      }
    ],
    category: 'home-living',
    brand: 'LightCraft',
    stock: 25,
    featured: true,
    tags: ['lamp', 'lighting', 'modern', 'usb'],
    specifications: [
      { name: 'Power', value: '12W LED' },
      { name: 'Features', value: 'USB Charging Port' },
      { name: 'Material', value: 'Aluminum & Wood' }
    ]
  },
  {
    name: 'Wireless Phone Charger',
    slug: 'wireless-phone-charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 34.99,
    originalPrice: 49.99,
    images: [
      {
        public_id: 'charger_1',
        url: 'https://images.unsplash.com/photo-1609592085810-ed1c8ffa6e2a?w=400',
        alt: 'Wireless Phone Charger'
      }
    ],
    category: 'electronics',
    brand: 'ChargeTech',
    stock: 75,
    featured: false,
    tags: ['wireless', 'charger', 'qi', 'fast-charging'],
    specifications: [
      { name: 'Power Output', value: '15W' },
      { name: 'Compatibility', value: 'Qi-enabled devices' },
      { name: 'Safety', value: 'Over-temperature protection' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cartz');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created:', createdCategories.length);

    // Create a category map
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Update products with category IDs
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Products created:', createdProducts.length);

    console.log('Database seeded successfully!');
    console.log('Sample products:');
    createdProducts.forEach(product => {
      console.log(`- ${product.name}: $${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
