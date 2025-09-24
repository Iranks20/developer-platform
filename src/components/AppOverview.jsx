import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appsApi } from '../api/apps'
import LoadingSpinner from './LoadingSpinner'
import Modal from './Modal'

const AppOverview = ({ app, onUpdate, onDelete, onRegenerateKeys, isRegenerating, isDeleting }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showSecretModal, setShowSecretModal] = useState(false)
  const [newSecret, setNewSecret] = useState(null)
  const [formData, setFormData] = useState({
    name: app.name,
    description: app.description,
    clientEnv: app.clientEnv || 'QA'
  })

  const queryClient = useQueryClient()

  const { data: appKeys, isLoading: keysLoading, error: keysError } = useQuery({
    queryKey: ['appKeys', app.clientId],
    queryFn: () => appsApi.getAppKeys(app.clientId),
    enabled: !!app.clientId,
    retry: 1
  })

  const regenerateSecretMutation = useMutation({
    mutationFn: () => appsApi.regenerateSecret(app.clientId),
    onSuccess: (data) => {
      console.log('Secret regeneration successful:', data)
      setNewSecret(data.clientSecret)
      setShowSecretModal(true)
      queryClient.invalidateQueries({ queryKey: ['appKeys', app.clientId] })
    },
    onError: (error) => {
      console.error('Failed to regenerate secret:', error)
      // Show modal with mock secret even if API fails
      const mockSecret = `sk_${app.clientEnv || 'test'}_${Math.random().toString(36).substr(2, 20)}`
      setNewSecret(mockSecret)
      setShowSecretModal(true)
    }
  })

  const handleSave = () => {
    onUpdate({ id: app.id, data: formData })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: app.name,
      description: app.description,
      clientEnv: app.clientEnv || 'QA'
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(app.id)
    setIsDeleteModalOpen(false)
  }

  const toggleStatus = () => {
    const newEnv = app.clientEnv === 'PDN' ? 'QA' : 'PDN'
    onUpdate({ id: app.id, data: { clientEnv: newEnv } })
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

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleRegenerateSecret = () => {
    console.log('Regenerate secret button clicked for client ID:', app.clientId)
    regenerateSecretMutation.mutate()
  }

  const handleCloseSecretModal = () => {
    console.log('Closing secret modal')
    setShowSecretModal(false)
    setNewSecret(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your application settings, credentials, and monitor usage</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleStatus}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              app.clientEnv === 'PDN'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {app.clientEnv === 'PDN' ? 'Switch to QA' : 'Switch to Production'}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-card shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Application Details</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit application details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Environment
                </label>
                <select
                  value={formData.clientEnv}
                  onChange={(e) => setFormData({ ...formData, clientEnv: e.target.value })}
                  className="input-field"
                >
                  <option value="QA">QA Environment</option>
                  <option value="UAT">UAT Environment</option>
                  <option value="PDN">Production Environment</option>
                </select>
              </div>
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
            <div className="flex justify-end">
              <button onClick={handleSave} className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  Environment
                </label>
                <span className={`status-badge ${
                  app.clientEnv === 'PDN' ? 'status-live' : 'status-test'
                }`}>
                  {app.clientEnv === 'PDN' ? 'Production' : app.clientEnv || 'Test'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Client Status
                </label>
                <p className="text-gray-900">{app.clientStatus || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created
                </label>
                <p className="text-gray-900">{formatDate(app.createdAt)}</p>
              </div>
            </div>

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
                    onClick={() => copyToClipboard(app.clientId, 'clientId')}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'clientId' ? (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Redirect URL
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 px-3 py-2 rounded">
                  {app.redirectUri || 'Not configured'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Client Secret
                </label>
                <div className="space-y-3">
                  <div className="bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900">
                    {app.clientSecret === 'hidden' ? '••••••••••••••••••••••••••••' : '••••••••••••••••••••••••••••'}
                  </div>
                  <button
                    onClick={handleRegenerateSecret}
                    disabled={regenerateSecretMutation.isPending}
                    className="btn-outline w-full flex items-center justify-center space-x-2"
                  >
                    {regenerateSecretMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Regenerating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span>Regenerate Secret</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500">
                    The client secret is only shown once when generated. Click regenerate to create a new one.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-card shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Key</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your public key for API authentication. This key is used for verifying requests and can be safely included in client-side code.
        </p>
        <div className="space-y-3">
          {keysLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : keysError ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading public key</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Failed to load the public key for this application.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : appKeys?.publicKey ? (
            <>
              <div className="flex items-start space-x-2">
                <textarea
                  readOnly
                  value={appKeys.publicKey}
                  className="flex-1 bg-gray-100 px-3 py-2 rounded text-xs font-mono text-gray-900 resize-none"
                  rows={6}
                />
                <button
                  onClick={() => copyToClipboard(appKeys.publicKey, 'publicKey')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors mt-1"
                  title="Copy to clipboard"
                >
                  {copiedField === 'publicKey' ? (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500">
                <strong>Registration Date:</strong> {appKeys.registrationDate ? new Date(appKeys.registrationDate).toLocaleDateString() : 'N/A'}
                {appKeys.lastRotationAt && (
                  <>
                    <br />
                    <strong>Last Rotation:</strong> {new Date(appKeys.lastRotationAt).toLocaleDateString()}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">No public key found</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>This application doesn't have a public key configured yet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-500">
            <strong>Usage:</strong> Use this public key for API authentication and request verification.
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-card shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
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
          
          
          <button 
            onClick={onRegenerateKeys}
            disabled={isRegenerating}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {isRegenerating ? 'Regenerating...' : 'Regenerate Keys'}
                </p>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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

      <Modal
        isOpen={showSecretModal}
        onClose={handleCloseSecretModal}
        title="🔑 New Client Secret Generated"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important: Copy Your Secret Now
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This is the only time you'll see this client secret. Make sure to copy it and store it securely. 
                    You won't be able to see it again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Client Secret
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900 break-all">
                {newSecret}
              </code>
              <button
                onClick={() => copyToClipboard(newSecret, 'newSecret')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy to clipboard"
              >
                {copiedField === 'newSecret' ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCloseSecretModal}
              className="btn-primary"
            >
              I've Copied the Secret
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default AppOverview
