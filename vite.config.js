import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/_/backend': {
        target: 'https://99cap.vercel.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
