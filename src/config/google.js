// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  redirectUri: window.location.origin,
  scopes: [
    'openid',
    'email',
    'profile'
  ]
}

export const GOOGLE_BUTTON_CONFIG = {
  theme: 'outline',
  size: 'large',
  text: 'continue_with',
  shape: 'rectangular',
  width: '100%'
}