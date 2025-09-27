import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import AdminSidebar from '../components/AdminSidebar'
import AdminApplications from '../components/AdminApplications'
import AdminApplicationDetails from '../components/AdminApplicationDetails'
import AdminUsers from '../components/AdminUsers'
import Countries from '../components/Countries'
import ProductStatus from '../components/ProductStatus'
import ApiDocs from '../components/ApiDocs'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('applications')
  const [selectedApp, setSelectedApp] = useState(null)
  const { user, logout } = useAuth()

  const handleSelectApp = (app) => {
    setSelectedApp(app)
    setActiveTab('application-details')
  }

  const handleBackToApplications = () => {
    setSelectedApp(null)
    setActiveTab('applications')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'applications':
        return <AdminApplications onSelectApp={handleSelectApp} />
      case 'application-details':
        return (
          <AdminApplicationDetails
            selectedApp={selectedApp}
            onBack={handleBackToApplications}
          />
        )
      case 'users':
        return <AdminUsers />
      case 'products':
        return <ProductStatus app={null} />
      case 'countries':
        return <Countries />
      case 'docs':
        return <ApiDocs />
      default:
        return <AdminApplications onSelectApp={handleSelectApp} />
    }
  }

  if (!user || user.accessLevel !== 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <div className="flex">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedApp={selectedApp}
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

export default AdminDashboardPage
