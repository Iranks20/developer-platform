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
  const [activeTab, setActiveTab] = useState('live')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showClientSecretModal, setShowClientSecretModal] = useState(false)
  const [newAppData, setNewAppData] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ['apps', user?.id],
    queryFn: () => appsApi.getAll(user?.id),
    enabled: !!user?.id,
  })

  console.log('Dashboard - Apps data:', apps)
  console.log('Dashboard - Loading:', isLoading)
  console.log('Dashboard - Error:', error)

  const createAppMutation = useMutation({
    mutationFn: (appData) => appsApi.create({ ...appData, userAccountId: user?.id }),
    onSuccess: (data) => {
      console.log('App created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['apps', user?.id] })
      setIsCreateModalOpen(false)
      setNewAppData(data)
      setShowClientSecretModal(true)
    },
    onError: (error) => {
      console.error('Failed to create app:', error)
    },
  })

  const deleteAppMutation = useMutation({
    mutationFn: appsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps', user?.id] })
    },
  })

  const filteredApps = apps.filter(app => 
    activeTab === 'live' ? app.status === 'live' : app.status === 'test'
  )

  const handleDeleteApp = (appId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      deleteAppMutation.mutate(appId)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-header"
        >
          <h1 className="section-title font-heading">My Applications</h1>
          <p className="section-subtitle">
            Manage your applications and API access
          </p>
        </motion.div>

        <div className="card-elevated">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('live')}
                className={`tab-button ${
                  activeTab === 'live' ? 'active' : ''
                }`}
              >
                Live Applications ({apps.filter(app => app.status === 'live').length})
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`tab-button ${
                  activeTab === 'test' ? 'active' : ''
                }`}
              >
                Test Applications ({apps.filter(app => app.status === 'test').length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">Loading your applications...</p>
                </div>
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-card flex items-center justify-center mb-6 shadow-sm">
                  <svg className="h-10 w-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-heading mb-3">
                  No {activeTab} applications
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  {activeTab === 'live' 
                    ? 'Create your first live application to get started with our APIs.'
                    : 'Create test applications to experiment with our APIs safely.'
                  }
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  Create New Application
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="fade-in"
                  >
                    <AppCard
                      app={app}
                      onDelete={() => handleDeleteApp(app.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {filteredApps.length > 0 && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateAppModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createAppMutation.mutate}
        isLoading={createAppMutation.isPending}
      />

      <ClientSecretModal
        isOpen={showClientSecretModal}
        onClose={() => {
          setShowClientSecretModal(false)
          setNewAppData(null)
        }}
        appData={newAppData}
      />
    </div>
  )
}

export default DashboardPage
