import { useState, useEffect } from 'react'
import './Footer.css'

function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-icon">🎓</span>
                <span className="footer-logo-text">Smart Learning</span>
              </div>
              <p className="footer-description">
                An innovative interactive learning platform designed to enhance COS102
                computer science fundamentals through engaging quizzes, comprehensive
                exercises, and instant feedback mechanisms.
              </p>
              <div className="footer-stats">
                <div className="stat-item">
                  <span className="stat-number">300+</span>
                  <span className="stat-label">Questions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Categories</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Interactive</span>
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="GitHub">
                  <span>💻</span>
                </a>
                <a href="mailto:sani_zaharadeen@yahoo.com" className="social-link" aria-label="Email">
                  <span>📧</span>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <span>💼</span>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <span>🐦</span>
                </a>
              </div>
            </div>

            {/* Platform Information */}
            <div className="footer-links">
              <h4 className="footer-section-title">Platform Information</h4>
              <div className="platform-info">
                <div className="info-item">
                  <h5 className="info-title">📖 About Platform</h5>
                  <p className="info-description">
                    Smart Learning is a comprehensive interactive platform designed specifically for COS102
                    Computer Science Fundamentals. Our mission is to enhance learning through engaging
                    quizzes, instant feedback, and structured educational content that supplements
                    traditional classroom instruction.
                  </p>
                </div>
                <div className="info-item">
                  <h5 className="info-title">🚀 Features</h5>
                  <ul className="features-list">
                    <li>🎯 Interactive quizzes with instant feedback</li>
                    <li>📊 6 comprehensive learning categories</li>
                    <li>💡 Detailed explanations and examples</li>
                    <li>📱 Mobile-responsive design</li>
                    <li>🔄 Progress tracking and hints</li>
                    <li>📋 Comprehensive exercise solutions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="footer-contact">
              <h4 className="footer-section-title">Contact Info</h4>
              <div className="contact-item">
                <span className="contact-icon">👤</span>
                <span>Sani Zaharadeen</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <a href="mailto:sani_zaharadeen@yahoo.com">sani_zaharadeen@yahoo.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🎯</span>
                <span>COS102 Learning Platform</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🚀</span>
                <span>Beta Version 1.0</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              <span>© 2024 Smart Learning Platform.</span>
              <span>Created by</span>
              <a href="mailto:sani_zaharadeen@yahoo.com" className="footer-creator">
                Sani Zaharadeen
              </a>
            </div>
            <div className="footer-meta">
              <span className="footer-meta-link">🚀 Interactive Learning Platform</span>
              <span className="footer-meta-link">Built with ❤️ for Education</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </>
  )
}

export default Footer
