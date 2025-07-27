import React from 'react'
import { Helmet } from 'react-helmet-async'

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - CartZ</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600">Contact page coming soon...</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage
