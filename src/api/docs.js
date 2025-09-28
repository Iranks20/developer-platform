import { API_CONFIG } from '../config/environment'

const API_BASE = API_CONFIG.BASE_URL

export const docsApi = {
  getApis: async () => {
    try {
      const response = await fetch(`${API_BASE}/docs`)
      if (!response.ok) {
        throw new Error('Failed to fetch API documentation')
      }
      return response.json()
    } catch (error) {
      throw error
    }
  },
}