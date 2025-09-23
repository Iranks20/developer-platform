import React, { useEffect, useRef } from 'react'
import { googleAuthService } from '../services/googleAuth'
import { TEST_CREDENTIALS } from '../config/testCredentials'

const GoogleSignInButton = ({ onSuccess, onError, text = 'Continue with Google', disabled = false }) => {
  const buttonRef = useRef(null)

  useEffect(() => {
    const initializeButton = async () => {
      try {
        await googleAuthService.initialize()
        
        if (buttonRef.current) {
          googleAuthService.renderButton(buttonRef.current.id, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: '100%',
            disabled: disabled
          })

          window.google.accounts.id.initialize({
            client_id: TEST_CREDENTIALS.GOOGLE_CLIENT_ID,
            callback: (response) => {
              try {
                const payload = googleAuthService.parseJwt(response.credential)
                
                // Log the token for backend developer testing
                console.log('🔑 Google ID Token for Backend Testing:')
                console.log('Token:', response.credential)
                console.log('User:', payload.email, '|', payload.name)
                console.log('Expires:', new Date(payload.exp * 1000).toLocaleString())
                
                onSuccess({
                  credential: response.credential,
                  payload: payload
                })
              } catch (error) {
                onError(error)
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          })
        }
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error)
        onError(error)
      }
    }

    initializeButton()
  }, [onSuccess, onError, disabled])

  return (
    <div className="w-full">
      <div 
        ref={buttonRef}
        id="google-signin-button"
        className="w-full"
      />
    </div>
  )
}

export default GoogleSignInButton
