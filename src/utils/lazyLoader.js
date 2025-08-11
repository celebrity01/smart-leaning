// Intersection Observer for lazy loading
export const createLazyLoader = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, defaultOptions)

  return observer
}

// Lazy load images
export const lazyLoadImage = (img) => {
  const dataSrc = img.getAttribute('data-src')
  if (dataSrc) {
    img.src = dataSrc
    img.removeAttribute('data-src')
    img.classList.add('loaded')
  }
}

// Preload critical resources
export const preloadResource = (href, as = 'script') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered:', registration)
      return registration
    } catch (error) {
      console.log('SW registration failed:', error)
    }
  }
}

// Memory usage monitoring
export const monitorMemory = () => {
  if (performance.memory) {
    const memory = performance.memory
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
    })
  }
}

// FPS monitoring
export const monitorFPS = (callback) => {
  let lastTime = performance.now()
  let frameCount = 0

  const countFrames = () => {
    frameCount++
    const currentTime = performance.now()
    
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
      callback(fps)
      frameCount = 0
      lastTime = currentTime
    }
    
    requestAnimationFrame(countFrames)
  }
  
  countFrames()
}
