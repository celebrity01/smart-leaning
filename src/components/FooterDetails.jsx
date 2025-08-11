function FooterDetails() {
  return (
    <div className="footer-details animate-fade-in-optimized">
      <div className="footer-content">
        {/* Platform Information - Simplified */}
        <div className="footer-links">
          <h4 className="footer-section-title">Platform</h4>
          <div className="footer-stats-compact">
            <div className="stat-item">
              <span className="stat-number">300+</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">6</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
          
          <div className="features-compact">
            <span>🎯 Interactive Quizzes</span>
            <span>📊 Progress Tracking</span>
            <span>📱 Mobile Responsive</span>
          </div>
        </div>

        {/* Contact Information - Minimal */}
        <div className="footer-contact">
          <h4 className="footer-section-title">Contact</h4>
          <div className="contact-compact">
            <a href="mailto:sani_zaharadeen@yahoo.com" className="contact-link">
              📧 sani_zaharadeen@yahoo.com
            </a>
            <span className="contact-info">🚀 COS102 Learning Platform</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterDetails
