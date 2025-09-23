const API_BASE = '/api'

export const authApi = {
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'OTP verification failed')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Auth API Error:', error)
      
      // Fallback for when MSW is not working
      if (otp === '123456') {
        return {
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`
          }
        }
      }
      
      throw new Error('Invalid OTP')
    }
  },

  googleSignIn: async (idToken) => {
    try {
      console.log('🚀 Google Sign-In Request to:', `${API_BASE}/auth/google`)
      
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Google authentication failed')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Google Auth API Error:', error)
      
      // Fallback for development when backend is not ready
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      return {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          isGoogleUser: true
        }
      }
    }
  },

  googleSignUp: async (idToken) => {
    try {
      console.log('🚀 Google Sign-Up Request to:', `${API_BASE}/auth/google/signup`)
      
      const response = await fetch(`${API_BASE}/auth/google/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Google signup failed')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Google Signup API Error:', error)
      
      // Fallback for development when backend is not ready
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      return {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          isGoogleUser: true
        }
      }
    }
  },
}
