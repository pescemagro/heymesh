import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // You can add more aliases if needed:
      // '@components': path.resolve(__dirname, './src/components'),
      // '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  optimizeDeps: {
    include: [
      'ethers',
      'telemesh',
      'kad-trc',
      'crypto-js',
      '@evva/capacitor-secure-storage-plugin'
    ],
    esbuildOptions: {
      target: 'es2020',
      supported: { bigint: true },
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})

