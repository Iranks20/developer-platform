import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const AppCard = ({ app, onDelete, viewMode = 'grid' }) => {
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
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24)
      return `${days} days ago`
    } else if (diffInHours < 24 * 30) {
      const weeks = Math.floor(diffInHours / (24 * 7))
      return `${weeks} weeks ago`
    } else {
      const months = Math.floor(diffInHours / (24 * 30))
      return `${months} months ago`
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'test':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {app.name}
                </h3>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  app.status === 'live' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusIcon(app.status)}
                  <span className="ml-1">{app.status === 'live' ? 'Deployed' : 'Test'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">{app.description}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="text-right">
                <div className="font-medium text-gray-900">Prod branch</div>
                <div className="text-xs">main</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">Last update</div>
                <div className="text-xs">{formatDate(app.createdAt)}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">App ID</div>
                <div className="text-xs font-mono truncate max-w-20" title={app.clientId}>
                  {app.clientId}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/app/${app.id}`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                  >
                    <Link
                      to={`/app/${app.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        onDelete()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Application
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {app.name}
            </h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              app.status === 'live' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {getStatusIcon(app.status)}
              <span className="ml-1">{app.status === 'live' ? 'Deployed' : 'Test'}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
            >
              <Link
                to={`/app/${app.id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </Link>
              <button
                onClick={() => {
                  onDelete()
                  setIsMenuOpen(false)
                }}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Application
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {app.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Prod branch</span>
          <span className="font-medium text-gray-900">main</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last update</span>
          <span className="font-medium text-gray-900">{formatDate(app.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">App ID</span>
          <span className="font-mono text-xs text-gray-700 truncate max-w-24" title={app.clientId}>
            {app.clientId}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={`/app/${app.id}`}
          className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Manage Application
        </Link>
      </div>
    </motion.div>
  )
}

export default AppCard
