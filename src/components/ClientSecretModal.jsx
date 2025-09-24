import React, { useState } from 'react'
import Modal from './Modal'

const ClientSecretModal = ({ isOpen, onClose, appData }) => {
  const [copiedField, setCopiedField] = useState(null)

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const downloadKeys = () => {
    const content = `Application: ${appData.name}
Client ID: ${appData.clientId}
Client Secret: ${appData.clientSecret}

Important: Keep your client secret secure and never share it publicly.
This secret will not be shown again.`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${appData.name.replace(/\s+/g, '_')}_credentials.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!appData) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="🎉 Application Created Successfully!">
      <div className="p-6">
        <div className="mb-6">
          <p className="text-gray-600">
            Your application "{appData.name}" has been created. Please save your credentials securely.
          </p>
        </div>

        <div className="bg-warning-50 border border-warning-200 rounded-default p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-800">
                ⚠️ Important: Save Your Client Secret
              </h3>
              <div className="mt-2 text-sm text-warning-700">
                <p>
                  Your client secret is shown only once for security reasons. 
                  Make sure to copy and save it securely. You won't be able to see it again.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">
              Application Name
            </label>
            <div className="flex">
              <input
                type="text"
                value={appData.name}
                readOnly
                className="input-field rounded-r-none border-r-0"
              />
              <button
                onClick={() => copyToClipboard(appData.name, 'name')}
                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-r-default hover:bg-gray-200 transition-colors"
              >
                {copiedField === 'name' ? (
                  <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Client ID
            </label>
            <div className="flex">
              <input
                type="text"
                value={appData.clientId}
                readOnly
                className="input-field rounded-r-none border-r-0 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(appData.clientId, 'clientId')}
                className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-r-default hover:bg-gray-200 transition-colors"
              >
                {copiedField === 'clientId' ? (
                  <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Client Secret <span className="text-error-600 font-bold">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={appData.clientSecret}
                readOnly
                className="input-field rounded-r-none border-r-0 font-mono text-sm bg-warning-50 border-warning-300"
              />
              <button
                onClick={() => copyToClipboard(appData.clientSecret, 'clientSecret')}
                className="px-4 py-3 bg-warning-100 border border-warning-300 rounded-r-default hover:bg-warning-200 transition-colors"
              >
                {copiedField === 'clientSecret' ? (
                  <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-sm text-warning-700 mt-1">
              ⚠️ This secret will not be shown again. Save it securely!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={downloadKeys}
            className="btn-secondary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Credentials</span>
          </button>
          
          <button
            onClick={onClose}
            className="btn-primary"
          >
            I've Saved My Credentials
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ClientSecretModal
