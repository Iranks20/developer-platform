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

const userAccountsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE}/useraccounts`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map(user => ({
          id: user.user_account_id,
          name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email_address || user.email,
          accessLevel: user.access_level,
          status: user.user_account_status,
          createdAt: user.date_created,
          lastLoginAt: user.last_login_at,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email_address)}&background=3b82f6&color=fff`
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (userAccountId) => {
    try {
      const response = await fetch(`${API_BASE}/useraccounts/${userAccountId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const user = data.data;
        return {
          id: user.user_account_id,
          name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email_address || user.email,
          accessLevel: user.access_level,
          status: user.user_account_status,
          createdAt: user.date_created,
          lastLoginAt: user.last_login_at,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email_address)}&background=3b82f6&color=fff`
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  getByStatus: async (status) => {
    try {
      const response = await fetch(`${API_BASE}/useraccounts/bystatus/${status}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map(user => ({
          id: user.user_account_id,
          name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email_address || user.email,
          accessLevel: user.access_level,
          status: user.user_account_status,
          createdAt: user.date_created,
          lastLoginAt: user.last_login_at,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email_address)}&background=3b82f6&color=fff`
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching users by status:', error);
      throw error;
    }
  },

  getByEmail: async (emailAddress) => {
    try {
      const response = await fetch(`${API_BASE}/useraccounts/byemail/${encodeURIComponent(emailAddress)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const user = data.data;
        return {
          id: user.user_account_id,
          name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email_address || user.email,
          accessLevel: user.access_level,
          status: user.user_account_status,
          createdAt: user.date_created,
          lastLoginAt: user.last_login_at,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email_address)}&background=3b82f6&color=fff`
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  update: async (userAccountId, updateData) => {
    try {
      const response = await fetch(`${API_BASE}/useraccounts/${userAccountId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          access_level: updateData.accessLevel,
          user_account_status: updateData.status
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const user = data.data;
        return {
          id: user.user_account_id,
          name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email_address || user.email,
          accessLevel: user.access_level,
          status: user.user_account_status,
          createdAt: user.date_created,
          lastLoginAt: user.last_login_at,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email_address)}&background=3b82f6&color=fff`
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

export default userAccountsApi;
