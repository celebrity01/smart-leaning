import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import CategoryGrid from './components/CategoryGrid'
import QuizSection from './components/QuizSection'
import PDFViewer from './components/PDFViewer'
import Footer from './components/Footer'
import CountdownLoader from './components/CountdownLoader'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState('categories')
  const [isHomepageLoading, setIsHomepageLoading] = useState(true)
  const [isBackToHomepageLoading, setIsBackToHomepageLoading] = useState(false)

  // Handle homepage loading countdown
  useEffect(() => {
    // Always show homepage loading countdown on initial app load
    setIsHomepageLoading(true)
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
      return <PDFViewer onBack={handleBackToCategories} />
    }

    if (selectedCategory) {
      return (
        <QuizSection
          category={selectedCategory}
          onBack={handleBackToCategories}
        />
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
    <div className="app">
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      <main id="main-content" className="main-content">
        {renderMainContent()}
      </main>
      <Footer />
    </div>
  )
}

export default App
