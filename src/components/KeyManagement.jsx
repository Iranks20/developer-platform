import React, { useState } from 'react'
import { motion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

const KeyManagement = ({ app, onRegenerateKeys, isRegenerating }) => {
  const [showSecret, setShowSecret] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadKeys = () => {
    const content = `Client ID: ${app.clientId}\nClient Secret: ${app.clientSecret}\n\nKeep these credentials secure and never share them publicly.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${app.name}-api-keys.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Key Management</h1>
          <p className="text-gray-600">Manage your API credentials and access keys</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadKeys}
            className="btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Keys
          </button>
          <button
            onClick={onRegenerateKeys}
            disabled={isRegenerating}
            className="btn-danger"
          >
            {isRegenerating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Regenerating...
              </>
            ) : (
              'Regenerate Keys'
            )}
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Security Warning
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Keep your API keys secure and never share them publicly. If you suspect your keys have been compromised, regenerate them immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client ID</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your public identifier for API requests. This can be safely included in client-side code.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900 break-all">
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
            <div className="text-xs text-gray-500">
              <strong>Usage:</strong> Include this in the Authorization header as: <code>Bearer {app.clientId}</code>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Secret</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your private key for server-side API requests. Keep this secure and never expose it in client-side code.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-900 break-all">
                {showSecret ? app.clientSecret : '•'.repeat(app.clientSecret.length)}
              </code>
              <div className="flex space-x-1">
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={showSecret ? 'Hide secret' : 'Show secret'}
                >
                  {showSecret ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(app.clientSecret, 'clientSecret')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedField === 'clientSecret' ? (
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
            <div className="text-xs text-gray-500">
              <strong>Usage:</strong> Include this in server-side requests only. Never expose in client-side code.
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Usage</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">cURL Example</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`curl -X POST https://api.portal.com/v1/payments \\
  -H "Authorization: Bearer ${app.clientId}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2000,
    "currency": "usd",
    "customer_id": "cus_1234567890"
  }'`}</code>
            </pre>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">JavaScript Example</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`const response = await fetch('https://api.portal.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${app.clientId}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 2000,
    currency: 'usd',
    customer_id: 'cus_1234567890'
  })
});

const data = await response.json();`}</code>
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default KeyManagement
