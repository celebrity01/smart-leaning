// Advanced Performance Optimization Utilities

// Resource preloading and prefetching
export class ResourceOptimizer {
  constructor() {
    this.preloadedResources = new Set()
    this.prefetchedResources = new Set()
  }

  // Preload critical resources
  preloadResource(href, as = 'script', crossorigin = null) {
    if (this.preloadedResources.has(href)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossorigin) link.crossOrigin = crossorigin
    
    document.head.appendChild(link)
    this.preloadedResources.add(href)
  }

  // Prefetch resources for next page
  prefetchResource(href) {
    if (this.prefetchedResources.has(href)) return

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    
    document.head.appendChild(link)
    this.prefetchedResources.add(href)
  }

  // DNS prefetch for external domains
  dnsPrefetch(domain) {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = `//${domain}`
    document.head.appendChild(link)
  }

  // Preload critical fonts
  preloadFonts() {
    const fonts = [
      'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeAmM.woff2'
    ]
    
    fonts.forEach(font => {
      this.preloadResource(font, 'font', 'anonymous')
    })
  }
}

// Bundle analyzer for runtime
export class BundleAnalyzer {
  static analyzeBundleSize() {
    if (!import.meta.env.DEV) return

    const resources = performance.getEntriesByType('resource')
    const analysis = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      largestFiles: []
    }

    resources.forEach(resource => {
      const size = resource.transferSize || resource.encodedBodySize || 0
      analysis.totalSize += size

      if (resource.name.includes('.js')) {
        analysis.jsSize += size
      } else if (resource.name.includes('.css')) {
        analysis.cssSize += size
      }

      analysis.largestFiles.push({
        name: resource.name.split('/').pop(),
        size: Math.round(size / 1024),
        type: resource.initiatorType
      })
    })

    analysis.largestFiles.sort((a, b) => b.size - a.size).splice(10)
    
    console.group('Bundle Analysis')
    console.log('Total Size:', Math.round(analysis.totalSize / 1024), 'KB')
    console.log('JS Size:', Math.round(analysis.jsSize / 1024), 'KB')
    console.log('CSS Size:', Math.round(analysis.cssSize / 1024), 'KB')
    console.log('Largest Files:', analysis.largestFiles)
    console.groupEnd()

    return analysis
  }
}

// Advanced memory management
export class MemoryOptimizer {
  constructor() {
    this.observers = new Set()
    this.timers = new Set()
    this.eventListeners = new Map()
  }

  // Track and cleanup observers
  addObserver(observer) {
    this.observers.add(observer)
    return observer
  }

  // Track and cleanup timers
  addTimer(timerId) {
    this.timers.add(timerId)
    return timerId
  }

  // Track event listeners for cleanup
  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options)
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, [])
    }
    this.eventListeners.get(element).push({ event, handler })
  }

  // Cleanup all tracked resources
  cleanup() {
    // Disconnect observers
    this.observers.forEach(observer => {
      if (observer.disconnect) observer.disconnect()
    })
    this.observers.clear()

    // Clear timers
    this.timers.forEach(timerId => {
      clearTimeout(timerId)
      clearInterval(timerId)
    })
    this.timers.clear()

    // Remove event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler)
      })
    })
    this.eventListeners.clear()
  }

  // Force garbage collection (development only)
  forceGC() {
    if (window.gc && import.meta.env.DEV) {
      window.gc()
      console.log('Forced garbage collection')
    }
  }

  // Monitor memory usage
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      }
    }
    return null
  }
}

// Image optimization utilities
export class ImageOptimizer {
  static createWebPImage(src, fallback) {
    const picture = document.createElement('picture')
    
    // WebP source
    const webpSource = document.createElement('source')
    webpSource.srcset = src.replace(/\.(jpg|jpeg|png)$/, '.webp')
    webpSource.type = 'image/webp'
    
    // Fallback image
    const img = document.createElement('img')
    img.src = fallback || src
    img.loading = 'lazy'
    img.decoding = 'async'
    
    picture.appendChild(webpSource)
    picture.appendChild(img)
    
    return picture
  }

  static lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          img.classList.add('loaded')
          imageObserver.unobserve(img)
        }
      })
    }, { rootMargin: '50px' })

    images.forEach(img => imageObserver.observe(img))
    return imageObserver
  }
}

// Code splitting utilities
export class CodeSplitter {
  static async loadComponent(importFunc, fallback = null) {
    try {
      const module = await importFunc()
      return module.default || module
    } catch (error) {
      console.error('Code splitting failed:', error)
      return fallback
    }
  }

  static preloadComponent(importFunc) {
    // Preload component without executing
    return importFunc().catch(console.error)
  }
}

// Performance monitoring
export class PerformanceTracker {
  constructor() {
    this.metrics = new Map()
    this.marks = new Map()
  }

  // Mark start of operation
  mark(name) {
    const markName = `${name}-start`
    performance.mark(markName)
    this.marks.set(name, markName)
  }

  // Measure operation duration
  measure(name, logResult = true) {
    const startMark = this.marks.get(name)
    if (!startMark) return null

    const endMark = `${name}-end`
    performance.mark(endMark)
    
    const measureName = `${name}-duration`
    performance.measure(measureName, startMark, endMark)
    
    const measure = performance.getEntriesByName(measureName)[0]
    const duration = measure.duration

    this.metrics.set(name, duration)
    
    if (logResult) {
      console.log(`${name}: ${duration.toFixed(2)}ms`)
    }

    // Cleanup
    performance.clearMarks(startMark)
    performance.clearMarks(endMark)
    performance.clearMeasures(measureName)
    this.marks.delete(name)

    return duration
  }

  // Get all metrics
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  // Monitor Core Web Vitals
  observeWebVitals(callback) {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      callback('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        callback('FID', entry.processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let cls = 0
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      }
      callback('CLS', cls)
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Initialize global performance optimizations
export function initPerformanceOptimizations() {
  const resourceOptimizer = new ResourceOptimizer()
  
  // Preload critical resources
  resourceOptimizer.preloadFonts()
  resourceOptimizer.dnsPrefetch('fonts.googleapis.com')
  resourceOptimizer.dnsPrefetch('fonts.gstatic.com')
  
  // Initialize image lazy loading
  ImageOptimizer.lazyLoadImages()
  
  // Bundle analysis in development
  if (import.meta.env.DEV) {
    setTimeout(() => {
      BundleAnalyzer.analyzeBundleSize()
    }, 3000)
  }

  return {
    resourceOptimizer,
    memoryOptimizer: new MemoryOptimizer(),
    performanceTracker: new PerformanceTracker()
  }
}
