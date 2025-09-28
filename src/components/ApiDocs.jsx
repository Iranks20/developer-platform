import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { docsApi } from '../api/docs'
import LoadingSpinner from './LoadingSpinner'

const ApiDocs = () => {
  const [selectedApi, setSelectedApi] = useState(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState(null)

  const { data: docsData, isLoading } = useQuery({
    queryKey: ['docs'],
    queryFn: docsApi.getApis,
  })

  useEffect(() => {
    if (docsData?.apis && docsData.apis.length > 0 && !selectedApi) {
      setSelectedApi(docsData.apis[0])
    }
  }, [docsData, selectedApi])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const apis = docsData?.apis || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
        <p className="text-gray-600">Explore our APIs and integrate them into your applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Reference</h3>
            <nav className="space-y-2">
              {apis.map((api, index) => (
                <button
                  key={api.id}
                  onClick={() => {
                    setSelectedApi(api)
                    setSelectedEndpoint(null)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedApi?.id === api.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {api.name}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          {selectedApi ? (
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApi.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedApi.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Version: {selectedApi.version}</span>
                      <span className="text-sm text-gray-500">Base URL: {selectedApi.baseUrl}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints</h3>
                  <div className="space-y-3">
                    {selectedApi.endpoints.map((endpoint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedEndpoint(endpoint)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              endpoint.method === 'GET' 
                                ? 'bg-green-100 text-green-800'
                                : endpoint.method === 'POST'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                          </div>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedEndpoint && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      selectedEndpoint.method === 'GET' 
                        ? 'bg-green-100 text-green-800'
                        : selectedEndpoint.method === 'POST'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <code className="text-lg font-mono text-gray-900">{selectedEndpoint.path}</code>
                  </div>

                  <p className="text-gray-600 mb-6">{selectedEndpoint.description}</p>

                  {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedEndpoint.parameters.map((param, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-gray-900">{param.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{param.type}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {param.required ? (
                                    <span className="text-red-600">Yes</span>
                                  ) : (
                                    <span className="text-gray-400">No</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-sm text-gray-500">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Request Example</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{`curl -X ${selectedEndpoint.method} ${selectedApi.baseUrl}${selectedEndpoint.path} \\
  -H "Authorization: Bearer YOUR_CLIENT_ID" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2000,
    "currency": "usd"
  }'`}</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Response Example</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{JSON.stringify(selectedEndpoint.response.body, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="mx-auto h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an API to view documentation
              </h3>
              <p className="text-gray-500">
                Choose an API from the sidebar to explore its endpoints and examples.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ApiDocs
