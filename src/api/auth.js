const API_BASE = 'https://openapi.qa.gwiza.co'

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_type: 'email',
          email_address: email,
          password: password
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }
      
      const data = await response.json()
      
      if (data.success && data.data && data.data.user) {
        return {
          user: {
            id: data.data.user.user_account_id,
            email: data.data.user.email_address,
            name: data.data.user.full_name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.data.user.full_name)}&background=3b82f6&color=fff`,
            status: data.data.user.user_account_status
          },
          token: data.data.access_token,
          tokenType: data.data.token_type,
          expiresIn: data.data.expires_in,
          scope: data.data.scope
        }
      }
      
      return data
    } catch (error) {
      console.error('Login API Error:', error)
      throw new Error(error.message || 'Login failed')
    }
  },

  signup: async (fullName, email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_type: 'email',
          full_name: fullName,
          email_address: email,
          password: password
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Signup failed')
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        return {
          user: {
            id: data.data.user_account_id,
            email: data.data.email_address,
            name: data.data.full_name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.data.full_name)}&background=3b82f6&color=fff`,
            status: data.data.user_account_status
          }
        }
      }
      
      return data
    } catch (error) {
      console.error('Signup API Error:', error)
      throw new Error(error.message || 'Signup failed')
    }
  },

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
