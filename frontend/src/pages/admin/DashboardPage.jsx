import React from 'react'
import { Helmet } from 'react-helmet-async'

const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CartZ</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600">Admin dashboard coming soon...</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
