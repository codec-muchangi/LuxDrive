import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Clean imports: import X from '@/components/...' instead of '../../..'
      '@':            fileURLToPath(new URL('./src', import.meta.url)),
      '@components':  fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages':       fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@hooks':       fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@services':    fileURLToPath(new URL('./src/services', import.meta.url)),
      '@context':     fileURLToPath(new URL('./src/context', import.meta.url)),
      '@utils':       fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@lib':         fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@assets':      fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@styles':      fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    // Proxy API calls to FastAPI backend during development
    // This avoids CORS issues in dev and matches production routing
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Code-splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks — split large deps from app code
          'react-vendor': ['react', 'react-dom'],
          'router':        ['react-router-dom'],
          'supabase':      ['@supabase/supabase-js'],
          'ui-utils':      ['lucide-react', 'react-hot-toast', 'date-fns'],
        },
      },
    },
  },
})
