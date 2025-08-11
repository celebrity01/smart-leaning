// Quiz data extracted for dynamic loading
export const getQuestionsByCategory = (categoryId) => {
  const questionSets = {
    'algorithms': [
      {
        question: "What is the time complexity of linear search?",
        type: "multiple-choice",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: "O(n)",
        explanation: "Linear search checks each element one by one, so it takes O(n) time in the worst case.",
        hint: "Think about how many elements you need to check in the worst case scenario.",
        example: "Searching for the number 7 in [3, 1, 4, 1, 5, 9, 2, 6, 7]: you might need to check all 9 elements if 7 is at the end or not present.",
        similarQuestion: "What is the time complexity of finding an element in an unsorted array of n elements?",
        similarAnswer: "O(n) - because you may need to check every element in the worst case."
      },
      {
        question: "Which sorting algorithm has the best average-case time complexity?",
        type: "multiple-choice",
        options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
        correct: "Merge Sort",
        explanation: "Merge Sort has O(n log n) time complexity in all cases, making it optimal for average-case performance.",
        hint: "Consider algorithms that use divide-and-conquer approach.",
        example: "Sorting [64, 34, 25, 12, 22, 11, 90]: Merge Sort divides into [64, 34, 25, 12] and [22, 11, 90], sorts each half, then merges them efficiently.",
        similarQuestion: "Which sorting algorithm guarantees O(n log n) performance in all cases?",
        similarAnswer: "Merge Sort - it always divides the array in half and merges, giving consistent O(n log n) performance."
      },
      {
        question: "What is the principle behind binary search?",
        type: "text",
        correct: "divide and conquer",
        explanation: "Binary search works by repeatedly dividing the search space in half, eliminating half of the remaining elements in each step.",
        hint: "Think about how you would find a word in a dictionary efficiently.",
        example: "Searching for 7 in [1, 3, 5, 7, 9, 11, 13]: check middle (7), found! If searching for 5: check 7 (too big), check 3 (too small), check 5 (found!).",
        similarQuestion: "What strategy does merge sort use to sort an array efficiently?",
        similarAnswer: "divide and conquer - it divides the array into smaller parts, sorts them, then combines the results."
      }
    ],
    'data-structures': [
      {
        question: "Which data structure follows LIFO (Last In, First Out)?",
        type: "multiple-choice",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: "Stack",
        explanation: "A stack follows LIFO principle where the last element added is the first one to be removed.",
        hint: "Think of a stack of plates - which one do you remove first?",
        example: "Stack operations: push(1), push(2), push(3) gives [1,2,3]. pop() returns 3, pop() returns 2, pop() returns 1.",
        similarQuestion: "Which data structure follows FIFO (First In, First Out)?",
        similarAnswer: "Queue - the first element added is the first one to be removed, like a line of people."
      },
      {
        question: "What is the main advantage of a linked list over an array?",
        type: "text",
        correct: "dynamic size",
        explanation: "Linked lists can grow and shrink during runtime, unlike arrays which have fixed size in most languages.",
        hint: "Consider what happens when you need to add more elements than initially planned.",
        example: "Array[5] is fixed at 5 elements. LinkedList can start empty, grow to 100 elements, shrink to 3, without declaring size beforehand.",
        similarQuestion: "What is the main advantage of an array over a linked list?",
        similarAnswer: "random access - you can directly access any element by index in O(1) time."
      }
    ],
    'programming': [
      {
        question: "Which keyword is used to define a function in Python?",
        type: "multiple-choice",
        options: ["function", "def", "func", "define"],
        correct: "def",
        explanation: "In Python, functions are defined using the 'def' keyword followed by the function name.",
        hint: "It's short for 'define'.",
        example: "def greet(name): return f'Hello, {name}!' defines a function named 'greet' that takes a 'name' parameter.",
        similarQuestion: "Which keyword is used to define a class in Python?",
        similarAnswer: "class - used to define a new class, like 'class MyClass:' followed by the class definition."
      },
      {
        question: "What is the difference between '==' and '=' in programming?",
        type: "text",
        correct: "== compares values, = assigns values",
        explanation: "'==' is the equality operator used for comparison, while '=' is the assignment operator used to assign values to variables.",
        hint: "One is for checking if things are equal, the other is for giving a value to a variable.",
        example: "x = 5 assigns value 5 to x. x == 5 checks if x equals 5 (returns True). x = 10 changes x, but x == 5 now returns False.",
        similarQuestion: "What is the difference between '=' and '+=' in programming?",
        similarAnswer: "= assigns a new value, += adds to the existing value (x += 5 is equivalent to x = x + 5)."
      }
    ],
    'problem-solving': [
      {
        question: "What is the first step in problem-solving methodology?",
        type: "multiple-choice",
        options: ["Write code", "Test solution", "Understand the problem", "Choose algorithm"],
        correct: "Understand the problem",
        explanation: "Understanding the problem thoroughly is crucial before attempting any solution, as it guides all subsequent steps.",
        hint: "You can't solve what you don't understand.",
        example: "Before coding a sorting algorithm, understand: What data? What order? Any constraints? Expected input size? Time/space requirements?",
        similarQuestion: "What should you do after understanding a problem?",
        similarAnswer: "Plan your approach - break down the problem into smaller, manageable steps before coding."
      }
    ]
  };

  return questionSets[categoryId] || [];
};

// Lazy load full question set only when needed
export const loadFullQuestionSet = async (categoryId) => {
  // In a real app, this would fetch from an API or load a large data file
  return import(`./fullQuestions/${categoryId}.js`).then(module => module.default);
};
