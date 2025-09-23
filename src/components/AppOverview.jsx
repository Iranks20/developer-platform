import React, { useState } from 'react'
import { motion } from 'framer-motion'

const AppOverview = ({ app, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: app.name,
    description: app.description,
    status: app.status
  })

  const handleSave = () => {
    onUpdate({ id: app.id, data: formData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: app.name,
      description: app.description,
      status: app.status
    })
    setIsEditing(false)
  }

  const toggleStatus = () => {
    const newStatus = app.status === 'live' ? 'test' : 'live'
    onUpdate({ id: app.id, data: { status: newStatus } })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Overview</h1>
          <p className="text-gray-600">Manage your application settings and monitor usage</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              app.status === 'live'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {app.status === 'live' ? 'Switch to Test' : 'Switch to Live'}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary"
          >
            {isEditing ? 'Cancel' : 'Edit Details'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Application Name
                </label>
                <p className="text-lg font-medium text-gray-900">{app.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Description
                </label>
                <p className="text-gray-900">{app.description || 'No description provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                <span className={`status-badge ${
                  app.status === 'live' ? 'status-live' : 'status-test'
                }`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created
                </label>
                <p className="text-gray-900">{formatDate(app.createdAt)}</p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Credentials</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Client ID
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900">
                  {app.clientId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(app.clientId)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Client Secret
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900">
                  {app.clientSecret}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(app.clientSecret)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View API Docs</p>
                <p className="text-sm text-gray-500">Explore available endpoints</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Regenerate Keys</p>
                <p className="text-sm text-gray-500">Create new API keys</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Monitor API usage</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AppOverview
