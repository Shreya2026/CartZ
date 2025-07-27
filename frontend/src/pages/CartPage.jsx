import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart({ id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // TODO: Integrate with payment processing
    console.log('Proceeding to checkout...');
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - CartZ</title>
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-4xl text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300"
              >
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Shopping Cart (${totalItems || 0}) - CartZ`}</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-300"
              >
                Clear Cart
              </button>
            </div>
            <p className="text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            {item.category}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-xl font-bold text-indigo-600">
                              ${item.price}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="px-4 py-2 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-0">
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">
                      ${(totalAmount + totalAmount * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="block w-full text-center mt-4 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                >
                  Continue Shopping
                </Link>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      SSL Secured
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                      Safe Checkout
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage
