export const MASTERY_DATA = [
  { concept: "Variables & Data Types", level: 92, trend: "up" },
  { concept: "Control Flow (If/Switch)", level: 85, trend: "stable" },
  { concept: "Loops (For/While/Do)", level: 78, trend: "up" },
  { concept: "Functions & Scope", level: 65, trend: "up" },
  { concept: "Arrays & Strings", level: 58, trend: "stable" },
  { concept: "Pointers & Memory", level: 32, trend: "down" },
  { concept: "Structs & Unions", level: 25, trend: "up" },
  { concept: "Dynamic Memory (malloc)", level: 15, trend: "stable" },
  { concept: "File I/O", level: 10, trend: "up" },
  { concept: "Preprocessor Directives", level: 45, trend: "up" },
];

export const PRACTICE_CONTENT = {
  "Variables & Data Types": {
    title: "Variables & Data Types",
    description:
      "In C, variables must be declared with a specific type. Common types include int, float, char, and double.",
    task: 'Declare an integer variable named "age" and assign it the value 21. Then print it using printf.',
    concepts: [
      "Variable declaration",
      "Format specifiers (%d)",
      "Assignment operator (=)",
    ],
    initialCode:
      '#include <stdio.h>\n\nint main() {\n    // Declare and initialize age here\n    \n    return 0;\n}',
  },

  "Control Flow (If/Switch)": {
    title: "Control Flow",
    description:
      "Control flow statements like if-else and switch allow your program to make decisions based on conditions.",
    task: "Write an if-else statement that checks if a number is positive or negative.",
    concepts: [
      "if-else syntax",
      "Comparison operators (>, <)",
      "Logical operators",
    ],
    initialCode:
      "#include <stdio.h>\n\nint main() {\n    int num = -5;\n    // Write if-else here\n    \n    return 0;\n}",
  },

  "Loops (For/While/Do)": {
    title: "Loops in C",
    description:
      "Loops are used to repeat a block of code. The for loop is ideal when the number of iterations is known.",
    task: "Write a for loop that prints all numbers from 1 to 10 using printf().",
    concepts: [
      "for loop syntax: for(init; cond; inc)",
      "Loop variables",
      "printf format specifiers",
    ],
    initialCode:
      '#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 10; i++) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}',
  },
};

export const CURRICULUM_DATA = [
  {
    module: "1. Basics",
    description:
      "Master the foundational syntax of C, variable declarations, and how the computer manages data types in memory.",
    concepts: [
      "Variables & Identifiers",
      "Primitive Data Types",
      "Memory Layout Basics",
      "Constants & Qualifiers",
    ],
    materials: [
      { type: "article", title: "Variables & Identifiers", duration: "10m" },
      { type: "article", title: "Primitive Data Types", duration: "8m" },
      { type: "video", title: "Memory Layout Basics", duration: "12m" },
      { type: "lab", title: "Variables Hands-on", duration: "15m" },
    ],
    lessons: [
      {
        id: 1,
        title: "Variables & Identifiers",
        duration: "15m",
        status: "completed",
      },
      {
        id: 2,
        title: "Primitive Data Types",
        duration: "20m",
        status: "completed",
      },
      {
        id: 3,
        title: "Memory Layout Basics",
        duration: "15m",
        status: "completed",
      },
    ],
  },

  {
    module: "2. Input / Output",
    description:
      "Master communicating with users using standard input and output streams, format specifiers, and buffer management.",
    concepts: [
      "Standard Streams",
      "Format Specifiers",
      "Input with scanf()",
      "Escape Sequences",
      "Buffer Handling",
    ],
    materials: [
      { type: "article", title: "Standard Streams", duration: "5m" },
      { type: "article", title: "Format Specifiers", duration: "10m" },
      { type: "video", title: "Mastering printf() & scanf()", duration: "18m" },
    ],
    lessons: [
      {
        id: 4,
        title: "Standard Streams",
        duration: "10m",
        status: "completed",
      },
      {
        id: 5,
        title: "Format Specifiers",
        duration: "15m",
        status: "completed",
      },
      {
        id: 6,
        title: "Input with scanf()",
        duration: "20m",
        status: "completed",
      },
    ],
  },

  {
    module: "3. Operators",
    description:
      "Master mathematical, logical, and relational operations that drive program logic and decision-making.",
    concepts: [
      "Arithmetic Operators",
      "Relational Operators",
      "Logical Operators",
      "Assignment Operators",
    ],
    materials: [
      { type: "article", title: "Arithmetic Operators", duration: "8m" },
      { type: "article", title: "Relational Operators", duration: "5m" },
      { type: "article", title: "Logical Operators", duration: "8m" },
    ],
    lessons: [
      {
        id: 7,
        title: "Arithmetic & Logic",
        duration: "20m",
        status: "completed",
      },
      {
        id: 8,
        title: "Precedence & Casting",
        duration: "15m",
        status: "completed",
      },
    ],
  },
];

export const QUESTION_BANK = [
  {
    id: "C02-REM-Q01",
    type: "MCQ",
    level: "Remember",
    difficulty: "EASY",
    concept: "Input / Output",
    question: "What header file must be included to use printf() and scanf()?",
    options: ["<stdlib.h>", "<stdio.h>", "<conio.h>", "<math.h>"],
    answer: "<stdio.h>",
  },
  {
    id: "C02-REM-Q03",
    type: "MCQ",
    level: "Remember",
    difficulty: "EASY",
    concept: "Input / Output",
    question: 'What does the "\\n" escape sequence represent?',
    options: ["New Tab", "New Line", "Null Character", "Backspace"],
    answer: "New Line",
  },
  {
    id: "C02-REM-Q06",
    type: "MCQ",
    level: "Remember",
    difficulty: "EASY",
    concept: "Input / Output",
    question: 'What does the "&" symbol mean when used with scanf()?',
    options: [
      "Value of operator",
      "Address-of operator",
      "Logical AND",
      "Pointer dereference",
    ],
    answer: "Address-of operator",
  },
];