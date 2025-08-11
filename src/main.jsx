import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './critical.css'
import PerformanceMonitor from './components/PerformanceMonitor'

// Service Worker registration
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Resource hints
const addResourceHints = () => {
  // DNS prefetch for external domains
  const dnsPrefetch = document.createElement('link')
  dnsPrefetch.rel = 'dns-prefetch'
  dnsPrefetch.href = '//fonts.googleapis.com'
  document.head.appendChild(dnsPrefetch)

  // Preload critical resources
  const preloadFont = document.createElement('link')
  preloadFont.rel = 'preload'
  preloadFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  preloadFont.as = 'style'
  preloadFont.onload = function() { this.onload = null; this.rel = 'stylesheet' }
  document.head.appendChild(preloadFont)
}

// Add resource hints immediately
addResourceHints()

// Lazy load non-critical CSS
const loadNonCriticalCSS = () => {
  import('./index.css')
}

// Load non-critical CSS after initial render
setTimeout(loadNonCriticalCSS, 100)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PerformanceMonitor />
    <App />
  </React.StrictMode>,
)
