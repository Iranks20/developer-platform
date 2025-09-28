import React, { useEffect, useRef } from 'react'
import { googleAuthService } from '../services/googleAuth'
import { FEATURE_FLAGS } from '../config/environment'

const GoogleSignInButton = ({ onSuccess, onError, text = 'Continue with Google', disabled = false }) => {
  const buttonRef = useRef(null)

  useEffect(() => {
    const initializeButton = async () => {
      try {
        if (FEATURE_FLAGS.ENABLE_GOOGLE_AUTH) {
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
              client_id: googleAuthService.clientId,
              callback: (response) => {
                try {
                  const payload = googleAuthService.parseJwt(response.credential)
                  
                  // Process the OAuth response
                  
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
