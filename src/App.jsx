import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import './styles/performance.css'
import Header from './components/Header'
import CategoryGrid from './components/CategoryGrid'
import FooterOptimized from './components/FooterOptimized'
import CountdownLoader from './components/CountdownLoader'
import ErrorBoundary from './components/ErrorBoundary'
import { useScrollOptimization } from './hooks/useScrollOptimization'
import { initPerformanceOptimizations } from './utils/performanceOptimizer'

// Lazy load heavy components
const QuizSection = lazy(() => import('./components/QuizSectionOptimized'))
const PDFViewer = lazy(() => import('./components/PDFViewer'))

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState('categories')
  const [isHomepageLoading, setIsHomepageLoading] = useState(true)
  const [isBackToHomepageLoading, setIsBackToHomepageLoading] = useState(false)

  // Initialize scroll optimization
  const { scrollData, scrollToTop } = useScrollOptimization({
    throttleDelay: 16,
    enableScrollDirection: true
  })

  // Handle homepage loading countdown and initialize performance optimizations
  useEffect(() => {
    // Always show homepage loading countdown on initial app load
    setIsHomepageLoading(true)

    // Initialize performance optimizations
    const optimizations = initPerformanceOptimizations()

    // Cleanup on unmount
    return () => {
      if (optimizations.memoryOptimizer) {
        optimizations.memoryOptimizer.cleanup()
      }
    }
  }, [])

  const handleHomepageLoadComplete = () => {
    setIsHomepageLoading(false)
  }

  const handleNavigation = (page) => {
    setCurrentPage(page)
    setSelectedCategory(null)
  }

  const handleBackToCategories = () => {
    // Show countdown when returning to homepage/categories
    setIsBackToHomepageLoading(true)
  }

  const handleBackToHomepageComplete = () => {
    setIsBackToHomepageLoading(false)
    setSelectedCategory(null)
    setCurrentPage('categories')
  }

  const renderMainContent = () => {
    if (currentPage === 'solutions') {
      return (
        <Suspense fallback={<CountdownLoader title="Loading PDF Viewer..." onComplete={() => {}} />}>
          <PDFViewer onBack={handleBackToCategories} />
        </Suspense>
      )
    }

    if (selectedCategory) {
      return (
        <Suspense fallback={<CountdownLoader title="Loading Quiz..." onComplete={() => {}} />}>
          <QuizSection
            category={selectedCategory}
            onBack={handleBackToCategories}
          />
        </Suspense>
      )
    }

    return <CategoryGrid onSelectCategory={setSelectedCategory} />
  }

  // Show homepage loading countdown
  if (isHomepageLoading) {
    return (
      <CountdownLoader
        onComplete={handleHomepageLoadComplete}
        title="Loading Homepage - Smart Learning COS102"
      />
    )
  }

  // Show countdown when returning to homepage
  if (isBackToHomepageLoading) {
    return (
      <CountdownLoader
        onComplete={handleBackToHomepageComplete}
        title="Loading Homepage Categories"
      />
    )
  }

  return (
    <ErrorBoundary>
      <div className="app scrollable-container gpu-accelerated">
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigation}
          scrollDirection={scrollData.direction}
        />
        <main id="main-content" className="main-content layout-stable">
          <ErrorBoundary>
            {renderMainContent()}
          </ErrorBoundary>
        </main>
        <FooterOptimized />
        {scrollData.scrollY > 500 && (
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn floating-element"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
              padding: '12px',
              borderRadius: '50%',
              background: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease'
            }}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
