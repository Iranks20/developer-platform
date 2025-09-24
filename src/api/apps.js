const API_BASE = 'https://openapi.qa.gwiza.co'

// Fallback in-memory store for when MSW is not working
let fallbackApps = [
  {
    id: '1',
    name: 'E-commerce App',
    description: 'Main e-commerce application for online store',
    status: 'live',
    createdAt: '2024-01-15T10:30:00Z',
    clientId: 'app_1234567890abcdef',
    clientSecret: 'sk_live_abcdef1234567890',
    products: [
      { id: 'prod_1', name: 'Payment API', status: 'active' },
      { id: 'prod_2', name: 'User Management', status: 'active' },
      { id: 'prod_3', name: 'Analytics API', status: 'pending' }
    ]
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Mobile application for iOS and Android',
    status: 'test',
    createdAt: '2024-02-20T14:15:00Z',
    clientId: 'app_0987654321fedcba',
    clientSecret: 'sk_test_fedcba0987654321',
    products: [
      { id: 'prod_4', name: 'Push Notifications', status: 'active' },
      { id: 'prod_5', name: 'Location Services', status: 'disabled' }
    ]
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Internal analytics and reporting dashboard',
    status: 'live',
    createdAt: '2024-03-10T09:45:00Z',
    clientId: 'app_abcdef1234567890',
    clientSecret: 'sk_live_1234567890abcdef',
    products: [
      { id: 'prod_6', name: 'Data Export API', status: 'active' },
      { id: 'prod_7', name: 'Real-time Metrics', status: 'active' },
      { id: 'prod_8', name: 'Webhook Management', status: 'pending' }
    ]
  },
  {
    id: '4',
    name: 'API Gateway',
    description: 'Centralized API gateway for microservices',
    status: 'test',
    createdAt: '2024-03-25T16:20:00Z',
    clientId: 'app_gateway123456789',
    clientSecret: 'sk_test_gateway123456789',
    products: [
      { id: 'prod_9', name: 'Rate Limiting', status: 'active' },
      { id: 'prod_10', name: 'Authentication', status: 'active' },
      { id: 'prod_11', name: 'Monitoring', status: 'disabled' }
    ]
  }
]

let nextId = 5

const generateId = () => (nextId++).toString()
const generateClientId = () => `app_${Math.random().toString(36).substr(2, 16)}`
const generateClientSecret = (status) => `sk_${status}_${Math.random().toString(36).substr(2, 20)}`

export const appsApi = {
  getAll: async (userId) => {
    try {
      console.log('Attempting to fetch apps from API for user:', userId)
      const response = await fetch(`${API_BASE}/auth/oauth2/client/byuser/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }
      const data = await response.json()
      console.log('API response:', data)
      
      if (data.success && data.data) {
        return data.data.map(app => ({
          id: app.client_id,
          name: app.client_name,
          description: app.client_description || 'No description provided',
          status: app.public ? 'live' : 'test',
          createdAt: new Date().toISOString(),
          clientId: app.client_id,
          clientSecret: 'hidden'
        }))
      }
      
      return []
    } catch (error) {
      console.log('API not available, using fallback data:', error.message)
      console.log('Fallback apps:', fallbackApps)
      return fallbackApps
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/apps/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch application')
      }
      return response.json()
    } catch (error) {
      console.log('MSW not available, using fallback data')
      const app = fallbackApps.find(a => a.id === id)
      if (!app) {
        throw new Error('Application not found')
      }
      return app
    }
  },

  create: async (appData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/oauth2/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_account_id: appData.userAccountId,
          client_name: appData.name,
          client_description: appData.description,
          redirect_url: appData.redirectUrl || ''
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to create application')
      }
      const data = await response.json()
      console.log('Create app response:', data)
      
      if (data.success && data.data) {
        return {
          id: data.data.client_id,
          name: data.data.client_name,
          description: appData.description,
          status: 'test',
          createdAt: new Date().toISOString(),
          clientId: data.data.client_id,
          clientSecret: data.data.client_secret
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.log('API not available, using fallback creation')
      const newApp = {
        id: generateId(),
        name: appData.name,
        description: appData.description,
        status: 'test',
        createdAt: new Date().toISOString(),
        clientId: generateClientId(),
        clientSecret: generateClientSecret('test'),
        products: []
      }
      fallbackApps.push(newApp)
      return newApp
    }
  },

  update: async (id, appData) => {
    try {
      const response = await fetch(`${API_BASE}/apps/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appData),
      })
      if (!response.ok) {
        throw new Error('Failed to update application')
      }
      return response.json()
    } catch (error) {
      console.log('MSW not available, using fallback update')
      const index = fallbackApps.findIndex(a => a.id === id)
      if (index === -1) {
        throw new Error('Application not found')
      }
      fallbackApps[index] = { ...fallbackApps[index], ...appData }
      return fallbackApps[index]
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/apps/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete application')
      }
      return response.json()
    } catch (error) {
      console.log('MSW not available, using fallback delete')
      const index = fallbackApps.findIndex(a => a.id === id)
      if (index === -1) {
        throw new Error('Application not found')
      }
      fallbackApps.splice(index, 1)
      return { success: true }
    }
  },

  regenerateKeys: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/apps/${id}/keys/regenerate`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to regenerate keys')
      }
      return response.json()
    } catch (error) {
      console.log('MSW not available, using fallback key regeneration')
      const app = fallbackApps.find(a => a.id === id)
      if (!app) {
        throw new Error('Application not found')
      }
      app.clientSecret = generateClientSecret(app.status)
      return { clientSecret: app.clientSecret }
    }
  },
}
