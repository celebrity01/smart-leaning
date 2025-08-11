import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import CategoryGrid from './components/CategoryGrid'
import QuizSection from './components/QuizSection'
import PDFViewer from './components/PDFViewer'
import Footer from './components/Footer'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState('categories')

  const handleNavigation = (page) => {
    setCurrentPage(page)
    setSelectedCategory(null)
  }

  const renderMainContent = () => {
    if (currentPage === 'solutions') {
      return <PDFViewer onBack={() => handleNavigation('categories')} />
    }

    if (selectedCategory) {
      return (
        <QuizSection
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      )
    }

    return <CategoryGrid onSelectCategory={setSelectedCategory} />
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
