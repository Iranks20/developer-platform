import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from './Modal'

const AppSettings = ({ app, onUpdate, onDelete, isDeleting }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: app.name,
    description: app.description,
    status: app.status
  })

  const handleSave = () => {
    onUpdate({ id: app.id, data: formData })
  }

  const handleDelete = () => {
    onDelete(app.id)
    setIsDeleteModalOpen(false)
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Environment
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                <option value="test">Test Environment</option>
                <option value="live">Live Environment</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Developer Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Application ID
              </label>
              <p className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded">
                {app.id}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Client ID
              </label>
              <p className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded break-all">
                {app.clientId}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created
              </label>
              <p className="text-sm text-gray-900">{formatDate(app.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p className="text-sm text-gray-900">{formatDate(app.createdAt)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card border-red-200 bg-red-50"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Danger Zone
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                Once you delete an application, there is no going back. This will permanently delete the application and all associated data.
              </p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isDeleting}
                className="btn-danger"
              >
                {isDeleting ? 'Deleting...' : 'Delete Application'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Application"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure you want to delete this application?
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  This action cannot be undone. This will permanently delete the <strong>{app.name}</strong> application and remove all associated data from our servers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  What will be deleted:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Application configuration and settings</li>
                    <li>API keys and credentials</li>
                    <li>Usage data and analytics</li>
                    <li>Webhook configurations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-danger"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AppSettings
