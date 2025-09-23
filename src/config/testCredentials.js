// Test Credentials Configuration
// This file contains direct credentials for testing purposes
// In production, these should be moved to environment variables

export const TEST_CREDENTIALS = {
  // Google OAuth Credentials
  GOOGLE_CLIENT_ID: '1014126568369-l9moqqlcka953cjui6fqt7alf0o0qkli.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',
  
  // Project Information
  PROJECT_ID: 'developer-portal-473016',
  
  // API Configuration
  API_BASE_URL: 'http://localhost:3001/api',
  
  // Authorized Origins (for reference)
  AUTHORIZED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  
  // Redirect URIs (for reference)
  REDIRECT_URIS: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002'
  ]
}

// Backend Configuration for your tech lead
export const BACKEND_CONFIG = {
  GOOGLE_CLIENT_ID: TEST_CREDENTIALS.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: TEST_CREDENTIALS.GOOGLE_CLIENT_SECRET,
  PROJECT_ID: TEST_CREDENTIALS.PROJECT_ID,
  
  // Required API Endpoints
  ENDPOINTS: {
    GOOGLE_SIGNIN: '/api/auth/google',
    GOOGLE_SIGNUP: '/api/auth/google/signup'
  }
}

// Frontend Configuration
export const FRONTEND_CONFIG = {
  GOOGLE_CLIENT_ID: TEST_CREDENTIALS.GOOGLE_CLIENT_ID,
  API_BASE_URL: TEST_CREDENTIALS.API_BASE_URL,
  
  // Development URLs
  DEV_URLS: [
    'http://localhost:3000',
    'http://localhost:5173'
  ]
}

// Export everything for easy access
export default {
  TEST_CREDENTIALS,
  BACKEND_CONFIG,
  FRONTEND_CONFIG
}
