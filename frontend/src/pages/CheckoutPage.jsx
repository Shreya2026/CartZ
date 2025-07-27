import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTruck,
  FaCreditCard,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaMoneyBillWave,
} from 'react-icons/fa';

import {
  getCheckoutSession,
  processCheckout,
  setShippingAddress,
  setPaymentMethod,
  setCheckoutStep,
  resetCheckout,
  clearError,
  selectCheckoutCart,
  selectCheckoutPricing,
  selectShippingAddress,
  selectPaymentMethod,
  selectCheckoutStep,
  selectCurrentOrder,
  selectCheckoutLoading,
  selectCheckoutProcessing,
  selectCheckoutError,
} from '../store/slices/checkoutSlice';

import { selectCartItems, selectCartTotal, selectCartItemsCount, clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const cart = useSelector(selectCheckoutCart);
  const pricing = useSelector(selectCheckoutPricing);
  const shippingAddress = useSelector(selectShippingAddress);
  const paymentMethod = useSelector(selectPaymentMethod);
  const currentStep = useSelector(selectCheckoutStep);
  const currentOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectCheckoutLoading);
  const processing = useSelector(selectCheckoutProcessing);
  const error = useSelector(selectCheckoutError);

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemsCount = useSelector(selectCartItemsCount);

  // Local state
  const [formData, setFormData] = useState({
    fullName: shippingAddress.fullName || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || '',
    phone: shippingAddress.phone || '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Use cart items from Redux store instead of fetching from backend
    // dispatch(getCheckoutSession());

    // Cleanup on unmount only
    return () => {
      // Only reset if we're not on the complete step
      // This will only run on unmount, not on re-renders
    };
  }, [dispatch, cartItems.length, navigate]);

  useEffect(() => {
    // Clear cart after successful order
    if (currentOrder) {
      dispatch(clearCart());
    }
  }, [currentOrder, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (value.length > 5) return;
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }

    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Validate shipping form
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    dispatch(setShippingAddress(formData));
    dispatch(setCheckoutStep('payment'));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment form
    if (paymentMethod === 'card') {
      const requiredCardFields = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
      const missingCardFields = requiredCardFields.filter(field => !cardData[field].trim());
      
      if (missingCardFields.length > 0) {
        alert(`Please fill in all card details: ${missingCardFields.join(', ')}`);
        return;
      }
    }

    dispatch(setCheckoutStep('review'));
  };

  const handlePlaceOrder = async () => {
    const taxPrice = cartTotal * 0.08;
    let shippingPrice = cartTotal > 100 ? 0 : 10; // Free shipping over $100
    
    // Add COD charges if payment method is COD
    const codCharges = paymentMethod === 'cod' ? (cartTotal > 500 ? 0 : 40) : 0;
    shippingPrice += codCharges;
    
    const totalPrice = cartTotal + taxPrice + shippingPrice;

    console.log('=== CHECKOUT DEBUG INFO ===');
    console.log('Cart items:', cartItems);
    console.log('Cart total:', cartTotal);
    console.log('Payment method:', paymentMethod);

    const checkoutData = {
      items: cartItems.map(item => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      shippingAddress: {
        ...formData,
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      },
      paymentMethod,
      itemsPrice: cartTotal,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      paymentResult: paymentMethod === 'card' ? {
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: 'customer@example.com'
      } : {}
    };

    console.log('Sending checkout data:', checkoutData);
    dispatch(processCheckout(checkoutData));
  };

  const goBack = () => {
    if (currentStep === 'payment') {
      dispatch(setCheckoutStep('shipping'));
    } else if (currentStep === 'review') {
      dispatch(setCheckoutStep('payment'));
    } else {
      navigate('/cart');
    }
  };

  const steps = [
    { id: 'shipping', name: 'Shipping', icon: FaTruck },
    { id: 'payment', name: 'Payment', icon: FaCreditCard },
    { id: 'review', name: 'Review', icon: FaCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete' && currentOrder) {
    return (
      <>
        <Helmet>
          <title>Order Complete - CartZ</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-3xl text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-left">
                <h2 className="font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <span className="font-mono">#{currentOrder._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${currentOrder.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 capitalize">{currentOrder.orderStatus}</span>
                  </div>
                </div>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/orders')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Orders
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - CartZ</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <nav className="flex justify-center">
              <ol className="flex items-center space-x-8">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                  const Icon = step.icon;

                  return (
                    <li key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive ? 'border-indigo-600 bg-indigo-600 text-white' :
                        isCompleted ? 'border-green-600 bg-green-600 text-white' :
                        'border-gray-300 bg-white text-gray-400'
                      }`}>
                        <Icon className="text-sm" />
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        isActive ? 'text-indigo-600' :
                        isCompleted ? 'text-green-600' :
                        'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-800 hover:text-red-900 text-sm mt-2"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="IN">India</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <FaArrowLeft className="mr-2" />
                          Back to Cart
                        </button>
                        <button
                          type="submit"
                          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Continue to Payment
                          <FaArrowRight className="ml-2" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {currentStep === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => dispatch(setPaymentMethod(e.target.value))}
                            className="mr-3"
                          />
                          <FaCreditCard className="mr-2" />
                          Credit/Debit Card
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={(e) => dispatch(setPaymentMethod(e.target.value))}
                            className="mr-3"
                          />
                          PayPal
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => dispatch(setPaymentMethod(e.target.value))}
                            className="mr-3"
                          />
                          <FaMoneyBillWave className="mr-2 text-green-600" />
                          Cash on Delivery (COD)
                        </label>
                      </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      {paymentMethod === 'card' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={cardData.cardNumber}
                              onChange={handleCardInputChange}
                              placeholder="1234 5678 9012 3456"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                name="expiryDate"
                                value={cardData.expiryDate}
                                onChange={handleCardInputChange}
                                placeholder="MM/YY"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                              <input
                                type="text"
                                name="cvv"
                                value={cardData.cvv}
                                onChange={handleCardInputChange}
                                placeholder="123"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                            <input
                              type="text"
                              name="nameOnCard"
                              value={cardData.nameOnCard}
                              onChange={handleCardInputChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </>
                      )}

                      {paymentMethod === 'paypal' && (
                        <div className="text-center py-8">
                          <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
                          <div className="text-blue-600 font-semibold">PayPal Secure Payment</div>
                        </div>
                      )}

                      {paymentMethod === 'cod' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                          <FaMoneyBillWave className="text-green-600 text-3xl mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-green-800 mb-2">Cash on Delivery</h3>
                          <p className="text-green-700 mb-4">
                            Pay with cash when your order is delivered to your doorstep.
                          </p>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <h4 className="font-medium text-green-800 mb-2">COD Terms:</h4>
                            <ul className="text-sm text-green-700 space-y-1 text-left">
                              <li>• Payment accepted in cash only</li>
                              <li>• Exact amount preferred (change may be limited)</li>
                              <li>• Available for orders up to ₹50,000</li>
                              <li>• COD charges: ₹40 (Free for orders above ₹500)</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          <FaArrowLeft className="mr-2" />
                          Back to Shipping
                        </button>
                        <button
                          type="submit"
                          className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Review Order
                          <FaArrowRight className="ml-2" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {currentStep === 'review' && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                    
                    {/* Shipping Address Review */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>{formData.fullName}</p>
                        <p>{formData.address}</p>
                        <p>{formData.city}, {formData.postalCode}</p>
                        <p>{formData.country}</p>
                        <p>{formData.phone}</p>
                      </div>
                    </div>

                    {/* Payment Method Review */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {paymentMethod === 'card' 
                          ? 'Credit/Debit Card' 
                          : paymentMethod === 'paypal' 
                          ? 'PayPal' 
                          : 'Cash on Delivery (COD)'}
                        {paymentMethod === 'card' && cardData.cardNumber && (
                          <span className="ml-2">ending in {cardData.cardNumber.slice(-4)}</span>
                        )}
                        {paymentMethod === 'cod' && (
                          <span className="ml-2 text-green-600 font-medium">Pay on delivery</span>
                        )}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {cart?.items?.map((item) => (
                          <div key={item._id} className="flex items-center space-x-3">
                            <img
                              src={item.product.images?.[0] || '/placeholder-product.jpg'}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.product.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        <FaArrowLeft className="mr-2" />
                        Back to Payment
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={processing}
                        className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {processing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock className="mr-2" />
                            Place Order
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                {cartItems && cartItems.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 py-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>${(cartTotal * 0.08)?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-indigo-600">${(cartTotal + cartTotal * 0.08)?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaShieldAlt className="mr-1" />
                      Secure Payment
                    </div>
                    <div className="flex items-center">
                      <FaLock className="mr-1" />
                      SSL Encrypted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage
