# CartZ - E-commerce Platform

A full-stack MERN e-commerce application for online shopping with modern web technologies.

## Features

### Frontend Features
- React 18 with Vite for fast development
- Redux Toolkit for state management
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Helmet Async for SEO
- Heroicons for icons
- Responsive design
- Shopping cart with localStorage
- User authentication
- Product search and filtering
- Wishlist
- User profiles and order history
- Admin dashboard

### Backend Features
- Express.js REST API
- MongoDB with Mongoose
- JWT authentication with refresh tokens
- bcryptjs for password hashing
- CORS enabled
- Helmet for security
- Rate limiting
- Cookie parser for tokens
- File upload with Multer
- Error handling
- Input validation

## Tech Stack

### Frontend
- React 18
- Vite
- Redux Toolkit
- React Router Dom
- Tailwind CSS
- Framer Motion
- React Helmet Async
- Heroicons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Helmet
- CORS

## Project Structure

```
CartZ/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── payments.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── products/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── user/
│   │   ├── store/
│   │   │   └── slices/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json
└── README.md
```

## Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shreya2026/CartZ.git
   cd CartZ
   ```

2. **Install dependencies for all packages**
   ```bash
   npm run setup
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cartz
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   COOKIE_SECRET=your-cookie-secret
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:5173`

### Individual Commands

**Backend only:**
```bash
npm run backend
```

**Frontend only:**
```bash
npm run frontend
```

**Build for production:**
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin only)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## UI Components

Main reusable components:

- Button - Multiple variants
- Card - Container with hover effects
- Modal - Dialog system
- Toast - Notifications
- LoadingSpinner - Loading states
- ProductCard - Product display
- ProductGrid - Product listing
- ProductFilters - Search and filtering

## Authentication

- JWT tokens (access + refresh)
- Role-based access (User/Admin)
- Protected routes
- Secure cookie storage
- bcryptjs password hashing

## Responsive Design

Optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub repository

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Team

- **Shreya** - Full-stack Developer
- **Contributors** - Open source community

## Acknowledgments

- React team
- Tailwind CSS
- Framer Motion
- MongoDB team
- Open source community

---

Built with React and Node.js
