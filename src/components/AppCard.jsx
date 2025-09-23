import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const AppCard = ({ app, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'status-live'
      case 'test':
        return 'status-test'
      default:
        return 'status-disabled'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {app.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {app.description}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`status-badge ${getStatusColor(app.status)}`}>
              {app.status.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              Created {formatDate(app.createdAt)}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <Link
                to={`/app/${app.id}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                View Details
              </Link>
              <button
                onClick={() => {
                  onDelete()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Application
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">App ID:</span>
          <span className="font-mono text-gray-900">{app.clientId}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Products:</span>
          <span className="text-gray-900">
            {app.products?.filter(p => p.status === 'active').length || 0} active
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/app/${app.id}`}
          className="block w-full text-center btn-secondary text-sm"
        >
          Manage Application
        </Link>
      </div>
    </motion.div>
  )
}

export default AppCard
