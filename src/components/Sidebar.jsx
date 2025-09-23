import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar = ({ app, activeTab, onTabChange }) => {
  const navigation = [
    { id: 'overview', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'keys', name: 'Key Management', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
    { id: 'products', name: 'Product Status', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'settings', name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'docs', name: 'API Docs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Portal</span>
          </Link>
        </div>

        <div className="px-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{app.name}</h3>
            <p className="text-xs text-gray-500 font-mono">{app.clientId}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                app.status === 'live' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {app.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                activeTab === item.id
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  activeTab === item.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link
            to="/dashboard"
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  ← Back to Applications
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
