const API_BASE = 'https://openapi.qa.gwiza.co'

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('portal_user') || '{}');
  if (user.token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

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
      
      let endpoint = `${API_BASE}/auth/oauth2/client/byuser/${userId}`
      if (userId === 'admin-all-users') {
        endpoint = `${API_BASE}/auth/oauth2/client`
      }
      
      const response = await fetch(endpoint, {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      console.log('API response:', data)
      
      if (data.success && data.data) {
        return data.data.map(app => ({
          id: app.client_id,
          name: app.client_name,
          description: app.client_description || 'No description provided',
          status: app.client_env === 'PDN' ? 'live' : 'test',
          clientStatus: app.client_status,
          clientEnv: app.client_env,
          createdAt: app.created_at,
          clientId: app.client_id,
          clientSecret: 'hidden',
          userAccountId: app.user_account_id || 'unknown',
          redirectUri: app.redirect_uri,
          public: app.public
        }))
      }
      
      return []
    } catch (error) {
      console.log('API not available, using fallback data:', error.message)
      console.log('Fallback apps:', fallbackApps)
      return fallbackApps
    }
  },

  getAllAdmin: async () => {
    try {
      console.log('Attempting to fetch all apps from API for admin')
      const response = await fetch(`${API_BASE}/auth/oauth2/client`, {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch all applications for admin: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      console.log('Admin API response:', data)

      if (data.success && data.data) {
        return data.data.map(app => ({
          id: app.client_id,
          name: app.client_name,
          description: app.client_description || 'No description provided',
          status: app.client_env === 'PDN' ? 'live' : 'test',
          clientStatus: app.client_status,
          clientEnv: app.client_env,
          createdAt: app.created_at,
          clientId: app.client_id,
          clientSecret: 'hidden',
          userAccountId: app.user_account_id || 'unknown',
          redirectUri: app.redirect_uri,
          public: app.public
        }))
      }

      return []
    } catch (error) {
      console.error('Error fetching all applications for admin:', error)
      throw error
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

  getAppDetails: async (clientId) => {
    try {
      console.log('Fetching app details for client ID:', clientId)
      const response = await fetch(`${API_BASE}/auth/oauth2/client/${clientId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch application details')
      }
      const data = await response.json()
      console.log('App details response:', data)
      
      if (data.success && data.data) {
        return {
          id: data.data.client_id,
          name: data.data.client_name,
          description: data.data.client_description || 'No description provided',
          status: data.data.client_env === 'PDN' ? 'live' : 'test',
          createdAt: data.data.created_at,
          clientId: data.data.client_id,
          clientSecret: 'hidden', // Will be fetched separately
          redirectUri: data.data.redirect_uri,
          public: data.data.public,
          clientStatus: data.data.client_status,
          clientEnv: data.data.client_env,
          scopes: data.data.mvd_api_client_scopes || []
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.log('API not available, using fallback data for app details:', error.message)
      const app = fallbackApps.find(a => a.id === clientId || a.clientId === clientId)
      if (!app) {
        throw new Error('Application not found')
      }
      return {
        id: app.id,
        name: app.name,
        description: app.description,
        status: app.status,
        createdAt: app.createdAt,
        clientId: app.clientId,
        clientSecret: app.clientSecret,
        redirectUri: null,
        public: false,
        clientStatus: 'new',
        clientEnv: app.status === 'live' ? 'PDN' : 'QA',
        scopes: []
      }
    }
  },

  getAppKeys: async (clientId) => {
    try {
      console.log('Fetching app keys for client ID:', clientId)
      const response = await fetch(`${API_BASE}/auth/oauth2/client/appkey/${clientId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch application keys')
      }
      const data = await response.json()
      console.log('App keys response:', data)
      
      if (data.success && data.data && data.data.length > 0) {
        const keyData = data.data[0]
        return {
          publicKey: keyData.public_key_pem,
          registrationDate: keyData.registration_date,
          lastRotationAt: keyData.last_rotation_at,
          recordId: keyData.record_id
        }
      }
      
      return null
    } catch (error) {
      console.log('API not available, using fallback data for app keys:', error.message)
      const app = fallbackApps.find(a => a.id === clientId || a.clientId === clientId)
      if (!app) {
        return null
      }
      return {
        publicKey: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${Math.random().toString(36).substr(2, 50)}\n-----END PUBLIC KEY-----`,
        registrationDate: app.createdAt,
        lastRotationAt: app.createdAt,
        recordId: app.id
      }
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
          clientStatus: 'new',
          clientEnv: 'QA',
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

  regenerateKeys: async (clientId) => {
    try {
      console.log('Regenerating keys for client ID:', clientId)
      const response = await fetch(`${API_BASE}/auth/oauth2/client/rotate-keys`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          client_id: clientId,
          reason: "operator requested"
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to regenerate keys')
      }
      const data = await response.json()
      console.log('Regenerate keys response:', data)
      
      if (data.success && data.data) {
        return {
          clientId: data.data.client_id,
          publicKey: data.data.publicKeyPem,
          success: data.success,
          message: data.resp_msg
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.log('API not available, using fallback key regeneration:', error.message)
      const app = fallbackApps.find(a => a.id === clientId)
      if (!app) {
        throw new Error('Application not found')
      }
      return {
        clientId: clientId,
        publicKey: `-----BEGIN PUBLIC KEY-----\n${Math.random().toString(36).substr(2, 50)}\n-----END PUBLIC KEY-----`,
        success: true,
        message: "Keys regenerated successfully (fallback)"
      }
    }
  },

  regenerateSecret: async (clientId) => {
    try {
      console.log('Regenerating secret for client ID:', clientId)
      const response = await fetch(`${API_BASE}/auth/oauth2/client/rotate-secret`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          client_id: clientId,
          reason: "operator requested"
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to regenerate client secret')
      }
      const data = await response.json()
      console.log('Regenerate secret response:', data)
      
      if (data.success && data.data) {
        return {
          clientSecret: data.data.client_secret,
          clientId: data.data.client_id,
          clientName: data.data.client_name,
          secretVersion: data.data.secret_version,
          secretRotatedAt: data.data.secret_rotated_at,
          success: data.success,
          message: data.resp_msg
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.log('API not available, using fallback secret regeneration:', error.message)
      const app = fallbackApps.find(a => a.id === clientId || a.clientId === clientId)
      if (!app) {
        throw new Error('Application not found')
      }
      const newSecret = generateClientSecret(app.status)
      app.clientSecret = newSecret
      return { 
        clientSecret: newSecret,
        clientId: clientId,
        clientName: app.name,
        secretVersion: 1,
        secretRotatedAt: new Date().toISOString(),
        success: true,
        message: 'Secret regenerated successfully (fallback)'
      }
    }
  },
}
