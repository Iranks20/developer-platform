// Environment configuration
// This file contains environment-specific settings

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  
  // API endpoints
  ENDPOINTS: {
    AUTH: '/auth',
    APPS: '/auth/oauth2/client',
    PRODUCTS: '/appsettings/products',
    COUNTRIES: '/appsettings/countries',
    USER_ACCOUNTS: '/useraccounts',
    OPCO: '/opcos',
    PRODUCT_PAIRING: '/appsettings/app'
  }
}

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Client ID from environment variable
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Scopes for Google OAuth
  SCOPES: [
    'openid',
    'email',
    'profile'
  ]
}

// Application Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Developer Portal',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DESCRIPTION: 'Developer Portal for API Management',
  ENVIRONMENT: import.meta.env.VITE_NODE_ENV || 'production'
}

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true',
  ENABLE_ADMIN_PANEL: import.meta.env.VITE_ENABLE_ADMIN_PANEL === 'true',
  ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true',
  ENABLE_CONSOLE_LOGS: import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true'
}