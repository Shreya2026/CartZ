import mongoose from 'mongoose';
import Product from './models/Product.js';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestProducts = async () => {
  try {
    await connectDB();

    // Create categories first (clear existing ones)
    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and fashion accessories' },
      { name: 'Sports', slug: 'sports', description: 'Sports and fitness equipment' },
      { name: 'Food', slug: 'food', description: 'Food and beverages' },
      { name: 'Home', slug: 'home', description: 'Home and garden items' }
    ];

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');
    
    const testProducts = [
      {
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        sku: "AWH-001",
        description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
        shortDescription: "Premium wireless headphones with noise cancellation",
        price: 299.99,
        originalPrice: 399.99,
        category: createdCategories.find(c => c.name === 'Electronics')._id,
        brand: "AudioMax",
        stock: 50,
        images: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Premium Wireless Headphones"
          },
          {
            url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Headphones Side View"
          }
        ],
        features: ["Active Noise Cancellation", "30-hour battery", "Bluetooth 5.0", "Fast charging"],
        specifications: [
          { name: "Battery Life", value: "30 hours" },
          { name: "Connectivity", value: "Bluetooth 5.0, 3.5mm jack" },
          { name: "Weight", value: "250g" },
          { name: "Frequency Response", value: "20Hz - 20kHz" }
        ],
        rating: 4.8,
        numReviews: 256,
        isFeatured: true,
        isNew: true,
        tags: ["wireless", "bluetooth", "noise-cancelling", "premium"],
        seoTitle: "Premium Wireless Headphones - AudioMax",
        seoDescription: "Experience premium sound quality with these wireless headphones featuring active noise cancellation and 30-hour battery life."
      },
      {
        name: "Smart Fitness Watch",
        slug: "smart-fitness-watch",
        sku: "SFW-002",
        description: "Advanced fitness tracking smartwatch with heart rate monitoring, GPS, sleep tracking, and water resistance. Track your health and fitness goals with precision.",
        shortDescription: "Advanced fitness tracking with heart rate monitoring",
        price: 199.99,
        originalPrice: 249.99,
        category: createdCategories.find(c => c.name === 'Electronics')._id,
        brand: "FitTech",
        stock: 30,
        images: [
          {
            url: "https://images.unsplash.com/photo-1544117519-31a4b719223d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Smart Fitness Watch"
          }
        ],
        features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "Sleep Tracking"],
        specifications: [
          { name: "Display", value: "1.4\" AMOLED" },
          { name: "Battery", value: "7 days" },
          { name: "Water Resistance", value: "5ATM" },
          { name: "Connectivity", value: "Bluetooth, WiFi" }
        ],
        rating: 4.5,
        numReviews: 189,
        isFeatured: true,
        isNew: false,
        tags: ["fitness", "smartwatch", "health", "gps"],
        seoTitle: "Smart Fitness Watch - FitTech",
        seoDescription: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS."
      },
      {
        name: "Designer Leather Jacket",
        slug: "designer-leather-jacket",
        sku: "DLJ-003",
        description: "Premium genuine leather jacket with modern design and exceptional craftsmanship. Made from high-quality leather with attention to detail.",
        shortDescription: "Premium leather jacket with modern design",
        price: 449.99,
        originalPrice: null,
        category: createdCategories.find(c => c.name === 'Fashion')._id,
        brand: "StyleCo",
        stock: 15,
        images: [
          {
            url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Designer Leather Jacket"
          }
        ],
        features: ["Genuine Leather", "Modern Design", "Multiple Pockets", "Premium Craftsmanship"],
        specifications: [
          { name: "Material", value: "100% Genuine Leather" },
          { name: "Lining", value: "Polyester" },
          { name: "Care", value: "Professional leather cleaning" },
          { name: "Origin", value: "Italy" }
        ],
        rating: 4.9,
        numReviews: 124,
        isFeatured: true,
        isNew: true,
        tags: ["leather", "jacket", "fashion", "premium"],
        seoTitle: "Designer Leather Jacket - StyleCo",
        seoDescription: "Premium genuine leather jacket with modern design and exceptional craftsmanship."
      },
      {
        name: "Organic Coffee Beans",
        slug: "organic-coffee-beans",
        sku: "OCB-004",
        description: "Single-origin organic coffee beans, medium roast. Ethically sourced from sustainable farms with rich, smooth flavor profile.",
        shortDescription: "Single-origin organic coffee beans, medium roast",
        price: 24.99,
        originalPrice: 29.99,
        category: createdCategories.find(c => c.name === 'Food')._id,
        brand: "BrewMaster",
        stock: 100,
        images: [
          {
            url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Organic Coffee Beans"
          }
        ],
        features: ["100% Organic", "Single Origin", "Medium Roast", "Ethically Sourced"],
        specifications: [
          { name: "Weight", value: "500g" },
          { name: "Roast Level", value: "Medium" },
          { name: "Origin", value: "Colombia" },
          { name: "Certification", value: "USDA Organic" }
        ],
        rating: 4.7,
        numReviews: 89,
        isFeatured: false,
        isNew: false,
        tags: ["coffee", "organic", "beans", "medium-roast"],
        seoTitle: "Organic Coffee Beans - BrewMaster",
        seoDescription: "Premium single-origin organic coffee beans with rich, smooth flavor profile."
      },
      {
        name: "Professional Yoga Mat",
        slug: "professional-yoga-mat",
        sku: "PYM-005",
        description: "Professional-grade yoga mat with superior grip and cushioning. Perfect for yoga, pilates, and fitness exercises.",
        shortDescription: "Professional-grade yoga mat with superior grip",
        price: 89.99,
        originalPrice: null,
        category: createdCategories.find(c => c.name === 'Sports')._id,
        brand: "ZenFit",
        stock: 25,
        images: [
          {
            url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Professional Yoga Mat"
          }
        ],
        features: ["Superior Grip", "6mm Thickness", "Eco-Friendly", "Non-Slip Surface"],
        specifications: [
          { name: "Dimensions", value: "183cm x 61cm x 6mm" },
          { name: "Material", value: "TPE (Eco-Friendly)" },
          { name: "Weight", value: "1.2kg" },
          { name: "Texture", value: "Non-slip surface" }
        ],
        rating: 4.6,
        numReviews: 167,
        isFeatured: false,
        isNew: false,
        tags: ["yoga", "fitness", "mat", "exercise"],
        seoTitle: "Professional Yoga Mat - ZenFit",
        seoDescription: "Professional-grade yoga mat with superior grip and cushioning for yoga and fitness."
      },
      {
        name: "Wireless Gaming Mouse",
        slug: "wireless-gaming-mouse",
        sku: "WGM-006",
        description: "High-precision wireless gaming mouse with customizable RGB lighting, programmable buttons, and ultra-fast response time.",
        shortDescription: "High-precision wireless gaming mouse with RGB lighting",
        price: 79.99,
        originalPrice: 99.99,
        category: createdCategories.find(c => c.name === 'Electronics')._id,
        brand: "GamePro",
        stock: 40,
        images: [
          {
            url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Wireless Gaming Mouse"
          }
        ],
        features: ["High Precision Sensor", "RGB Lighting", "Programmable Buttons", "Wireless Connection"],
        specifications: [
          { name: "DPI", value: "Up to 16,000 DPI" },
          { name: "Battery", value: "70 hours" },
          { name: "Connectivity", value: "2.4GHz Wireless" },
          { name: "Buttons", value: "8 programmable buttons" }
        ],
        rating: 4.4,
        numReviews: 203,
        isFeatured: true,
        isNew: false,
        tags: ["gaming", "mouse", "wireless", "rgb"],
        seoTitle: "Wireless Gaming Mouse - GamePro",
        seoDescription: "High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons."
      },
      {
        name: "Bluetooth Speaker",
        slug: "bluetooth-speaker",
        sku: "BTS-007",
        description: "Portable bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life. Perfect for outdoor adventures.",
        shortDescription: "Portable bluetooth speaker with 360-degree sound",
        price: 159.99,
        originalPrice: null,
        category: createdCategories.find(c => c.name === 'Electronics')._id,
        brand: "SoundWave",
        stock: 35,
        images: [
          {
            url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Bluetooth Speaker"
          }
        ],
        features: ["360° Sound", "Waterproof IPX7", "12-hour Battery", "Voice Assistant"],
        specifications: [
          { name: "Output Power", value: "20W" },
          { name: "Battery Life", value: "12 hours" },
          { name: "Water Resistance", value: "IPX7" },
          { name: "Connectivity", value: "Bluetooth 5.0" }
        ],
        rating: 4.3,
        numReviews: 156,
        isFeatured: true,
        isNew: true,
        tags: ["speaker", "bluetooth", "waterproof", "portable"],
        seoTitle: "Bluetooth Speaker - SoundWave",
        seoDescription: "Portable bluetooth speaker with 360-degree sound and waterproof design."
      },
      {
        name: "Smart Home Security Camera",
        slug: "smart-home-security-camera",
        sku: "HSC-008",
        description: "Advanced security camera with 4K recording, night vision, motion detection, and smartphone app integration.",
        shortDescription: "4K security camera with night vision and motion detection",
        price: 249.99,
        originalPrice: 299.99,
        category: createdCategories.find(c => c.name === 'Electronics')._id,
        brand: "SecureHome",
        stock: 20,
        images: [
          {
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Smart Security Camera"
          }
        ],
        features: ["4K Recording", "Night Vision", "Motion Detection", "Cloud Storage"],
        specifications: [
          { name: "Resolution", value: "4K (3840x2160)" },
          { name: "Storage", value: "Cloud + MicroSD" },
          { name: "Connectivity", value: "WiFi, Ethernet" },
          { name: "Power", value: "AC Adapter" }
        ],
        rating: 4.6,
        numReviews: 98,
        isFeatured: true,
        isNew: true,
        tags: ["security", "camera", "smart-home", "4k"],
        seoTitle: "Smart Home Security Camera - SecureHome",
        seoDescription: "Advanced 4K security camera with night vision, motion detection, and smartphone integration."
      }
    ];

    console.log('Creating test products...');
    const createdProducts = await Product.insertMany(testProducts);
    
    console.log(`✅ Successfully created ${createdProducts.length} test products:`);
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (ID: ${product._id}) - $${product.price}`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error creating test products:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

createTestProducts();
