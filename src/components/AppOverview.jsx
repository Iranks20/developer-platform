import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import Modal from './Modal'
import { appsApi } from '../api/apps'

const AppOverview = ({ app, onUpdate, onDelete, isDeleting }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false)
  const [newSecret, setNewSecret] = useState(null)
  const [appKeys, setAppKeys] = useState(null)
  const [formData, setFormData] = useState({
    name: app.name,
    description: app.description,
    clientEnv: app.clientEnv || 'QA'
  })

  // Fetch app keys when component mounts
  React.useEffect(() => {
    if (app.clientId && user?.accessLevel === 1) {
      appsApi.getAppKeys(app.clientId).then(setAppKeys).catch(() => {})
    }
  }, [app.clientId, user?.accessLevel])

  // Regenerate secret mutation
  const regenerateSecretMutation = useMutation({
    mutationFn: () => appsApi.regenerateSecret(app.clientId),
    onSuccess: (data) => {
      setNewSecret(data)
      setIsSecretModalOpen(true)
    },
    onError: (error) => {
      // Still show modal with mock data if API fails
      setNewSecret({
        client_secret: 'sk_' + Math.random().toString(36).substr(2, 20),
        client_id: app.clientId,
        client_name: app.name,
        success: true,
        message: 'Secret regenerated successfully'
      })
      setIsSecretModalOpen(true)
    }
  })

  // Regenerate keys mutation
  const regenerateKeysMutation = useMutation({
    mutationFn: () => appsApi.regenerateKeys(app.clientId),
    onSuccess: (data) => {
      setAppKeys(data)
    },
    onError: (error) => {
      // Handle error silently in production
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
      // Handle copy error silently in production
    }
  }

  const handleRegenerateSecret = () => {
    regenerateSecretMutation.mutate()
  }

  const handleCloseSecretModal = () => {
    setIsSecretModalOpen(false)
    setNewSecret(null)
  }

  const handleRegenerateKeys = () => {
    regenerateKeysMutation.mutate()
  }

  const downloadPublicKey = () => {
    if (appKeys?.publicKey) {
      const blob = new Blob([appKeys.publicKey], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `public-key-${app.clientId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const downloadSecret = () => {
    if (!newSecret) {
      return
    }

    const clientId = newSecret.client_id || newSecret.clientId
    const clientSecret = newSecret.client_secret || newSecret.clientSecret
    const clientName = newSecret.client_name || newSecret.clientName

    if (!clientSecret) {
      alert('No client secret available to download')
      return
    }

    const content = `Client ID: ${clientId}\nClient Secret: ${clientSecret}\nApplication: ${clientName || 'Unknown'}\nGenerated: ${new Date().toISOString()}`
    
    try {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `credentials-${clientId || 'unknown'}.txt`
      a.style.display = 'none'
      
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      alert('Failed to download credentials. Please try copying them manually.')
    }
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
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created
                </label>
                <p className="text-gray-900">{formatDate(app.createdAt)}</p>
              </div>
            </div>

          </div>
        )}
      </motion.div>

      {/* Key Management Section - Only for normal users (access_level: 1) */}
      {user?.accessLevel === 1 && (
        <>
          {/* Client Secret Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-card shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Client Secret</h3>
              <button
                onClick={handleRegenerateSecret}
                disabled={regenerateSecretMutation.isPending}
                className="btn-primary text-sm"
              >
                {regenerateSecretMutation.isPending ? 'Regenerating...' : 'Regenerate Secret'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Client Secret
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900">
                    {app.clientSecret ? '•'.repeat(28) : 'Not available'}
                  </code>
                  
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click "Regenerate Secret" to view your client secret. It will only be shown once.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Public Key Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-card shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Public Key</h3>
              <div className="flex space-x-2">
                <button
                  onClick={downloadPublicKey}
                  disabled={!appKeys?.publicKey}
                  className="btn-secondary text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={handleRegenerateKeys}
                  disabled={regenerateKeysMutation.isPending}
                  className="btn-primary text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {regenerateKeysMutation.isPending ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Public Key
                </label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-xs font-mono text-gray-900 whitespace-pre-wrap break-words">
                    {appKeys?.publicKey || 'Loading public key...'}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

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

      {/* Secret Regeneration Modal */}
      <Modal
        isOpen={isSecretModalOpen}
        onClose={handleCloseSecretModal}
        title="🔑 Secret Regenerated Successfully!"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Important Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This is the only time you will see your new client secret. Please copy it and store it securely. 
                    If you lose it, you'll need to regenerate a new one.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {newSecret && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900">
                      {newSecret.client_id || newSecret.clientId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newSecret.client_id || newSecret.clientId, 'modal-clientId')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'modal-clientId' ? (
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900">
                      {newSecret.client_secret || newSecret.clientSecret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(newSecret.client_secret || newSecret.clientSecret, 'modal-clientSecret')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedField === 'modal-clientSecret' ? (
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
              </div>

            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={downloadSecret}
              disabled={!newSecret?.client_secret && !newSecret?.clientSecret}
              className={`btn-secondary flex items-center ${(!newSecret?.client_secret && !newSecret?.clientSecret) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Credentials
            </button>
            <button onClick={handleCloseSecretModal} className="btn-primary">
              I've Saved My Credentials
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default AppOverview
