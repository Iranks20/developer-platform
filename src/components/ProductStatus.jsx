import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { productsApi } from '../api/products'
import productPairingApi from '../api/productPairing'
import ProductModal from './ProductModal'
import ApprovalModal from './ApprovalModal'
import ConfirmDialog from './ConfirmDialog'
import LoadingSpinner from './LoadingSpinner'

const ProductStatus = ({ app }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleteAction, setDeleteAction] = useState('delete') // 'delete' or 'deactivate'
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [productToApprove, setProductToApprove] = useState(null)

  // Fetch products or product pairs based on user access level
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: user?.accessLevel === 2 ? ['products', user?.accessLevel, app?.clientId] : ['productPairs', app?.clientId],
    queryFn: () => user?.accessLevel === 2 
      ? (app?.clientId ? productPairingApi.getPairs(app.clientId) : productsApi.getAll(user?.accessLevel || 1))
      : productPairingApi.getPairs(app?.clientId),
    enabled: !!user?.accessLevel && (user?.accessLevel === 2 || !!app?.clientId),
    retry: 1
  })

  const filteredProducts = useMemo(() => {
    // Ensure products is an array
    if (!Array.isArray(products)) {
      return []
    }

    let filtered = products

    if (filter !== 'all') {
      filtered = filtered.filter(product => product.status === filter)
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.country_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.call_back_url?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [products, filter, searchTerm])

  // Create product/pairing mutation
  const createProductMutation = useMutation({
    mutationFn: (data) => user?.accessLevel === 2 
      ? productsApi.create(data)
      : productPairingApi.addPair(data),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
      setIsModalOpen(false)
      setEditingProduct(null)
    },
    onError: (error) => {
      console.error('Error creating product/pairing:', error)
    }
  })

  // Update product/pairing mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => user?.accessLevel === 2 
      ? productsApi.update(id, data)
      : productPairingApi.updatePair(id, data),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
      setEditingProduct(null)
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.error('Error updating product/pairing:', error)
    }
  })

  // Delete product/pairing mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id) => user?.accessLevel === 2 
      ? productsApi.delete(id)
      : productPairingApi.removePair(id),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    },
    onError: (error) => {
      console.error('Error deleting product/pairing:', error)
    }
  })

  // Deactivate product pairing mutation (for normal users only)
  const deactivatePairMutation = useMutation({
    mutationFn: (recordId) => productPairingApi.deactivatePair(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productPairs', app?.clientId] })
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    },
    onError: (error) => {
      console.error('Error deactivating product pair:', error)
    }
  })

  // Admin-specific mutations for product management
  const approveProductMutation = useMutation({
    mutationFn: ({ record_id, assignment_status, approval_pin }) => 
      productPairingApi.approvePair(record_id, assignment_status, approval_pin),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel, app?.clientId] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
      setIsApprovalModalOpen(false)
      setProductToApprove(null)
    },
    onError: (error) => {
      console.error('Error approving product:', error)
    }
  })

  const rejectProductMutation = useMutation({
    mutationFn: (recordId) => productPairingApi.rejectProduct(recordId),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel, app?.clientId] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      console.error('Error rejecting product:', error)
    }
  })

  const activateProductMutation = useMutation({
    mutationFn: (recordId) => productPairingApi.activateProduct(recordId),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel, app?.clientId] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      console.error('Error activating product:', error)
    }
  })

  const deactivateProductMutation = useMutation({
    mutationFn: (recordId) => productPairingApi.deactivateProduct(recordId),
    onSuccess: () => {
      const queryKey = user?.accessLevel === 2 
        ? ['products', user?.accessLevel, app?.clientId] 
        : ['productPairs', app?.clientId]
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error) => {
      console.error('Error deactivating product:', error)
    }
  })

  const handleCreateProduct = async (productData) => {
    createProductMutation.mutate(productData)
  }

  const handleUpdateProduct = async (productData) => {
    if (user?.accessLevel === 2) {
      // Admin editing product
      updateProductMutation.mutate({ id: editingProduct.id, data: productData })
    } else {
      // Normal user editing product pairing - pass record_id as parameter
      updateProductMutation.mutate({ id: editingProduct.record_id, data: productData })
    }
  }

  const handleDeleteProduct = async () => {
    const recordId = user?.accessLevel === 2 ? productToDelete.id : productToDelete.record_id
    deleteProductMutation.mutate(recordId)
  }

  const handleDeactivatePair = async () => {
    deactivatePairMutation.mutate(productToDelete.record_id)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setDeleteAction('delete')
    setIsDeleteDialogOpen(true)
  }

  const handleDeactivateClick = (product) => {
    setProductToDelete(product)
    setDeleteAction('deactivate')
    setIsDeleteDialogOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  // Admin-specific handlers
  const handleApproveProduct = (product) => {
    setProductToApprove(product)
    setIsApprovalModalOpen(true)
  }

  const handleApprovalSubmit = (approvalData) => {
    approveProductMutation.mutate(approvalData)
  }

  const handleRejectProduct = (product) => {
    rejectProductMutation.mutate(product.record_id)
  }

  const handleActivateProduct = (product) => {
    activateProductMutation.mutate(product.record_id)
  }

  const handleDeactivateProduct = (product) => {
    deactivateProductMutation.mutate(product.record_id)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'pending':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'disabled':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'deleted':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'disabled':
      case 'inactive':
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const activeProducts = Array.isArray(products) ? products.filter(p => p.status === 'active').length : 0
  const pendingProducts = Array.isArray(products) ? products.filter(p => p.status === 'pending').length : 0
  const disabledProducts = Array.isArray(products) ? products.filter(p => p.status === 'inactive').length : 0

  // Show loading spinner while fetching products
  if (productsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show error state if products failed to load
  if (productsError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Failed to load products. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.accessLevel === 2 
              ? (app?.clientId ? `Products for ${app.name}` : 'Product Status')
              : 'My Product Pairings'
            }
          </h1>
          <p className="text-gray-700">
            {user?.accessLevel === 2 
              ? (app?.clientId 
                ? `Manage products created by users for ${app.name}` 
                : 'Monitor and manage all API products and services (Admin View)'
              )
              : 'View and manage your product pairings awaiting approval'
            }
          </p>
        </div>
        {(user?.accessLevel !== 2 || !app?.clientId) && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {user?.accessLevel === 2 ? 'Add Product' : 'Add Product Pairing'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Products</p>
              <p className="text-2xl font-bold text-gray-900">{pendingProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disabled Products</p>
              <p className="text-2xl font-bold text-gray-900">{disabledProducts}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">All Products</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-200' 
                    : 'text-gray-600 hover:bg-gray-100 font-medium'
                }`}
              >
                All ({products.length})
              </button>
              <button 
                onClick={() => setFilter('active')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                  filter === 'active' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'text-gray-600 hover:bg-green-50 font-medium'
                }`}
              >
                Active ({activeProducts})
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                  filter === 'pending' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'text-gray-600 hover:bg-blue-50 font-medium'
                }`}
              >
                Pending ({pendingProducts})
              </button>
              <button 
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
                  filter === 'inactive' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                    : 'text-gray-600 hover:bg-yellow-50 font-medium'
                }`}
              >
                Inactive ({disabledProducts})
              </button>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-700">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new product.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="whitespace-nowrap">{user?.accessLevel === 2 ? 'Add Product' : 'Add Product Pairing'}</span>
                  </button>
                </div>
              )}
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Callback URL
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{product.product_name || product.name}</div>
                        <div className="text-sm text-gray-700">ID: {product.scope_group_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.country_name}</div>
                      <div className="text-xs text-gray-500">{product.country_alpha3}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800 max-w-xs truncate">
                        {product.call_back_url || 'No callback URL'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {user?.accessLevel === 2 && app?.clientId ? (
                          <>
                            {product.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveProduct(product)}
                                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors duration-150"
                                  title="Approve"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleRejectProduct(product)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
                                  title="Reject"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            )}
                            {product.status === 'active' && (
                              <button
                                onClick={() => handleDeactivateProduct(product)}
                                className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors duration-150"
                                title="Deactivate"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            {product.status === 'inactive' && (
                              <button
                                onClick={() => handleActivateProduct(product)}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors duration-150"
                                title="Activate"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-md transition-colors duration-150"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {user?.accessLevel === 1 && product.status === 'active' && (
                              <button
                                onClick={() => handleDeactivateClick(product)}
                                className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-md transition-colors duration-150"
                                title="Deactivate"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-150"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          product={editingProduct}
          isLoading={createProductMutation.isPending || updateProductMutation.isPending}
          clientId={app?.clientId}
        />

        <ApprovalModal
          isOpen={isApprovalModalOpen}
          onClose={() => {
            setIsApprovalModalOpen(false)
            setProductToApprove(null)
          }}
          onSubmit={handleApprovalSubmit}
          product={productToApprove}
          isLoading={approveProductMutation.isPending}
        />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setProductToDelete(null)
          setDeleteAction('delete')
        }}
        onConfirm={deleteAction === 'delete' ? handleDeleteProduct : handleDeactivatePair}
        title={deleteAction === 'delete' ? "Delete Product" : "Deactivate Product"}
        message={deleteAction === 'delete' 
          ? `Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`
          : `Are you sure you want to deactivate "${productToDelete?.name}"? This will disable the product pairing.`
        }
        confirmText={deleteAction === 'delete' ? "Delete" : "Deactivate"}
        cancelText="Cancel"
        type="danger"
        isLoading={deleteAction === 'delete' ? deleteProductMutation.isPending : deactivatePairMutation.isPending}
      />
    </div>
  )
}

export default ProductStatus
