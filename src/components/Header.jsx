import './Header.css'

function Header({ currentPage, onNavigate, scrollDirection }) {
  return (
    <header className="header compact">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="app-title">🎓 Smart Learning COS102</h1>
          <span className="beta-badge">BETA</span>
        </div>
        <nav className="navigation">
          <button
            className={`nav-button ${currentPage === 'solutions' ? 'active' : ''}`}
            onClick={() => onNavigate('solutions')}
          >
            📄 Solutions
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
