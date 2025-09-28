import { API_CONFIG } from '../config/environment'

const API_BASE = API_CONFIG.BASE_URL;

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

const productPairingApi = {
  addPair: async (pairData) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/addpair`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pairData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          ...data,
          data: {
            id: data.data.record_id,
            name: 'Product Pair',
            description: 'Product pairing created successfully',
            status: data.data.assignment_status,
            type: 'product_pair',
            scope_group_id: data.data.scope_group_id,
            country_id: data.data.country_id,
            call_back_url: data.data.call_back_url,
            pin: data.data.pin,
            record_id: data.data.record_id,
            client_id: data.data.client_id,
            date_created: data.data.date_created
          }
        };
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  updatePair: async (recordId, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/updatepair/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          call_back_url: updateData.call_back_url,
          pin: updateData.pin
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  getPairs: async (clientId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/getpairs/${clientId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
        return data.data.map(pair => ({
          id: pair.record_id,
          name: pair.mvd_api_scopes?.scope_group_name || 'Unknown Product',
          description: pair.mvd_api_scopes?.scope_group_name || 'No description provided',
          status: pair.assignment_status || 'inactive',
          type: 'product pair',
          scope_group_id: pair.scope_group_id,
          country_id: pair.country_id,
          call_back_url: pair.call_back_url,
          pin: pair.pin,
          record_id: pair.record_id,
          client_id: pair.client_id,
          product_name: pair.mvd_api_scopes?.scope_group_name,
          country_name: pair.mvd_opcos?.name,
          country_alpha3: pair.mvd_opcos?.alpha3_code
        }));
      }
      
      return [];
    } catch (error) {
      return [];
    }
  },

  removePair: async (recordId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/removepair/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  deactivatePair: async (recordId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/deactivatepair/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Admin-specific methods for product management
  approveProduct: async (recordId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/approveproduct/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  rejectProduct: async (recordId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/rejectproduct/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  activateProduct: async (recordId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/activateproduct/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  deactivateProduct: async (recordId) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/deactivateproduct/${recordId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  approvePair: async (recordId, assignmentStatus, approvalPin) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/app/approvepair`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          record_id: recordId,
          assignment_status: assignmentStatus,
          approval_pin: approvalPin
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default productPairingApi;
