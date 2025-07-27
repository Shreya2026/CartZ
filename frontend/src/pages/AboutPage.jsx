import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  HeartIcon,
  StarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: UserGroupIcon },
    { label: 'Products Available', value: '10K+', icon: ShoppingBagIcon },
    { label: 'Countries Served', value: '25+', icon: GlobeAltIcon },
    { label: 'Years of Experience', value: '5+', icon: StarIcon },
  ]

  const values = [
    {
      icon: ShoppingBagIcon,
      title: 'Quality Products',
      description: 'We curate only the finest products from trusted brands and suppliers worldwide.'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Lightning-fast shipping with real-time tracking to get your orders to you quickly.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Shopping',
      description: 'Your data and transactions are protected with enterprise-grade security.'
    },
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: '24/7 customer support to ensure your shopping experience is always exceptional.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      description: 'Visionary leader with 10+ years in e-commerce.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      description: 'Tech innovator focused on seamless user experiences.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      description: 'Creative mind behind our beautiful and intuitive designs.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About Us - CartZ | Your Premium Shopping Destination</title>
        <meta name="description" content="Learn about CartZ - your trusted e-commerce partner. Discover our story, values, and commitment to exceptional shopping experiences." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                About{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CartZ
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Redefining online shopping with premium products, exceptional service, 
                and innovative technology since 2019.
              </p>
            </motion.div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
            >
              <div className="prose prose-lg max-w-none text-gray-600">
                <p className="text-xl leading-relaxed mb-6">
                  CartZ began with a simple vision: to create the most delightful and trustworthy 
                  online shopping experience. Founded in 2019 by a team of passionate entrepreneurs, 
                  we recognized the need for a platform that truly puts customers first.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  What started as a small startup with big dreams has grown into a thriving 
                  e-commerce platform serving customers across 25+ countries. We've built our 
                  reputation on three core principles: quality, innovation, and exceptional service.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, CartZ continues to evolve, embracing new technologies and expanding our 
                  product range while never losing sight of our founding mission: making online 
                  shopping a joy, not a chore.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Values</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core values guide everything we do and shape every decision we make.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-3 w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The passionate individuals behind CartZ's success.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff&size=128`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <LightBulbIcon className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience CartZ?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of satisfied customers and discover why CartZ is the future of online shopping.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full text-lg hover:shadow-xl transition-all duration-300"
              >
                Start Shopping Now
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage
