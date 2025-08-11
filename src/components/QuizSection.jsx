import { useState } from 'react'
import './QuizSection.css'

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

  // Comprehensive questions - 50 per category with examples and similar questions
  const getQuestions = (categoryId) => {
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
          question: "Write a simple algorithm to find the maximum element in an array:",
          type: "code",
          correct: "max = arr[0]\nfor i in range(1, len(arr)):\n    if arr[i] > max:\n        max = arr[i]\nreturn max",
          explanation: "This algorithm iterates through the array and keeps track of the maximum element found so far.",
          hint: "Start with the first element as max, then compare with remaining elements.",
          example: "For array [3, 7, 2, 9, 1]: start with max=3, compare with 7 (7>3, so max=7), then 2 (2<7), then 9 (9>7, so max=9), then 1 (1<9). Result: 9",
          similarQuestion: "Write an algorithm to find the minimum element in an array:",
          similarAnswer: "min = arr[0]\nfor i in range(1, len(arr)):\n    if arr[i] < min:\n        min = arr[i]\nreturn min"
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
        },
        {
          question: "In which scenario would you prefer recursion over iteration?",
          type: "multiple-choice",
          options: ["Processing large arrays", "Tree traversal", "Simple loops", "Memory-critical applications"],
          correct: "Tree traversal",
          explanation: "Recursion is naturally suited for tree-like structures where the problem can be broken down into similar subproblems.",
          hint: "Consider data structures that have a hierarchical or nested nature.",
          example: "Traversing a family tree: visit parent, then recursively visit each child's subtree. Much cleaner than iterative approach with explicit stacks.",
          similarQuestion: "Which approach is most natural for calculating factorial of a number?",
          similarAnswer: "Recursion - because factorial(n) = n * factorial(n-1), which naturally breaks down into smaller subproblems."
        },
        {
          question: "What is the worst-case time complexity of Quick Sort?",
          type: "multiple-choice",
          options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
          correct: "O(n²)",
          explanation: "Quick Sort's worst case occurs when the pivot is always the smallest or largest element, leading to unbalanced partitions.",
          hint: "Consider what happens when the pivot choice is consistently poor.",
          example: "Sorting already sorted array [1, 2, 3, 4, 5] with first element as pivot: each partition only removes one element, creating n partitions.",
          similarQuestion: "What is the worst-case time complexity of Bubble Sort?",
          similarAnswer: "O(n²) - because it compares each element with every other element in nested loops."
        },
        {
          question: "Which algorithm is used to find the shortest path in a weighted graph?",
          type: "multiple-choice",
          options: ["Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm", "Linear Search"],
          correct: "Dijkstra's Algorithm",
          explanation: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph.",
          hint: "Think about algorithms specifically designed for weighted graphs.",
          example: "Finding shortest route from City A to City D with distances: A→B(4), A→C(2), B→D(3), C→D(5). Dijkstra finds A→B→D(7) is shorter than A→C→D(7).",
          similarQuestion: "Which algorithm finds the shortest path in an unweighted graph?",
          similarAnswer: "Breadth-First Search (BFS) - it explores nodes level by level, guaranteeing shortest path in unweighted graphs."
        },
        {
          question: "What is dynamic programming?",
          type: "text",
          correct: "optimization technique",
          explanation: "Dynamic programming is an optimization technique that solves complex problems by breaking them down into simpler subproblems and storing results to avoid redundant calculations.",
          hint: "It's about avoiding repeated calculations by storing results.",
          example: "Fibonacci: instead of recalculating fib(5)=fib(4)+fib(3) multiple times, store fib(3)=2, fib(4)=3, so fib(5)=3+2=5 without recalculation.",
          similarQuestion: "What technique is used to avoid recalculating the same subproblems in recursive algorithms?",
          similarAnswer: "memoization - storing results of function calls so they don't need to be recalculated."
        },
        {
          question: "Write pseudocode for bubble sort:",
          type: "code",
          correct: "for i = 0 to n-1:\n    for j = 0 to n-i-2:\n        if arr[j] > arr[j+1]:\n            swap(arr[j], arr[j+1])",
          explanation: "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.",
          hint: "Think about bubbles rising to the surface - larger elements 'bubble' to the end.",
          example: "Sorting [64, 34, 25, 12]: First pass swaps 64↔34, 64↔25, 64↔12, giving [34, 25, 12, 64]. Continue until no swaps needed.",
          similarQuestion: "Write pseudocode for selection sort:",
          similarAnswer: "for i = 0 to n-1:\n    min_index = i\n    for j = i+1 to n-1:\n        if arr[j] < arr[min_index]:\n            min_index = j\n    swap(arr[i], arr[min_index])"
        },
        {
          question: "What is the space complexity of merge sort?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(n)",
          explanation: "Merge sort requires additional space for the temporary arrays used during the merge process, resulting in O(n) space complexity.",
          hint: "Consider the extra space needed for merging subarrays.",
          example: "Merging [1, 3, 5] and [2, 4, 6] requires temporary array [1, 2, 3, 4, 5, 6] of size 6 - same as total input size.",
          similarQuestion: "What is the space complexity of quick sort?",
          similarAnswer: "O(log n) on average - due to the recursive call stack depth in a balanced partition scenario."
        },
        {
          question: "Which data structure is best for implementing BFS?",
          type: "multiple-choice",
          options: ["Stack", "Queue", "Array", "Linked List"],
          correct: "Queue",
          explanation: "BFS uses a queue to ensure vertices are visited in the order they were discovered (FIFO - First In, First Out).",
          hint: "BFS explores level by level - which data structure maintains order?",
          example: "BFS on graph starting from A: visit A, add neighbors [B, C] to queue, visit B (first out), add its neighbors to queue end, etc.",
          similarQuestion: "Which data structure is best for implementing DFS?",
          similarAnswer: "Stack - DFS explores as far as possible before backtracking, which follows LIFO (Last In, First Out) principle."
        },
        {
          question: "What is a greedy algorithm?",
          type: "text",
          correct: "local optimization",
          explanation: "A greedy algorithm makes the locally optimal choice at each step, hoping to find a global optimum.",
          hint: "It makes the best choice available at each step without considering future consequences.",
          example: "Making change for $0.67: greedily pick largest coins first: 2 quarters (50¢), 1 dime (10¢), 1 nickel (5¢), 2 pennies (2¢) = 6 coins total.",
          similarQuestion: "What approach does Dijkstra's algorithm use to find shortest paths?",
          similarAnswer: "greedy approach - it always selects the unvisited vertex with the smallest distance as the next vertex to process."
        },
        {
          question: "Write code to implement binary search:",
          type: "code",
          correct: "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
          explanation: "Binary search repeatedly divides the search interval in half by comparing the target with the middle element.",
          hint: "Divide the array in half each time based on comparison with middle element.",
          example: "Searching for 7 in [1, 3, 5, 7, 9]: mid=5 (index 2), 7>5 so search right half [7, 9], mid=7 (found at index 3).",
          similarQuestion: "Write code to implement linear search:",
          similarAnswer: "def linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1"
        },
        {
          question: "What is the time complexity of heap insertion?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: "O(log n)",
          explanation: "Heap insertion requires bubbling up the new element to maintain heap property, which takes O(log n) time.",
          hint: "Consider how many levels you might need to traverse in a binary heap.",
          example: "Inserting 15 into max heap [20, 18, 12, 10, 8]: add 15 at bottom, bubble up: 15>10 so swap, 15<18 so stop. Height traversed = log(6) ≈ 3.",
          similarQuestion: "What is the time complexity of heap deletion (removing root)?",
          similarAnswer: "O(log n) - replace root with last element, then bubble down to maintain heap property."
        },
        {
          question: "Which algorithm finds strongly connected components?",
          type: "multiple-choice",
          options: ["Dijkstra's", "Kruskal's", "Tarjan's", "Prim's"],
          correct: "Tarjan's",
          explanation: "Tarjan's algorithm efficiently finds strongly connected components in a directed graph using DFS.",
          hint: "Think about algorithms specifically designed for directed graph analysis.",
          example: "In directed graph A→B→C→A, D→E→D: Tarjan's finds two SCCs: {A, B, C} and {D, E}, where each node can reach every other node in its component.",
          similarQuestion: "Which algorithm finds the minimum spanning tree of a graph?",
          similarAnswer: "Kruskal's or Prim's algorithm - both find the minimum spanning tree but use different approaches."
        },
        {
          question: "What is memoization?",
          type: "text",
          correct: "caching results",
          explanation: "Memoization is a technique where you cache the results of expensive function calls and return the cached result when the same inputs occur again.",
          hint: "It's about remembering previous calculations to avoid repeating them.",
          example: "Fibonacci with memo: fib(5) calls fib(4) and fib(3). When calculating fib(6)=fib(5)+fib(4), we reuse stored fib(5) and fib(4) values.",
          similarQuestion: "What technique stores intermediate results in dynamic programming?",
          similarAnswer: "tabulation - building up solutions from smaller subproblems and storing them in a table."
        },
        {
          question: "Write code for factorial using recursion:",
          type: "code",
          correct: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
          explanation: "This recursive function calculates factorial by multiplying n with factorial of (n-1), with base case of 1 for n <= 1.",
          hint: "Base case is when n is 0 or 1, recursive case multiplies n with factorial of n-1.",
          example: "factorial(4): 4 * factorial(3) = 4 * (3 * factorial(2)) = 4 * (3 * (2 * factorial(1))) = 4 * 3 * 2 * 1 = 24",
          similarQuestion: "Write code for calculating power using recursion:",
          similarAnswer: "def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)"
        },
        {
          question: "What is the master theorem used for?",
          type: "multiple-choice",
          options: ["Sorting analysis", "Graph traversal", "Recurrence relations", "Space complexity"],
          correct: "Recurrence relations",
          explanation: "The master theorem provides a way to analyze the time complexity of divide-and-conquer algorithms expressed as recurrence relations.",
          hint: "It's a mathematical tool for analyzing recursive algorithms.",
          example: "For merge sort: T(n) = 2T(n/2) + O(n). Master theorem with a=2, b=2, f(n)=n gives T(n) = O(n log n).",
          similarQuestion: "What mathematical approach is used to analyze the time complexity of recursive algorithms?",
          similarAnswer: "Recurrence relations - equations that express the time complexity in terms of the complexity of smaller inputs."
        },
        {
          question: "Which algorithm is used for topological sorting?",
          type: "multiple-choice",
          options: ["BFS", "DFS", "Both BFS and DFS", "Binary Search"],
          correct: "Both BFS and DFS",
          explanation: "Topological sorting can be implemented using either DFS (with finishing times) or BFS (Kahn's algorithm).",
          hint: "Both major graph traversal algorithms can be adapted for this purpose.",
          example: "Course prerequisites: Math→Physics→Engineering. Topological sort gives valid order: [Math, Physics, Engineering] ensuring prereqs come first.",
          similarQuestion: "Which algorithms can detect cycles in a directed graph?",
          similarAnswer: "DFS - by detecting back edges during traversal, or BFS - if topological sort cannot include all vertices."
        },
        {
          question: "What is the invariant in loop analysis?",
          type: "text",
          correct: "condition that remains true",
          explanation: "A loop invariant is a condition that remains true before and after each iteration of the loop, helping prove correctness.",
          hint: "It's a property that doesn't change throughout the loop execution.",
          example: "In array sorting loop: invariant might be 'elements 0 to i-1 are sorted'. This remains true before/after each iteration, proving final array is sorted.",
          similarQuestion: "What property helps prove the correctness of iterative algorithms?",
          similarAnswer: "loop invariant - a condition that holds true at the start and end of each loop iteration."
        },
        {
          question: "What is the time complexity of insertion sort in the best case?",
          type: "multiple-choice",
          options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
          correct: "O(n)",
          explanation: "In the best case, when the array is already sorted, insertion sort only needs to compare each element once, resulting in O(n) time complexity.",
          hint: "Consider what happens when the array is already in sorted order.",
          example: "Sorting [1, 2, 3, 4, 5]: each element is already in correct position, so only n-1 comparisons needed.",
          similarQuestion: "What is the best-case time complexity of bubble sort?",
          similarAnswer: "O(n) - when the array is already sorted, bubble sort can detect this in one pass with no swaps."
        },
        {
          question: "What is a stable sorting algorithm?",
          type: "text",
          correct: "preserves relative order",
          explanation: "A stable sorting algorithm preserves the relative order of equal elements in the sorted output.",
          hint: "Think about what happens to elements with the same value.",
          example: "Sorting [(3,a), (1,b), (3,c), (2,d)] by number: stable sort gives [(1,b), (2,d), (3,a), (3,c)] - original order of 3s preserved.",
          similarQuestion: "Is merge sort a stable sorting algorithm?",
          similarAnswer: "Yes - merge sort is stable because it preserves the order of equal elements during the merge process."
        },
        {
          question: "What is the maximum number of comparisons needed for binary search in an array of 1000 elements?",
          type: "multiple-choice",
          options: ["10", "100", "500", "1000"],
          correct: "10",
          explanation: "Binary search has O(log n) complexity. For 1000 elements, log₂(1000) ≈ 10 comparisons maximum.",
          hint: "Binary search eliminates half the elements with each comparison.",
          example: "1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1 (10 steps maximum).",
          similarQuestion: "How many comparisons are needed for binary search in an array of 64 elements?",
          similarAnswer: "Maximum 6 comparisons - since log₂(64) = 6."
        },
        {
          question: "Write code for iterative factorial:",
          type: "code",
          correct: "def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result",
          explanation: "Iterative factorial uses a loop to multiply numbers from 1 to n, avoiding recursion overhead.",
          hint: "Start with result = 1 and multiply by each number from 1 to n.",
          example: "factorial(5): result starts at 1, then 1×1=1, 1×2=2, 2×3=6, 6×4=24, 24×5=120.",
          similarQuestion: "Write iterative code to calculate the sum of first n natural numbers:",
          similarAnswer: "def sum_n(n):\n    result = 0\n    for i in range(1, n + 1):\n        result += i\n    return result"
        },
        {
          question: "What is the space complexity of recursive factorial?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(n)",
          explanation: "Recursive factorial uses O(n) space due to the function call stack storing n recursive calls.",
          hint: "Consider how many function calls are stored on the call stack simultaneously.",
          example: "factorial(5) calls factorial(4), which calls factorial(3), etc. All 5 calls remain on stack until base case reached.",
          similarQuestion: "What is the space complexity of iterative factorial?",
          similarAnswer: "O(1) - iterative version only uses a constant amount of extra space regardless of input size."
        },
        {
          question: "Which algorithm would you use to find the kth smallest element?",
          type: "multiple-choice",
          options: ["Linear Search", "Binary Search", "QuickSelect", "Bubble Sort"],
          correct: "QuickSelect",
          explanation: "QuickSelect is a selection algorithm that finds the kth smallest element in O(n) average time using partitioning.",
          hint: "Think of an algorithm that uses divide-and-conquer but doesn't need to sort the entire array.",
          example: "Finding 3rd smallest in [7, 2, 1, 6, 8, 5, 3, 4]: QuickSelect partitions around pivot, recursively searches the correct partition.",
          similarQuestion: "What is the average time complexity of QuickSelect?",
          similarAnswer: "O(n) - because it only needs to process one partition at each level, unlike QuickSort which processes both."
        },
        {
          question: "What is the difference between an algorithm and a heuristic?",
          type: "text",
          correct: "guaranteed vs approximate",
          explanation: "An algorithm guarantees a correct solution, while a heuristic provides a good approximation but may not be optimal.",
          hint: "Consider the trade-off between correctness and efficiency.",
          example: "Dijkstra's algorithm guarantees shortest path (algorithm). A* uses heuristics to guide search efficiently but maintains optimality with good heuristic.",
          similarQuestion: "When would you prefer a heuristic over an exact algorithm?",
          similarAnswer: "When the problem is too complex for exact solutions or when a good approximation is sufficient and much faster."
        },
        {
          question: "Write pseudocode for linear search:",
          type: "code",
          correct: "for i = 0 to n-1:\n    if arr[i] == target:\n        return i\nreturn -1",
          explanation: "Linear search checks each element sequentially until the target is found or the end is reached.",
          hint: "Check elements one by one from start to end.",
          example: "Searching for 5 in [2, 8, 5, 1, 9]: check 2≠5, check 8≠5, check 5=5, return index 2.",
          similarQuestion: "Write pseudocode for counting occurrences of an element:",
          similarAnswer: "count = 0\nfor i = 0 to n-1:\n    if arr[i] == target:\n        count = count + 1\nreturn count"
        },
        {
          question: "What is backtracking?",
          type: "text",
          correct: "trial and error approach",
          explanation: "Backtracking is a systematic trial-and-error approach that abandons candidates as soon as it's clear they cannot lead to a solution.",
          hint: "It's like solving a maze - try a path, if it's wrong, go back and try another.",
          example: "Solving N-Queens: place queen, if no conflicts continue; if conflict found, backtrack and try next position for previous queen.",
          similarQuestion: "What problem-solving technique does the N-Queens problem commonly use?",
          similarAnswer: "Backtracking - systematically placing queens and backtracking when conflicts are detected."
        },
        {
          question: "What is the time complexity of finding the median in an unsorted array?",
          type: "multiple-choice",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          correct: "O(n)",
          explanation: "Using QuickSelect algorithm, finding the median (kth element where k=n/2) can be done in O(n) average time.",
          hint: "You don't need to sort the entire array to find the median.",
          example: "Array [3, 1, 4, 1, 5]: QuickSelect can find median without fully sorting, just partitioning around the middle position.",
          similarQuestion: "What is the time complexity of finding median in a sorted array?",
          similarAnswer: "O(1) - in a sorted array, the median is simply the middle element(s)."
        },
        {
          question: "Which sorting algorithm is adaptive?",
          type: "multiple-choice",
          options: ["Merge Sort", "Heap Sort", "Quick Sort", "Insertion Sort"],
          correct: "Insertion Sort",
          explanation: "Insertion sort is adaptive because its performance improves when the input is partially sorted, requiring fewer operations.",
          hint: "An adaptive algorithm performs better on inputs that are already partially sorted.",
          example: "On nearly sorted array [1, 2, 4, 3, 5], insertion sort performs much better than on random array [5, 1, 4, 2, 3].",
          similarQuestion: "What makes an algorithm adaptive?",
          similarAnswer: "An algorithm is adaptive if it performs better on inputs that are already partially ordered or have some existing structure."
        },
        {
          question: "What is the principle of optimality in dynamic programming?",
          type: "text",
          correct: "optimal substructure",
          explanation: "The principle of optimality states that an optimal solution contains optimal solutions to subproblems.",
          hint: "If you solve a problem optimally, the subproblems must also be solved optimally.",
          example: "Shortest path from A to C through B: if A→B→C is shortest, then A→B must be shortest path from A to B.",
          similarQuestion: "What property must a problem have for dynamic programming to be applicable?",
          similarAnswer: "Optimal substructure and overlapping subproblems - the problem can be broken into smaller problems whose solutions can be reused."
        },
        {
          question: "Write code for checking if a number is prime:",
          type: "code",
          correct: "def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True",
          explanation: "This algorithm checks divisibility up to the square root of n, as factors come in pairs where one is ≤ √n.",
          hint: "You only need to check divisors up to the square root of the number.",
          example: "is_prime(17): check divisors 2, 3, 4 (up to √17 ≈ 4.1). 17%2≠0, 17%3≠0, 17%4≠0, so 17 is prime.",
          similarQuestion: "Write code to find all prime numbers up to n (Sieve of Eratosthenes):",
          similarAnswer: "def sieve(n):\n    prime = [True] * (n+1)\n    prime[0] = prime[1] = False\n    for i in range(2, int(n**0.5)+1):\n        if prime[i]:\n            for j in range(i*i, n+1, i):\n                prime[j] = False\n    return [i for i in range(2, n+1) if prime[i]]"
        },
        {
          question: "What is the worst-case time complexity of hash table operations?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(n)",
          explanation: "In the worst case, all keys hash to the same bucket, creating a chain of length n, making operations O(n).",
          hint: "Consider what happens when the hash function is very poor.",
          example: "If hash function always returns 0, all elements go to bucket 0: [key1→key2→key3→...→keyn], search becomes linear.",
          similarQuestion: "What is the average-case time complexity of hash table operations?",
          similarAnswer: "O(1) - with a good hash function and proper load factor, operations are constant time on average."
        },
        {
          question: "What is divide and conquer?",
          type: "text",
          correct: "break problem into subproblems",
          explanation: "Divide and conquer breaks a problem into smaller subproblems, solves them recursively, then combines the results.",
          hint: "Think about the three steps: divide, solve, combine.",
          example: "Merge sort: divide array in half, recursively sort each half, then merge the sorted halves back together.",
          similarQuestion: "What are the three steps of divide and conquer?",
          similarAnswer: "1) Divide the problem into smaller subproblems, 2) Solve subproblems recursively, 3) Combine solutions to solve original problem."
        },
        {
          question: "Which algorithm finds the longest common subsequence?",
          type: "multiple-choice",
          options: ["Greedy", "Dynamic Programming", "Backtracking", "Divide and Conquer"],
          correct: "Dynamic Programming",
          explanation: "LCS is solved efficiently using dynamic programming by building a table of optimal solutions to subproblems.",
          hint: "This problem has overlapping subproblems and optimal substructure.",
          example: "LCS of 'ABCDGH' and 'AEDFHR' is 'ADH'. DP table builds up solutions for all substring pairs.",
          similarQuestion: "What approach is used to solve the edit distance problem?",
          similarAnswer: "Dynamic Programming - similar to LCS, it uses a table to find minimum operations to transform one string to another."
        },
        {
          question: "What is the time complexity of building a heap from an unsorted array?",
          type: "multiple-choice",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
          correct: "O(n)",
          explanation: "Building a heap using the bottom-up approach (heapify) takes O(n) time, not O(n log n) as one might expect.",
          hint: "The heapify process is more efficient than inserting elements one by one.",
          example: "Array [4,1,3,2,16,9,10,14,8,7]: heapify starts from bottom non-leaf nodes and bubbles down, total work is O(n).",
          similarQuestion: "What is the time complexity of heap sort?",
          similarAnswer: "O(n log n) - building heap takes O(n), then extracting each of n elements takes O(log n) each."
        },
        {
          question: "Write code for tower of Hanoi recursive solution:",
          type: "code",
          correct: "def hanoi(n, source, destination, auxiliary):\n    if n == 1:\n        print(f'Move disk from {source} to {destination}')\n    else:\n        hanoi(n-1, source, auxiliary, destination)\n        print(f'Move disk from {source} to {destination}')\n        hanoi(n-1, auxiliary, destination, source)",
          explanation: "Tower of Hanoi solution moves n-1 disks to auxiliary rod, moves largest disk to destination, then moves n-1 disks from auxiliary to destination.",
          hint: "Break the problem into: move n-1 disks out of the way, move largest disk, move n-1 disks to destination.",
          example: "hanoi(3, 'A', 'C', 'B'): move 2 disks A→B, move largest A→C, move 2 disks B→C.",
          similarQuestion: "What is the time complexity of Tower of Hanoi?",
          similarAnswer: "O(2ⁿ) - each disk requires roughly twice as many moves as the previous configuration."
        },
        {
          question: "What is amortized analysis?",
          type: "text",
          correct: "average cost over sequence",
          explanation: "Amortized analysis calculates the average cost of operations over a sequence, rather than worst-case cost of individual operations.",
          hint: "It considers the cost over many operations, not just one expensive operation.",
          example: "Dynamic array doubling: most insertions are O(1), occasional resize is O(n), but amortized cost per insertion is O(1).",
          similarQuestion: "Why is the amortized time complexity of dynamic array insertion O(1)?",
          similarAnswer: "Although resize operations cost O(n), they happen infrequently enough that the average cost per insertion over many operations is O(1)."
        },
        {
          question: "Which algorithm solves the traveling salesman problem optimally?",
          type: "multiple-choice",
          options: ["Greedy", "Dynamic Programming", "BFS", "Linear Search"],
          correct: "Dynamic Programming",
          explanation: "The optimal solution to TSP uses dynamic programming with bitmask, though it's still exponential in time complexity.",
          hint: "TSP is NP-hard, but DP can solve it optimally for small instances.",
          example: "DP stores minimum cost to visit subset of cities ending at each city, builds up to full solution visiting all cities.",
          similarQuestion: "What is the time complexity of the optimal TSP algorithm?",
          similarAnswer: "O(n²2ⁿ) using dynamic programming with bitmask - exponential but better than brute force O(n!)."
        },
        {
          question: "What is the difference between BFS and DFS in terms of space complexity?",
          type: "text",
          correct: "BFS uses more space",
          explanation: "BFS typically uses more space than DFS because it stores all nodes at the current level, while DFS only stores the path from root to current node.",
          hint: "Consider how much each algorithm needs to remember at any given time.",
          example: "In binary tree of height h: BFS queue can hold up to 2^h nodes at bottom level, DFS stack holds at most h nodes (path to current).",
          similarQuestion: "Which traversal is better for finding shortest path in unweighted graphs?",
          similarAnswer: "BFS - it explores nodes level by level, guaranteeing the shortest path is found first."
        },
        {
          question: "Write code for checking if a string is a palindrome:",
          type: "code",
          correct: "def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True",
          explanation: "Two-pointer approach compares characters from both ends moving inward, stopping when they meet or find a mismatch.",
          hint: "Use two pointers starting from both ends and move them toward each other.",
          example: "is_palindrome('racecar'): compare r-r, a-a, c-c, all match so return True. For 'hello': h≠o so return False.",
          similarQuestion: "Write code to reverse a string:",
          similarAnswer: "def reverse_string(s):\n    return s[::-1]\n# or iteratively:\ndef reverse_string(s):\n    result = ''\n    for char in s:\n        result = char + result\n    return result"
        },
        {
          question: "What is the pigeonhole principle in algorithm analysis?",
          type: "text",
          correct: "more items than containers",
          explanation: "The pigeonhole principle states that if you have more items than containers, at least one container must hold more than one item.",
          hint: "It's about the inevitable overlap when distributing items into fewer containers.",
          example: "In a room of 13 people, at least 2 share the same birth month (12 months < 13 people). Used to prove lower bounds in sorting.",
          similarQuestion: "How does the pigeonhole principle prove that comparison-based sorting has O(n log n) lower bound?",
          similarAnswer: "With n! possible permutations and each comparison giving at most 2 outcomes, you need at least log₂(n!) ≈ n log n comparisons."
        },
        {
          question: "What is the difference between best-fit and first-fit algorithms?",
          type: "text",
          correct: "allocation strategy",
          explanation: "Best-fit allocates the smallest available block that fits the request, while first-fit allocates the first available block that fits.",
          hint: "Think about memory allocation strategies and their trade-offs.",
          example: "Available blocks: [100, 50, 200]. Request 60: first-fit chooses 100, best-fit chooses 200 (smallest that fits).",
          similarQuestion: "Which memory allocation algorithm typically has better space utilization?",
          similarAnswer: "Best-fit generally has better space utilization but may be slower due to searching for the optimal block."
        },
        {
          question: "What is branch and bound?",
          type: "text",
          correct: "optimization technique",
          explanation: "Branch and bound is a systematic optimization technique that explores the solution space by branching and pruning based on bounds.",
          hint: "It's like backtracking but with pruning based on optimality bounds.",
          example: "TSP with branch and bound: explore partial paths, maintain best solution found, prune paths that cannot improve the best solution.",
          similarQuestion: "How does branch and bound differ from brute force?",
          similarAnswer: "Branch and bound prunes unpromising branches using bounds, while brute force explores all possibilities."
        },
        {
          question: "Write code for Euclidean algorithm (GCD):",
          type: "code",
          correct: "def gcd(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a",
          explanation: "Euclidean algorithm finds GCD by repeatedly replacing the larger number with the remainder of division until one becomes zero.",
          hint: "Use the fact that gcd(a,b) = gcd(b, a%b).",
          example: "gcd(48, 18): 48%18=12, gcd(18,12): 18%12=6, gcd(12,6): 12%6=0, so gcd=6.",
          similarQuestion: "What is the time complexity of Euclidean algorithm?",
          similarAnswer: "O(log min(a,b)) - the number of steps is logarithmic in the smaller of the two numbers."
        },
        {
          question: "What is the space-time tradeoff?",
          type: "text",
          correct: "memory for speed",
          explanation: "Space-time tradeoff involves using additional memory to reduce computation time, or vice versa - using less memory at the cost of more time.",
          hint: "It's about balancing memory usage and execution speed.",
          example: "Memoization: uses extra memory to store computed results, trading space for faster lookup instead of recomputation.",
          similarQuestion: "Give an example of trading time for space:",
          similarAnswer: "Computing Fibonacci iteratively instead of with memoization - uses O(1) space but takes O(n) time for each call."
        },
        {
          question: "What is randomized algorithm?",
          type: "text",
          correct: "uses random choices",
          explanation: "A randomized algorithm makes random choices during execution, which can lead to different outcomes on the same input.",
          hint: "The algorithm's behavior depends on random number generation.",
          example: "Randomized QuickSort chooses pivot randomly, making worst-case unlikely. Monte Carlo algorithms use randomness for approximation.",
          similarQuestion: "What are the two main types of randomized algorithms?",
          similarAnswer: "Las Vegas algorithms (always correct, random runtime) and Monte Carlo algorithms (random correctness, fixed runtime)."
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
        },
        {
          question: "Which data structure is best for implementing a priority queue?",
          type: "multiple-choice",
          options: ["Array", "Linked List", "Binary Heap", "Hash Table"],
          correct: "Binary Heap",
          explanation: "Binary heaps provide O(log n) insertion and O(log n) extraction of the highest priority element.",
          hint: "Think about structures that maintain order efficiently.",
          example: "Hospital ER priority queue: Critical(1), Urgent(2), Standard(3). Heap ensures critical patients are always treated first, regardless of arrival order.",
          similarQuestion: "Which data structure is best for implementing a regular queue?",
          similarAnswer: "Linked List or Circular Array - both allow efficient O(1) enqueue and dequeue operations."
        },
        {
          question: "What is the time complexity of accessing an element in a hash table?",
          type: "multiple-choice",
          options: ["O(1) average", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(1) average",
          explanation: "Hash tables provide constant time access on average, though worst-case can be O(n) due to collisions.",
          hint: "Hash functions are designed to provide direct access to elements.",
          example: "Looking up student grade: hash('John') = 7, directly access grades[7]. No need to search through all students.",
          similarQuestion: "What is the time complexity of searching in a balanced binary search tree?",
          similarAnswer: "O(log n) - the tree height is logarithmic, so search takes logarithmic time."
        },
        {
          question: "Write code to implement a basic stack using an array:",
          type: "code",
          correct: "class Stack:\n    def __init__(self):\n        self.items = []\n    \n    def push(self, item):\n        self.items.append(item)\n    \n    def pop(self):\n        return self.items.pop()",
          explanation: "This implements a stack using Python's list, with push adding to the end and pop removing from the end.",
          hint: "Use a list and think about which end represents the 'top' of the stack.",
          example: "stack = Stack(); stack.push('A'); stack.push('B'); stack.pop() returns 'B'; stack.pop() returns 'A'.",
          similarQuestion: "Write code to implement a basic queue using an array:",
          similarAnswer: "class Queue:\n    def __init__(self):\n        self.items = []\n    \n    def enqueue(self, item):\n        self.items.append(item)\n    \n    def dequeue(self):\n        return self.items.pop(0)"
        },
        {
          question: "What is a binary search tree?",
          type: "text",
          correct: "ordered binary tree",
          explanation: "A binary search tree is a binary tree where for each node, all values in the left subtree are smaller and all values in the right subtree are larger.",
          hint: "It's a tree that maintains a specific ordering property.",
          example: "BST with root 8: left subtree {3, 1, 6} all < 8, right subtree {10, 14, 13} all > 8. Search for 6: go left, then right.",
          similarQuestion: "What is a balanced binary tree?",
          similarAnswer: "A binary tree where the height difference between left and right subtrees is at most 1 for every node."
        },
        {
          question: "Which operation is NOT efficient in a singly linked list?",
          type: "multiple-choice",
          options: ["Insertion at beginning", "Deletion at beginning", "Access by index", "Insertion after a node"],
          correct: "Access by index",
          explanation: "Accessing an element by index in a singly linked list requires traversing from the head, taking O(n) time.",
          hint: "Think about which operations require traversing the entire list.",
          example: "To access list[100] in linked list, must traverse: head→node1→node2→...→node100. Array[100] accesses directly.",
          similarQuestion: "Which operation is NOT efficient in an array?",
          similarAnswer: "Insertion at beginning - requires shifting all existing elements to the right, taking O(n) time."
        },
        {
          question: "What is the height of a balanced binary tree with n nodes?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(log n)",
          explanation: "A balanced binary tree maintains a height of O(log n) by ensuring the tree remains relatively balanced.",
          hint: "Balanced trees minimize height by distributing nodes evenly.",
          example: "Balanced tree with 15 nodes has height 4 (log₂15 ≈ 4). Unbalanced could be height 15 if all nodes form a chain.",
          similarQuestion: "What is the height of a complete binary tree with n nodes?",
          similarAnswer: "O(log n) - a complete binary tree fills levels from left to right, maintaining minimal height."
        },
        {
          question: "Write code to reverse a linked list:",
          type: "code",
          correct: "def reverse_list(head):\n    prev = None\n    current = head\n    while current:\n        next_temp = current.next\n        current.next = prev\n        prev = current\n        current = next_temp\n    return prev",
          explanation: "This iteratively reverses a linked list by changing the direction of pointers.",
          hint: "You need to keep track of previous, current, and next nodes while reversing pointers.",
          example: "Original: A→B→C→NULL. Step by step: A←B C→NULL, then A←B←C NULL. Result: NULL←A←B←C (or C→B→A→NULL).",
          similarQuestion: "Write code to find the length of a linked list:",
          similarAnswer: "def list_length(head):\n    count = 0\n    current = head\n    while current:\n        count += 1\n        current = current.next\n    return count"
        },
        {
          question: "What is a circular queue?",
          type: "text",
          correct: "queue with circular buffer",
          explanation: "A circular queue uses a circular buffer where the rear connects back to the front, efficiently utilizing space.",
          hint: "It's like a regular queue but the end connects back to the beginning.",
          example: "Queue[5]: front=0, rear=2 has [A,B,C,_,_]. After adding D,E: rear=4. After removing A,B: front=2. Next add wraps rear to 0.",
          similarQuestion: "What is a double-ended queue (deque)?",
          similarAnswer: "A data structure that allows insertion and deletion at both ends, combining features of stack and queue."
        },
        {
          question: "Which tree traversal visits root after children?",
          type: "multiple-choice",
          options: ["Preorder", "Inorder", "Postorder", "Level order"],
          correct: "Postorder",
          explanation: "Postorder traversal visits left subtree, then right subtree, and finally the root node.",
          hint: "Think about the order: left, right, then root.",
          example: "Tree with root A, children B and C: Postorder visits B's children first, then B, then C's children, then C, finally A. Order: left→right→root.",
          similarQuestion: "Which tree traversal visits root before children?",
          similarAnswer: "Preorder - it visits the root first, then the left subtree, then the right subtree."
        },
        {
          question: "What is the load factor in hash tables?",
          type: "text",
          correct: "ratio of elements to slots",
          explanation: "Load factor is the ratio of the number of elements to the number of slots in the hash table, affecting performance.",
          hint: "It measures how full the hash table is.",
          example: "Hash table with 10 slots containing 7 elements has load factor 0.7. Higher load factor means more collisions, slower performance.",
          similarQuestion: "What happens when a hash table's load factor becomes too high?",
          similarAnswer: "Performance degrades due to increased collisions; the table should be resized and elements rehashed."
        },
        {
          question: "Write code to implement a queue using two stacks:",
          type: "code",
          correct: "class Queue:\n    def __init__(self):\n        self.stack1 = []\n        self.stack2 = []\n    \n    def enqueue(self, item):\n        self.stack1.append(item)\n    \n    def dequeue(self):\n        if not self.stack2:\n            while self.stack1:\n                self.stack2.append(self.stack1.pop())\n        return self.stack2.pop()",
          explanation: "This implements a queue using two stacks by transferring elements between them to achieve FIFO behavior.",
          hint: "Use one stack for input and another for output, transferring when needed.",
          example: "Enqueue A,B,C: stack1=[A,B,C]. Dequeue: move all to stack2=[C,B,A], pop A. Next dequeue pops B from stack2.",
          similarQuestion: "Write code to implement a stack using two queues:",
          similarAnswer: "class Stack:\n    def __init__(self):\n        self.q1 = []\n        self.q2 = []\n    \n    def push(self, item):\n        self.q2.append(item)\n        while self.q1:\n            self.q2.append(self.q1.pop(0))\n        self.q1, self.q2 = self.q2, self.q1"
        },
        {
          question: "What is a deque?",
          type: "multiple-choice",
          options: ["Single-ended queue", "Double-ended queue", "Priority queue", "Circular queue"],
          correct: "Double-ended queue",
          explanation: "A deque (double-ended queue) allows insertion and deletion at both ends.",
          hint: "It's a queue that works from both front and back.",
          example: "Deque [A,B,C]: can addFront(X)→[X,A,B,C], addRear(Y)→[X,A,B,C,Y], removeFront()→[A,B,C,Y], removeRear()→[A,B,C].",
          similarQuestion: "What is a priority queue?",
          similarAnswer: "A data structure where each element has a priority, and elements are served based on their priority rather than insertion order."
        },
        {
          question: "Which data structure is used for undo operations?",
          type: "multiple-choice",
          options: ["Queue", "Stack", "Tree", "Graph"],
          correct: "Stack",
          explanation: "Stacks are perfect for undo operations because the most recent action (top of stack) should be undone first.",
          hint: "Think about the order in which you want to undo actions.",
          example: "Text editor: type 'H', type 'i', delete 'i'. Undo stack: [type'H', type'i', delete'i']. Undo pops delete'i' first.",
          similarQuestion: "Which data structure is used for breadth-first search?",
          similarAnswer: "Queue - BFS explores nodes level by level, processing nodes in the order they were discovered."
        },
        {
          question: "What is a trie data structure?",
          type: "text",
          correct: "prefix tree",
          explanation: "A trie is a tree-like data structure used for storing strings where each path represents a string and common prefixes share paths.",
          hint: "It's especially useful for storing and searching strings with common prefixes.",
          example: "Storing ['cat', 'car', 'card']: root→c→a→t(end), and c→a→r(end)→d(end). 'ca' prefix is shared by all three words.",
          similarQuestion: "What is a suffix tree?",
          similarAnswer: "A tree that contains all suffixes of a given string, useful for fast string searching and pattern matching."
        },
        {
          question: "Write code to find the middle element of a linked list:",
          type: "code",
          correct: "def find_middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
          explanation: "This uses the two-pointer technique where fast pointer moves twice as fast as slow pointer.",
          hint: "Use two pointers moving at different speeds - when fast reaches end, slow is at middle.",
          example: "List A→B→C→D→E: slow starts at A, fast at A. Step 1: slow at B, fast at C. Step 2: slow at C, fast at E. Step 3: fast at null, slow at C (middle).",
          similarQuestion: "Write code to detect a cycle in a linked list:",
          similarAnswer: "def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False"
        },
        {
          question: "What is the difference between B-tree and B+ tree?",
          type: "text",
          correct: "leaf node linking",
          explanation: "B+ trees have all data in leaf nodes and leaf nodes are linked, while B-trees store data in all nodes.",
          hint: "Think about where data is stored and how leaf nodes are connected.",
          example: "B-tree: internal nodes store data. B+ tree: only leaves store data [1,3,5,7], and leaves are linked 1↔3↔5↔7 for range queries.",
          similarQuestion: "What is the difference between binary tree and binary search tree?",
          similarAnswer: "Binary tree has no ordering constraint; BST maintains the property that left children < parent < right children."
        },
        {
          question: "Which data structure is best for LRU cache implementation?",
          type: "multiple-choice",
          options: ["Array", "Hash table + Doubly linked list", "Stack", "Queue"],
          correct: "Hash table + Doubly linked list",
          explanation: "LRU cache combines hash table for O(1) access and doubly linked list for O(1) insertion/deletion.",
          hint: "You need both fast access and efficient reordering capabilities.",
          example: "Cache[3]: {A:1}→{B:2}→{C:3}. Access A: move to front {A:1}→{B:2}→{C:3}. Add D: evict C, {D:4}→{A:1}→{B:2}.",
          similarQuestion: "Which data structure is best for LFU (Least Frequently Used) cache?",
          similarAnswer: "Hash table + Min heap - hash table for O(1) access, min heap to track frequency and find least frequently used item."
        },
        {
          question: "What is the space complexity of a recursive tree traversal?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(log n)",
          explanation: "Recursive tree traversal uses O(h) space where h is the height of the tree, which is O(log n) for balanced trees.",
          hint: "Consider the maximum depth of recursive calls on the call stack.",
          example: "Balanced tree height 4: maximum 4 recursive calls on stack simultaneously. For n=15 nodes, height ≈ log₂15 = 4.",
          similarQuestion: "What is the space complexity of iterative tree traversal using a stack?",
          similarAnswer: "O(h) where h is the height of the tree - same as recursive, but using explicit stack instead of call stack."
        },
        {
          question: "What is a deque (double-ended queue)?",
          type: "text",
          correct: "insertion and deletion at both ends",
          explanation: "A deque allows insertion and deletion operations at both the front and rear ends efficiently.",
          hint: "Think of a queue where you can add/remove from both sides.",
          example: "Deque operations: addFront(1), addRear(2), addFront(3) gives [3,1,2]. removeFront() gives 3, removeRear() gives 2.",
          similarQuestion: "What is the time complexity of deque operations?",
          similarAnswer: "O(1) for insertion and deletion at both ends when implemented with a doubly linked list or circular buffer."
        },
        {
          question: "Write code to implement a circular queue:",
          type: "code",
          correct: "class CircularQueue:\n    def __init__(self, size):\n        self.queue = [None] * size\n        self.size = size\n        self.front = self.rear = -1\n    \n    def enqueue(self, item):\n        if (self.rear + 1) % self.size == self.front:\n            return False  # Full\n        if self.front == -1:\n            self.front = self.rear = 0\n        else:\n            self.rear = (self.rear + 1) % self.size\n        self.queue[self.rear] = item\n        return True",
          explanation: "Circular queue wraps around using modulo arithmetic, efficiently using fixed space without shifting elements.",
          hint: "Use modulo operation to wrap indices around the array.",
          example: "Size 4 queue: indices wrap as 0→1→2→3→0→1... When rear reaches end, it wraps to beginning if space available.",
          similarQuestion: "What is the advantage of circular queue over linear queue?",
          similarAnswer: "Circular queue reuses freed space at the beginning, avoiding the need to shift elements when dequeuing."
        },
        {
          question: "What is the difference between depth and height of a tree?",
          type: "text",
          correct: "depth from root, height from leaf",
          explanation: "Depth is the distance from root to a node, while height is the distance from a node to its deepest leaf.",
          hint: "Depth is measured downward from root, height is measured upward from leaves.",
          example: "Tree: A(root)-B-C. Node B has depth 1 (1 edge from A), height 1 (1 edge to C). Node C has depth 2, height 0.",
          similarQuestion: "What is the height of a leaf node?",
          similarAnswer: "0 - a leaf node has no children, so the distance to its deepest leaf (itself) is 0."
        },
        {
          question: "Which tree traversal gives nodes in sorted order for a BST?",
          type: "multiple-choice",
          options: ["Preorder", "Inorder", "Postorder", "Level-order"],
          correct: "Inorder",
          explanation: "Inorder traversal of a BST visits nodes in ascending sorted order: left subtree, root, right subtree.",
          hint: "BST property: left < root < right. Which traversal respects this order?",
          example: "BST [5,3,7,2,4,6,8]: inorder gives 2,3,4,5,6,7,8 (sorted). Preorder gives 5,3,2,4,7,6,8 (not sorted).",
          similarQuestion: "How can you check if a binary tree is a valid BST?",
          similarAnswer: "Perform inorder traversal and check if the sequence is strictly increasing, or use recursive validation with min/max bounds."
        },
        {
          question: "What is a balanced binary tree?",
          type: "text",
          correct: "height difference at most 1",
          explanation: "A balanced binary tree has the height difference between left and right subtrees of any node at most 1.",
          hint: "It's about keeping the tree roughly even on both sides.",
          example: "Balanced: left height=2, right height=3 (diff=1). Unbalanced: left height=1, right height=4 (diff=3).",
          similarQuestion: "What is an AVL tree?",
          similarAnswer: "A self-balancing BST where the height difference between left and right subtrees is at most 1 for every node."
        },
        {
          question: "Write code to find the middle element of a linked list:",
          type: "code",
          correct: "def find_middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
          explanation: "Two-pointer technique: slow pointer moves one step, fast pointer moves two steps. When fast reaches end, slow is at middle.",
          hint: "Use tortoise and hare algorithm - one pointer twice as fast as the other.",
          example: "List [1,2,3,4,5]: slow starts at 1, fast at 1. After iterations: slow at 3, fast at 5. Middle is 3.",
          similarQuestion: "How do you detect a cycle in a linked list?",
          similarAnswer: "Use Floyd's algorithm: if there's a cycle, fast and slow pointers will eventually meet; if no cycle, fast reaches null."
        },
        {
          question: "What is the time complexity of deleting from the middle of an array?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: "O(n)",
          explanation: "Deleting from the middle requires shifting all subsequent elements one position left, taking O(n) time.",
          hint: "Consider what happens to elements after the deleted position.",
          example: "Array [1,2,3,4,5], delete 3: shift [4,5] left to get [1,2,4,5]. Number of shifts = n - position.",
          similarQuestion: "What is the time complexity of inserting in the middle of an array?",
          similarAnswer: "O(n) - need to shift all subsequent elements one position right to make space."
        },
        {
          question: "What is a priority queue?",
          type: "text",
          correct: "ordered by priority",
          explanation: "A priority queue serves elements based on priority rather than insertion order, with highest priority element served first.",
          hint: "It's like a VIP line where importance matters more than arrival time.",
          example: "Hospital emergency queue: critical patients (priority 1) served before minor injuries (priority 3), regardless of arrival order.",
          similarQuestion: "What data structure is commonly used to implement a priority queue?",
          similarAnswer: "Binary heap - provides O(log n) insertion and O(log n) extraction of highest priority element."
        },
        {
          question: "Write code to reverse a linked list iteratively:",
          type: "code",
          correct: "def reverse_list(head):\n    prev = None\n    current = head\n    while current:\n        next_node = current.next\n        current.next = prev\n        prev = current\n        current = next_node\n    return prev",
          explanation: "Iteratively reverse links by maintaining three pointers: previous, current, and next node.",
          hint: "Keep track of previous node to reverse the link direction.",
          example: "List 1→2→3: Step1: 1→None, Step2: 2→1→None, Step3: 3→2→1→None. Return pointer to 3.",
          similarQuestion: "Write code to reverse a linked list recursively:",
          similarAnswer: "def reverse_recursive(head):\n    if not head or not head.next:\n        return head\n    new_head = reverse_recursive(head.next)\n    head.next.next = head\n    head.next = None\n    return new_head"
        },
        {
          question: "What is the difference between a complete and perfect binary tree?",
          type: "text",
          correct: "complete fills left to right",
          explanation: "A perfect binary tree has all levels completely filled. A complete binary tree fills levels left to right, with the last level possibly incomplete.",
          hint: "Perfect means every level is full, complete means filled left to right.",
          example: "Perfect: all nodes at depth 2 have 2 children. Complete: may have missing nodes only at rightmost positions of last level.",
          similarQuestion: "What is a full binary tree?",
          similarAnswer: "A binary tree where every node has either 0 or 2 children (no node has exactly 1 child)."
        },
        {
          question: "What is the space complexity of merge sort?",
          type: "multiple-choice",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: "O(n)",
          explanation: "Merge sort requires O(n) auxiliary space for temporary arrays during the merge process.",
          hint: "Consider the space needed for merging two sorted subarrays.",
          example: "Merging arrays [1,3,5] and [2,4,6] requires temporary array of size 6 to store the merged result.",
          similarQuestion: "What is the space complexity of quicksort?",
          similarAnswer: "O(log n) average case due to recursion stack depth, O(n) worst case when tree is highly unbalanced."
        },
        {
          question: "Write code to implement a stack using queues:",
          type: "code",
          correct: "class Stack:\n    def __init__(self):\n        self.q1 = []\n        self.q2 = []\n    \n    def push(self, x):\n        self.q1.append(x)\n    \n    def pop(self):\n        if not self.q1:\n            return None\n        while len(self.q1) > 1:\n            self.q2.append(self.q1.pop(0))\n        result = self.q1.pop(0)\n        self.q1, self.q2 = self.q2, self.q1\n        return result",
          explanation: "Use two queues: push to q1, for pop transfer all but last element to q2, pop last from q1, swap queues.",
          hint: "Use one queue for storage, another as temporary space during pop operations.",
          example: "Stack [1,2,3]: push(4) adds to q1. pop() moves [1,2,3] to q2, returns 4, swaps queues.",
          similarQuestion: "Write code to implement a queue using stacks:",
          similarAnswer: "Use two stacks: enqueue to stack1, dequeue by moving all to stack2 (if empty), pop from stack2."
        },
        {
          question: "What is a segment tree used for?",
          type: "text",
          correct: "range queries",
          explanation: "A segment tree efficiently handles range queries (sum, min, max) and updates on an array in O(log n) time.",
          hint: "It's about answering questions about ranges of elements quickly.",
          example: "Array [1,3,5,7,9]: segment tree can answer 'sum from index 1 to 3' (3+5+7=15) in O(log n) time.",
          similarQuestion: "What is the time complexity of range sum query in a segment tree?",
          similarAnswer: "O(log n) - the tree height is log n, and queries traverse at most 4 nodes per level."
        },
        {
          question: "What is a trie (prefix tree)?",
          type: "text",
          correct: "tree for string storage",
          explanation: "A trie is a tree data structure used to store strings where each path from root to node represents a prefix.",
          hint: "It's like a tree where each edge represents a character.",
          example: "Storing ['cat', 'car', 'card']: root→c→a→t (end), with branch a→r→ε (end) and r→d (end).",
          similarQuestion: "What is the time complexity of searching in a trie?",
          similarAnswer: "O(m) where m is the length of the search string - independent of number of strings stored."
        },
        {
          question: "Write code to detect cycle in an undirected graph:",
          type: "code",
          correct: "def has_cycle(graph):\n    visited = set()\n    \n    def dfs(node, parent):\n        visited.add(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                if dfs(neighbor, node):\n                    return True\n            elif neighbor != parent:\n                return True\n        return False\n    \n    for node in graph:\n        if node not in visited:\n            if dfs(node, -1):\n                return True\n    return False",
          explanation: "Use DFS to detect back edges. If we visit a node that's already visited and it's not the parent, there's a cycle.",
          hint: "In undirected graphs, a cycle exists if there's a back edge to a non-parent visited node.",
          example: "Graph with edges [(1,2), (2,3), (3,1)]: visiting 1→2→3, then 3 connects back to 1 (not parent), cycle detected.",
          similarQuestion: "How do you detect cycle in a directed graph?",
          similarAnswer: "Use DFS with three colors: white (unvisited), gray (visiting), black (visited). Cycle exists if gray node is revisited."
        },
        {
          question: "What is the difference between BFS and level-order traversal?",
          type: "text",
          correct: "same algorithm different context",
          explanation: "BFS and level-order traversal use the same algorithm but differ in context: BFS for graphs, level-order for trees.",
          hint: "They're the same technique applied to different data structures.",
          example: "Both use a queue to visit nodes level by level: process current level completely before moving to next level.",
          similarQuestion: "Can you use BFS to traverse a tree?",
          similarAnswer: "Yes - BFS on a tree is exactly level-order traversal, visiting all nodes at depth d before any node at depth d+1."
        },
        {
          question: "What is a B-tree?",
          type: "text",
          correct: "self-balancing multiway tree",
          explanation: "A B-tree is a self-balancing tree where nodes can have multiple keys and children, commonly used in databases and file systems.",
          hint: "It's like a BST but nodes can store multiple values and have many children.",
          example: "B-tree node with 3 keys [10,20,30] has 4 children: values <10, 10-20, 20-30, >30.",
          similarQuestion: "Why are B-trees used in databases?",
          similarAnswer: "B-trees minimize disk I/O by storing many keys per node, reducing the height and number of disk accesses needed."
        },
        {
          question: "Write code to find the diameter of a binary tree:",
          type: "code",
          correct: "def diameter(root):\n    def height(node):\n        if not node:\n            return 0\n        left_height = height(node.left)\n        right_height = height(node.right)\n        diameter[0] = max(diameter[0], left_height + right_height)\n        return 1 + max(left_height, right_height)\n    \n    diameter = [0]\n    height(root)\n    return diameter[0]",
          explanation: "Diameter is the longest path between any two nodes. For each node, check if path through it is longer than current maximum.",
          hint: "The diameter through a node is the sum of heights of its left and right subtrees.",
          example: "Tree with root having left subtree height 2, right subtree height 3: diameter through root = 2+3=5.",
          similarQuestion: "What is the time complexity of finding tree diameter?",
          similarAnswer: "O(n) - we visit each node once to calculate height and update diameter."
        },
        {
          question: "What is dynamic array resizing strategy?",
          type: "text",
          correct: "double size when full",
          explanation: "Dynamic arrays typically double their size when full and may halve when quarter full to maintain amortized O(1) insertion.",
          hint: "Growing too slowly wastes time, growing too quickly wastes space.",
          example: "Array size 4 becomes full: resize to 8. If 8 becomes full: resize to 16. If 16 shrinks to 4: resize to 8.",
          similarQuestion: "Why do dynamic arrays double in size rather than increase by a fixed amount?",
          similarAnswer: "Doubling ensures amortized O(1) insertion time. Fixed increment would give O(n) amortized time."
        },
        {
          question: "What is a hash collision?",
          type: "text",
          correct: "different keys same bucket",
          explanation: "A hash collision occurs when different keys hash to the same bucket in a hash table.",
          hint: "Multiple keys trying to occupy the same storage location.",
          example: "Hash function h(k)=k%5: keys 7 and 12 both hash to bucket 2 (7%5=2, 12%5=2), causing collision.",
          similarQuestion: "What are two common methods to handle hash collisions?",
          similarAnswer: "Chaining (store multiple values in each bucket using linked lists) and open addressing (probe for next available slot)."
        },
        {
          question: "Write code to merge two sorted linked lists:",
          type: "code",
          correct: "def merge_sorted_lists(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    \n    while l1 and l2:\n        if l1.val <= l2.val:\n            current.next = l1\n            l1 = l1.next\n        else:\n            current.next = l2\n            l2 = l2.next\n        current = current.next\n    \n    current.next = l1 or l2\n    return dummy.next",
          explanation: "Use two pointers to compare nodes from both lists, always choosing the smaller value for the merged list.",
          hint: "Create a dummy head to simplify the merging logic.",
          example: "Lists [1,2,4] and [1,3,4]: compare 1≤1, add 1, compare 2≤3, add 2, etc. Result: [1,1,2,3,4,4].",
          similarQuestion: "What is the time complexity of merging two sorted linked lists?",
          similarAnswer: "O(m+n) where m and n are the lengths of the two lists - we visit each node exactly once."
        },
        {
          question: "What is the load factor in a hash table?",
          type: "text",
          correct: "ratio of elements to buckets",
          explanation: "Load factor is the ratio of number of elements to number of buckets, indicating how full the hash table is.",
          hint: "It measures the density of the hash table.",
          example: "Hash table with 100 elements and 50 buckets has load factor = 100/50 = 2.0.",
          similarQuestion: "What happens when load factor becomes too high?",
          similarAnswer: "Performance degrades due to increased collisions. Hash table typically resizes when load factor exceeds threshold (e.g., 0.75)."
        },
        {
          question: "What is a red-black tree?",
          type: "text",
          correct: "self-balancing BST with colors",
          explanation: "A red-black tree is a self-balancing BST where nodes are colored red or black, with properties ensuring O(log n) operations.",
          hint: "It uses colors and rules to maintain balance automatically.",
          example: "Rules: root is black, red nodes have black children, all paths from root to leaves have same number of black nodes.",
          similarQuestion: "What is the maximum height of a red-black tree with n nodes?",
          similarAnswer: "2×log₂(n+1) - the color properties ensure the longest path is at most twice the shortest path."
        },
        {
          question: "Write code to implement LRU cache:",
          type: "code",
          correct: "class LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = {}\n        self.order = []\n    \n    def get(self, key):\n        if key in self.cache:\n            self.order.remove(key)\n            self.order.append(key)\n            return self.cache[key]\n        return -1\n    \n    def put(self, key, value):\n        if key in self.cache:\n            self.order.remove(key)\n        elif len(self.cache) >= self.capacity:\n            oldest = self.order.pop(0)\n            del self.cache[oldest]\n        \n        self.cache[key] = value\n        self.order.append(key)",
          explanation: "LRU cache maintains insertion order and evicts least recently used item when capacity is exceeded.",
          hint: "Keep track of access order and remove the oldest item when full.",
          example: "Capacity 2: put(1,1), put(2,2), get(1), put(3,3) evicts key 2 since 1 was accessed more recently.",
          similarQuestion: "What data structures can implement LRU cache efficiently?",
          similarAnswer: "HashMap + doubly linked list: O(1) access via hashmap, O(1) removal/insertion in list."
        },
        {
          question: "What is a graph adjacency matrix vs adjacency list?",
          type: "text",
          correct: "matrix uses 2D array, list uses arrays of neighbors",
          explanation: "Adjacency matrix uses a 2D array where matrix[i][j] indicates edge from i to j. Adjacency list stores each vertex's neighbors in a list.",
          hint: "Matrix uses more space but faster edge queries, list uses less space for sparse graphs.",
          example: "Graph with 4 vertices, edges (0,1), (1,2): Matrix is 4×4 array, List is {0:[1], 1:[2], 2:[], 3:[]}.",
          similarQuestion: "When is adjacency matrix preferred over adjacency list?",
          similarAnswer: "For dense graphs or when frequent edge existence queries are needed - O(1) edge lookup vs O(degree) in adjacency list."
        },
        {
          question: "What is amortized analysis in the context of dynamic arrays?",
          type: "text",
          correct: "average cost over many operations",
          explanation: "Amortized analysis shows that despite occasional expensive resize operations, the average cost per insertion in dynamic arrays is O(1).",
          hint: "Some operations are expensive, but they happen rarely enough to average out.",
          example: "Inserting n elements: most insertions are O(1), but resizes at powers of 2 cost O(n). Total cost is still O(n), so amortized O(1) per operation.",
          similarQuestion: "What is the amortized time complexity of insertion in a dynamic array?",
          similarAnswer: "O(1) - although resize operations take O(n), they occur infrequently enough that the average insertion time is constant."
        },
        {
          question: "Write code to find if two binary trees are identical:",
          type: "code",
          correct: "def is_identical(tree1, tree2):\n    if not tree1 and not tree2:\n        return True\n    if not tree1 or not tree2:\n        return False\n    return (tree1.val == tree2.val and \n            is_identical(tree1.left, tree2.left) and \n            is_identical(tree1.right, tree2.right))",
          explanation: "Recursively compare nodes: both null (identical), one null (different), values different (different), recurse on children.",
          hint: "Two trees are identical if their structure and values match exactly.",
          example: "Trees with same structure [1,2,3] and [1,2,3] are identical. [1,2,3] and [1,3,2] are not identical.",
          similarQuestion: "How do you check if two trees are structurally identical but may have different values?",
          similarAnswer: "Modify the comparison to only check structure: replace 'tree1.val == tree2.val' with 'True' in the recursive function."
        }
      ],
      'programming': [
        {
          question: "What does the following code output?\nfor i in range(3):\n    print(i)",
          type: "text",
          correct: "0\n1\n2",
          explanation: "The range(3) function generates numbers from 0 to 2, so the output is 0, 1, 2 on separate lines.",
          hint: "range(n) starts from 0 and goes up to (but not including) n.",
          example: "range(3) produces the sequence [0, 1, 2]. The loop prints each number: first 0, then 1, then 2, each on a new line.",
          similarQuestion: "What does this code output?\nfor i in range(1, 4):\n    print(i * 2)",
          similarAnswer: "2\n4\n6 - range(1,4) gives [1,2,3], each multiplied by 2 gives [2,4,6]."
        },
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
        },
        {
          question: "Write a function that calculates the factorial of a number:",
          type: "code",
          correct: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
          explanation: "This recursive function calculates factorial by multiplying n with factorial of (n-1), with base case of 1 for n <= 1.",
          hint: "Factorial of n is n * factorial(n-1), and factorial of 1 is 1.",
          example: "factorial(4): 4 * factorial(3) = 4 * 6 = 24. factorial(3): 3 * factorial(2) = 3 * 2 = 6. factorial(2): 2 * factorial(1) = 2 * 1 = 2.",
          similarQuestion: "Write a function that calculates the sum of numbers from 1 to n:",
          similarAnswer: "def sum_to_n(n):\n    if n <= 0:\n        return 0\n    return n + sum_to_n(n - 1)"
        },
        {
          question: "What is a variable in programming?",
          type: "multiple-choice",
          options: ["A fixed value", "A storage location with a name", "A function", "A loop"],
          correct: "A storage location with a name",
          explanation: "A variable is a named storage location that can hold data and whose value can change during program execution.",
          hint: "Think of it as a labeled box where you can store things.",
          example: "age = 25 creates a variable named 'age' storing the value 25. Later, age = 26 changes the stored value to 26.",
          similarQuestion: "What is a constant in programming?",
          similarAnswer: "A named storage location whose value cannot be changed after initial assignment, like PI = 3.14159."
        },
        {
          question: "What is the output of: print(type(5.0))?",
          type: "multiple-choice",
          options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"],
          correct: "<class 'float'>",
          explanation: "5.0 is a floating-point number, so type() returns <class 'float'>.",
          hint: "The decimal point makes it a floating-point number.",
          example: "type(5) returns <class 'int'>, but type(5.0) returns <class 'float'> because the decimal point indicates a float.",
          similarQuestion: "What is the output of: print(type('5'))?",
          similarAnswer: "<class 'str'> - because '5' is enclosed in quotes, making it a string, not a number."
        },
        {
          question: "What is string concatenation?",
          type: "text",
          correct: "joining strings together",
          explanation: "String concatenation is the operation of joining two or more strings together to create a new string.",
          hint: "It's about combining multiple strings into one.",
          example: "'Hello' + ' ' + 'World' concatenates three strings to produce 'Hello World'. first_name + last_name joins two name strings.",
          similarQuestion: "What is string interpolation?",
          similarAnswer: "Embedding variables or expressions within string literals, like f'Hello {name}' in Python."
        },
        {
          question: "Write code to swap two variables without using a third variable:",
          type: "code",
          correct: "a, b = b, a",
          explanation: "Python allows tuple unpacking to swap variables in a single line without needing a temporary variable.",
          hint: "Python has a very elegant way to do this using tuple unpacking.",
          example: "If a = 5 and b = 10, then a, b = b, a results in a = 10 and b = 5. Python evaluates right side first: (10, 5), then unpacks to a, b.",
          similarQuestion: "Write code to swap two variables using a third variable:",
          similarAnswer: "temp = a\na = b\nb = temp"
        },
        {
          question: "What is the difference between a list and a tuple in Python?",
          type: "multiple-choice",
          options: ["No difference", "Lists are mutable, tuples are immutable", "Tuples are faster", "Lists use more memory"],
          correct: "Lists are mutable, tuples are immutable",
          explanation: "Lists can be modified after creation (mutable), while tuples cannot be changed once created (immutable).",
          hint: "Think about whether you can change the contents after creation.",
          example: "list1 = [1, 2, 3]; list1[0] = 9 works (now [9, 2, 3]). tuple1 = (1, 2, 3); tuple1[0] = 9 causes error.",
          similarQuestion: "What is the difference between a set and a list in Python?",
          similarAnswer: "Sets contain unique elements and are unordered; lists can have duplicates and maintain order."
        },
        {
          question: "What is the result of 5 // 2 in Python?",
          type: "multiple-choice",
          options: ["2.5", "2", "3", "2.0"],
          correct: "2",
          explanation: "The // operator performs floor division, returning the largest integer less than or equal to the result.",
          hint: "// is floor division, which rounds down to the nearest integer.",
          example: "5 / 2 = 2.5 (regular division), but 5 // 2 = 2 (floor division). Also: 7 // 3 = 2, not 2.33.",
          similarQuestion: "What is the result of 5 % 2 in Python?",
          similarAnswer: "1 - the % operator gives the remainder after division (5 divided by 2 is 2 with remainder 1)."
        },
        {
          question: "What is a dictionary in Python?",
          type: "text",
          correct: "key-value pairs",
          explanation: "A dictionary is a collection of key-value pairs where each key is unique and maps to a specific value.",
          hint: "It's like a real dictionary where words (keys) map to definitions (values).",
          example: "student = {'name': 'John', 'age': 20, 'grade': 'A'} maps keys to values. student['name'] returns 'John'.",
          similarQuestion: "What is a list in Python?",
          similarAnswer: "An ordered collection of items that can contain duplicates and be modified after creation."
        },
        {
          question: "Write code to find the length of a string without using len():",
          type: "code",
          correct: "def string_length(s):\n    count = 0\n    for char in s:\n        count += 1\n    return count",
          explanation: "This function iterates through each character in the string and counts them manually.",
          hint: "Iterate through each character and count them one by one.",
          example: "For string 'hello': loop through 'h'(count=1), 'e'(count=2), 'l'(count=3), 'l'(count=4), 'o'(count=5). Result: 5.",
          similarQuestion: "Write code to count vowels in a string:",
          similarAnswer: "def count_vowels(s):\n    count = 0\n    vowels = 'aeiouAEIOU'\n    for char in s:\n        if char in vowels:\n            count += 1\n    return count"
        },
        {
          question: "What is the difference between 'break' and 'continue'?",
          type: "text",
          correct: "break exits loop, continue skips iteration",
          explanation: "'break' terminates the entire loop, while 'continue' skips the current iteration and moves to the next one.",
          hint: "One stops the loop completely, the other just skips to the next round.",
          example: "for i in [1,2,3,4]: if i==3: break prints 1,2 then stops. if i==3: continue prints 1,2,4 (skips 3).",
          similarQuestion: "What is the difference between 'return' and 'print'?",
          similarAnswer: "return exits a function and gives back a value; print displays output to the screen but doesn't exit the function."
        },
        {
          question: "What is the output of: print(bool([]))?",
          type: "multiple-choice",
          options: ["True", "False", "[]", "Error"],
          correct: "False",
          explanation: "An empty list evaluates to False in a boolean context in Python.",
          hint: "Empty collections are considered 'falsy' in Python.",
          example: "bool([]) = False, bool([1]) = True. Similarly: bool('') = False, bool('hi') = True, bool(0) = False, bool(5) = True.",
          similarQuestion: "What is the output of: print(bool(0))?",
          similarAnswer: "False - zero is considered 'falsy' in Python, while any non-zero number is 'truthy'."
        },
        {
          question: "What is list comprehension?",
          type: "text",
          correct: "concise way to create lists",
          explanation: "List comprehension is a concise way to create lists by applying an expression to each item in an iterable.",
          hint: "It's a shorthand way to create lists using a single line of code.",
          example: "[x*2 for x in [1,2,3]] creates [2,4,6]. Equivalent to: result=[]; for x in [1,2,3]: result.append(x*2).",
          similarQuestion: "What is dictionary comprehension?",
          similarAnswer: "A concise way to create dictionaries, like {x: x*2 for x in [1,2,3]} creating {1: 2, 2: 4, 3: 6}."
        },
        {
          question: "Write code to reverse a string:",
          type: "code",
          correct: "def reverse_string(s):\n    return s[::-1]",
          explanation: "Python's slice notation [::-1] reverses a string by stepping backwards through all characters.",
          hint: "Use Python's slice notation with a negative step.",
          example: "'hello'[::-1] returns 'olleh'. The slice [start:end:step] with step=-1 goes backwards from end to start.",
          similarQuestion: "Write code to check if a string is a palindrome:",
          similarAnswer: "def is_palindrome(s):\n    return s == s[::-1]"
        },
        {
          question: "What is the difference between 'is' and '==' in Python?",
          type: "text",
          correct: "is checks identity, == checks equality",
          explanation: "'is' checks if two variables refer to the same object in memory, while '==' checks if the values are equal.",
          hint: "One checks if they're the same object, the other checks if they have the same value.",
          example: "a = [1,2]; b = [1,2]; c = a. a == b is True (same values), a is b is False (different objects), a is c is True (same object).",
          similarQuestion: "What is the difference between '!=' and 'is not' in Python?",
          similarAnswer: "!= checks if values are not equal; 'is not' checks if they're not the same object in memory."
        },
        {
          question: "What is a lambda function?",
          type: "multiple-choice",
          options: ["A named function", "An anonymous function", "A class method", "A built-in function"],
          correct: "An anonymous function",
          explanation: "A lambda function is a small anonymous function that can have any number of arguments but can only have one expression.",
          hint: "It's a function without a name, defined inline.",
          example: "lambda x: x*2 is equivalent to def multiply_by_two(x): return x*2. Used like: square = lambda x: x**2; square(5) returns 25.",
          similarQuestion: "What is a closure in Python?",
          similarAnswer: "A nested function that has access to variables from its enclosing scope, even after the outer function returns."
        },
        {
          question: "What is the output of: print('Hello' * 3)?",
          type: "text",
          correct: "HelloHelloHello",
          explanation: "The * operator with strings repeats the string the specified number of times.",
          hint: "String multiplication repeats the string.",
          example: "'Hi' * 3 = 'HiHiHi', 'A' * 5 = 'AAAAA', '-' * 10 = '----------'. Useful for creating separators or padding.",
          similarQuestion: "What is the output of: print([1, 2] * 3)?",
          similarAnswer: "[1, 2, 1, 2, 1, 2] - list multiplication repeats the entire list the specified number of times."
        },
        {
          question: "Write code to check if a number is even:",
          type: "code",
          correct: "def is_even(n):\n    return n % 2 == 0",
          explanation: "This function uses the modulo operator to check if a number is divisible by 2 (no remainder means even).",
          hint: "Even numbers are divisible by 2 with no remainder.",
          example: "is_even(4) returns True (4 % 2 = 0), is_even(5) returns False (5 % 2 = 1). Modulo gives remainder after division.",
          similarQuestion: "Write code to check if a number is odd:",
          similarAnswer: "def is_odd(n):\n    return n % 2 != 0"
        },
        {
          question: "What is the difference between '==' and 'is' in Python?",
          type: "text",
          correct: "equality vs identity",
          explanation: "'==' checks if values are equal, while 'is' checks if two variables refer to the same object in memory.",
          hint: "One compares values, the other compares object identity.",
          example: "a = [1,2,3]; b = [1,2,3]; a == b is True (same values), a is b is False (different objects).",
          similarQuestion: "When should you use 'is' instead of '=='?",
          similarAnswer: "Use 'is' when comparing with None, True, False, or when you specifically need to check object identity."
        },
        {
          question: "What does this code output?\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)",
          type: "text",
          correct: "[1, 2, 3, 4]",
          explanation: "y = x creates a reference to the same list object. Modifying y also affects x since they point to the same object.",
          hint: "Assignment creates a reference, not a copy.",
          example: "Both x and y point to the same list in memory. When y.append(4) modifies the list, x sees the change too.",
          similarQuestion: "How do you create a copy of a list instead of a reference?",
          similarAnswer: "Use y = x.copy() or y = x[:] or y = list(x) to create a new list with the same elements."
        },
        {
          question: "What is variable scope in Python?",
          type: "text",
          correct: "where variable can be accessed",
          explanation: "Variable scope determines where in the code a variable can be accessed. Python follows LEGB rule: Local, Enclosing, Global, Built-in.",
          hint: "Scope defines the visibility and accessibility of variables.",
          example: "Function variables are local scope, module variables are global scope. Local variables can't be accessed outside their function.",
          similarQuestion: "What does the 'global' keyword do in Python?",
          similarAnswer: "The 'global' keyword allows a function to modify a global variable instead of creating a new local variable."
        },
        {
          question: "Write code to find the sum of elements in a list:",
          type: "code",
          correct: "def sum_list(lst):\n    total = 0\n    for num in lst:\n        total += num\n    return total\n# or simply: sum(lst)",
          explanation: "Iterate through the list and add each element to a running total, or use the built-in sum() function.",
          hint: "You can do this manually with a loop or use Python's built-in sum() function.",
          example: "sum_list([1, 2, 3, 4, 5]) returns 15. sum([1, 2, 3, 4, 5]) also returns 15.",
          similarQuestion: "Write code to find the average of elements in a list:",
          similarAnswer: "def average(lst):\n    return sum(lst) / len(lst) if lst else 0"
        },
        {
          question: "What is list comprehension in Python?",
          type: "text",
          correct: "concise way to create lists",
          explanation: "List comprehension provides a concise way to create lists based on existing iterables with optional filtering and transformation.",
          hint: "It's a one-liner alternative to for loops for creating lists.",
          example: "[x**2 for x in range(5)] creates [0, 1, 4, 9, 16]. [x for x in range(10) if x % 2 == 0] creates [0, 2, 4, 6, 8].",
          similarQuestion: "How do you filter even numbers from a list using list comprehension?",
          similarAnswer: "even_nums = [x for x in numbers if x % 2 == 0]"
        },
        {
          question: "What is the difference between a tuple and a list?",
          type: "text",
          correct: "tuple is immutable",
          explanation: "Tuples are immutable (cannot be changed after creation) while lists are mutable (can be modified).",
          hint: "One can be changed after creation, the other cannot.",
          example: "lst = [1, 2, 3]; lst[0] = 5 works. tup = (1, 2, 3); tup[0] = 5 raises TypeError.",
          similarQuestion: "When should you use a tuple instead of a list?",
          similarAnswer: "Use tuples for data that shouldn't change (like coordinates), as dictionary keys, or when you need guaranteed immutability."
        },
        {
          question: "Write code to reverse a string:",
          type: "code",
          correct: "def reverse_string(s):\n    return s[::-1]\n# or:\ndef reverse_string(s):\n    return ''.join(reversed(s))",
          explanation: "Python slice notation s[::-1] reverses a string, or use reversed() function with join().",
          hint: "Use slice notation with step -1 or the reversed() function.",
          example: "reverse_string('hello') returns 'olleh'. 'world'[::-1] also returns 'dlrow'.",
          similarQuestion: "Write code to check if a string is a palindrome:",
          similarAnswer: "def is_palindrome(s):\n    return s == s[::-1]"
        },
        {
          question: "What does the 'break' statement do in a loop?",
          type: "text",
          correct: "exits the loop immediately",
          explanation: "The 'break' statement immediately terminates the current loop and continues with the statement after the loop.",
          hint: "It provides an early exit from a loop.",
          example: "for i in range(10): if i == 5: break; print(i) prints 0,1,2,3,4 then stops.",
          similarQuestion: "What does the 'continue' statement do in a loop?",
          similarAnswer: "The 'continue' statement skips the rest of the current iteration and moves to the next iteration of the loop."
        },
        {
          question: "What is a dictionary in Python?",
          type: "text",
          correct: "key-value data structure",
          explanation: "A dictionary is a mutable data structure that stores data as key-value pairs, where keys must be unique and immutable.",
          hint: "It's like a real dictionary where you look up definitions (values) using words (keys).",
          example: "person = {'name': 'Alice', 'age': 30}. Access with person['name'] returns 'Alice'.",
          similarQuestion: "How do you add a new key-value pair to a dictionary?",
          similarAnswer: "dict[new_key] = new_value or use dict.update({new_key: new_value})"
        },
        {
          question: "Write code to find the maximum element in a list:",
          type: "code",
          correct: "def find_max(lst):\n    if not lst:\n        return None\n    maximum = lst[0]\n    for num in lst[1:]:\n        if num > maximum:\n            maximum = num\n    return maximum\n# or simply: max(lst)",
          explanation: "Compare each element with the current maximum, updating when a larger element is found, or use built-in max().",
          hint: "Keep track of the largest element seen so far, or use Python's max() function.",
          example: "find_max([3, 1, 4, 1, 5, 9]) returns 9. max([3, 1, 4, 1, 5, 9]) also returns 9.",
          similarQuestion: "Write code to find the minimum element in a list:",
          similarAnswer: "def find_min(lst):\n    return min(lst) if lst else None"
        },
        {
          question: "What is the difference between 'append()' and 'extend()' methods?",
          type: "text",
          correct: "append adds one item, extend adds multiple",
          explanation: "append() adds a single element to the end of a list, while extend() adds all elements from an iterable.",
          hint: "One adds a single item, the other adds multiple items from another collection.",
          example: "lst = [1, 2]; lst.append([3, 4]) gives [1, 2, [3, 4]]. lst.extend([3, 4]) gives [1, 2, 3, 4].",
          similarQuestion: "What does the '+' operator do with lists?",
          similarAnswer: "The '+' operator concatenates lists, creating a new list: [1, 2] + [3, 4] returns [1, 2, 3, 4]."
        },
        {
          question: "What is string formatting in Python?",
          type: "text",
          correct: "inserting values into strings",
          explanation: "String formatting allows you to insert variables and expressions into strings using various methods like f-strings, format(), or % formatting.",
          hint: "It's about creating strings with dynamic content.",
          example: "name = 'Alice'; age = 25; f'Hello {name}, you are {age}' gives 'Hello Alice, you are 25'.",
          similarQuestion: "What is an f-string in Python?",
          similarAnswer: "F-strings (formatted string literals) use f'' syntax to embed expressions directly in strings: f'Value is {variable}'."
        },
        {
          question: "Write code to count vowels in a string:",
          type: "code",
          correct: "def count_vowels(s):\n    vowels = 'aeiouAEIOU'\n    count = 0\n    for char in s:\n        if char in vowels:\n            count += 1\n    return count\n# or: sum(1 for char in s if char.lower() in 'aeiou')",
          explanation: "Iterate through the string and count characters that are vowels (both lowercase and uppercase).",
          hint: "Check each character against a string of vowels.",
          example: "count_vowels('Hello World') returns 3 (e, o, o). count_vowels('Python') returns 1 (o, y is not a vowel).",
          similarQuestion: "Write code to count consonants in a string:",
          similarAnswer: "def count_consonants(s):\n    return sum(1 for char in s if char.isalpha() and char.lower() not in 'aeiou')"
        },
        {
          question: "What is exception handling in Python?",
          type: "text",
          correct: "managing runtime errors",
          explanation: "Exception handling allows programs to respond to runtime errors gracefully using try-except blocks instead of crashing.",
          hint: "It's about dealing with errors that occur during program execution.",
          example: "try: result = 10/0; except ZeroDivisionError: print('Cannot divide by zero') handles division by zero error.",
          similarQuestion: "What is the difference between syntax errors and exceptions?",
          similarAnswer: "Syntax errors are detected before the program runs (invalid Python syntax). Exceptions occur during execution (like division by zero)."
        },
        {
          question: "What does the 'len()' function return for different data types?",
          type: "text",
          correct: "number of elements or characters",
          explanation: "len() returns the number of items in a container: characters in strings, elements in lists/tuples, key-value pairs in dictionaries.",
          hint: "It counts the items or elements in a collection.",
          example: "len('hello') = 5, len([1,2,3]) = 3, len({'a':1, 'b':2}) = 2, len((1,2,3,4)) = 4.",
          similarQuestion: "What happens if you use len() on an integer?",
          similarAnswer: "TypeError is raised because integers don't have a length - len() only works on sequences and collections."
        },
        {
          question: "Write code to remove duplicates from a list:",
          type: "code",
          correct: "def remove_duplicates(lst):\n    return list(set(lst))\n# or to preserve order:\ndef remove_duplicates(lst):\n    seen = set()\n    result = []\n    for item in lst:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result",
          explanation: "Use set() to remove duplicates (loses order) or manually track seen items to preserve order.",
          hint: "Sets automatically remove duplicates, or track seen elements manually.",
          example: "remove_duplicates([1,2,2,3,1]) could return [1,2,3] or [1,2,3] (order may vary with set approach).",
          similarQuestion: "How do you check if a list has duplicates?",
          similarAnswer: "len(lst) != len(set(lst)) - if lengths differ, there are duplicates."
        },
        {
          question: "What is the difference between '==' and '!=' operators?",
          type: "text",
          correct: "equal vs not equal",
          explanation: "'==' checks if two values are equal and returns True if they are, '!=' checks if values are not equal.",
          hint: "One tests equality, the other tests inequality.",
          example: "5 == 5 is True, 5 != 5 is False. 'cat' == 'dog' is False, 'cat' != 'dog' is True.",
          similarQuestion: "What are the comparison operators in Python?",
          similarAnswer: "==, !=, <, >, <=, >= for equality, inequality, and ordering comparisons."
        },
        {
          question: "What is a while loop?",
          type: "text",
          correct: "repeats while condition is true",
          explanation: "A while loop repeatedly executes a block of code as long as a specified condition remains true.",
          hint: "It continues looping until the condition becomes false.",
          example: "i = 0; while i < 5: print(i); i += 1 prints 0,1,2,3,4. The condition i < 5 controls the loop.",
          similarQuestion: "What is the difference between while and for loops?",
          similarAnswer: "for loops iterate over sequences/ranges, while loops continue based on a condition. Use for when you know iterations, while for condition-based loops."
        },
        {
          question: "Write code to find factorial using iteration:",
          type: "code",
          correct: "def factorial(n):\n    if n < 0:\n        return None\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result",
          explanation: "Multiply numbers from 1 to n iteratively. Handle edge case of negative numbers.",
          hint: "Start with result = 1 and multiply by each number from 1 to n.",
          example: "factorial(5) = 1*1*2*3*4*5 = 120. factorial(0) = 1 by definition.",
          similarQuestion: "What is the factorial of 0?",
          similarAnswer: "factorial(0) = 1 by mathematical definition (there's exactly one way to arrange zero objects)."
        },
        {
          question: "What is the 'in' operator used for?",
          type: "text",
          correct: "membership testing",
          explanation: "The 'in' operator tests whether a value exists in a sequence (string, list, tuple) or collection (set, dictionary keys).",
          hint: "It checks if something is contained within something else.",
          example: "'a' in 'cat' is True, 5 in [1,2,3] is False, 'key' in {'key': 'value'} is True.",
          similarQuestion: "What does 'not in' operator do?",
          similarAnswer: "'not in' returns True if the value is NOT found in the sequence/collection - opposite of 'in'."
        },
        {
          question: "What is the difference between local and global variables?",
          type: "text",
          correct: "scope and accessibility",
          explanation: "Local variables are defined inside functions and only accessible within that function. Global variables are defined outside functions and accessible throughout the program.",
          hint: "Local variables have limited scope, global variables have program-wide scope.",
          example: "def func(): x = 5 (local). x = 10 (global). Local x only exists inside func(), global x exists everywhere.",
          similarQuestion: "How do you modify a global variable inside a function?",
          similarAnswer: "Use the 'global' keyword: global x; x = new_value inside the function."
        },
        {
          question: "Write code to check if a list is empty:",
          type: "code",
          correct: "def is_empty(lst):\n    return len(lst) == 0\n# or more pythonic:\ndef is_empty(lst):\n    return not lst",
          explanation: "Check if length is 0, or use the fact that empty collections are 'falsy' in Python.",
          hint: "Empty collections evaluate to False in boolean context.",
          example: "is_empty([]) returns True, is_empty([1,2,3]) returns False. 'not []' is True, 'not [1,2,3]' is False.",
          similarQuestion: "How do you check if a string is empty?",
          similarAnswer: "return not string or return len(string) == 0 or return string == ''"
        },
        {
          question: "What is string slicing in Python?",
          type: "text",
          correct: "extracting substring using indices",
          explanation: "String slicing extracts a portion of a string using [start:end:step] notation, where start is inclusive and end is exclusive.",
          hint: "It's like cutting out a piece of the string using index positions.",
          example: "'hello'[1:4] gives 'ell' (indices 1,2,3). 'python'[::2] gives 'pto' (every 2nd character).",
          similarQuestion: "What does negative indexing mean in Python?",
          similarAnswer: "Negative indices count from the end: -1 is last character, -2 is second to last, etc. 'hello'[-1] is 'o'."
        },
        {
          question: "What is the difference between 'print()' and 'return'?",
          type: "text",
          correct: "output vs value",
          explanation: "print() displays output to the console but doesn't provide a value to the program. return gives a value back to the caller.",
          hint: "One shows something to the user, the other gives data back to the program.",
          example: "def func1(): print(5) shows '5' but returns None. def func2(): return 5 gives value 5 back to caller.",
          similarQuestion: "What happens if a function doesn't have a return statement?",
          similarAnswer: "The function returns None by default when it reaches the end without an explicit return statement."
        },
        {
          question: "Write code to convert a string to uppercase:",
          type: "code",
          correct: "def to_uppercase(s):\n    return s.upper()\n# or manually:\ndef to_uppercase(s):\n    result = ''\n    for char in s:\n        if 'a' <= char <= 'z':\n            result += chr(ord(char) - 32)\n        else:\n            result += char\n    return result",
          explanation: "Use the built-in upper() method, or manually convert by adjusting ASCII values for lowercase letters.",
          hint: "Python strings have a built-in upper() method.",
          example: "'hello world'.upper() returns 'HELLO WORLD'. to_uppercase('Python') returns 'PYTHON'.",
          similarQuestion: "How do you convert a string to lowercase?",
          similarAnswer: "Use s.lower() method: 'HELLO'.lower() returns 'hello'."
        },
        {
          question: "What is type conversion (casting) in Python?",
          type: "text",
          correct: "changing data type",
          explanation: "Type conversion changes a value from one data type to another using functions like int(), float(), str(), list(), etc.",
          hint: "It's about transforming data from one type to another.",
          example: "int('123') converts string to integer 123. str(456) converts integer to string '456'. float('3.14') converts to 3.14.",
          similarQuestion: "What happens if you try to convert an invalid string to int?",
          similarAnswer: "ValueError is raised: int('abc') raises ValueError because 'abc' is not a valid integer representation."
        },
        {
          question: "What is the range() function?",
          type: "text",
          correct: "generates sequence of numbers",
          explanation: "range() generates a sequence of numbers, commonly used in for loops. Can specify start, stop, and step values.",
          hint: "It creates a sequence of numbers for iteration.",
          example: "range(5) gives 0,1,2,3,4. range(2,8) gives 2,3,4,5,6,7. range(0,10,2) gives 0,2,4,6,8.",
          similarQuestion: "What are the parameters of the range() function?",
          similarAnswer: "range(stop), range(start, stop), or range(start, stop, step). Start defaults to 0, step defaults to 1."
        },
        {
          question: "Write code to find the index of an element in a list:",
          type: "code",
          correct: "def find_index(lst, element):\n    try:\n        return lst.index(element)\n    except ValueError:\n        return -1\n# or manually:\ndef find_index(lst, element):\n    for i, item in enumerate(lst):\n        if item == element:\n            return i\n    return -1",
          explanation: "Use the built-in index() method with exception handling, or manually search using enumerate().",
          hint: "The index() method raises ValueError if element not found.",
          example: "[1,2,3,2].index(2) returns 0 (first occurrence). find_index([1,2,3], 5) returns -1 (not found).",
          similarQuestion: "How do you find all indices of an element in a list?",
          similarAnswer: "indices = [i for i, x in enumerate(lst) if x == element]"
        }
      ],
      'problem-solving': [
        {
          question: "What is the first step in problem-solving methodology?",
          type: "multiple-choice",
          options: ["Write code", "Test solution", "Understand the problem", "Choose algorithm"],
          correct: "Understand the problem",
          explanation: "Before solving any problem, you must first clearly understand what is being asked and what the requirements are.",
          hint: "You can't solve what you don't understand.",
          example: "Problem: 'Find average student grade.' First understand: How many students? What grade format? Include/exclude failed students? Only then plan solution.",
          similarQuestion: "What is the last step in problem-solving methodology?",
          similarAnswer: "Test and validate the solution - ensure it works correctly for all expected inputs and edge cases."
        },
        {
          question: "Which approach breaks a complex problem into smaller, manageable parts?",
          type: "text",
          correct: "divide and conquer",
          explanation: "Divide and conquer is a problem-solving strategy that breaks complex problems into smaller, more manageable subproblems.",
          hint: "Think about how you might tackle a large project by breaking it into smaller tasks.",
          example: "Building a house: divide into foundation, framing, plumbing, electrical, finishing. Each part is manageable and can be worked on separately.",
          similarQuestion: "What approach solves problems by building up from the simplest cases?",
          similarAnswer: "bottom-up approach - start with the simplest subproblems and gradually build up to solve the complete problem."
        },
        {
          question: "What is pseudocode used for?",
          type: "multiple-choice",
          options: ["Running programs", "Planning algorithm logic", "Debugging code", "Testing software"],
          correct: "Planning algorithm logic",
          explanation: "Pseudocode is a high-level description of an algorithm's logic using natural language and programming concepts.",
          hint: "It's like writing a recipe before cooking - planning the steps.",
          example: "Pseudocode for finding max: SET max = first number; FOR each remaining number; IF number > max THEN SET max = number; OUTPUT max.",
          similarQuestion: "What is a flowchart used for?",
          similarAnswer: "Visualizing algorithm flow and decision-making process using graphical symbols and connecting lines."
        },
        {
          question: "Write pseudocode for checking if a number is even:",
          type: "code",
          correct: "INPUT number\nIF number MOD 2 = 0 THEN\n    OUTPUT \"Even\"\nELSE\n    OUTPUT \"Odd\"\nEND IF",
          explanation: "This pseudocode uses the modulo operation to check if a number is divisible by 2 (even) or not (odd).",
          hint: "Even numbers are divisible by 2 with no remainder.",
          example: "For input 4: 4 MOD 2 = 0, so output 'Even'. For input 7: 7 MOD 2 = 1, so output 'Odd'.",
          similarQuestion: "Write pseudocode for checking if a number is positive:",
          similarAnswer: "INPUT number\nIF number > 0 THEN\n    OUTPUT \"Positive\"\nELSE IF number < 0 THEN\n    OUTPUT \"Negative\"\nELSE\n    OUTPUT \"Zero\"\nEND IF"
        },
        {
          question: "What debugging technique involves adding print statements to track program execution?",
          type: "text",
          correct: "trace debugging",
          explanation: "Trace debugging involves adding output statements to follow the program's execution path and variable values.",
          hint: "Think about leaving breadcrumbs to see where your program goes.",
          example: "def calculate(x): print(f'Input: {x}'); result = x * 2; print(f'Result: {result}'); return result. Shows program flow.",
          similarQuestion: "What debugging technique involves stepping through code line by line?",
          similarAnswer: "step debugging or single-step debugging - using a debugger to execute code one line at a time."
        },
        {
          question: "What is the purpose of flowcharts in problem solving?",
          type: "multiple-choice",
          options: ["Write final code", "Visualize algorithm flow", "Test programs", "Store data"],
          correct: "Visualize algorithm flow",
          explanation: "Flowcharts provide a visual representation of the algorithm's logic and decision flow.",
          hint: "They help you see the path your algorithm takes through different decisions.",
          example: "ATM flowchart: Start → Insert card → Enter PIN → Correct? → Yes: Menu / No: Try again → Select transaction → etc.",
          similarQuestion: "What is the purpose of pseudocode in problem solving?",
          similarAnswer: "Planning and describing algorithm logic in plain language before writing actual code."
        },
        {
          question: "What is abstraction in problem solving?",
          type: "text",
          correct: "hiding unnecessary details",
          explanation: "Abstraction involves hiding complex implementation details and focusing on the essential features of a problem.",
          hint: "It's about focusing on what matters and ignoring irrelevant details.",
          example: "Driving a car: you use steering wheel, pedals, gear shift (abstraction) without knowing engine internals, transmission mechanics, etc.",
          similarQuestion: "What is decomposition in problem solving?",
          similarAnswer: "Breaking down a complex problem into smaller, more manageable sub-problems that are easier to solve."
        },
        {
          question: "Write pseudocode for finding the largest number in a list:",
          type: "code",
          correct: "SET largest = first element\nFOR each element in list\n    IF element > largest THEN\n        SET largest = element\nEND FOR\nOUTPUT largest",
          explanation: "This pseudocode iterates through the list, keeping track of the largest element found so far.",
          hint: "Start with the first element as largest, then compare with each remaining element.",
          example: "List [3, 7, 2, 9, 1]: largest=3, check 7 (7>3, so largest=7), check 2 (2<7), check 9 (9>7, so largest=9), check 1 (1<9). Result: 9.",
          similarQuestion: "Write pseudocode for finding the smallest number in a list:",
          similarAnswer: "SET smallest = first element\nFOR each element in list\n    IF element < smallest THEN\n        SET smallest = element\nEND FOR\nOUTPUT smallest"
        },
        {
          question: "What is a test case in problem solving?",
          type: "multiple-choice",
          options: ["A bug in code", "Input/output example", "A programming language", "A debugging tool"],
          correct: "Input/output example",
          explanation: "A test case is a specific input with its expected output, used to verify that a solution works correctly.",
          hint: "It's an example that shows what input should produce what output.",
          example: "Function add(a,b): Test case 1: input (2,3), expected output 5. Test case 2: input (-1,1), expected output 0.",
          similarQuestion: "What is a boundary test case?",
          similarAnswer: "A test case that uses extreme or edge values like minimum, maximum, or boundary conditions to test limits."
        },
        {
          question: "What is the difference between syntax errors and logic errors?",
          type: "text",
          correct: "syntax errors break rules, logic errors give wrong results",
          explanation: "Syntax errors violate language rules and prevent compilation, while logic errors produce incorrect results despite valid syntax.",
          hint: "One breaks language rules, the other gives wrong answers.",
          example: "Syntax error: 'print(hello' (missing closing parenthesis). Logic error: calculating area with 'area = length + width' instead of 'length * width'.",
          similarQuestion: "What is the difference between compile-time and runtime errors?",
          similarAnswer: "Compile-time errors are caught during compilation (like syntax errors); runtime errors occur during program execution (like division by zero)."
        },
        {
          question: "What is top-down design?",
          type: "multiple-choice",
          options: ["Starting with details", "Starting with main problem", "Random approach", "Bottom-up method"],
          correct: "Starting with main problem",
          explanation: "Top-down design starts with the main problem and progressively breaks it down into smaller subproblems.",
          hint: "You start with the big picture and work your way down to details.",
          example: "Design student management system: Start with 'Manage Students' → break into 'Add Student', 'View Students', 'Update Grades' → further break each down.",
          similarQuestion: "What is bottom-up design?",
          similarAnswer: "Starting with small, basic components and combining them to build larger, more complex systems."
        },
        {
          question: "What is modular programming?",
          type: "text",
          correct: "dividing program into modules",
          explanation: "Modular programming involves dividing a program into separate modules or functions, each handling a specific task.",
          hint: "It's about breaking your program into smaller, manageable pieces.",
          example: "Calculator program: separate modules for add(), subtract(), multiply(), divide(), displayMenu(), getInput(). Each module has one responsibility.",
          similarQuestion: "What is structured programming?",
          similarAnswer: "A programming paradigm that uses structured control flow constructs (sequence, selection, iteration) instead of goto statements."
        },
        {
          question: "Write pseudocode for a simple calculator:",
          type: "code",
          correct: "INPUT num1, operator, num2\nIF operator = '+' THEN\n    result = num1 + num2\nELSE IF operator = '-' THEN\n    result = num1 - num2\nELSE IF operator = '*' THEN\n    result = num1 * num2\nELSE IF operator = '/' THEN\n    result = num1 / num2\nOUTPUT result",
          explanation: "This pseudocode shows the logic for a basic calculator that performs arithmetic operations based on user input.",
          hint: "Use conditional statements to handle different operations based on the operator.",
          example: "Input: 10, '+', 5 → result = 10 + 5 = 15. Input: 8, '*', 3 → result = 8 * 3 = 24.",
          similarQuestion: "Write pseudocode for finding factorial of a number:",
          similarAnswer: "INPUT n\nSET factorial = 1\nFOR i = 1 to n\n    factorial = factorial * i\nEND FOR\nOUTPUT factorial"
        },
        {
          question: "What is boundary testing?",
          type: "multiple-choice",
          options: ["Testing normal cases", "Testing edge cases", "Testing random inputs", "Testing syntax"],
          correct: "Testing edge cases",
          explanation: "Boundary testing involves testing the extreme or edge cases of input ranges to ensure the program handles them correctly.",
          hint: "It's about testing the limits - minimum, maximum, and boundary values.",
          example: "Function accepts ages 0-120: test with -1 (below min), 0 (min), 120 (max), 121 (above max), typical values like 25.",
          similarQuestion: "What is stress testing?",
          similarAnswer: "Testing a system with extreme loads or volumes of data to see how it performs under maximum expected conditions."
        },
        {
          question: "What is stepwise refinement?",
          type: "text",
          correct: "gradually adding detail",
          explanation: "Stepwise refinement is the process of gradually adding more detail to a solution, starting from a high-level description.",
          hint: "You start with a rough outline and progressively add more specific details.",
          example: "1. 'Sort list' → 2. 'Compare adjacent elements and swap if needed' → 3. 'FOR i=0 to n-1: FOR j=0 to n-2: IF arr[j]>arr[j+1] SWAP'",
          similarQuestion: "What is incremental development?",
          similarAnswer: "Building software by adding small pieces of functionality one at a time, testing each addition before proceeding."
        },
        {
          question: "What is the purpose of tracing an algorithm?",
          type: "multiple-choice",
          options: ["Write code faster", "Follow execution step by step", "Find syntax errors", "Optimize performance"],
          correct: "Follow execution step by step",
          explanation: "Tracing involves manually following the algorithm's execution step by step to understand its behavior and verify correctness.",
          hint: "It's like walking through your algorithm manually to see what happens.",
          example: "Trace bubble sort on [3,1,2]: Step 1: compare 3,1 (swap) → [1,3,2]. Step 2: compare 3,2 (swap) → [1,2,3]. Continue until no swaps.",
          similarQuestion: "What is the purpose of desk checking?",
          similarAnswer: "Manually reviewing code or algorithms before execution to catch errors and verify logic without running the program."
        },
        {
          question: "What is defensive programming?",
          type: "text",
          correct: "anticipating errors",
          explanation: "Defensive programming involves writing code that anticipates and handles potential errors or unexpected inputs gracefully.",
          hint: "It's about protecting your program against things that could go wrong.",
          example: "def divide(a,b): if b == 0: return 'Error: Division by zero'; return a/b. Checks for zero before dividing.",
          similarQuestion: "What is robust programming?",
          similarAnswer: "Writing programs that continue to function correctly even when encountering unexpected inputs or conditions."
        },
        {
          question: "Write pseudocode for input validation:",
          type: "code",
          correct: "REPEAT\n    INPUT value\n    IF value is valid THEN\n        EXIT loop\n    ELSE\n        OUTPUT \"Invalid input, try again\"\nUNTIL valid input received",
          explanation: "This pseudocode shows how to repeatedly ask for input until a valid value is provided.",
          hint: "Keep asking for input until you get something valid.",
          example: "Getting age: Input: -5 → 'Invalid, try again'. Input: 200 → 'Invalid, try again'. Input: 25 → Valid, continue.",
          similarQuestion: "Write pseudocode for menu-driven program:",
          similarAnswer: "REPEAT\n    DISPLAY menu options\n    INPUT choice\n    CASE choice OF\n        1: call function1\n        2: call function2\n        0: EXIT\n        default: \"Invalid choice\"\nUNTIL choice = 0"
        },
        {
          question: "What is code review in problem solving?",
          type: "multiple-choice",
          options: ["Writing new code", "Examining code for errors", "Deleting old code", "Running programs"],
          correct: "Examining code for errors",
          explanation: "Code review is the systematic examination of code to find bugs, improve quality, and ensure it meets requirements.",
          hint: "It's like proofreading your code to catch mistakes and improve quality.",
          example: "Review checklist: Are variable names clear? Are edge cases handled? Is the algorithm efficient? Are there any potential bugs?",
          similarQuestion: "What is pair programming?",
          similarAnswer: "Two programmers working together at one computer, with one writing code while the other reviews and suggests improvements."
        },
        {
          question: "What is the purpose of documentation in problem solving?",
          type: "text",
          correct: "explain how solution works",
          explanation: "Documentation explains how the solution works, making it easier for others (and yourself) to understand and maintain the code.",
          hint: "It's about explaining your solution so others can understand it.",
          example: "Function comment: 'Calculates compound interest. Parameters: principal (initial amount), rate (annual %), years. Returns: final amount.'",
          similarQuestion: "What is the purpose of comments in code?",
          similarAnswer: "Explaining what the code does, why certain decisions were made, and how complex parts work for future reference."
        }
      ],
      'computer-systems': [
        {
          question: "What is the main function of the CPU?",
          type: "multiple-choice",
          options: ["Store data permanently", "Execute instructions", "Display graphics", "Connect to internet"],
          correct: "Execute instructions",
          explanation: "The CPU (Central Processing Unit) is responsible for executing program instructions and performing calculations.",
          hint: "Think about what the 'processor' in your computer does.",
          example: "CPU executes instructions like: LOAD data from memory → ADD two numbers → STORE result back to memory → JUMP to next instruction.",
          similarQuestion: "What is the main function of the GPU?",
          similarAnswer: "Process graphics and visual data - specialized for parallel processing of graphics calculations and rendering."
        },
        {
          question: "Which type of memory is volatile?",
          type: "multiple-choice",
          options: ["Hard Disk", "SSD", "RAM", "ROM"],
          correct: "RAM",
          explanation: "RAM (Random Access Memory) is volatile memory that loses its contents when power is turned off.",
          hint: "Volatile means it disappears when the power goes off.",
          example: "When you turn off computer: RAM loses all data (unsaved work disappears), but hard disk keeps files permanently.",
          similarQuestion: "Which type of memory is non-volatile?",
          similarAnswer: "ROM (Read-Only Memory) - retains its contents even when power is turned off, like BIOS firmware."
        },
        {
          question: "What does HTTP stand for?",
          type: "text",
          correct: "HyperText Transfer Protocol",
          explanation: "HTTP is the protocol used for transferring web pages and other resources over the internet.",
          hint: "It's the protocol that makes the web work.",
          example: "When you type www.google.com, your browser uses HTTP to request the webpage from Google's servers and receive the HTML response.",
          similarQuestion: "What does HTTPS stand for?",
          similarAnswer: "HyperText Transfer Protocol Secure - HTTP with SSL/TLS encryption for secure communication."
        },
        {
          question: "Convert the binary number 1011 to decimal:",
          type: "text",
          correct: "11",
          explanation: "1011 in binary = 1×8 + 0×4 + 1×2 + 1×1 = 8 + 0 + 2 + 1 = 11 in decimal.",
          hint: "Remember binary uses powers of 2: 8, 4, 2, 1 for 4-digit numbers.",
          example: "1011: rightmost 1 = 1×1=1, next 1 = 1×2=2, next 0 = 0×4=0, leftmost 1 = 1×8=8. Sum: 8+0+2+1=11.",
          similarQuestion: "Convert the binary number 1101 to decimal:",
          similarAnswer: "13 - (1×8 + 1×4 + 0×2 + 1×1 = 8 + 4 + 0 + 1 = 13)"
        },
        {
          question: "What is the purpose of an operating system?",
          type: "multiple-choice",
          options: ["Edit documents", "Manage hardware and software", "Browse internet", "Play games"],
          correct: "Manage hardware and software",
          explanation: "The operating system manages computer hardware, software resources, and provides services for computer programs.",
          hint: "Think of it as the manager that coordinates everything in your computer.",
          example: "OS manages: CPU time allocation between programs, memory distribution, file storage, device drivers for keyboard/mouse, network connections.",
          similarQuestion: "What is the purpose of device drivers?",
          similarAnswer: "Translate between the operating system and specific hardware devices, allowing the OS to communicate with hardware."
        },
        {
          question: "What is the difference between 32-bit and 64-bit systems?",
          type: "text",
          correct: "data processing width",
          explanation: "32-bit and 64-bit refer to the width of data that the processor can handle in a single operation.",
          hint: "It's about how much data can be processed at once.",
          example: "32-bit CPU processes 32 bits at once (max 4GB RAM), 64-bit CPU processes 64 bits at once (supports much more RAM, faster processing).",
          similarQuestion: "What is the difference between single-core and multi-core processors?",
          similarAnswer: "Single-core has one processing unit; multi-core has multiple processing units that can work simultaneously on different tasks."
        },
        {
          question: "Which component stores the BIOS?",
          type: "multiple-choice",
          options: ["RAM", "Hard Drive", "ROM", "Cache"],
          correct: "ROM",
          explanation: "BIOS (Basic Input/Output System) is stored in ROM (Read-Only Memory) so it's available when the computer starts.",
          hint: "BIOS needs to be available even when the computer is first turned on.",
          example: "When you press power button: ROM contains BIOS that checks hardware, initializes components, then loads OS from hard drive into RAM.",
          similarQuestion: "Which component stores the operating system?",
          similarAnswer: "Hard Drive or SSD - non-volatile storage that retains the OS files when power is off."
        },
        {
          question: "What is virtual memory?",
          type: "text",
          correct: "disk space used as RAM",
          explanation: "Virtual memory uses disk space to extend the apparent amount of RAM, allowing programs to use more memory than physically available.",
          hint: "It's a way to make your computer think it has more RAM than it actually does.",
          example: "Computer with 4GB RAM running programs needing 6GB: OS uses 2GB of hard disk space as 'virtual RAM' to supplement physical RAM.",
          similarQuestion: "What is cache memory?",
          similarAnswer: "Very fast temporary storage between CPU and RAM that stores frequently accessed data for quick retrieval."
        },
        {
          question: "Convert decimal 25 to binary:",
          type: "text",
          correct: "11001",
          explanation: "25 in decimal = 16 + 8 + 1 = 10000 + 1000 + 1 = 11001 in binary.",
          hint: "Divide by 2 repeatedly and read remainders bottom to top, or use powers of 2.",
          example: "25 ÷ 2 = 12 remainder 1, 12 ÷ 2 = 6 remainder 0, 6 ÷ 2 = 3 remainder 0, 3 ÷ 2 = 1 remainder 1, 1 ÷ 2 = 0 remainder 1. Read up: 11001.",
          similarQuestion: "Convert decimal 15 to binary:",
          similarAnswer: "1111 - (15 = 8 + 4 + 2 + 1, so 1111 in binary)"
        },
        {
          question: "What is cache memory?",
          type: "multiple-choice",
          options: ["Permanent storage", "Fast temporary storage", "Graphics memory", "Network storage"],
          correct: "Fast temporary storage",
          explanation: "Cache memory is very fast temporary storage that keeps frequently accessed data close to the CPU.",
          hint: "It's like keeping frequently used items on your desk for quick access.",
          example: "CPU needs data from RAM (slow). Cache stores recently used data. If data is in cache (cache hit), access is much faster than going to RAM.",
          similarQuestion: "What is buffer memory?",
          similarAnswer: "Temporary storage area that holds data while it's being transferred between devices with different speeds."
        },
        {
          question: "What does URL stand for?",
          type: "text",
          correct: "Uniform Resource Locator",
          explanation: "URL is the address used to locate resources on the internet, like web pages, images, or files.",
          hint: "It's the web address you type in your browser.",
          example: "https://www.example.com/page.html - 'https' is protocol, 'www.example.com' is domain, '/page.html' is specific resource path.",
          similarQuestion: "What does IP stand for?",
          similarAnswer: "Internet Protocol - the standard that governs how data packets are sent across networks."
        },
        {
          question: "Which protocol is used for email?",
          type: "multiple-choice",
          options: ["HTTP", "FTP", "SMTP", "TCP"],
          correct: "SMTP",
          explanation: "SMTP (Simple Mail Transfer Protocol) is used for sending email messages between servers.",
          hint: "Think about protocols specifically designed for mail transfer.",
          example: "Sending email: Your email client uses SMTP to send message to your email server, which uses SMTP to forward it to recipient's email server.",
          similarQuestion: "Which protocol is used for file transfer?",
          similarAnswer: "FTP (File Transfer Protocol) - designed specifically for transferring files between computers over a network."
        },
        {
          question: "What is the purpose of a compiler?",
          type: "text",
          correct: "translate source code to machine code",
          explanation: "A compiler translates high-level source code written by programmers into machine code that computers can execute.",
          hint: "It's like a translator that converts human-readable code to computer-readable code.",
          example: "C++ code 'cout << \"Hello\";' is compiled into machine code like '10110001 01000000...' that CPU can directly execute.",
          similarQuestion: "What is the purpose of an interpreter?",
          similarAnswer: "Execute high-level code line by line without first translating it to machine code, like Python interpreter."
        },
        {
          question: "What is bandwidth in networking?",
          type: "multiple-choice",
          options: ["Physical width of cables", "Amount of data transmitted per unit time", "Number of connections", "Signal strength"],
          correct: "Amount of data transmitted per unit time",
          explanation: "Bandwidth refers to the maximum amount of data that can be transmitted over a network connection in a given time period.",
          hint: "Think of it like the width of a highway - more lanes allow more traffic.",
          example: "100 Mbps bandwidth = 100 megabits per second. Like a highway: more bandwidth = more data can travel simultaneously.",
          similarQuestion: "What is latency in networking?",
          similarAnswer: "The time delay between sending a request and receiving a response, measured in milliseconds."
        },
        {
          question: "What is the difference between hardware and software?",
          type: "text",
          correct: "hardware is physical, software is logical",
          explanation: "Hardware consists of physical components you can touch, while software consists of programs and instructions.",
          hint: "One you can touch, the other you can't.",
          example: "Hardware: CPU chip, RAM modules, hard drive, keyboard. Software: Windows OS, Microsoft Word, games, device drivers.",
          similarQuestion: "What is the difference between system software and application software?",
          similarAnswer: "System software manages computer resources (like OS); application software performs specific tasks for users (like games, word processors)."
        },
        {
          question: "What is a network topology?",
          type: "multiple-choice",
          options: ["Network speed", "Network layout structure", "Network protocol", "Network security"],
          correct: "Network layout structure",
          explanation: "Network topology refers to the physical or logical layout of network components and their connections.",
          hint: "It's about how network devices are arranged and connected.",
          example: "Star topology: all devices connect to central hub. Ring topology: devices connected in circle. Bus topology: all devices on single cable.",
          similarQuestion: "What is a network protocol?",
          similarAnswer: "A set of rules that govern how data is transmitted and received over a network, like HTTP, TCP/IP."
        },
        {
          question: "What is the hexadecimal equivalent of decimal 255?",
          type: "text",
          correct: "FF",
          explanation: "255 in decimal equals FF in hexadecimal (15×16 + 15 = 240 + 15 = 255).",
          hint: "Hexadecimal uses base 16, with digits 0-9 and letters A-F.",
          example: "255 ÷ 16 = 15 remainder 15. 15 ÷ 16 = 0 remainder 15. Remainders 15,15 = F,F in hex = FF.",
          similarQuestion: "What is the hexadecimal equivalent of decimal 16?",
          similarAnswer: "10 - (16 ÷ 16 = 1 remainder 0, so 10 in hexadecimal)"
        },
        {
          question: "What is interrupt handling?",
          type: "text",
          correct: "responding to hardware signals",
          explanation: "Interrupt handling is the process by which the CPU responds to signals from hardware devices that need immediate attention.",
          hint: "It's like answering the phone when it rings - stopping what you're doing to handle something urgent.",
          example: "Keyboard interrupt: when you press a key, keyboard sends interrupt signal to CPU, CPU pauses current task, processes keypress, then resumes.",
          similarQuestion: "What is multitasking in operating systems?",
          similarAnswer: "Running multiple programs simultaneously by rapidly switching CPU time between different processes."
        },
        {
          question: "Which layer of the OSI model handles routing?",
          type: "multiple-choice",
          options: ["Physical", "Data Link", "Network", "Transport"],
          correct: "Network",
          explanation: "The Network layer (Layer 3) of the OSI model is responsible for routing packets between different networks.",
          hint: "Think about which layer deals with finding paths between networks.",
          example: "When sending data from New York to London: Network layer determines best route through multiple routers and networks to reach destination.",
          similarQuestion: "Which layer of the OSI model handles error detection and correction?",
          similarAnswer: "Data Link layer (Layer 2) - ensures reliable transmission of data frames between directly connected nodes."
        },
        {
          question: "What is the purpose of DNS?",
          type: "text",
          correct: "translate domain names to IP addresses",
          explanation: "DNS (Domain Name System) translates human-readable domain names like google.com into IP addresses that computers use.",
          hint: "It's like a phone book that converts names to numbers.",
          example: "Type 'google.com': DNS looks up and returns IP address like 172.217.14.14, then your browser connects to that IP address.",
          similarQuestion: "What is the purpose of DHCP?",
          similarAnswer: "Automatically assign IP addresses and network configuration to devices when they connect to a network."
        }
      ],
      'coding-practice': [
        {
          question: "Write a program to check if a string is a palindrome:",
          type: "code",
          correct: "def is_palindrome(s):\n    s = s.lower().replace(' ', '')\n    return s == s[::-1]",
          explanation: "This function converts the string to lowercase, removes spaces, and checks if it reads the same forwards and backwards.",
          hint: "A palindrome reads the same forwards and backwards, like 'level' or 'A man a plan a canal Panama'.",
          example: "'Racecar' → 'racecar' → compare with 'racecar'[::-1] = 'racecar' → True. 'hello' → compare with 'olleh' → False.",
          similarQuestion: "Write a program to check if a number is a palindrome:",
          similarAnswer: "def is_palindrome_number(n):\n    s = str(n)\n    return s == s[::-1]"
        },
        {
          question: "What will this code print?\nx = 5\ny = x\ny = 10\nprint(x)",
          type: "text",
          correct: "5",
          explanation: "x remains 5 because when we assign y = x, we copy the value, not create a reference. Changing y doesn't affect x.",
          hint: "Think about whether changing one variable affects another after assignment.",
          example: "Step by step: x=5, y=5 (copy of x), y=10 (changes y only), print(x) shows 5. Variables store independent copies of values.",
          similarQuestion: "What will this code print?\na = [1, 2]\nb = a\nb.append(3)\nprint(a)",
          similarAnswer: "[1, 2, 3] - because lists are mutable objects, b and a refer to the same list in memory."
        },
        {
          question: "Write a function to find the sum of all numbers in a list:",
          type: "code",
          correct: "def sum_list(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total",
          explanation: "This function iterates through each number in the list and adds it to a running total.",
          hint: "Start with a total of 0 and add each number to it.",
          example: "sum_list([1, 2, 3, 4]): total=0, add 1 (total=1), add 2 (total=3), add 3 (total=6), add 4 (total=10). Return 10.",
          similarQuestion: "Write a function to find the product of all numbers in a list:",
          similarAnswer: "def product_list(numbers):\n    product = 1\n    for num in numbers:\n        product *= num\n    return product"
        },
        {
          question: "Which loop is best when you know exactly how many times to iterate?",
          type: "multiple-choice",
          options: ["while loop", "for loop", "do-while loop", "infinite loop"],
          correct: "for loop",
          explanation: "For loops are ideal when you know the exact number of iterations needed, such as processing each item in a collection.",
          hint: "Think about counting from 1 to 10 - which loop would you use?",
          example: "Print numbers 1-5: for i in range(1, 6): print(i). You know exactly 5 iterations needed.",
          similarQuestion: "Which loop is best when you don't know how many times to iterate?",
          similarAnswer: "while loop - continues until a condition becomes false, useful when the number of iterations is unknown."
        },
        {
          question: "What is the output of this code?\nprint(2 ** 3)",
          type: "text",
          correct: "8",
          explanation: "The ** operator is exponentiation in Python. 2**3 means 2 raised to the power of 3, which equals 8.",
          hint: "** means 'raised to the power of' in Python.",
          example: "2**3 = 2×2×2 = 8. Similarly: 3**2 = 9, 5**0 = 1, 10**3 = 1000.",
          similarQuestion: "What is the output of this code?\nprint(3 ** 2)",
          similarAnswer: "9 - 3 raised to the power of 2 equals 3×3 = 9."
        },
        {
          question: "Write a function to find all prime numbers up to n:",
          type: "code",
          correct: "def find_primes(n):\n    primes = []\n    for num in range(2, n+1):\n        is_prime = True\n        for i in range(2, int(num**0.5)+1):\n            if num % i == 0:\n                is_prime = False\n                break\n        if is_prime:\n            primes.append(num)\n    return primes",
          explanation: "This function checks each number from 2 to n for primality by testing divisibility up to its square root.",
          hint: "A prime number is only divisible by 1 and itself. Check divisibility up to the square root.",
          example: "find_primes(10): check 2 (prime), 3 (prime), 4 (4%2=0, not prime), 5 (prime), 6 (6%2=0, not prime), 7 (prime), 8 (8%2=0, not prime), 9 (9%3=0, not prime), 10 (10%2=0, not prime). Result: [2,3,5,7].",
          similarQuestion: "Write a function to check if a single number is prime:",
          similarAnswer: "def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5)+1):\n        if n % i == 0:\n            return False\n    return True"
        },
        {
          question: "What is the output of: len([1, 2, 3, [4, 5]])?",
          type: "multiple-choice",
          options: ["5", "4", "3", "Error"],
          correct: "4",
          explanation: "The len() function returns the number of top-level elements. The nested list [4, 5] counts as one element.",
          hint: "Count the top-level items, not the nested ones.",
          example: "List has 4 top-level elements: 1, 2, 3, and [4,5]. The nested list [4,5] is treated as a single element.",
          similarQuestion: "What is the output of: len('hello')?",
          similarAnswer: "5 - counts the number of characters in the string 'hello'."
        },
        {
          question: "Write a function to remove duplicates from a list:",
          type: "code",
          correct: "def remove_duplicates(lst):\n    return list(set(lst))",
          explanation: "Converting to a set removes duplicates, then converting back to a list preserves the data type.",
          hint: "Sets automatically remove duplicates. Convert list to set, then back to list.",
          example: "remove_duplicates([1,2,2,3,1]): set({1,2,3}) removes duplicates, list([1,2,3]) converts back. Note: order may change.",
          similarQuestion: "Write a function to remove duplicates while preserving order:",
          similarAnswer: "def remove_duplicates_ordered(lst):\n    seen = set()\n    result = []\n    for item in lst:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result"
        },
        {
          question: "What is the difference between append() and extend() in Python lists?",
          type: "text",
          correct: "append adds single item, extend adds multiple items",
          explanation: "append() adds a single item to the end of the list, while extend() adds all items from an iterable to the list.",
          hint: "One adds one thing, the other adds many things at once.",
          example: "lst=[1,2]; lst.append([3,4]) → [1,2,[3,4]]. lst=[1,2]; lst.extend([3,4]) → [1,2,3,4].",
          similarQuestion: "What is the difference between append() and insert() in Python lists?",
          similarAnswer: "append() adds item at the end; insert() adds item at a specific position, like lst.insert(1, 'x') inserts 'x' at index 1."
        },
        {
          question: "Write a function to count occurrences of each character in a string:",
          type: "code",
          correct: "def count_chars(s):\n    count = {}\n    for char in s:\n        count[char] = count.get(char, 0) + 1\n    return count",
          explanation: "This function uses a dictionary to count each character, using get() to handle new characters.",
          hint: "Use a dictionary where keys are characters and values are counts.",
          example: "count_chars('hello'): h:1, e:1, l:2, o:1. Dictionary: {'h':1, 'e':1, 'l':2, 'o':1}.",
          similarQuestion: "Write a function to count occurrences of each word in a sentence:",
          similarAnswer: "def count_words(sentence):\n    words = sentence.split()\n    count = {}\n    for word in words:\n        count[word] = count.get(word, 0) + 1\n    return count"
        },
        {
          question: "What is the output of: 'hello'.upper().replace('L', 'X')?",
          type: "text",
          correct: "HEXXO",
          explanation: "First 'hello' becomes 'HELLO', then each 'L' is replaced with 'X' to get 'HEXXO'.",
          hint: "Apply the operations in order: first upper(), then replace().",
          example: "'hello' → upper() → 'HELLO' → replace('L','X') → 'HEXXO'. Two L's become two X's.",
          similarQuestion: "What is the output of: 'WORLD'.lower().replace('o', '0')?",
          similarAnswer: "'w0rld' - converts to lowercase 'world', then replaces 'o' with '0' to get 'w0rld'."
        },
        {
          question: "Write a function to find the second largest number in a list:",
          type: "code",
          correct: "def second_largest(lst):\n    unique_nums = list(set(lst))\n    unique_nums.sort(reverse=True)\n    return unique_nums[1] if len(unique_nums) > 1 else None",
          explanation: "This function removes duplicates, sorts in descending order, and returns the second element.",
          hint: "Remove duplicates first, then sort and pick the second largest.",
          example: "second_largest([3,1,4,1,5]): unique=[3,1,4,5], sorted=[5,4,3,1], second=4.",
          similarQuestion: "Write a function to find the smallest number in a list:",
          similarAnswer: "def find_smallest(lst):\n    return min(lst) if lst else None"
        },
        {
          question: "What does the zip() function do?",
          type: "multiple-choice",
          options: ["Compresses files", "Combines iterables", "Sorts lists", "Removes duplicates"],
          correct: "Combines iterables",
          explanation: "zip() combines multiple iterables element-wise, creating tuples of corresponding elements.",
          hint: "Think of a zipper - it combines two sides element by element.",
          example: "zip([1,2,3], ['a','b','c']) → [(1,'a'), (2,'b'), (3,'c')]. Pairs up corresponding elements.",
          similarQuestion: "What does the enumerate() function do?",
          similarAnswer: "Returns pairs of (index, value) for each element in an iterable, like enumerate(['a','b']) → [(0,'a'), (1,'b')]."
        },
        {
          question: "Write a function to check if two strings are anagrams:",
          type: "code",
          correct: "def are_anagrams(str1, str2):\n    return sorted(str1.lower()) == sorted(str2.lower())",
          explanation: "Anagrams have the same characters in different order. Sorting both strings should give the same result.",
          hint: "Anagrams have the same letters. Sort both strings and compare.",
          example: "are_anagrams('listen', 'silent'): sorted('listen')='eilnst', sorted('silent')='eilnst'. Same → True.",
          similarQuestion: "Write a function to check if two lists have the same elements:",
          similarAnswer: "def same_elements(list1, list2):\n    return sorted(list1) == sorted(list2)"
        },
        {
          question: "What is the output of: [1, 2, 3] + [4, 5]?",
          type: "text",
          correct: "[1, 2, 3, 4, 5]",
          explanation: "The + operator concatenates lists, creating a new list with all elements from both lists.",
          hint: "List concatenation joins the lists together.",
          example: "First list [1,2,3] + second list [4,5] = combined list [1,2,3,4,5]. Original lists unchanged.",
          similarQuestion: "What is the output of: [1, 2] * 3?",
          similarAnswer: "[1, 2, 1, 2, 1, 2] - list multiplication repeats the list elements the specified number of times."
        },
        {
          question: "Write a function to flatten a nested list:",
          type: "code",
          correct: "def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result",
          explanation: "This recursive function checks each item - if it's a list, it recursively flattens it; otherwise, it adds the item.",
          hint: "Use recursion to handle nested lists. Check if each item is a list.",
          example: "flatten([1, [2, 3], [4, [5, 6]]]): processes 1 (add), [2,3] (recurse→add 2,3), [4,[5,6]] (recurse→add 4, recurse→add 5,6). Result: [1,2,3,4,5,6].",
          similarQuestion: "Write a function to find the depth of a nested list:",
          similarAnswer: "def list_depth(lst):\n    if not isinstance(lst, list):\n        return 0\n    return 1 + max([list_depth(item) for item in lst], default=0)"
        },
        {
          question: "What is list slicing in Python?",
          type: "text",
          correct: "extracting parts of a list",
          explanation: "List slicing allows you to extract a portion of a list using start:stop:step notation.",
          hint: "It's about taking a slice or portion of the list.",
          example: "lst=[0,1,2,3,4]; lst[1:4]=[1,2,3] (indices 1-3), lst[:3]=[0,1,2] (start to 3), lst[::2]=[0,2,4] (every 2nd).",
          similarQuestion: "What is string slicing in Python?",
          similarAnswer: "Extracting portions of a string using the same start:stop:step notation, like 'hello'[1:4] gives 'ell'."
        },
        {
          question: "Write a function to find the intersection of two lists:",
          type: "code",
          correct: "def intersection(list1, list2):\n    return list(set(list1) & set(list2))",
          explanation: "This function converts lists to sets and uses the & operator to find common elements.",
          hint: "Use sets and the intersection operator (&) to find common elements.",
          example: "intersection([1,2,3,4], [3,4,5,6]): set1={1,2,3,4}, set2={3,4,5,6}, intersection={3,4}, result=[3,4].",
          similarQuestion: "Write a function to find the union of two lists:",
          similarAnswer: "def union(list1, list2):\n    return list(set(list1) | set(list2))"
        },
        {
          question: "What is the difference between shallow copy and deep copy?",
          type: "text",
          correct: "shallow copies references, deep copies objects",
          explanation: "Shallow copy creates a new object but inserts references to objects in the original. Deep copy creates new objects recursively.",
          hint: "One copies the container but not the contents, the other copies everything.",
          example: "lst=[[1,2],[3,4]]; shallow copy copies list but inner lists are same objects; deep copy creates completely independent nested lists.",
          similarQuestion: "What is the difference between copy() and assignment in Python?",
          similarAnswer: "copy() creates a new object with same content; assignment creates another reference to the same object."
        },
        {
          question: "Write a function to generate Fibonacci sequence up to n terms:",
          type: "code",
          correct: "def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    return fib",
          explanation: "This function generates the Fibonacci sequence where each number is the sum of the two preceding numbers.",
          hint: "Start with [0, 1] and each new number is the sum of the previous two.",
          example: "fibonacci(6): start [0,1], add 0+1=1 → [0,1,1], add 1+1=2 → [0,1,1,2], add 1+2=3 → [0,1,1,2,3], add 2+3=5 → [0,1,1,2,3,5].",
          similarQuestion: "Write a function to generate arithmetic sequence:",
          similarAnswer: "def arithmetic_sequence(start, diff, n):\n    return [start + i * diff for i in range(n)]"
        }
      ]
    }
    
    return questionSets[categoryId] || questionSets['algorithms']
  }

  const questions = getQuestions(category.id)

  const checkAnswer = () => {
    const currentQ = questions[currentQuestion]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentQ.correct.toLowerCase().trim()
    
    const isCorrect = userAnswerClean === correctAnswerClean ||
                     (currentQ.type === "text" && userAnswerClean.includes(correctAnswerClean))
    
    setFeedback({
      correct: isCorrect,
      explanation: currentQ.explanation,
      correctAnswer: currentQ.correct,
      questionType: currentQ.type
    })
    
    setIsAnswered(true)
    
    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
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

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setUserAnswer('')
    setFeedback(null)
    setScore(0)
    setIsAnswered(false)
    setShowResult(false)
    setStreak(0)
    setHintsUsed(0)
    setShowHint(false)
  }

  const useHint = () => {
    setShowHint(true)
    setHintsUsed(hintsUsed + 1)
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="quiz-section">
        <div className="quiz-result">
          <div className="result-animation">
            <div className="result-icon">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥉' : percentage >= 40 ? '📚' : '💪'}
            </div>
            <h2 className="result-title">Quiz Complete!</h2>
          </div>
          
          <div className="score-breakdown">
            <div className="main-score">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {questions.length}</span>
            </div>
            <div className="score-details">
              <div className="score-item">
                <span className="score-label">Accuracy</span>
                <span className="score-value">{percentage}%</span>
              </div>
              <div className="score-item">
                <span className="score-label">Questions</span>
                <span className="score-value">{questions.length}</span>
              </div>
              <div className="score-item">
                <span className="score-label">Hints Used</span>
                <span className="score-value">{hintsUsed}</span>
              </div>
            </div>
          </div>

          <div className="achievement-section">
            {percentage >= 80 && <div className="achievement">🌟 Expert Level!</div>}
            {streak >= 5 && <div className="achievement">🔥 Hot Streak!</div>}
            {hintsUsed === 0 && <div className="achievement">🧠 No Hints Needed!</div>}
            {percentage === 100 && <div className="achievement">🎯 Perfect Score!</div>}
          </div>
          
          <div className="result-actions">
            <button className="action-button primary" onClick={resetQuiz}>
              Try Again
            </button>
            <button className="action-button secondary" onClick={onBack}>
              Back to Categories
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="quiz-section">
      <div className="quiz-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Categories
        </button>
        <div className="quiz-info">
          <h2 className="category-title-quiz">{category.title}</h2>
          <div className="quiz-stats">
            <div className="stat-item">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Streak</span>
              <span className="stat-value streak">{streak}</span>
            </div>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <h3 className="question-text">{currentQ.question}</h3>
          <div className="question-actions">
            {!showHint && !isAnswered && (
              <button className="hint-button" onClick={useHint}>
                💡 Hint
              </button>
            )}
          </div>
        </div>

        {showHint && (
          <div className="hint-container">
            <span className="hint-icon">💡</span>
            <p className="hint-text">{currentQ.hint}</p>
          </div>
        )}

        {currentQ.example && (
          <div className="example-container">
            <span className="example-icon">📝</span>
            <div className="example-content">
              <h4 className="example-title">Example:</h4>
              <p className="example-text">{currentQ.example}</p>
            </div>
          </div>
        )}

        {currentQ.similarQuestion && (
          <div className="similar-container">
            <span className="similar-icon">🔗</span>
            <div className="similar-content">
              <h4 className="similar-title">Similar Question:</h4>
              <p className="similar-question">{currentQ.similarQuestion}</p>
              <p className="similar-answer"><strong>Answer:</strong> {currentQ.similarAnswer}</p>
            </div>
          </div>
        )}
        
        {currentQ.type === 'multiple-choice' && (
          <div className="options-container">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${userAnswer === option ? 'selected' : ''} ${
                  feedback ? (option === currentQ.correct ? 'correct-option' : option === userAnswer && !feedback.correct ? 'incorrect-option' : '') : ''
                }`}
                onClick={() => !isAnswered && setUserAnswer(option)}
                disabled={isAnswered}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        )}

        {(currentQ.type === 'text' || currentQ.type === 'code') && (
          <div className="input-container">
            <textarea
              className={`answer-input ${currentQ.type === 'code' ? 'code-input' : ''}`}
              value={userAnswer}
              onChange={(e) => !isAnswered && setUserAnswer(e.target.value)}
              placeholder={currentQ.type === 'code' ? 'Enter your code here...' : 'Enter your answer...'}
              rows={currentQ.type === 'code' ? 8 : 3}
              disabled={isAnswered}
            />
          </div>
        )}

        <div className="action-buttons">
          {!feedback ? (
            <button 
              className="submit-button"
              onClick={checkAnswer}
              disabled={!userAnswer.trim() || isAnswered}
            >
              Submit Answer
            </button>
          ) : (
            <button className="next-button" onClick={nextQuestion}>
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🏁'}
            </button>
          )}
        </div>

        {feedback && (
          <div className={`feedback-container ${feedback.correct ? 'correct' : 'incorrect'}`}>
            <div className="feedback-header">
              <div className="feedback-icon">
                {feedback.correct ? '✅' : '❌'}
              </div>
              <h4 className="feedback-title">
                {feedback.correct ? 'Excellent!' : 'Not quite right'}
              </h4>
            </div>
            <p className="feedback-explanation">{feedback.explanation}</p>
            
            {!feedback.correct && (feedback.questionType === 'text' || feedback.questionType === 'code') && (
              <div className="correct-answer-section">
                <h5 className="correct-answer-title">📚 Correct Answer:</h5>
                <div className={`correct-answer-text ${feedback.questionType === 'code' ? 'code-answer' : ''}`}>
                  {feedback.correctAnswer}
                </div>
              </div>
            )}
            
            {feedback.correct && streak > 1 && (
              <div className="streak-indicator">
                🔥 {streak} in a row! Keep it up!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizSection
