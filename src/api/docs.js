const API_BASE = '/api'

const fallbackDocs = {
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
}

export const docsApi = {
  getApis: async () => {
    try {
      const response = await fetch(`${API_BASE}/docs`)
      if (!response.ok) {
        throw new Error('Failed to fetch API documentation')
      }
      return response.json()
    } catch (error) {
      console.log('MSW not available, using fallback docs data')
      return fallbackDocs
    }
  },
}
