import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

const DocsPage = () => {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('getting-started')

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'api-reference', title: 'API Reference', icon: '📚' },
    { id: 'webhooks', title: 'Webhooks', icon: '🔗' },
    { id: 'sdks', title: 'SDKs & Libraries', icon: '💻' },
    { id: 'examples', title: 'Code Examples', icon: '💡' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' }
  ]

  const codeExamples = {
    'getting-started': `# Getting Started with Our API

## 1. Create an Application
First, create a new application in your dashboard to get your API credentials.

## 2. Install SDK (Optional)
\`\`\`bash
npm install @your-company/api-sdk
\`\`\`

## 3. Make Your First Request
\`\`\`javascript
import { ApiClient } from '@your-company/api-sdk'

const client = new ApiClient({
  apiKey: 'your-api-key',
  environment: 'sandbox' // or 'production'
})

// Make a simple request
const response = await client.users.list()
console.log(response.data)
\`\`\`

## 4. Next Steps
- Explore our API reference
- Check out code examples
- Join our developer community`,

    'authentication': `# Authentication

Our API uses API keys for authentication. Include your API key in the Authorization header of all requests.

## API Key Authentication
\`\`\`bash
curl -H "Authorization: Bearer your-api-key" \\
     https://api.yourcompany.com/v1/users
\`\`\`

## JavaScript Example
\`\`\`javascript
const response = await fetch('https://api.yourcompany.com/v1/users', {
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  }
})
\`\`\`

## Python Example
\`\`\`python
import requests

headers = {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.yourcompany.com/v1/users', headers=headers)
\`\`\`

## Security Best Practices
- Keep your API keys secure
- Use environment variables
- Rotate keys regularly
- Never commit keys to version control`,

    'api-reference': `# API Reference

## Base URL
- **Sandbox**: \`https://api-sandbox.yourcompany.com/v1\`
- **Production**: \`https://api.yourcompany.com/v1\`

## Endpoints

### Users
#### List Users
\`\`\`http
GET /users
\`\`\`

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 1
  }
}
\`\`\`

#### Get User
\`\`\`http
GET /users/{user_id}
\`\`\`

### Products
#### List Products
\`\`\`http
GET /products
\`\`\`

#### Create Product
\`\`\`http
POST /products
Content-Type: application/json

{
  "name": "Premium Plan",
  "price": 29.99,
  "description": "Access to all features"
}
\`\`\``,

    'webhooks': `# Webhooks

Webhooks allow you to receive real-time notifications when events occur in your account.

## Setting Up Webhooks

1. Go to your application settings
2. Navigate to the Webhooks section
3. Add your webhook URL
4. Select the events you want to receive

## Webhook Events

### User Events
- \`user.created\` - New user registered
- \`user.updated\` - User profile updated
- \`user.deleted\` - User account deleted

### Product Events
- \`product.created\` - New product created
- \`product.updated\` - Product updated
- \`product.deleted\` - Product deleted

## Webhook Payload

\`\`\`json
{
  "id": "evt_1234567890",
  "type": "user.created",
  "created": "2024-01-15T10:30:00Z",
  "data": {
    "object": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
\`\`\`

## Security

Webhooks include a signature header for verification:

\`\`\`javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
}
\`\`\``,

    'sdks': `# SDKs & Libraries

We provide official SDKs for popular programming languages.

## JavaScript/Node.js
\`\`\`bash
npm install @your-company/api-sdk
\`\`\`

\`\`\`javascript
import { ApiClient } from '@your-company/api-sdk'

const client = new ApiClient({
  apiKey: process.env.API_KEY,
  environment: 'production'
})

// List users
const users = await client.users.list()

// Create a user
const user = await client.users.create({
  email: 'user@example.com',
  name: 'John Doe'
})
\`\`\`

## Python
\`\`\`bash
pip install your-company-api
\`\`\`

\`\`\`python
from your_company_api import ApiClient

client = ApiClient(
    api_key='your-api-key',
    environment='production'
)

# List users
users = client.users.list()

# Create a user
user = client.users.create({
    'email': 'user@example.com',
    'name': 'John Doe'
})
\`\`\`

## PHP
\`\`\`bash
composer require your-company/api-php
\`\`\`

\`\`\`php
<?php
use YourCompany\\Api\\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'environment' => 'production'
]);

// List users
$users = $client->users->list();

// Create a user
$user = $client->users->create([
    'email' => 'user@example.com',
    'name' => 'John Doe'
]);
\`\`\``,

    'examples': `# Code Examples

## Complete Integration Example

### React Application
\`\`\`jsx
import React, { useState, useEffect } from 'react'
import { ApiClient } from '@your-company/api-sdk'

function UserDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = new ApiClient({
      apiKey: process.env.REACT_APP_API_KEY,
      environment: 'sandbox'
    })

    const fetchUsers = async () => {
      try {
        const response = await client.users.list()
        setUsers(response.data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  )
}
\`\`\`

### Express.js Backend
\`\`\`javascript
const express = require('express')
const { ApiClient } = require('@your-company/api-sdk')

const app = express()
const client = new ApiClient({
  apiKey: process.env.API_KEY,
  environment: 'production'
})

app.get('/api/users', async (req, res) => {
  try {
    const response = await client.users.list()
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const user = await client.users.create(req.body)
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
\`\`\``,

    'troubleshooting': `# Troubleshooting

## Common Issues

### 401 Unauthorized
**Problem**: Invalid or missing API key
**Solution**: 
- Verify your API key is correct
- Check that you're using the right environment (sandbox vs production)
- Ensure the key is included in the Authorization header

### 429 Rate Limited
**Problem**: Too many requests
**Solution**:
- Implement exponential backoff
- Check your rate limits in the dashboard
- Consider upgrading your plan

### 422 Validation Error
**Problem**: Invalid request data
**Solution**:
- Check the request body format
- Verify required fields are included
- Review the API documentation for field requirements

## Error Response Format

\`\`\`json
{
  "error": {
    "code": "validation_error",
    "message": "The email field is required",
    "details": {
      "field": "email",
      "code": "required"
    }
  }
}
\`\`\`

## Getting Help

- Check our [status page](https://status.yourcompany.com)
- Join our [Discord community](https://discord.gg/yourcompany)
- Contact support at support@yourcompany.com
- Browse our [GitHub issues](https://github.com/yourcompany/api/issues)`
  }

  const renderContent = () => {
    const content = codeExamples[activeSection] || ''
    return (
      <div className="prose prose-lg max-w-none">
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-card overflow-x-auto">
          <code>{content}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-header"
        >
          <h1 className="section-title font-heading">Developer Documentation</h1>
          <p className="section-subtitle">
            Everything you need to integrate with our APIs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`nav-link w-full text-left ${
                      activeSection === section.id ? 'active' : ''
                    }`}
                  >
                    <span className="text-lg mr-3">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card-elevated">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">
                    {sections.find(s => s.id === activeSection)?.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800 font-heading">
                    {sections.find(s => s.id === activeSection)?.title}
                  </h2>
                </div>
                
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocsPage


