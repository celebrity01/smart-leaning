import { useState, useEffect } from 'react'
import './CountdownLoader.css'

function CountdownLoader({ onComplete, title = "Loading Smart Learning Platform" }) {
  const [timeLeft, setTimeLeft] = useState(10)
  const [currentTip, setCurrentTip] = useState(0)
  const [progress, setProgress] = useState(0)

  const tips = [
    "🏠 Loading your personalized learning homepage...",
    "📚 Preparing study categories for COS102 course content",
    "🎯 Getting interactive quizzes ready for your practice",
    "⚡ Setting up instant feedback and explanations system",
    "📈 Initializing progress tracking and learning analytics",
    "🧠 Loading smart hints and guidance features",
    "✨ Preparing detailed explanations for each topic",
    "🎓 Setting up your comprehensive study environment",
    "🌟 Loading premium educational content and resources",
    "💪 Almost ready - preparing your learning dashboard!"
  ]

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
      setProgress(prev => prev + 10)
      
      // Change tip every second
      setCurrentTip(prev => (prev + 1) % tips.length)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onComplete, tips.length])

  const formatTime = (seconds) => {
    return seconds.toString().padStart(2, '0')
  }

  return (
    <div className="countdown-overlay">
      <div className="countdown-container">
        <div className="countdown-header">
          <div className="countdown-logo">
            <div className="logo-icon">📚</div>
            <h1 className="countdown-title">{title}</h1>
          </div>
        </div>

        <div className="countdown-main">
          <div className="countdown-circle">
            <svg className="countdown-svg" viewBox="0 0 120 120">
              <circle
                className="countdown-track"
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
              />
              <circle
                className="countdown-progress"
                cx="60"
                cy="60"
                r="54"
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              />
            </svg>
            <div className="countdown-time">
              <span className="countdown-number">{formatTime(timeLeft)}</span>
              <span className="countdown-label">seconds</span>
            </div>
          </div>

          <div className="countdown-progress-bar">
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">{progress}% Complete</div>
          </div>

          <div className="countdown-tips">
            <div className="tip-container">
              <div className="tip-content" key={currentTip}>
                {tips[currentTip]}
              </div>
            </div>
          </div>
        </div>

        <div className="countdown-footer">
          <div className="countdown-tagline">
            Preparing your personalized learning experience...
          </div>
        </div>
      </div>

      <div className="countdown-background">
        <div className="floating-element element-1">🎯</div>
        <div className="floating-element element-2">📊</div>
        <div className="floating-element element-3">💡</div>
        <div className="floating-element element-4">🏆</div>
        <div className="floating-element element-5">⚡</div>
        <div className="floating-element element-6">🎓</div>
      </div>
    </div>
  )
}

export default CountdownLoader
