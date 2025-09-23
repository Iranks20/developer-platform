import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'

const startApp = async () => {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('./mock/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
      })
      console.log('MSW worker started successfully')
    } catch (error) {
      console.error('Failed to start MSW worker:', error)
    }
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

startApp()
