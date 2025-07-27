import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createTestProducts = async () => {
  try {
    await connectDB();

    // Clear existing products (optional)
    // await Product.deleteMany({});
    
    const testProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "Electronics",
        stock: 50,
        images: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            alt: "Wireless Headphones"
          }
        ],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Smartphone Case",
        description: "Protective case for your smartphone",
        price: 29.99,
        category: "Accessories",
        stock: 100,
        images: [
          {
            url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500",
            alt: "Smartphone Case"
          }
        ],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable bluetooth speaker with great sound quality",
        price: 79.99,
        category: "Electronics",
        stock: 30,
        images: [
          {
            url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
            alt: "Bluetooth Speaker"
          }
        ],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Creating test products...');
    const createdProducts = await Product.insertMany(testProducts);
    
    console.log(`✅ Successfully created ${createdProducts.length} test products:`);
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (ID: ${product._id})`);
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
