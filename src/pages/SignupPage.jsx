import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import GoogleSignInButton from '../components/GoogleSignInButton'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await authApi.signup(formData.name, formData.email, formData.password)
      
      if (response.user) {
        login(response.user)
        navigate('/dashboard')
      } else {
        setError('Signup failed. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async (googleResponse) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authApi.googleSignUp(googleResponse.credential)
      login(response.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Google signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = (error) => {
    setError('Google sign-in failed. Please try again.')
    console.error('Google Sign-In Error:', error)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-secondary-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 gradient-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 font-heading text-white">Welcome to Developer Portal</h1>
            <p className="text-xl text-secondary-100 mb-8 leading-relaxed">
              Build amazing applications with our powerful APIs and developer tools.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium">Access to 100+ APIs</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium">Real-time analytics</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-medium">24/7 developer support</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-white bg-opacity-10 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-white bg-opacity-5 rounded-full blur-sm"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <div className="mx-auto h-16 w-16 gradient-secondary rounded-card flex items-center justify-center mb-6 shadow-lg">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 font-heading mb-3">Create your account</h2>
            <p className="text-lg text-gray-600">
              Join thousands of developers building amazing applications
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Create a strong password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="bg-error-50 border border-error-200 rounded-default p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-error-800 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 mr-3"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </motion.div>


          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <GoogleSignInButton
                onSuccess={handleGoogleSignIn}
                onError={handleGoogleError}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignupPage
