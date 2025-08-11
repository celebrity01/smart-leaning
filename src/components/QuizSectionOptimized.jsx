import { useState, useEffect } from 'react'
import './QuizSection.css'
import '../styles/performance.css'
import { getQuestionsByCategory } from '../data/quizData'

function QuizSection({ category, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [streak, setStreak] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load questions dynamically
  useEffect(() => {
    if (category?.id) {
      setIsLoading(true)
      try {
        const categoryQuestions = getQuestionsByCategory(category.id)
        setQuestions(categoryQuestions)
      } catch (error) {
        console.error('Error loading questions:', error)
        setQuestions([])
      } finally {
        setIsLoading(false)
      }
    }
  }, [category])

  if (isLoading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading {category.name} questions...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-error">
        <h3>No questions available for {category.name}</h3>
        <button onClick={onBack} className="back-button">
          ← Back to Categories
        </button>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return

    const isCorrect = userAnswer.toLowerCase().trim() === currentQ.correct.toLowerCase()
    
    setFeedback({
      isCorrect,
      explanation: currentQ.explanation,
      example: currentQ.example,
      similarQuestion: currentQ.similarQuestion,
      similarAnswer: currentQ.similarAnswer
    })
    
    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
    
    setIsAnswered(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer('')
      setFeedback(null)
      setIsAnswered(false)
      setShowHint(false)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setUserAnswer('')
    setFeedback(null)
    setScore(0)
    setShowResult(false)
    setIsAnswered(false)
    setStreak(0)
    setHintsUsed(0)
    setShowHint(false)
  }

  const handleShowHint = () => {
    setShowHint(true)
    setHintsUsed(hintsUsed + 1)
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="quiz-result">
        <h2>Quiz Complete!</h2>
        <div className="result-stats">
          <div className="stat">
            <span className="stat-value">{score}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat">
            <span className="stat-value">{questions.length - score}</span>
            <span className="stat-label">Incorrect</span>
          </div>
          <div className="stat">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">Score</span>
          </div>
        </div>
        
        <div className="result-actions">
          <button onClick={handleRestart} className="restart-button">
            🔄 Try Again
          </button>
          <button onClick={onBack} className="back-button">
            ← Back to Categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container scrollable-container paint-optimized">
      <div className="quiz-header layout-stable">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <div className="quiz-progress">
          <span className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="quiz-stats">
          <span className="score">Score: {score}</span>
          <span className="streak">Streak: {streak}</span>
        </div>
      </div>

      <div className="question-section">
        <h2 className="question-title">{currentQ.question}</h2>
        
        {currentQ.type === 'multiple-choice' ? (
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${userAnswer === option ? 'selected' : ''}`}
                onClick={() => setUserAnswer(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            className="answer-input"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={isAnswered}
          />
        )}

        {!isAnswered && (
          <div className="action-buttons">
            <button
              className="hint-button"
              onClick={handleShowHint}
              disabled={showHint}
            >
              💡 {showHint ? 'Hint Shown' : 'Show Hint'}
            </button>
            <button
              className="submit-button"
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
            >
              Submit Answer
            </button>
          </div>
        )}

        {showHint && (
          <div className="hint-section">
            <h4>💡 Hint:</h4>
            <p>{currentQ.hint}</p>
          </div>
        )}

        {feedback && (
          <div className={`feedback-section ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
            <h4>{feedback.isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
            <div className="feedback-content">
              <div className="explanation">
                <h5>Explanation:</h5>
                <p>{feedback.explanation}</p>
              </div>
              
              {feedback.example && (
                <div className="example">
                  <h5>Example:</h5>
                  <p>{feedback.example}</p>
                </div>
              )}
              
              {feedback.similarQuestion && (
                <div className="similar-question">
                  <h5>Similar Question:</h5>
                  <p><strong>Q:</strong> {feedback.similarQuestion}</p>
                  <p><strong>A:</strong> {feedback.similarAnswer}</p>
                </div>
              )}
            </div>
            
            <button className="next-button" onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizSection
