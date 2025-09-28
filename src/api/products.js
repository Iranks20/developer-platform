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

// Fallback mock data for when API is not available
const fallbackProducts = [
  {
    scope_group_id: 1,
    scope_group_name: "KYC",
    scope_group_description: "Know Your Customer verification services",
    scope_group_type: "product",
    scope_group_status: "active"
  },
  {
    scope_group_id: 2,
    scope_group_name: "Wallets",
    scope_group_description: "Digital wallet management and operations",
    scope_group_type: "product",
    scope_group_status: "active"
  },
  {
    scope_group_id: 3,
    scope_group_name: "Transfers",
    scope_group_description: "Money transfer and payment services",
    scope_group_type: "product",
    scope_group_status: "active"
  },
  {
    scope_group_id: 4,
    scope_group_name: "Collections",
    scope_group_description: "Payment collection and processing",
    scope_group_type: "product",
    scope_group_status: "pending"
  },
  {
    scope_group_id: 5,
    scope_group_name: "Disbursements",
    scope_group_description: "Fund disbursement and payout services",
    scope_group_type: "product",
    scope_group_status: "disabled"
  }
]

export const productsApi = {
  // Fetch products based on user access level
  getAll: async (userAccessLevel = 1) => {
    try {
      console.log('Fetching products for access level:', userAccessLevel)
      
      // Determine which endpoint to use based on access level
      const endpoint = userAccessLevel === 2 
        ? `${API_BASE}/appsettings/products` 
        : `${API_BASE}/appsettings/products/active`
      
      console.log('Fetching from endpoint:', endpoint)
      
      const response = await fetch(endpoint, {
        headers: getAuthHeaders()
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Products API response:', data)
      
      if (data.success && data.data) {
        return data.data.map(product => ({
          id: product.scope_group_id,
          name: product.scope_group_name,
          description: product.scope_group_description || 'No description provided',
          status: product.scope_group_status,
          type: product.scope_group_type,
          scope_group_id: product.scope_group_id,
          scope_group_name: product.scope_group_name,
          scope_group_description: product.scope_group_description,
          scope_group_type: product.scope_group_type,
          scope_group_status: product.scope_group_status
        }))
      }
      
      return []
    } catch (error) {
      console.log('API not available, using fallback products:', error.message)
      return fallbackProducts.map(product => ({
        id: product.scope_group_id,
        name: product.scope_group_name,
        description: product.scope_group_description || 'No description provided',
        status: product.scope_group_status,
        type: product.scope_group_type,
        scope_group_id: product.scope_group_id,
        scope_group_name: product.scope_group_name,
        scope_group_description: product.scope_group_description,
        scope_group_type: product.scope_group_type,
        scope_group_status: product.scope_group_status
      }))
    }
  },

  // Create a new product (admin only)
  create: async (productData) => {
    try {
      console.log('Creating product:', productData)
      const response = await fetch(`${API_BASE}/appsettings/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          scope_group_name: productData.name,
          scope_group_description: productData.description,
          scope_group_type: 'product',
          scope_group_status: productData.status || 'active'
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create product')
      }
      
      const data = await response.json()
      console.log('Create product response:', data)
      
      if (data.success && data.data) {
        return {
          id: data.data.scope_group_id,
          name: data.data.scope_group_name,
          description: data.data.scope_group_description || 'No description provided',
          status: data.data.scope_group_status,
          type: data.data.scope_group_type,
          scope_group_id: data.data.scope_group_id,
          scope_group_name: data.data.scope_group_name,
          scope_group_description: data.data.scope_group_description,
          scope_group_type: data.data.scope_group_type,
          scope_group_status: data.data.scope_group_status
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.log('API not available, using fallback creation:', error.message)
      const newProduct = {
        scope_group_id: Date.now(),
        scope_group_name: productData.name,
        scope_group_description: productData.description,
        scope_group_type: 'product',
        scope_group_status: productData.status || 'active'
      }
      return {
        id: newProduct.scope_group_id,
        name: newProduct.scope_group_name,
        description: newProduct.scope_group_description || 'No description provided',
        status: newProduct.scope_group_status,
        type: newProduct.scope_group_type,
        scope_group_id: newProduct.scope_group_id,
        scope_group_name: newProduct.scope_group_name,
        scope_group_description: newProduct.scope_group_description,
        scope_group_type: newProduct.scope_group_type,
        scope_group_status: newProduct.scope_group_status
      }
    }
  },

  // Update a product (admin only)
  update: async (productId, productData) => {
    try {
      console.log('Updating product:', productId, productData)
      const response = await fetch(`${API_BASE}/appsettings/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          scope_group_name: productData.name,
          scope_group_description: productData.description,
          scope_group_type: 'product',
          scope_group_status: productData.status
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      
      const data = await response.json()
      console.log('Update product response:', data)
      
      if (data.success && data.data) {
        return {
          id: data.data.scope_group_id,
          name: data.data.scope_group_name,
          description: data.data.scope_group_description || 'No description provided',
          status: data.data.scope_group_status,
          type: data.data.scope_group_type,
          scope_group_id: data.data.scope_group_id,
          scope_group_name: data.data.scope_group_name,
          scope_group_description: data.data.scope_group_description,
          scope_group_type: data.data.scope_group_type,
          scope_group_status: data.data.scope_group_status
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.log('API not available, using fallback update:', error.message)
      return {
        id: productId,
        name: productData.name,
        description: productData.description || 'No description provided',
        status: productData.status,
        type: 'product',
        scope_group_id: productId,
        scope_group_name: productData.name,
        scope_group_description: productData.description,
        scope_group_type: 'product',
        scope_group_status: productData.status
      }
    }
  },

  // Delete a product (admin only)
  delete: async (productId) => {
    try {
      console.log('Deleting product:', productId)
      const response = await fetch(`${API_BASE}/appsettings/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      
      const data = await response.json()
      console.log('Delete product response:', data)
      
      return data
    } catch (error) {
      console.log('API not available, using fallback delete:', error.message)
      return { success: true }
    }
  }
}
