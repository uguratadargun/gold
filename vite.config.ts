import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gold': {
        target: 'https://static.altinkaynak.com/Gold',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gold/, ''),
      },
      '/api/currency': {
        target: 'https://static.altinkaynak.com/Currency',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/currency/, ''),
      },
    },
  },
})
