export const GOOGLE_CONFIG = {
  // Direct credentials for testing - replace with env vars in production
  clientId: '1014126568369-l9moqqlcka953cjui6fqt7alf0o0qkli.apps.googleusercontent.com',
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
