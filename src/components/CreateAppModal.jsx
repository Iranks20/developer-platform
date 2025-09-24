import React, { useState } from 'react'
import Modal from './Modal'

const CreateAppModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'test',
    redirectUrl: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    console.log('Submitting form data:', formData)
    onSubmit(formData)
    setFormData({ name: '', description: '', status: 'test', redirectUrl: '' })
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', status: 'test', redirectUrl: '' })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Application"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Application Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="My Awesome App"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field resize-none"
            placeholder="Describe what your application does..."
          />
        </div>

        <div>
          <label htmlFor="redirectUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Redirect URL (Optional)
          </label>
          <input
            id="redirectUrl"
            type="url"
            value={formData.redirectUrl}
            onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
            className="input-field"
            placeholder="https://your-app.com/callback"
          />
          <p className="mt-1 text-sm text-gray-500">
            The URL where users will be redirected after authentication.
          </p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Environment
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="input-field"
          >
            <option value="test">Test Environment</option>
            <option value="live">Live Environment</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {formData.status === 'test' 
              ? 'Test applications are for development and testing purposes.'
              : 'Live applications can process real transactions.'
            }
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Application'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateAppModal
