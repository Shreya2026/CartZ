import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
    customer: [
      { name: 'Help Center', href: '/help' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
    categories: [
      { name: 'Electronics', href: '/products?category=electronics' },
      { name: 'Fashion', href: '/products?category=fashion' },
      { name: 'Home & Garden', href: '/products?category=home-garden' },
      { name: 'Sports', href: '/products?category=sports' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
    { name: 'YouTube', icon: FaYoutube, href: '#' },
  ]

  const paymentMethods = [
    'Visa',
    'Mastercard',
    'American Express',
    'PayPal',
    'Apple Pay',
    'Google Pay',
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay in the loop
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new products, 
              exclusive offers, and insider tips.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border border-primary-500 focus:ring-2 focus:ring-white focus:border-transparent text-gray-900"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-r-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-bold text-white"
              >
                CartZ
              </motion.div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your premium online shopping destination. Discover amazing products 
              with unbeatable prices and lightning-fast delivery.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400" />
                <span className="text-sm">123 Commerce St, Shopping City, SC 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400" />
                <span className="text-sm">support@cartz.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                  >
                    <IconComponent size={20} />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} CartZ. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-red-400">
                <span className="text-sm">Made with</span>
                <HeartIcon className="h-4 w-4 fill-current" />
                <span className="text-sm">by CartZ Team</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-2">We accept:</span>
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className="w-8 h-5 bg-gray-700 rounded text-xs flex items-center justify-center text-gray-300"
                  title={method}
                >
                  {method.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Secure Shopping</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
