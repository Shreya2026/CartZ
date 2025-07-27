import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'

import Avatar from '../../components/ui/Avatar'

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile Information' },
    { id: 'security', name: 'Security' },
    { id: 'preferences', name: 'Preferences' },
  ]

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <Helmet>
        <title>My Profile - CartZ</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar user={user} size="2xl" className="ring-4 ring-white" />
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                    <CameraIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
                  <p className="text-primary-100">{user?.email}</p>
                  <div className="flex items-center mt-2 text-primary-200">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">Member since {formatDate(user?.createdAt)}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Personal Information
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm text-gray-900">{user?.name || 'Not provided'}</span>
                            <button className="text-primary-600 hover:text-primary-700">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm text-gray-900">{user?.email}</span>
                            <button className="text-primary-600 hover:text-primary-700">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm text-gray-900">{user?.phone || 'Not provided'}</span>
                            <button className="text-primary-600 hover:text-primary-700">
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role</label>
                          <span className="mt-1 text-sm text-gray-900 capitalize">{user?.role || 'User'}</span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Account Status</label>
                          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Member Since</label>
                          <span className="mt-1 text-sm text-gray-900">{formatDate(user?.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                      <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                      Address Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-gray-900">{user?.address?.street || 'Not provided'}</span>
                          <button className="text-primary-600 hover:text-primary-700">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-gray-900">{user?.address?.city || 'Not provided'}</span>
                          <button className="text-primary-600 hover:text-primary-700">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-gray-900">{user?.address?.state || 'Not provided'}</span>
                          <button className="text-primary-600 hover:text-primary-700">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-gray-900">{user?.address?.zipCode || 'Not provided'}</span>
                          <button className="text-primary-600 hover:text-primary-700">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-500">Last updated 30 days ago</p>
                      </div>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        Change Password
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates about your orders</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Marketing Emails</h4>
                        <p className="text-sm text-gray-500">Receive emails about new products and offers</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive SMS updates about your orders</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
