import { useEffect, useRef, useCallback, useState } from 'react'
import { 
  throttleScroll, 
  optimizedScrollHandler, 
  ScrollManager,
  smoothScrollTo 
} from '../utils/scrollOptimizer'

// Hook for optimized scroll handling
export const useScrollOptimization = (options = {}) => {
  const {
    throttleDelay = 16,
    enableScrollDirection = true,
    enableVisibilityTracking = false,
    bufferSize = 50
  } = options

  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    direction: 'down',
    isScrolling: false
  })

  const scrollManagerRef = useRef(null)
  const scrollTimeoutRef = useRef(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    scrollManagerRef.current = new ScrollManager()
    
    const handleScroll = optimizedScrollHandler((data) => {
      if (enableScrollDirection) {
        setScrollData(prev => ({
          ...prev,
          scrollY: data.scrollY,
          direction: data.direction,
          isScrolling: true
        }))
      }

      // Mark as not scrolling after delay
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollData(prev => ({ ...prev, isScrolling: false }))
        isScrollingRef.current = false
      }, 150)

      isScrollingRef.current = true
    })

    scrollManagerRef.current.addScrollListener(window, handleScroll)

    return () => {
      if (scrollManagerRef.current) {
        scrollManagerRef.current.cleanup()
      }
      clearTimeout(scrollTimeoutRef.current)
    }
  }, [enableScrollDirection])

  const scrollToElement = useCallback((target, scrollOptions = {}) => {
    smoothScrollTo(target, scrollOptions)
  }, [])

  const scrollToTop = useCallback((duration = 500) => {
    smoothScrollTo(document.body, { duration, offset: 0 })
  }, [])

  return {
    scrollData,
    scrollToElement,
    scrollToTop,
    isScrolling: isScrollingRef.current
  }
}

// Hook for virtual scrolling
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  const totalHeight = items.length * itemHeight
  const buffer = 5
  
  const handleScroll = useCallback(
    throttleScroll((e) => {
      const scrollTop = e.target.scrollTop
      setScrollTop(scrollTop)
      
      const start = Math.floor(scrollTop / itemHeight)
      const visibleCount = Math.ceil(containerHeight / itemHeight)
      const end = Math.min(items.length, start + visibleCount + buffer)
      
      setVisibleRange({
        start: Math.max(0, start - buffer),
        end
      })
    }, 16),
    [items.length, itemHeight, containerHeight]
  )

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const visibleItems = items.slice(visibleRange.start, visibleRange.end)
  const offsetY = visibleRange.start * itemHeight

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    visibleRange
  }
}

// Hook for intersection-based optimizations
export const useIntersectionOptimization = (targetRef, options = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [visibilityRatio, setVisibilityRatio] = useState(0)
  const observerRef = useRef(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...options
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(entry.isIntersecting)
        setVisibilityRatio(entry.intersectionRatio)
      })
    }, defaultOptions)

    observerRef.current.observe(target)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [targetRef, options])

  return { isVisible, visibilityRatio }
}

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    scrollPerformance: 'good',
    memoryUsage: 0
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          scrollPerformance: fps > 50 ? 'good' : fps > 30 ? 'fair' : 'poor'
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Memory monitoring
    const monitorMemory = () => {
      if (performance.memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(performance.memory.usedJSHeapSize / 1048576)
        }))
      }
    }

    const memoryInterval = setInterval(monitorMemory, 5000)

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(memoryInterval)
    }
  }, [])

  return metrics
}

// Hook for scroll-based animations
export const useScrollAnimation = (targetRef, animationConfig = {}) => {
  const [animationState, setAnimationState] = useState('idle')
  const { scrollData } = useScrollOptimization()
  const { isVisible, visibilityRatio } = useIntersectionOptimization(targetRef)

  useEffect(() => {
    if (!isVisible) {
      setAnimationState('idle')
      return
    }

    const {
      triggerRatio = 0.3,
      animationType = 'fadeIn'
    } = animationConfig

    if (visibilityRatio >= triggerRatio) {
      setAnimationState('active')
    } else {
      setAnimationState('pending')
    }
  }, [isVisible, visibilityRatio, animationConfig])

  return { animationState, isVisible, visibilityRatio }
}
