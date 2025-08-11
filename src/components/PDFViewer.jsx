import './PDFViewer.css'

function PDFViewer({ onBack }) {
  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <h2 className="pdf-title">COS102 Exercise Solutions</h2>
      </div>
      
      <div className="pdf-content">
        <div className="pdf-academic-notice">
          <span className="notice-icon">⚠️</span>
          <p className="notice-text">
            <strong>Academic Notice:</strong> This document provides supplementary exercise solutions.
            For comprehensive understanding and official guidance, consult with your course lecturer.
          </p>
        </div>

        <div className="download-section">
          <div className="download-container">
            <h3>📄 COS102 Exercise Solutions Document</h3>
            <p className="download-description">
              Access comprehensive solutions to COS102 exercises with detailed explanations,
              step-by-step problem-solving approaches, and practical examples to enhance your learning experience.
            </p>

            <div className="download-actions">
              <a
                href="./COS102_Exercise_Solutions_Revised.pdf"
                download="COS102_Exercise_Solutions_Revised.pdf"
                className="download-button primary"
              >
                📥 Download PDF
              </a>
              <a
                href="./COS102_Exercise_Solutions_Revised.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="download-button secondary"
              >
                👁️ View in Browser
              </a>
            </div>

            <div className="file-info">
              <div className="file-details">
                <span className="file-name">📋 COS102_Exercise_Solutions_Revised.pdf</span>
                <span className="file-type">PDF Document • Educational Resource</span>
              </div>
            </div>
          </div>
        </div>

        <div className="usage-guide">
          <div className="guide-content">
            <h3>📖 How to Maximize Your Learning</h3>
            <div className="guide-grid">
              <div className="guide-item">
                <span className="guide-icon">📥</span>
                <h4>Download & Save</h4>
                <p>Save the PDF to your device for offline access, enabling study sessions anywhere without internet connectivity</p>
              </div>
              <div className="guide-item">
                <span className="guide-icon">👁️</span>
                <h4>Interactive Viewing</h4>
                <p>Open in your browser for enhanced viewing experience with built-in zoom, search, and navigation features</p>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🔍</span>
                <h4>Smart Search</h4>
                <p>Use Ctrl+F (Cmd+F on Mac) to quickly locate specific topics, concepts, or keywords within the document</p>
              </div>
              <div className="guide-item">
                <span className="guide-icon">📚</span>
                <h4>Effective Study Method</h4>
                <p>Attempt problems independently first, then refer to solutions for verification and learning from alternative approaches</p>
              </div>
              <div className="guide-item">
                <span className="guide-icon">🎯</span>
                <h4>Practice Strategy</h4>
                <p>Focus on understanding the problem-solving methodology rather than memorizing specific answers</p>
              </div>
              <div className="guide-item">
                <span className="guide-icon">💡</span>
                <h4>Concept Reinforcement</h4>
                <p>Use the detailed explanations to strengthen your understanding of fundamental computer science concepts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
