import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import AppDashboardPage from './pages/AppDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import DocsPage from './pages/DocsPage'
import LoadingSpinner from './components/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const AppRoutes = () => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  const getDefaultRoute = () => {
    if (!user) return "/login"
    return user.accessLevel === 2 ? "/admin" : "/dashboard"
  }
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to={getDefaultRoute()} replace /> : <SignupPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {user?.accessLevel === 2 ? <Navigate to="/admin" replace /> : <DashboardPage />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            {user?.accessLevel !== 2 ? <Navigate to="/dashboard" replace /> : <AdminDashboardPage />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/app/:appId" 
        element={
          <ProtectedRoute>
            <AppDashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/docs" 
        element={
          <ProtectedRoute>
            <DocsPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App
