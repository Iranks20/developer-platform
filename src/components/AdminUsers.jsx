import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from './Modal'
import LoadingSpinner from './LoadingSpinner'

const AdminUsers = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const queryClient = useQueryClient()

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      accessLevel: 1,
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastLoginAt: '2024-01-20T14:22:00Z',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      accessLevel: 2,
      status: 'active',
      createdAt: '2024-01-10T09:15:00Z',
      lastLoginAt: '2024-01-21T08:45:00Z',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      accessLevel: 1,
      status: 'inactive',
      createdAt: '2024-01-05T16:20:00Z',
      lastLoginAt: '2024-01-18T11:30:00Z',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=f59e0b&color=fff'
    }
  ]

  const { data: users = mockUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockUsers
    }
  })

  const createUserMutation = useMutation({
    mutationFn: async (userData) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id: Date.now().toString(), ...userData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      setIsCreateModalOpen(false)
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { id, ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
      setIsEditModalOpen(false)
      setSelectedUser(null)
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users'])
    }
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusCount = (status) => {
    if (status === 'all') return users.length
    return users.filter(user => user.status === status).length
  }

  const getAccessLevelLabel = (level) => {
    return level === 2 ? 'Admin' : 'User'
  }

  const getAccessLevelColor = (level) => {
    return level === 2 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-700">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1">
            {[
              { key: 'all', label: 'All Users', count: getStatusCount('all') },
              { key: 'active', label: 'Active', count: getStatusCount('active') },
              { key: 'inactive', label: 'Inactive', count: getStatusCount('inactive') }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  filterStatus === tab.key
                    ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-600 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Access Level
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 border-b border-gray-300"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-700">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccessLevelColor(user.accessLevel)}`}>
                      {getAccessLevelLabel(user.accessLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-700 mb-6">
              {searchTerm 
                ? `No users match "${searchTerm}"`
                : `No users with ${filterStatus} status found.`
              }
            </p>
          </div>
        )}
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createUserMutation.mutate}
        isLoading={createUserMutation.isPending}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSubmit={(data) => updateUserMutation.mutate({ id: selectedUser.id, data })}
        isLoading={updateUserMutation.isPending}
      />
    </div>
  )
}

const CreateUserModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accessLevel: 1,
    status: 'active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', accessLevel: 1, status: 'active' })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Level
          </label>
          <select
            value={formData.accessLevel}
            onChange={(e) => setFormData({ ...formData, accessLevel: parseInt(e.target.value) })}
            className="input-field"
          >
            <option value={1}>User</option>
            <option value={2}>Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={handleClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

const EditUserModal = ({ isOpen, onClose, user, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    accessLevel: user?.accessLevel || 1,
    status: user?.status || 'active'
  })

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        accessLevel: user.accessLevel,
        status: user.status
      })
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Level
          </label>
          <select
            value={formData.accessLevel}
            onChange={(e) => setFormData({ ...formData, accessLevel: parseInt(e.target.value) })}
            className="input-field"
          >
            <option value={1}>User</option>
            <option value={2}>Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="input-field"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AdminUsers
