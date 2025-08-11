import { useRef, lazy, Suspense } from 'react'
import { useIntersectionOptimization } from '../hooks/useScrollOptimization'
import './Footer.css'
import '../styles/performance.css'

// Lazy load heavy footer content
const FooterDetails = lazy(() => import('./FooterDetails'))

function Footer() {
  const footerRef = useRef(null)
  const { isVisible } = useIntersectionOptimization(footerRef, {
    rootMargin: '100px'
  })

  return (
    <footer
      className="footer paint-optimized layout-stable"
      ref={footerRef}
    >
      <div className="footer-container">
        {/* Essential footer content - always visible */}
        <div className="footer-essential">
          <div className="footer-brand-minimal">
            <span className="footer-logo-icon">🎓</span>
            <span className="footer-logo-text">Smart Learning</span>
            <span className="footer-version">BETA</span>
          </div>
          
          <div className="footer-copyright-minimal">
            <span>© 2024 Smart Learning Platform</span>
            <a href="mailto:sani_zaharadeen@yahoo.com" className="footer-creator">
              by Sani Zaharadeen
            </a>
          </div>
        </div>

        {/* Lazy load detailed content when footer becomes visible */}
        {isVisible && (
          <Suspense fallback={
            <div className="footer-loading" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="loading-spinner"></div>
            </div>
          }>
            <FooterDetails />
          </Suspense>
        )}
      </div>
    </footer>
  )
}

export default Footer
