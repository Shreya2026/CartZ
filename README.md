# CartZ - Premium E-commerce Store

A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce application built with modern technologies and eye-catching UI.

## 🚀 Features

### Frontend Features
- **Modern React 18** with Vite for lightning-fast development
- **Redux Toolkit** for state management
- **Tailwind CSS** for beautiful, responsive design
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **React Helmet Async** for SEO optimization
- **Heroicons** for beautiful icons
- Responsive design for all devices
- Shopping cart with persistent storage
- User authentication and authorization
- Product search and filtering
- Wishlist functionality
- User profiles and order history
- Admin dashboard for management

### Backend Features
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **JWT** authentication with refresh tokens
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers
- **Rate limiting** for API protection
- **Cookie parser** for secure token handling
- File upload support with Multer
- Comprehensive error handling
- Input validation and sanitization

## 🛠️ Tech Stack

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

## 📦 Project Structure

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

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cartz-ecommerce.git
   cd cartz-ecommerce
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

## 🔗 API Endpoints

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

## 🎨 UI Components

The application includes a comprehensive set of reusable UI components:

- **Button** - Customizable button with multiple variants
- **Card** - Container component with hover effects
- **Modal** - Accessible modal dialogs
- **Toast** - Notification system
- **LoadingSpinner** - Loading indicators
- **ProductCard** - Product display component
- **ProductGrid** - Product listing layout
- **ProductFilters** - Search and filtering interface

## 🔐 Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- Role-based access control (User/Admin)
- Protected routes on both frontend and backend
- Secure cookie storage for tokens
- Password hashing with bcryptjs

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy from GitHub repository

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team** - Full-stack MERN developers
- **UI/UX Design** - Modern, responsive design
- **Backend Architecture** - Scalable REST API

## 📞 Support

For support, email support@cartz.com or join our Slack channel.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for beautiful animations
- All the open-source contributors

---

**Made with ❤️ by the CartZ Team**
