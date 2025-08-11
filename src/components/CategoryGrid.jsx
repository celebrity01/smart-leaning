import './CategoryGrid.css'

function CategoryGrid({ onSelectCategory }) {
  const categories = [
    {
      id: 'algorithms',
      title: 'Algorithms & Logic',
      description: 'Basic programming concepts and algorithmic thinking',
      icon: '🧠',
      color: '#a855f7'
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Arrays, lists, stacks, queues and more',
      icon: '📊',
      color: '#06b6d4'
    },
    {
      id: 'programming',
      title: 'Programming Basics',
      description: 'Variables, functions, loops and conditions',
      icon: '💻',
      color: '#0ea5e9'
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Approach complex problems step by step',
      icon: '🎯',
      color: '#10b981'
    },
    {
      id: 'computer-systems',
      title: 'Computer Systems',
      description: 'Hardware, software, and system architecture',
      icon: '⚙️',
      color: '#f59e0b'
    },
    {
      id: 'coding-practice',
      title: 'Coding Practice',
      description: 'Hands-on programming exercises',
      icon: '🚀',
      color: '#ec4899'
    }
  ]

  return (
    <div className="category-grid paint-optimized">
      <div className="intro-section layout-stable">
        <div className="academic-notice compact">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <p className="notice-text">
              <strong>Note:</strong> Supplementary tool. Consult your lecturer for official guidance.
            </p>
          </div>
        </div>

        <h2 className="section-title">Choose Your Learning Path</h2>
        <p className="section-description">
          Select a category below to start your interactive learning journey.
          Each section includes quizzes, coding exercises, and instant feedback.
        </p>
      </div>
      
      <div className="categories-container scrollable-container">
        {categories.map(category => (
          <div
            key={category.id}
            className="category-card gpu-accelerated paint-optimized"
            style={{ '--card-color': category.color }}
            role="button"
            tabIndex={0}
            aria-label={`Start ${category.title} learning path`}
            onClick={() => onSelectCategory(category)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectCategory(category)
              }
            }}
          >
            <div className="category-icon" aria-hidden="true">{category.icon}</div>
            <h3 className="category-title">{category.title}</h3>
            <p className="category-description">{category.description}</p>
            <span className="category-button" aria-hidden="true">Start Learning</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryGrid
