import './Header.css'

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="app-title">Smart Learning</h1>
          <span className="beta-badge">BETA</span>
        </div>
        <div className="course-info">
          <h2 className="course-title">COS102 - Computer Science Fundamentals</h2>
          <p className="course-subtitle">Interactive Learning Platform</p>
        </div>
      </div>

      <nav className="navigation">
        <div className="nav-container">
          <button
            className={`nav-button ${currentPage === 'categories' ? 'active' : ''}`}
            onClick={() => onNavigate('categories')}
          >
            📚 Interactive Quiz
          </button>
          <button
            className={`nav-button ${currentPage === 'solutions' ? 'active' : ''}`}
            onClick={() => onNavigate('solutions')}
          >
            📄 COS102_Exercise_Solutions
          </button>
        </div>
      </nav>

      {/* Floating Background Elements */}
      <div className="floating-element">💻</div>
      <div className="floating-element">🧠</div>
      <div className="floating-element">⚡</div>
      <div className="floating-element">🚀</div>
    </header>
  )
}

export default Header
