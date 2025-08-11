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
    <div className="category-grid">
      <div className="intro-section">
        <div className="academic-notice">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <h3 className="notice-title">Academic Guidance Notice</h3>
            <p className="notice-text">
              This platform serves as a supplementary learning tool. For comprehensive understanding,
              clarification of concepts, and academic guidance, students are strongly encouraged to
              consult with their course lecturers and attend scheduled classes. Your lecturers remain
              your primary source for official course information and assessment criteria.
            </p>
          </div>
        </div>

        <h2 className="section-title">Choose Your Learning Path</h2>
        <p className="section-description">
          Select a category below to start your interactive learning journey.
          Each section includes quizzes, coding exercises, and instant feedback.
        </p>
      </div>
      
      <div className="categories-container">
        {categories.map(category => (
          <div 
            key={category.id}
            className="category-card"
            style={{ '--card-color': category.color }}
            onClick={() => onSelectCategory(category)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-title">{category.title}</h3>
            <p className="category-description">{category.description}</p>
            <button className="category-button">Start Learning</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryGrid
