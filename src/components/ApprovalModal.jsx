import React, { useState } from 'react'
import { motion } from 'framer-motion'

const ApprovalModal = ({ isOpen, onClose, onSubmit, product, isLoading = false }) => {
  const [formData, setFormData] = useState({
    approval_pin: '',
    assignment_status: 'active'
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.approval_pin.trim()) {
      newErrors.approval_pin = 'Approval PIN is required'
    } else if (formData.approval_pin.length < 4) {
      newErrors.approval_pin = 'Approval PIN must be at least 4 characters'
    }

    if (!formData.assignment_status) {
      newErrors.assignment_status = 'Assignment status is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        record_id: product.record_id,
        assignment_status: formData.assignment_status,
        approval_pin: formData.approval_pin
      })
    }
  }

  const handleClose = () => {
    setFormData({
      approval_pin: '',
      assignment_status: 'active'
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Approve Product Pairing
                  </h3>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 mb-1">Product:</p>
                    <p className="font-medium text-gray-900">{product?.name || product?.product_name}</p>
                    <p className="text-sm text-gray-600 mt-1">Record ID: {product?.record_id}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="assignment_status" className="block text-sm font-medium text-gray-700 mb-1">
                        Assignment Status
                      </label>
                      <select
                        id="assignment_status"
                        name="assignment_status"
                        value={formData.assignment_status}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.assignment_status ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {errors.assignment_status && (
                        <p className="mt-1 text-sm text-red-600">{errors.assignment_status}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="approval_pin" className="block text-sm font-medium text-gray-700 mb-1">
                        Approval PIN
                      </label>
                      <input
                        type="password"
                        id="approval_pin"
                        name="approval_pin"
                        value={formData.approval_pin}
                        onChange={handleInputChange}
                        placeholder="Enter approval PIN"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.approval_pin ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.approval_pin && (
                        <p className="mt-1 text-sm text-red-600">{errors.approval_pin}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Approving...
                  </div>
                ) : (
                  'Approve Product'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ApprovalModal
