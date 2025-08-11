import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    })
  ],
  
  // Build optimizations
  build: {
    // Generate source maps for production debugging
    sourcemap: false,
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom'],
          
          // Separate chunk for quiz data
          quizData: ['./src/data/quizData.js'],
        }
      }
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true, // Split CSS into separate files
  },
  
  // Development server optimizations
  server: {
    // Enable file watching optimizations
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**']
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server
    include: ['react', 'react-dom'],
    
    // Exclude large dependencies from pre-bundling
    exclude: []
  },
  
  // Performance hints
  esbuild: {
    // Remove unused imports
    treeShaking: true,
  }
})
