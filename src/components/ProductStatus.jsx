import React from 'react'
import { motion } from 'framer-motion'

const ProductStatus = ({ app }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'status-live'
      case 'pending':
        return 'status-pending'
      case 'disabled':
        return 'status-disabled'
      default:
        return 'status-disabled'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'disabled':
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const mockProducts = [
    { id: 'prod_1', name: 'Payment API', status: 'active', description: 'Process payments and manage transactions' },
    { id: 'prod_2', name: 'User Management', status: 'active', description: 'Manage user accounts and authentication' },
    { id: 'prod_3', name: 'Analytics API', status: 'pending', description: 'Access analytics and reporting data' },
    { id: 'prod_4', name: 'Push Notifications', status: 'active', description: 'Send push notifications to mobile devices' },
    { id: 'prod_5', name: 'Location Services', status: 'disabled', description: 'Access location and geolocation data' },
    { id: 'prod_6', name: 'Data Export API', status: 'active', description: 'Export data in various formats' },
    { id: 'prod_7', name: 'Real-time Metrics', status: 'active', description: 'Access real-time performance metrics' },
    { id: 'prod_8', name: 'Webhook Management', status: 'pending', description: 'Manage webhook endpoints and events' }
  ]

  const activeProducts = mockProducts.filter(p => p.status === 'active').length
  const pendingProducts = mockProducts.filter(p => p.status === 'pending').length
  const disabledProducts = mockProducts.filter(p => p.status === 'disabled').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Status</h1>
        <p className="text-gray-600">Monitor the status of your API products and services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Products</p>
              <p className="text-2xl font-bold text-gray-900">{pendingProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disabled Products</p>
              <p className="text-2xl font-bold text-gray-900">{disabledProducts}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Products</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md">
              All ({mockProducts.length})
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">
              Active ({activeProducts})
            </button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">
              Pending ({pendingProducts})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {mockProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(product.status)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`status-badge ${getStatusColor(product.status)}`}>
                  {product.status.toUpperCase()}
                </span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Product Status Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Active:</strong> Product is available and ready for use</li>
                <li><strong>Pending:</strong> Product is being reviewed or configured</li>
                <li><strong>Disabled:</strong> Product is temporarily unavailable</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductStatus
