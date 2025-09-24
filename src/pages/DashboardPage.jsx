import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { appsApi } from '../api/apps'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import AppCard from '../components/AppCard'
import CreateAppModal from '../components/CreateAppModal'
import ClientSecretModal from '../components/ClientSecretModal'
import LoadingSpinner from '../components/LoadingSpinner'

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('test')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showClientSecretModal, setShowClientSecretModal] = useState(false)
  const [newAppData, setNewAppData] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Fetch applications
  const { data: apps, isLoading, error } = useQuery({
    queryKey: ['apps'],
    queryFn: () => appsApi.getAll(user?.id || 'default-user')
  })

  // Create app mutation
  const createAppMutation = useMutation({
    mutationFn: (appData) => appsApi.create({ ...appData, userAccountId: user?.id || 'default-user' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['apps'])
      setIsCreateModalOpen(false)
      setNewAppData(data)
      setShowClientSecretModal(true)
    }
  })

  // Delete app mutation
  const deleteAppMutation = useMutation({
    mutationFn: appsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['apps'])
    }
  })

  const handleCreateApp = (appData) => {
    createAppMutation.mutate(appData)
  }

  const handleDeleteApp = (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteAppMutation.mutate(appId)
    }
  }

  const handleCloseClientSecretModal = () => {
    setShowClientSecretModal(false)
    setNewAppData(null)
  }

  const filteredApps = apps?.filter(app => {
    if (activeTab === 'all') return true
    return app.status === activeTab
  }) || []

  const getStatusCount = (status) => {
    if (status === 'all') return apps?.length || 0
    return apps?.filter(app => app.status === status).length || 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header user={user} onLogout={logout} />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header user={user} onLogout={logout} />
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center">
            <div className="text-error-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Applications</h2>
            <p className="text-gray-600 mb-6">There was a problem loading your applications. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header user={user} onLogout={logout} />
      
      <div className="max-w-full mx-auto px-8 pt-6 pb-8">
        {/* My Applications Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Applications</h1>
            <p className="text-gray-600 text-lg">Manage your applications and API access.</p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1">
              {[
                { key: 'live', label: 'Live Applications', count: getStatusCount('live') },
                { key: 'test', label: 'Test Applications', count: getStatusCount('test') }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Create New Application
            </button>
          </div>

          {/* Applications Grid */}
          {filteredApps.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'all' 
                  ? "You haven't created any applications yet. Get started by creating your first app."
                  : `No applications with ${activeTab} status found.`
                }
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Create your first app
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredApps.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <AppCard
                    app={app}
                    onDelete={handleDeleteApp}
                    viewMode="grid"
                    onViewApp={(app) => navigate(`/app/${app.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateAppModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateApp}
        isLoading={createAppMutation.isPending}
      />

      <ClientSecretModal
        isOpen={showClientSecretModal}
        onClose={handleCloseClientSecretModal}
        appData={newAppData}
      />
    </div>
  )
}

export default DashboardPage