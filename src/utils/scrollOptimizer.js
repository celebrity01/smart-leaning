// Scroll performance optimizations
let ticking = false;
let lastScrollY = 0;
let scrollDirection = 'down';

// Throttle scroll events to prevent excessive function calls
export const throttleScroll = (callback, delay = 16) => {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      callback.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Debounce for scroll end detection
export const debounceScrollEnd = (callback, delay = 150) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
};

// Optimize scroll performance with requestAnimationFrame
export const optimizedScrollHandler = (callback) => {
  return (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        callback({
          scrollY: currentScrollY,
          direction: scrollDirection,
          event: e
        });
        
        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Passive scroll event listener for better performance
export const addPassiveScrollListener = (element, handler) => {
  element.addEventListener('scroll', handler, { passive: true });
  return () => element.removeEventListener('scroll', handler);
};

// Intersection Observer for visibility-based optimizations
export const createVisibilityObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
    ...options
  };

  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      callback({
        element: entry.target,
        isVisible: entry.isIntersecting,
        visibilityRatio: entry.intersectionRatio,
        boundingRect: entry.boundingClientRect
      });
    });
  }, defaultOptions);
};

// Smooth scroll with performance considerations
export const smoothScrollTo = (target, options = {}) => {
  const {
    duration = 800,
    easing = 'easeInOutCubic',
    offset = 0
  } = options;

  const targetElement = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const easingFunctions = {
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutCubic: t => (--t) * t * t + 1,
    linear: t => t
  };

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = easingFunctions[easing] || easingFunctions.easeInOutCubic;
    const run = ease(progress);
    
    window.scrollTo(0, startPosition + distance * run);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};

// Virtual scrolling for large lists
export class VirtualScroller {
  constructor(container, itemHeight, renderItem, totalItems) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.totalItems = totalItems;
    this.scrollTop = 0;
    this.visibleStart = 0;
    this.visibleEnd = 0;
    this.buffer = 5; // Extra items to render for smooth scrolling
    
    this.init();
  }

  init() {
    this.container.style.position = 'relative';
    this.container.style.overflow = 'auto';
    
    // Create viewport
    this.viewport = document.createElement('div');
    this.viewport.style.height = `${this.totalItems * this.itemHeight}px`;
    this.container.appendChild(this.viewport);
    
    // Create visible items container
    this.itemsContainer = document.createElement('div');
    this.itemsContainer.style.position = 'absolute';
    this.itemsContainer.style.top = '0';
    this.itemsContainer.style.width = '100%';
    this.viewport.appendChild(this.itemsContainer);
    
    this.updateVisibleRange();
    this.renderVisibleItems();
    
    // Add scroll listener
    this.container.addEventListener('scroll', 
      throttleScroll(() => this.handleScroll(), 16), 
      { passive: true }
    );
  }

  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.updateVisibleRange();
    this.renderVisibleItems();
  }

  updateVisibleRange() {
    const containerHeight = this.container.clientHeight;
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / this.itemHeight) + this.buffer,
      this.totalItems
    );
    
    this.visibleStart = Math.max(0, start - this.buffer);
    this.visibleEnd = end;
  }

  renderVisibleItems() {
    this.itemsContainer.innerHTML = '';
    this.itemsContainer.style.transform = `translateY(${this.visibleStart * this.itemHeight}px)`;
    
    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      const item = document.createElement('div');
      item.style.height = `${this.itemHeight}px`;
      item.innerHTML = this.renderItem(i);
      this.itemsContainer.appendChild(item);
    }
  }
}

// Memory-efficient event cleanup
export class ScrollManager {
  constructor() {
    this.listeners = new Map();
    this.observers = new Set();
  }

  addScrollListener(element, handler, options = {}) {
    const optimizedHandler = optimizedScrollHandler(handler);
    element.addEventListener('scroll', optimizedHandler, { passive: true, ...options });
    
    const cleanup = () => element.removeEventListener('scroll', optimizedHandler);
    this.listeners.set(handler, cleanup);
    return cleanup;
  }

  addVisibilityObserver(elements, callback, options = {}) {
    const observer = createVisibilityObserver(callback, options);
    
    if (Array.isArray(elements)) {
      elements.forEach(el => observer.observe(el));
    } else {
      observer.observe(elements);
    }
    
    this.observers.add(observer);
    return observer;
  }

  cleanup() {
    // Remove all scroll listeners
    this.listeners.forEach(cleanup => cleanup());
    this.listeners.clear();
    
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}
