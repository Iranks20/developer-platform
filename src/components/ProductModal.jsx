import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import Modal from './Modal'
import { productsApi } from '../api/products'
import countriesApi from '../api/countries'

const ProductModal = ({ isOpen, onClose, onSubmit, product = null, isLoading = false, clientId = null }) => {
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    product_id: '',
    country_id: '',
    call_back_url: '',
    pin: ''
  })

  const [errors, setErrors] = useState({})

  // Fetch active products and countries for normal users
  const { data: activeProducts = [] } = useQuery({
    queryKey: ['activeProducts'],
    queryFn: () => productsApi.getAll(1),
    enabled: user?.accessLevel === 1 && isOpen
  })

  const { data: activeCountries = [] } = useQuery({
    queryKey: ['activeCountries'],
    queryFn: () => countriesApi.getAll(1),
    enabled: user?.accessLevel === 1 && isOpen
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        status: product.status || 'active',
        product_id: product.product_id || '',
        country_id: product.country_id || '',
        call_back_url: product.call_back_url || '',
        pin: product.pin || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        product_id: '',
        country_id: '',
        call_back_url: '',
        pin: ''
      })
    }
    setErrors({})
  }, [product, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (user?.accessLevel === 2) {
      // Admin validation (create/edit products)
      if (!formData.name.trim()) {
        newErrors.name = 'Product name is required'
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Product description is required'
      }
      
      if (!formData.status.trim()) {
        newErrors.status = 'Product status is required'
      }
    } else {
      // Normal user validation
      if (product) {
        // Editing product pairing - no required fields, both call_back_url and pin are optional
        // No validation needed for editing
      } else {
        // Creating product pairing
        if (!formData.product_id) {
          newErrors.product_id = 'Product selection is required'
        }
        
        if (!formData.country_id) {
          newErrors.country_id = 'Country selection is required'
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (user?.accessLevel === 1) {
      if (product) {
        // Normal user editing product pairing - only send call_back_url and pin
        const pairingData = {
          call_back_url: formData.call_back_url,
          pin: formData.pin
        }
        onSubmit(pairingData)
      } else {
        // Normal user creating product pairing
        const pairingData = {
          client_id: clientId,
          product_id: parseInt(formData.product_id),
          country_id: parseInt(formData.country_id),
          call_back_url: formData.call_back_url,
          pin: formData.pin
        }
        onSubmit(pairingData)
      }
    } else {
      // Admin creating/editing product
      onSubmit(formData)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      product_id: '',
      country_id: '',
      call_back_url: '',
      pin: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={user?.accessLevel === 2 
        ? (product ? 'Edit Product' : 'Add New Product') 
        : (product ? 'Edit Product Pairing' : 'Add Product Pairing')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {user?.accessLevel === 2 ? (
          // Admin form (create/edit products)
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Enter product name (e.g., KYC, Wallets, Transfers)"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe what this product does and its key features"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`input-field ${errors.status ? 'border-red-500' : ''}`}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
              <p className="text-xs text-gray-500 mt-1">
                <strong>Active:</strong> Product is available and ready for use<br/>
                <strong>Pending:</strong> Product is being reviewed or configured<br/>
                <strong>Disabled:</strong> Product is temporarily unavailable
              </p>
            </div>
          </>
        ) : (
          // Normal user form
          product ? (
            // Editing product pairing - only show call_back_url and pin
            <>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Product:</strong> {product.product_name}<br/>
                  <strong>Country:</strong> {product.country_name}
                </p>
              </div>

              <div>
                <label htmlFor="call_back_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Callback URL
                </label>
                <input
                  type="url"
                  id="call_back_url"
                  name="call_back_url"
                  value={formData.call_back_url}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://your-domain.com/callback"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL where payment notifications will be sent
                </p>
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN
                </label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter PIN for additional security"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Additional security PIN for this product pairing
                </p>
              </div>
            </>
          ) : (
            // Creating product pairing
            <>
              <div>
                <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product *
                </label>
                <select
                  id="product_id"
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleInputChange}
                  className={`input-field ${errors.product_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Choose a product...</option>
                  {activeProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.description}
                    </option>
                  ))}
                </select>
                {errors.product_id && <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>}
              </div>

              <div>
                <label htmlFor="country_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Country *
                </label>
                <select
                  id="country_id"
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleInputChange}
                  className={`input-field ${errors.country_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Choose a country...</option>
                  {activeCountries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name} ({country.alpha2Code}) - {country.currency}
                    </option>
                  ))}
                </select>
                {errors.country_id && <p className="text-red-500 text-sm mt-1">{errors.country_id}</p>}
              </div>

              <div>
                <label htmlFor="call_back_url" className="block text-sm font-medium text-gray-700 mb-2">
                  Callback URL (Optional)
                </label>
                <input
                  type="url"
                  id="call_back_url"
                  name="call_back_url"
                  value={formData.call_back_url}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://your-domain.com/callback"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL where payment notifications will be sent
                </p>
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN (Optional)
                </label>
                <input
                  type="text"
                  id="pin"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter PIN for additional security"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Additional security PIN for this product pairing
                </p>
              </div>
            </>
          )
        )}

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
            disabled={isLoading || (
              user?.accessLevel === 2 
                ? (!formData.name.trim() || !formData.description.trim()) 
                : product 
                  ? false // Editing - no required fields
                  : (!formData.product_id || !formData.country_id) // Creating - product and country required
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {user?.accessLevel === 2 
                  ? (product ? 'Updating...' : 'Creating...') 
                  : (product ? 'Updating...' : 'Creating...')}
              </div>
            ) : (
              user?.accessLevel === 2 
                ? (product ? 'Update Product' : 'Create Product') 
                : (product ? 'Update Pairing' : 'Create Pairing')
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ProductModal