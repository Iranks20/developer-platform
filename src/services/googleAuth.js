import { GOOGLE_CONFIG, GOOGLE_BUTTON_CONFIG } from '../config/google'
import { FEATURE_FLAGS } from '../config/environment'

class GoogleAuthService {
  constructor() {
    this.isInitialized = false
    this.clientId = GOOGLE_CONFIG.clientId
  }

  async initialize() {
    if (this.isInitialized) return

    return new Promise((resolve, reject) => {
      if (window.google) {
        this.isInitialized = true
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        this.isInitialized = true
        resolve()
      }
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'))
      }
      document.head.appendChild(script)
    })
  }

  async signIn() {
    await this.initialize()

    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          try {
            const payload = this.parseJwt(response.credential)
            resolve({
              credential: response.credential,
              payload: payload
            })
          } catch (error) {
            reject(error)
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      })

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google Sign-In was cancelled or not displayed'))
        }
      })
    })
  }

  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error('Invalid JWT token')
    }
  }

  renderButton(elementId, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Google Auth not initialized')
    }

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        ...GOOGLE_BUTTON_CONFIG,
        ...options
      }
    )
  }

  async verifyTokenWithBackend(credential) {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: credential })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Google authentication failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Google auth verification failed:', error)
      throw error
    }
  }
}

export const googleAuthService = new GoogleAuthService()
