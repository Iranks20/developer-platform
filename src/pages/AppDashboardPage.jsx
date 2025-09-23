import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { appsApi } from '../api/apps'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import AppOverview from '../components/AppOverview'
import KeyManagement from '../components/KeyManagement'
import ProductStatus from '../components/ProductStatus'
import AppSettings from '../components/AppSettings'
import ApiDocs from '../components/ApiDocs'
import LoadingSpinner from '../components/LoadingSpinner'

const AppDashboardPage = () => {
  const { appId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const queryClient = useQueryClient()
  const { user, logout } = useAuth()

  console.log('AppDashboardPage - App ID from URL:', appId)

  // For demo purposes, always show a mock app instead of fetching from API
  const mockApp = {
    id: appId || 'demo',
    name: appId === '1' ? 'E-commerce App' : 
          appId === '2' ? 'Mobile App' : 
          appId === '3' ? 'Analytics Dashboard' : 
          appId === '4' ? 'API Gateway' : 
          `Demo App ${appId}`,
    description: appId === '1' ? 'Main e-commerce application for online store' :
                 appId === '2' ? 'Mobile application for iOS and Android' :
                 appId === '3' ? 'Internal analytics and reporting dashboard' :
                 appId === '4' ? 'Centralized API gateway for microservices' :
                 `Demo application with ID ${appId}`,
    status: appId === '1' || appId === '3' ? 'live' : 'test',
    createdAt: '2024-01-15T10:30:00Z',
    clientId: `app_${appId || 'demo'}_${Math.random().toString(36).substr(2, 8)}`,
    clientSecret: `sk_${appId === '1' || appId === '3' ? 'live' : 'test'}_${Math.random().toString(36).substr(2, 20)}`,
    products: [
      { id: 'prod_1', name: 'Payment API', status: 'active' },
      { id: 'prod_2', name: 'User Management', status: 'active' },
      { id: 'prod_3', name: 'Analytics API', status: 'pending' },
      { id: 'prod_4', name: 'Push Notifications', status: 'active' },
      { id: 'prod_5', name: 'Location Services', status: 'disabled' }
    ]
  }

  const app = mockApp
  const isLoading = false
  const error = null

  console.log('AppDashboardPage - Demo App data:', app)
  console.log('AppDashboardPage - App ID from URL:', appId)

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

  // Removed error handling - always show demo dashboard for any app ID

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AppOverview app={app} onUpdate={updateAppMutation.mutate} />
      case 'keys':
        return (
          <KeyManagement
            app={app}
            onRegenerateKeys={regenerateKeysMutation.mutate}
            isRegenerating={regenerateKeysMutation.isPending}
          />
        )
      case 'products':
        return <ProductStatus app={app} />
      case 'settings':
        return (
          <AppSettings
            app={app}
            onUpdate={updateAppMutation.mutate}
            onDelete={deleteAppMutation.mutate}
            isDeleting={deleteAppMutation.isPending}
          />
        )
      case 'docs':
        return <ApiDocs />
      default:
        return <AppOverview app={app} onUpdate={updateAppMutation.mutate} />
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
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AppDashboardPage
