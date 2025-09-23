import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { appsApi } from '../api/apps'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import AppCard from '../components/AppCard'
import CreateAppModal from '../components/CreateAppModal'
import LoadingSpinner from '../components/LoadingSpinner'

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('live')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ['apps'],
    queryFn: appsApi.getAll,
  })

  console.log('Dashboard - Apps data:', apps)
  console.log('Dashboard - Loading:', isLoading)
  console.log('Dashboard - Error:', error)

  const createAppMutation = useMutation({
    mutationFn: appsApi.create,
    onSuccess: (data) => {
      console.log('App created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      setIsCreateModalOpen(false)
      // Navigate to the newly created app dashboard
      navigate(`/app/${data.id}`)
    },
    onError: (error) => {
      console.error('Failed to create app:', error)
    },
  })

  const deleteAppMutation = useMutation({
    mutationFn: appsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">
            Manage your applications and API access
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('live')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'live'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Live Applications ({apps.filter(app => app.status === 'live').length})
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'test'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Test Applications ({apps.filter(app => app.status === 'test').length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} applications
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'live' 
                    ? 'Create your first live application to get started.'
                    : 'Create test applications to experiment with our APIs.'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  + Create New Application
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
    </div>
  )
}

export default DashboardPage
