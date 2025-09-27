import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appsApi } from '../api/apps'
import AppCard from './AppCard'
import CreateAppModal from './CreateAppModal'
import ClientSecretModal from './ClientSecretModal'
import LoadingSpinner from './LoadingSpinner'

const AdminApplications = ({ onSelectApp }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showClientSecretModal, setShowClientSecretModal] = useState(false)
  const [newAppData, setNewAppData] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: apps, isLoading, error } = useQuery({
    queryKey: ['admin-apps'],
    queryFn: () => appsApi.getAllAdmin()
  })

  const createAppMutation = useMutation({
    mutationFn: (appData) => appsApi.create({ ...appData, userAccountId: 'admin-created' }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-apps'])
      setIsCreateModalOpen(false)
      setNewAppData(data)
      setShowClientSecretModal(true)
    }
  })

  const deleteAppMutation = useMutation({
    mutationFn: appsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-apps'])
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
    const matchesTab = activeTab === 'all' || app.status === activeTab
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.clientId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  }) || []

  const getStatusCount = (status) => {
    if (status === 'all') return apps?.length || 0
    return apps?.filter(app => app.status === status).length || 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Applications</h2>
        <p className="text-gray-600 mb-6">There was a problem loading applications. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
          <p className="text-gray-700">Manage and monitor all applications in the system</p>
        </div>
         <button
           onClick={() => setIsCreateModalOpen(true)}
           className="btn-primary flex items-center"
         >
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
           </svg>
           Create Application
         </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1">
            {[
              { key: 'all', label: 'All Applications', count: getStatusCount('all') },
              { key: 'live', label: 'Live Applications', count: getStatusCount('live') },
              { key: 'test', label: 'Test Applications', count: getStatusCount('test') }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-600 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-700 mb-6">
              {searchTerm 
                ? `No applications match "${searchTerm}"`
                : activeTab === 'all' 
                  ? "No applications have been created yet."
                  : `No applications with ${activeTab} status found.`
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Create your first application
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Application
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Environment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Client ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredApps.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{app.name}</div>
                        <div className="text-sm text-gray-700 truncate max-w-xs">{app.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {app.clientEnv || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === 'live' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status === 'live' ? 'Live' : 'Test'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {app.clientId?.substring(0, 12)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => onSelectApp && onSelectApp(app)}
                          className="text-primary-600 hover:text-primary-900 transition-colors duration-150 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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

export default AdminApplications
