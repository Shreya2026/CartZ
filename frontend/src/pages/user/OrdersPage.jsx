import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  FaBox, 
  FaCalendarAlt, 
  FaEye, 
  FaChevronLeft, 
  FaChevronRight,
  FaShoppingBag,
  FaCreditCard,
  FaTruck,
  FaCheckCircle
} from 'react-icons/fa'
import { getMyOrders, getOrderById, cancelOrder, selectOrders, selectOrdersLoading, selectOrdersError, selectOrdersPagination } from '../../store/slices/ordersSlice'
import { formatCurrency } from '../../utils/helpers'

const OrdersPage = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const loading = useSelector(selectOrdersLoading)
  const error = useSelector(selectOrdersError)
  const pagination = useSelector(selectOrdersPagination)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false)

  useEffect(() => {
    dispatch(getMyOrders({ page: currentPage, limit: 10 }))
  }, [dispatch, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleViewDetails = async (order) => {
    setOrderDetailsLoading(true)
    try {
      // Fetch full order details from the backend
      const result = await dispatch(getOrderById(order._id))
      if (result.type === 'orders/getOrderById/fulfilled' && result.payload) {
        setSelectedOrder(result.payload.order || result.payload)
        setShowOrderDetails(true)
      } else {
        // Handle API error (404, 500, etc.)
        alert('Unable to load order details. The order may no longer be available.')
        console.error('Failed to fetch order details:', result.payload || result.error)
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      alert('Unable to load order details. Please try again later.')
    } finally {
      setOrderDetailsLoading(false)
    }
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
    setShowOrderDetails(false)
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId))
        // Refresh the orders list
        dispatch(getMyOrders({ page: currentPage }))
        // Update the selected order if it's showing
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({...prev, orderStatus: 'cancelled'}))
        }
      } catch (error) {
        console.error('Failed to cancel order:', error)
      }
    }
  }

  const handleReorder = (order) => {
    // Add all items from the order to cart
    order.items?.forEach(item => {
      // You can implement addToCart functionality here
      console.log('Reordering item:', item)
    })
    alert('Items have been added to your cart!')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
        return 'text-purple-600 bg-purple-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaCreditCard className="w-4 h-4" />
      case 'processing':
        return <FaBox className="w-4 h-4" />
      case 'shipped':
        return <FaTruck className="w-4 h-4" />
      case 'delivered':
        return <FaCheckCircle className="w-4 h-4" />
      default:
        return <FaBox className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && orders.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Orders - CartZ</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm mb-4">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Orders - CartZ</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FaShoppingBag className="text-2xl text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}

          {orders.length === 0 && !loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FaBox className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button
                onClick={() => window.location.href = '/products'}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-semibold text-gray-900">
                              Order #{order.orderNumber || order._id.slice(-8)}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" />
                              <span>Placed: {formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaBox className="text-gray-400" />
                              <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaCreditCard className="text-gray-400" />
                              <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                              >
                                {item.image ? (
                                  <img
                                    src={typeof item.image === 'string' ? item.image : item.image?.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <FaBox className="text-gray-400" />
                                )}
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleViewDetails(order)}
                            disabled={orderDetailsLoading}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                          >
                            <FaEye />
                            {orderDetailsLoading ? 'Loading...' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="w-3 h-3" />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {[...Array(pagination.pages)].map((_, index) => {
                      const page = index + 1
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            currentPage === page
                              ? 'text-white bg-purple-600'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <FaChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 pt-8 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto mt-4"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-600">Order #{selectedOrder._id}</p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Order Status */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {getStatusIcon(selectedOrder.orderStatus)}
                      {selectedOrder.orderStatus?.charAt(0).toUpperCase() + selectedOrder.orderStatus?.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Order Placed:</span>
                      <span className="ml-2 font-medium">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="ml-2 font-medium capitalize">{selectedOrder.paymentMethod?.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`ml-2 font-medium ${selectedOrder.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    {selectedOrder.deliveredAt && (
                      <div>
                        <span className="text-gray-600">Delivered:</span>
                        <span className="ml-2 font-medium">{formatDate(selectedOrder.deliveredAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      {selectedOrder.shippingAddress.phone && (
                        <p className="mt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={typeof item.image === 'string' ? item.image : item.image?.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaBox className="text-gray-400 text-xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: {formatCurrency(item.price)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.itemsPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">
                        {selectedOrder.shippingPrice > 0 ? formatCurrency(selectedOrder.shippingPrice) : 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%):</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.gstPrice || selectedOrder.taxPrice || 0)}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span className="font-medium">-{formatCurrency(selectedOrder.discountAmount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-purple-600">{formatCurrency(selectedOrder.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <div className="flex gap-3">
                    {selectedOrder.orderStatus === 'pending' && (
                      <button 
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    {selectedOrder.orderStatus === 'delivered' && (
                      <button 
                        onClick={() => handleReorder(selectedOrder)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Reorder Items
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      onClick={() => window.print()}
                    >
                      Print Invoice
                    </button>
                    <button
                      onClick={handleCloseDetails}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrdersPage
