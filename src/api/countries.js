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

const countriesApi = {
  getAll: async (userAccessLevel) => {
    try {
      const endpoint = userAccessLevel === 2 
        ? `${API_BASE}/opcos`
        : `${API_BASE}/opcos/active`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map(country => ({
          id: country.country_id,
          name: country.name,
          alpha2Code: country.alpha2_code,
          callingCode: country.calling_code,
          alpha3_code: country.alpha3_code,
          flag: country.flag,
          currency: country.currency,
          status: country.country_status
        }));
      }
      
      throw new Error(data.resp_msg || 'Failed to fetch countries');
    } catch (error) {
      console.error('Error fetching countries:', error);
      
      const fallbackCountries = [
        {
          id: 1,
          name: "Rwanda",
          alpha2Code: "RW",
          callingCode: "250",
          alpha3_code: "RWA",
          flag: "rwanda",
          currency: "RWF",
          status: "Active"
        },
        {
          id: 6,
          name: "Kenya",
          alpha2Code: "KE",
          callingCode: "254",
          alpha3_code: "KEN",
          flag: "kenya",
          currency: "KES",
          status: "Inactive"
        }
      ];
      
      return fallbackCountries;
    }
  },

  getOne: async (countryId) => {
    try {
      const response = await fetch(`${API_BASE}/opcos/${countryId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          id: data.data.country_id,
          name: data.data.name,
          alpha2Code: data.data.alpha2_code,
          callingCode: data.data.calling_code,
          alpha3_code: data.data.alpha3_code,
          flag: data.data.flag,
          currency: data.data.currency,
          status: data.data.country_status
        };
      }
      
      throw new Error(data.resp_msg || 'Failed to fetch country');
    } catch (error) {
      console.error('Error fetching country:', error);
      throw error;
    }
  },

  getCountryDetails: async (countryId) => {
    try {
      const response = await fetch(`${API_BASE}/opcos/${countryId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          id: data.data.country_id,
          name: data.data.name,
          alpha2Code: data.data.alpha2_code,
          callingCode: data.data.calling_code,
          alpha3_code: data.data.alpha3_code,
          flag: data.data.flag,
          currency: data.data.currency,
          status: data.data.country_status
        };
      }
      
      throw new Error(data.resp_msg || 'Failed to fetch country details');
    } catch (error) {
      console.error('Error fetching country details:', error);
      throw error;
    }
  },

  create: async (countryData) => {
    try {
      const response = await fetch(`${API_BASE}/opcos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: countryData.name,
          alpha2_code: countryData.alpha2Code,
          calling_code: countryData.callingCode,
          alpha3_code: countryData.alpha3Code,
          flag: countryData.flag,
          currency: countryData.currency,
          country_status: countryData.status.toLowerCase()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          id: data.data.country_id,
          name: data.data.name,
          alpha2Code: data.data.alpha2_code,
          callingCode: data.data.calling_code,
          alpha3_code: data.data.alpha3_code,
          flag: data.data.flag,
          currency: data.data.currency,
          status: data.data.country_status
        };
      }
      
      throw new Error(data.resp_msg || 'Failed to create country');
    } catch (error) {
      console.error('Error creating country:', error);
      throw error;
    }
  },

  update: async (countryId, countryData) => {
    try {
      const response = await fetch(`${API_BASE}/opcos/${countryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          flag: countryData.flag,
          country_status: countryData.status.toLowerCase()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          id: data.data.country_id,
          name: data.data.name,
          alpha2Code: data.data.alpha2_code,
          callingCode: data.data.calling_code,
          alpha3_code: data.data.alpha3_code,
          flag: data.data.flag,
          currency: data.data.currency,
          status: data.data.country_status
        };
      }
      
      throw new Error(data.resp_msg || 'Failed to update country');
    } catch (error) {
      console.error('Error updating country:', error);
      throw error;
    }
  },

  delete: async (countryId) => {
    try {
      const response = await fetch(`${API_BASE}/opcos/${countryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return true;
      }
      
      throw new Error(data.resp_msg || 'Failed to delete country');
    } catch (error) {
      console.error('Error deleting country:', error);
      throw error;
    }
  }
};

export default countriesApi;
