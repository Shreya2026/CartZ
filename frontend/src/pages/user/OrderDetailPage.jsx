import React from 'react'
import { Helmet } from 'react-helmet-async'

const OrderDetailPage = () => {
  return (
    <>
      <Helmet>
        <title>Order Details - CartZ</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600">Order details page coming soon...</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailPage
