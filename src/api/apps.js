import { API_CONFIG } from '../config/environment'

const API_BASE = API_CONFIG.BASE_URL

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

// Production API - no fallback data

export const appsApi = {
  getAll: async (userId) => {
    try {
      
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
      throw error
    }
  },

  getAllAdmin: async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/oauth2/client`, {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch all applications for admin: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()

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
      throw error
    }
  },

  getAppDetails: async (clientId) => {
    try {
      const response = await fetch(`${API_BASE}/auth/oauth2/client/${clientId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch application details')
      }
      const data = await response.json()
      
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
      throw error
    }
  },

  getAppKeys: async (clientId) => {
    try {
      const response = await fetch(`${API_BASE}/auth/oauth2/client/appkey/${clientId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch application keys')
      }
      const data = await response.json()
      
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
      throw error
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
      throw error
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
      throw error
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
      throw error
    }
  },

  regenerateKeys: async (clientId) => {
    try {
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
      throw error
    }
  },

  regenerateSecret: async (clientId) => {
    try {
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
      throw error
    }
  },
}
