import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    allowedHosts: ["developer.qa.gwiza.co", "developer.gwiza.tech"], // Allow specific hosts
  },
  preview: {
    host: true,
    allowedHosts: ["developer.qa.gwiza.co", "developer.gwiza.tech"], // Allow specific hosts
  },
})
