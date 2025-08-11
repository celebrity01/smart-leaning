import { useEffect } from 'react'

function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log key metrics
        if (entry.entryType === 'navigation') {
          console.log('Navigation Timing:', {
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            loadComplete: entry.loadEventEnd - entry.loadEventStart,
            totalTime: entry.loadEventEnd - entry.fetchStart
          })
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', entry.value)
        }
      }
    })

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'layout-shift'] })
    } catch (e) {
      console.log('Performance Observer not supported')
    }

    // Monitor bundle size in development
    if (import.meta.env.DEV) {
      const logBundleInfo = () => {
        if (window.performance && window.performance.getEntriesByType) {
          const resources = window.performance.getEntriesByType('resource')
          const jsFiles = resources.filter(r => r.name.includes('.js'))
          const cssFiles = resources.filter(r => r.name.includes('.css'))
          
          console.group('Bundle Analysis')
          console.log('JS Files:', jsFiles.length, 'Total Size:', 
            jsFiles.reduce((sum, file) => sum + (file.transferSize || 0), 0) + ' bytes')
          console.log('CSS Files:', cssFiles.length, 'Total Size:', 
            cssFiles.reduce((sum, file) => sum + (file.transferSize || 0), 0) + ' bytes')
          console.groupEnd()
        }
      }

      setTimeout(logBundleInfo, 2000)
    }

    return () => observer.disconnect()
  }, [])

  return null // This component doesn't render anything
}

export default PerformanceMonitor
