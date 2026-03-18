import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/users': { target: 'http://localhost:8080', changeOrigin: true },
      '/customers': { target: 'http://localhost:8080', changeOrigin: true },
      '/applications': { target: 'http://localhost:8080', changeOrigin: true },
      '/documents': { target: 'http://localhost:8080', changeOrigin: true },
      '/transactions': { target: 'http://localhost:8080', changeOrigin: true },
      '/billing': { target: 'http://localhost:8080', changeOrigin: true },
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
