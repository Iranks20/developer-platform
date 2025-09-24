import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar = ({ app, activeTab, onTabChange }) => {
  const navigation = [
    { id: 'overview', name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { id: 'products', name: 'Product Status', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'countries', name: 'Countries', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'docs', name: 'API Docs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-white border-r-2 border-gray-100 shadow-lg pt-6 pb-4 overflow-y-auto">

        <div className="px-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 font-heading">{app.name}</h3>
                
              </div>
            </div>
        </div>

        <nav className="flex-1 px-2 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`nav-link w-full text-left ${
                activeTab === item.id ? 'active' : ''
              }`}
            >
              <svg
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  activeTab === item.id ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
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

        <div className="flex-shrink-0 flex border-t-2 border-gray-100 p-4">
          <Link
            to="/dashboard"
            className="flex-shrink-0 w-full group block"
          >
            <div className="flex items-center space-x-3 p-2 rounded-default hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                Back to Applications
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
