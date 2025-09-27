import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appsApi } from '../api/apps'
import productPairingApi from '../api/productPairing'
import AppOverview from './AppOverview'
import ProductStatus from './ProductStatus'
import LoadingSpinner from './LoadingSpinner'

const AdminApplicationDetails = ({ selectedApp, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [app, setApp] = useState(selectedApp)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (selectedApp) {
      setApp(selectedApp)
    }
  }, [selectedApp])

  const { data: appDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['admin-app-details', app?.id],
    queryFn: () => appsApi.getAppDetails(app.clientId),
    enabled: !!app?.clientId
  })

  const { data: appKeys, isLoading: isLoadingKeys } = useQuery({
    queryKey: ['admin-app-keys', app?.id],
    queryFn: () => appsApi.getAppKeys(app.clientId),
    enabled: !!app?.clientId
  })

  const updateAppMutation = useMutation({
    mutationFn: ({ id, data }) => appsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-apps'])
      queryClient.invalidateQueries(['admin-app-details', app?.id])
    }
  })

  const deleteAppMutation = useMutation({
    mutationFn: appsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-apps'])
      onBack()
    }
  })

  const regenerateKeysMutation = useMutation({
    mutationFn: appsApi.regenerateKeys,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-app-keys', app?.id])
    }
  })

  const handleUpdateApp = (updateData) => {
    updateAppMutation.mutate({ id: app.id, data: updateData })
  }

  const handleDeleteApp = () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteAppMutation.mutate(app.id)
    }
  }

  const handleRegenerateKeys = () => {
    regenerateKeysMutation.mutate(app.clientId)
  }

  const renderContent = () => {
    if (!app) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Application Selected</h3>
          <p className="text-gray-700 mb-6">Select an application from the Applications tab to view its details.</p>
          <button
            onClick={onBack}
            className="btn-primary"
          >
            Back to Applications
          </button>
        </div>
      )
    }

    switch (activeTab) {
      case 'overview':
        return (
          <AppOverview
            app={appDetails || app}
            onUpdate={handleUpdateApp}
            onDelete={handleDeleteApp}
            onRegenerateKeys={handleRegenerateKeys}
            isRegenerating={regenerateKeysMutation.isPending}
            isDeleting={deleteAppMutation.isPending}
          />
        )
      case 'products':
        return <ProductStatus app={appDetails || app} />
      default:
        return (
          <AppOverview
            app={appDetails || app}
            onUpdate={handleUpdateApp}
            onDelete={handleDeleteApp}
            onRegenerateKeys={handleRegenerateKeys}
            isRegenerating={regenerateKeysMutation.isPending}
            isDeleting={deleteAppMutation.isPending}
          />
        )
    }
  }

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-3">
        {/* Back Button - Top Left */}
        <div className="mb-2 sm:mb-3">
          <button
            onClick={onBack}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors group shadow-sm"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Applications
          </button>
        </div>

        {/* App Title and Description - Centered */}
        {app && (
          <div className="text-center -mt-6">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full mb-2 sm:mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{app.name}</h1>
            <p className="text-sm sm:text-base text-gray-700">Application Details & Management</p>
          </div>
        )}
      </div>

      {/* Main Content Section */}
      {app && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'products', label: 'Products' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 sm:p-6">
            {renderContent()}
          </div>
        </div>
      )}

      {/* No App Selected State */}
      {!app && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderContent()}
        </div>
      )}
    </div>
  )
}

export default AdminApplicationDetails
