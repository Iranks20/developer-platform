const API_BASE = 'https://openapi.qa.gwiza.co';

const countriesApi = {
  getAll: async (userAccessLevel) => {
    try {
      const endpoint = userAccessLevel === 2 
        ? `${API_BASE}/appsettings/countries`
        : `${API_BASE}/appsettings/countries/active`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data.map(country => ({
          id: country.country_id,
          name: country.name,
          alpha2Code: country.alpha2Code,
          callingCode: country.callingCode,
          alpha3Code: country.alpha3Code,
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
          alpha3Code: "RWA",
          flag: "rwanda",
          currency: "RWF",
          status: "Active"
        },
        {
          id: 6,
          name: "Kenya",
          alpha2Code: "KE",
          callingCode: "254",
          alpha3Code: "KEN",
          flag: "kenya",
          currency: "KES",
          status: "Inactive"
        }
      ];
      
      return fallbackCountries;
    }
  },

  create: async (countryData) => {
    try {
      const response = await fetch(`${API_BASE}/appsettings/countries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: countryData.name,
          alpha2Code: countryData.alpha2Code,
          callingCode: countryData.callingCode,
          alpha3Code: countryData.alpha3Code,
          flag: countryData.flag,
          currency: countryData.currency,
          country_status: countryData.status
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
          alpha2Code: data.data.alpha2Code,
          callingCode: data.data.callingCode,
          alpha3Code: data.data.alpha3Code,
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
      const response = await fetch(`${API_BASE}/appsettings/countries/${countryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: countryData.name,
          alpha2Code: countryData.alpha2Code,
          callingCode: countryData.callingCode,
          alpha3Code: countryData.alpha3Code,
          flag: countryData.flag,
          currency: countryData.currency,
          country_status: countryData.status
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
          alpha2Code: data.data.alpha2Code,
          callingCode: data.data.callingCode,
          alpha3Code: data.data.alpha3Code,
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
      const response = await fetch(`${API_BASE}/appsettings/countries/${countryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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
