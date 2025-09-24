import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { appsApi } from '../api/apps'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import AppOverview from '../components/AppOverview'
import ProductStatus from '../components/ProductStatus'
import Countries from '../components/Countries'
import ApiDocs from '../components/ApiDocs'
import LoadingSpinner from '../components/LoadingSpinner'

const AppDashboardPage = () => {
  const { appId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const queryClient = useQueryClient()
  const { user, logout } = useAuth()

  console.log('AppDashboardPage - App ID from URL:', appId)

  const { data: app, isLoading, error } = useQuery({
    queryKey: ['app', appId],
    queryFn: () => appsApi.getAppDetails(appId),
    enabled: !!appId,
    retry: 1
  })

  console.log('AppDashboardPage - App data:', app)
  console.log('AppDashboardPage - Loading:', isLoading)
  console.log('AppDashboardPage - Error:', error)

  const updateAppMutation = useMutation({
    mutationFn: ({ id, data }) => appsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app', appId] })
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    },
  })

  const deleteAppMutation = useMutation({
    mutationFn: appsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      navigate('/dashboard')
    },
  })

  const regenerateKeysMutation = useMutation({
    mutationFn: () => appsApi.regenerateKeys(appId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['app', appId] })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-500 mb-4">The application you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <AppOverview 
            app={app} 
            onUpdate={updateAppMutation.mutate}
            onDelete={deleteAppMutation.mutate}
            onRegenerateKeys={regenerateKeysMutation.mutate}
            isRegenerating={regenerateKeysMutation.isPending}
            isDeleting={deleteAppMutation.isPending}
          />
        )
      case 'products':
        return <ProductStatus app={app} />
      case 'countries':
        return <Countries />
      case 'docs':
        return <ApiDocs />
      default:
        return (
          <AppOverview 
            app={app} 
            onUpdate={updateAppMutation.mutate}
            onDelete={deleteAppMutation.mutate}
            onRegenerateKeys={regenerateKeysMutation.mutate}
            isRegenerating={regenerateKeysMutation.isPending}
            isDeleting={deleteAppMutation.isPending}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <div className="flex">
        <Sidebar
          app={app}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1 lg:ml-64">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 lg:p-8"
          >
            <div className="fade-in">
              {renderContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AppDashboardPage
