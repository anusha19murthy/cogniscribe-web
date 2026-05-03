import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.pdf'],
  server: {
    fs: { strict: false },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion', 'gsap'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('three') || id.includes('@react-three')) return 'three-bundle';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('gsap')) return 'gsap';
        },
      },
    },
  },
})
