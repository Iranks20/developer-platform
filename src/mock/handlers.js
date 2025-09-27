import { http, HttpResponse } from 'msw'

let applications = [
  {
    id: '1',
    name: 'E-commerce App',
    description: 'Main e-commerce application for online store',
    status: 'live',
    createdAt: '2024-01-15T10:30:00Z',
    clientId: 'app_1234567890abcdef',
    clientSecret: 'sk_live_abcdef1234567890',
    products: [
      { id: 'prod_1', name: 'Payment API', status: 'active' },
      { id: 'prod_2', name: 'User Management', status: 'active' },
      { id: 'prod_3', name: 'Analytics API', status: 'pending' }
    ]
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Mobile application for iOS and Android',
    status: 'test',
    createdAt: '2024-02-20T14:15:00Z',
    clientId: 'app_0987654321fedcba',
    clientSecret: 'sk_test_fedcba0987654321',
    products: [
      { id: 'prod_4', name: 'Push Notifications', status: 'active' },
      { id: 'prod_5', name: 'Location Services', status: 'disabled' }
    ]
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Internal analytics and reporting dashboard',
    status: 'live',
    createdAt: '2024-03-10T09:45:00Z',
    clientId: 'app_abcdef1234567890',
    clientSecret: 'sk_live_1234567890abcdef',
    products: [
      { id: 'prod_6', name: 'Data Export API', status: 'active' },
      { id: 'prod_7', name: 'Real-time Metrics', status: 'active' }
    ]
  }
]

let nextId = 4

export const handlers = [
  http.get('/api/apps', () => {
    return HttpResponse.json(applications)
  }),


  http.post('/api/apps', async ({ request }) => {
    const newApp = await request.json()
    const app = {
      id: nextId.toString(),
      ...newApp,
      createdAt: new Date().toISOString(),
      clientId: `app_${Math.random().toString(36).substr(2, 16)}`,
      clientSecret: `sk_${Math.random().toString(36).substr(2, 20)}`,
      products: []
    }
    applications.push(app)
    nextId++
    return HttpResponse.json(app, { status: 201 })
  }),

  http.get('/api/apps/:id', ({ params }) => {
    const app = applications.find(a => a.id === params.id)
    if (!app) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    return HttpResponse.json(app)
  }),

  http.put('/api/apps/:id', async ({ params, request }) => {
    const updates = await request.json()
    const index = applications.findIndex(a => a.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    applications[index] = { ...applications[index], ...updates }
    return HttpResponse.json(applications[index])
  }),

  http.delete('/api/apps/:id', ({ params }) => {
    const index = applications.findIndex(a => a.id === params.id)
    if (index === -1) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    applications.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/apps/:id/keys/regenerate', ({ params }) => {
    const app = applications.find(a => a.id === params.id)
    if (!app) {
      return HttpResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    app.clientSecret = `sk_${Math.random().toString(36).substr(2, 20)}`
    return HttpResponse.json({ clientSecret: app.clientSecret })
  }),

  http.post('/api/auth/verify-otp', async ({ request }) => {
    const { email, otp } = await request.json()
    if (otp === '123456') {
      return HttpResponse.json({
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`
        }
      })
    }
    return HttpResponse.json({ error: 'Invalid OTP' }, { status: 400 })
  }),

  http.post('/api/auth/google', async ({ request }) => {
    const { id_token } = await request.json()
    
    try {
      const payload = JSON.parse(atob(id_token.split('.')[1]))
      
      const isAdmin = payload.email === 'admin@example.com' || payload.email.includes('admin')
      
      return HttpResponse.json({
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          isGoogleUser: true,
          accessLevel: isAdmin ? 2 : 1,
          token: 'mock-jwt-token'
        }
      })
    } catch (error) {
      return HttpResponse.json({ error: 'Invalid Google token' }, { status: 400 })
    }
  }),

  http.post('/api/auth/google/signup', async ({ request }) => {
    const { id_token } = await request.json()
    
    try {
      const payload = JSON.parse(atob(id_token.split('.')[1]))
      
      const isAdmin = payload.email === 'admin@example.com' || payload.email.includes('admin')
      
      return HttpResponse.json({
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          isGoogleUser: true,
          accessLevel: isAdmin ? 2 : 1,
          token: 'mock-jwt-token'
        }
      })
    } catch (error) {
      return HttpResponse.json({ error: 'Invalid Google token' }, { status: 400 })
    }
  }),

  http.get('/api/docs', () => {
    return HttpResponse.json({
      apis: [
        {
          id: 'payment-api',
          name: 'Payment API',
          description: 'Process payments and manage transactions',
          version: 'v1',
          baseUrl: 'https://api.portal.com/v1',
          endpoints: [
            {
              method: 'POST',
              path: '/payments',
              description: 'Create a new payment',
              parameters: [
                { name: 'amount', type: 'number', required: true, description: 'Payment amount in cents' },
                { name: 'currency', type: 'string', required: true, description: 'Currency code (e.g., USD)' },
                { name: 'customer_id', type: 'string', required: true, description: 'Customer identifier' }
              ],
              response: {
                status: 201,
                body: {
                  id: 'pay_1234567890',
                  amount: 2000,
                  currency: 'usd',
                  status: 'pending',
                  created_at: '2024-01-15T10:30:00Z'
                }
              }
            },
            {
              method: 'GET',
              path: '/payments/:id',
              description: 'Retrieve a payment by ID',
              parameters: [
                { name: 'id', type: 'string', required: true, description: 'Payment ID' }
              ],
              response: {
                status: 200,
                body: {
                  id: 'pay_1234567890',
                  amount: 2000,
                  currency: 'usd',
                  status: 'succeeded',
                  created_at: '2024-01-15T10:30:00Z'
                }
              }
            }
          ]
        },
        {
          id: 'user-api',
          name: 'User Management API',
          description: 'Manage user accounts and authentication',
          version: 'v1',
          baseUrl: 'https://api.portal.com/v1',
          endpoints: [
            {
              method: 'POST',
              path: '/users',
              description: 'Create a new user',
              parameters: [
                { name: 'email', type: 'string', required: true, description: 'User email address' },
                { name: 'name', type: 'string', required: true, description: 'User full name' }
              ],
              response: {
                status: 201,
                body: {
                  id: 'user_1234567890',
                  email: 'user@example.com',
                  name: 'John Doe',
                  created_at: '2024-01-15T10:30:00Z'
                }
              }
            }
          ]
        }
      ]
    })
  }),

  // Admin product management endpoints
  http.patch('https://openapi.qa.gwiza.co/appsettings/app/approveproduct/:recordId', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Product approved successfully',
      data: {
        record_id: params.recordId,
        status: 'active'
      }
    })
  }),

  http.patch('https://openapi.qa.gwiza.co/appsettings/app/rejectproduct/:recordId', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Product rejected successfully',
      data: {
        record_id: params.recordId,
        status: 'rejected'
      }
    })
  }),

  http.patch('https://openapi.qa.gwiza.co/appsettings/app/activateproduct/:recordId', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Product activated successfully',
      data: {
        record_id: params.recordId,
        status: 'active'
      }
    })
  }),

  http.patch('https://openapi.qa.gwiza.co/appsettings/app/deactivateproduct/:recordId', ({ params }) => {
    return HttpResponse.json({
      success: true,
      message: 'Product deactivated successfully',
      data: {
        record_id: params.recordId,
        status: 'inactive'
      }
    })
  })
]
