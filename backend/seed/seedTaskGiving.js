const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const LearningModuleExport = require("../models/LearningModule");
const QuestionExport = require("../models/Question");

const LearningModule =
  LearningModuleExport.LearningModule ||
  LearningModuleExport.default ||
  LearningModuleExport;

const Question =
  QuestionExport.Question || QuestionExport.default || QuestionExport;

const makeSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/\s*\/\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const makeCode = (text) => {
  return text
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/\+/g, "PLUS")
    .replace(/\s*\/\s*/g, "_")
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const normalizeConcept = (concept) => {
  return concept
    .trim()
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ");
};

const getConceptKey = (concept) => {
  return normalizeConcept(concept).toLowerCase();
};

const optionLabels = ["A", "B", "C", "D"];

/*
  Paste all your question objects here.

  You can paste questions in this format:

  {
    concept: "Basics",
    difficulty: "easy",
    question_text: "Which keyword is used to declare an integer variable?",
    options: ["number", "int", "integer", "var"],
    correct_answer: "B",
    hint: "C has specific short keywords for data types.",
    explanation: "int is the correct keyword to declare integer variables."
  }

  Or already converted format is also supported:

  {
    concept: "Input / Output",
    difficulty: "easy",
    orderNo: 1,
    questionText: "What header file must be included to use printf() and scanf()?",
    options: [
      { label: "A", text: "<stdlib.h>", misconceptionTag: "wrong_header" },
      { label: "B", text: "<stdio.h>", misconceptionTag: "" },
      { label: "C", text: "<conio.h>", misconceptionTag: "old_compiler_header" },
      { label: "D", text: "<math.h>", misconceptionTag: "math_header_confusion" }
    ],
    correctAnswer: "B",
    hint: "printf and scanf are standard input/output functions.",
    detailedHint: "The standard input/output library is stdio.h.",
    explanation: "printf() and scanf() are declared inside the stdio.h header file."
  }
*/

const rawQuestions = [
  
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which keyword is used to declare an integer variable?",
    "options": ["number", "int", "integer", "var"],
    "correct_answer": "B",
    "hint": "C has specific short keywords for data types.",
    "explanation": "int is the correct keyword to declare integer variables. Using integer causes 'unknown type name' error."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "What is the correct way to store a single character?",
    "options": ["char c = \"A\";", "char c = 'A';", "char c = A;", "character c = 'A';"],
    "correct_answer": "B",
    "hint": "Use single quotes for characters.",
    "explanation": "Character literals must be enclosed in single quotes ' '. Double quotes make it a string → type error."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which is a valid variable name in C?",
    "options": ["123abc", "abc123", "abc#123", "int"],
    "correct_answer": "B",
    "hint": "Cannot start with digit or use special characters (except _).",
    "explanation": "Variable names must start with a letter or underscore."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "The const keyword is used to create:",
    "options": ["A changeable variable", "A read-only constant", "A macro", "A function"],
    "correct_answer": "B",
    "hint": "Constant means stays the same.",
    "explanation": "A read-only constant cannot be changed after initialization."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which symbol is used to end a statement in C?",
    "options": [".", ",", ";", ":"],
    "correct_answer": "C",
    "hint": "Every statement in C ends with this punctuation mark.",
    "explanation": "A semicolon (;) is used to terminate statements in C."
  },

  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "By default, global variables are initialized to:",
    "options": ["Garbage value", "0", "1", "Random value"],
    "correct_answer": "B",
    "hint": "Scope affects initialization rules.",
    "explanation": "Globals and static variables are auto-initialized to zero."
  },
  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "The usual size of int in modern 64-bit compilers is:",
    "options": ["2 bytes", "4 bytes", "8 bytes", "1 byte"],
    "correct_answer": "B",
    "hint": "Standard implementation for 32-bit integers.",
    "explanation": "On most modern systems, int is 4 bytes."
  },
  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "#define PI 3.14 is an example of:",
    "options": ["Variable declaration", "Preprocessor macro", "Constant variable", "Loop"],
    "correct_answer": "B",
    "hint": "It's handled by the preprocessor.",
    "explanation": "It's a preprocessor macro that replaces PI with 3.14 in the source code."
  },
  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "What happens in this line: int x = 9.7; ?",
    "options": ["Error", "x becomes 9 (truncation)", "x becomes 10", "x becomes 9.7"],
    "correct_answer": "B",
    "hint": "float to int conversion.",
    "explanation": "Decimal part is discarded when assigning a float to an int."
  },
  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "Uninitialized local variables contain:",
    "options": ["0", "Garbage (random) value", "Null", "-1"],
    "correct_answer": "B",
    "hint": "Local scope on the stack doesn't auto-clear memory.",
    "explanation": "Local variables contain random data (garbage values) if not explicitly initialized."
  },

  {
    "concept": "Basics",
    "difficulty": "hard",
    "question_text": "What will be the output of this code?\n\nint x = 10;\nprintf(\"%d\", x++ + ++x);",
    "options": ["20", "21", "22", "Undefined behavior"],
    "correct_answer": "D",
    "hint": "Modifying a variable multiple times in the same expression can be risky.",
    "explanation": "This causes undefined behavior because x is modified more than once in the same expression without sequence points."
  },
  {
    "concept": "Basics",
    "difficulty": "hard",
    "question_text": "Which of the following is NOT a valid C data type?",
    "options": ["float", "real", "double", "char"],
    "correct_answer": "B",
    "hint": "Think about built-in C keywords.",
    "explanation": "C does not have a built-in data type called 'real'."
  },
  {
    "concept": "Basics",
    "difficulty": "hard",
    "question_text": "What happens if you try to modify a const variable?",
    "options": ["Program runs normally", "Compiler warning only", "Compilation error", "Runtime error"],
    "correct_answer": "C",
    "hint": "const means read-only.",
    "explanation": "A const variable cannot be modified after initialization and attempting to do so results in a compilation error."
  },
  {
    "concept": "Basics",
    "difficulty": "hard",
    "question_text": "What is the output of this code?\n\nchar ch = 65;\nprintf(\"%c\", ch);",
    "options": ["65", "A", "Error", "ASCII"],
    "correct_answer": "B",
    "hint": "Characters can be represented using ASCII values.",
    "explanation": "ASCII value 65 corresponds to the character 'A'."
  },
  {
    "concept": "Basics",
    "difficulty": "hard",
    "question_text": "Which statement about variables in C is correct?",
    "options": [
      "Variables can start with numbers",
      "Variable names can contain spaces",
      "Keywords cannot be used as variable names",
      "Special characters are allowed in variable names"
    ],
    "correct_answer": "C",
    "hint": "Reserved words have restrictions.",
    "explanation": "Keywords such as int, float, and return are reserved words and cannot be used as variable names."
  },
  
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which keyword is used to declare an integer variable in C?",
    "options": ["integer", "int", "num", "var"],
    "correct_answer": "B",
    "hint": "C uses short specific keywords for data types.",
    "explanation": "int is the standard keyword to declare integer variables. Writing integer instead of int causes 'unknown type name' error."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "What is the correct way to declare and initialize a character variable?",
    "options": ["char ch = \"A\";", "char ch = 'A';", "char ch = A;", "character ch = 'A';"],
    "correct_answer": "B",
    "hint": "Single characters use single quotes.",
    "explanation": "Character literals are enclosed in single quotes ' '. Double quotes are for strings."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which of the following is a valid variable name?",
    "options": ["2age", "age_2", "age#", "int"],
    "correct_answer": "B",
    "hint": "Cannot start with digit or use special symbols except underscore.",
    "explanation": "Variable names must start with a letter or underscore and can contain digits after that."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "The const keyword is used to create:",
    "options": ["A mutable variable", "A read-only constant", "A macro", "A function"],
    "correct_answer": "B",
    "hint": "Constant means value cannot change.",
    "explanation": "const makes a variable read-only after initialization."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which data type is used to store decimal numbers in C?",
    "options": ["int", "char", "float", "bool"],
    "correct_answer": "C",
    "hint": "Used for numbers with fractions.",
    "explanation": "float is used to store decimal values like 3.14."
  },

  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "Global variables are automatically initialized to:",
    "options": ["Garbage value", "0", "1", "Undefined"],
    "correct_answer": "B",
    "hint": "Scope affects default initialization.",
    "explanation": "Global and static variables are automatically initialized to zero."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "What is the usual size of int on modern 64-bit systems?",
    "options": ["2 bytes", "4 bytes", "8 bytes", "1 byte"],
    "correct_answer": "B",
    "hint": "Standard C implementation.",
    "explanation": "int is typically 4 bytes (32-bit) on modern systems."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "#define PI 3.14 is an example of:",
    "options": ["Variable", "Macro", "Function", "Pointer"],
    "correct_answer": "B",
    "hint": "Handled before compilation.",
    "explanation": "#define creates a macro replacement before compilation."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "What happens in int x = 7.8;?",
    "options": ["Compile error", "x becomes 7", "x becomes 8", "x becomes 7.8"],
    "correct_answer": "B",
    "hint": "Type conversion rules apply.",
    "explanation": "Decimal part is truncated when storing float into int."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "Uninitialized local variables contain:",
    "options": ["0", "Garbage value", "Null", "Undefined constant"],
    "correct_answer": "B",
    "hint": "Stack memory is not cleared automatically.",
    "explanation": "Local variables contain garbage values if not initialized."
  },

  {
    "concept": "Variables and Data Types",
    "difficulty": "hard",
    "question_text": "What will be the output?\n\nint x = 10;\nprintf(\"%d\", x++ + ++x);",
    "options": ["20", "21", "22", "Undefined behavior"],
    "correct_answer": "D",
    "hint": "Multiple modifications in same expression.",
    "explanation": "This causes undefined behavior because x is modified more than once without sequence points."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "hard",
    "question_text": "Which of the following is NOT a valid C data type?",
    "options": ["float", "real", "double", "char"],
    "correct_answer": "B",
    "hint": "Check built-in types.",
    "explanation": "C does not have a data type called 'real'."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "hard",
    "question_text": "What happens if a const variable is modified?",
    "options": ["Runs normally", "Warning", "Compilation error", "Runtime error"],
    "correct_answer": "C",
    "hint": "const means read-only.",
    "explanation": "Modifying a const variable causes a compilation error."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "hard",
    "question_text": "What will be the output?\n\nchar ch = 97;\nprintf(\"%c\", ch);",
    "options": ["97", "A", "a", "Error"],
    "correct_answer": "C",
    "hint": "ASCII mapping.",
    "explanation": "ASCII value 97 corresponds to 'a'."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "hard",
    "question_text": "Which statement is correct?",
    "options": [
      "Variable names can start with digits",
      "Keywords can be used as variable names",
      "Variable names can contain spaces",
      "Keywords cannot be used as variable names"
    ],
    "correct_answer": "D",
    "hint": "Reserved words rule.",
    "explanation": "C keywords like int, float, return cannot be used as variable names."
  },

  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which loop is best when you know the number of iterations in advance?",
    "options": ["while", "do-while", "for", "switch"],
    "correct_answer": "C",
    "hint": "This loop combines initialization, condition, and update in one line.",
    "explanation": "The for loop is ideal when the exact number of repetitions is known beforehand."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "How many times will this loop run?\nfor(int i = 0; i < 5; i++)\n    printf(\"Hi\");",
    "options": ["4 times", "5 times", "6 times", "Infinite"],
    "correct_answer": "B",
    "hint": "The condition i < 5 is checked before each iteration.",
    "explanation": "i takes values 0, 1, 2, 3, 4 → 5 iterations."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "What is the correct syntax for a while loop?",
    "options": ["while(condition) { }", "while { } condition", "while (condition);", "while condition do { }"],
    "correct_answer": "A",
    "hint": "Condition goes inside parentheses.",
    "explanation": "C uses while(condition) followed by a block or statement."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "What is a nested loop?",
    "options": ["A loop inside another loop", "Two loops in sequence", "Loop with no condition", "Infinite loop only"],
    "correct_answer": "A",
    "hint": "Think of loops inside loops.",
    "explanation": "A nested loop means one loop is placed inside another loop."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which loop will always execute at least once?",
    "options": ["for", "while", "do-while", "switch"],
    "correct_answer": "C",
    "hint": "Condition is checked after execution.",
    "explanation": "do-while executes the body first, then checks condition."
  },

  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "Which loop executes at least once even if the condition is false?",
    "options": ["for", "while", "do-while", "if"],
    "correct_answer": "C",
    "hint": "Exit-controlled loop.",
    "explanation": "do-while checks condition after executing the loop body."
  },
  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "Which of the following creates an infinite loop?",
    "options": ["for(;;)", "while(1)", "while(true)", "All of the above"],
    "correct_answer": "D",
    "hint": "All conditions are always true.",
    "explanation": "All given options create loops that never terminate."
  },
  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "In a for loop, which parts can be omitted?",
    "options": ["Initialization only", "Condition only", "Update only", "All parts can be omitted"],
    "correct_answer": "D",
    "hint": "for(;;) is valid in C.",
    "explanation": "All three parts of a for loop are optional in C."
  },
  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "A do-while loop is also called:",
    "options": ["Entry-controlled loop", "Exit-controlled loop", "Pre-test loop", "Infinite loop"],
    "correct_answer": "B",
    "hint": "Condition is checked at the end.",
    "explanation": "Since condition is checked after execution, it's exit-controlled."
  },
  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "What is the output count?\nfor(int i=0; i<3; i++) for(int j=0; j<2; j++) printf(\"*\");",
    "options": ["3", "2", "6", "5"],
    "correct_answer": "C",
    "hint": "Multiply outer and inner loop iterations.",
    "explanation": "3 outer × 2 inner = 6 prints."
  },

  {
    "concept": "Loops",
    "difficulty": "hard",
    "question_text": "What happens if you write while(condition); in C?",
    "options": [
      "Loop executes normally",
      "Infinite loop with empty body",
      "Syntax error",
      "Loop runs once"
    ],
    "correct_answer": "B",
    "hint": "Semicolon becomes loop body.",
    "explanation": "The loop runs an empty statement repeatedly, causing a potential infinite loop."
  },
  {
    "concept": "Loops",
    "difficulty": "hard",
    "question_text": "What is the output?\nint i=0;\nwhile(i++ < 3)\n    printf(\"%d\", i);",
    "options": ["012", "123", "0123", "1234"],
    "correct_answer": "B",
    "hint": "Post-increment affects comparison timing.",
    "explanation": "i is incremented after comparison, producing 1,2,3."
  },
  {
    "concept": "Loops",
    "difficulty": "hard",
    "question_text": "What is the result of this nested loop?\nfor(int i=1;i<=2;i++)\n for(int j=1;j<=3;j++)\n  printf(\"%d%d\", i,j);",
    "options": ["6 outputs", "5 outputs", "4 outputs", "3 outputs"],
    "correct_answer": "A",
    "hint": "Multiply iterations.",
    "explanation": "2 outer × 3 inner = 6 outputs."
  },
  {
    "concept": "Loops",
    "difficulty": "hard",
    "question_text": "What happens in for(;;)?",
    "options": ["Runs once", "Syntax error", "Infinite loop", "No execution"],
    "correct_answer": "C",
    "hint": "Empty for loop conditions.",
    "explanation": "All parts missing means condition is always true → infinite loop."
  },
  {
    "concept": "Loops",
    "difficulty": "hard",
    "question_text": "What is wrong with this code?\nwhile(x=5)\n{ printf(\"Hello\"); }",
    "options": [
      "Nothing wrong",
      "Comparison missing (assignment used)",
      "Syntax error",
      "Loop runs once"
    ],
    "correct_answer": "B",
    "hint": "Assignment vs comparison.",
    "explanation": "x=5 assigns value 5, which is always true → infinite loop."
  }, 
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "What is the result of 10 % 3 in C?",
    "options": ["3", "1", "0.33", "3.33"],
    "correct_answer": "B",
    "hint": "Modulus operator returns the remainder.",
    "explanation": "10 divided by 3 is 3 with a remainder of 1."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for multiplication in C?",
    "options": ["x", "*", "mul", "#"],
    "correct_answer": "B",
    "hint": "It is a symbol, not a word.",
    "explanation": "The * operator is used for multiplication in C."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for division in C?",
    "options": ["/", "%", "//", "\\"],
    "correct_answer": "A",
    "hint": "Used for dividing numbers.",
    "explanation": "The / operator performs division in C."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "What is the result of 5 + 2 * 3?",
    "options": ["21", "11", "16", "9"],
    "correct_answer": "B",
    "hint": "Multiplication has higher precedence than addition.",
    "explanation": "2 * 3 = 6, then 5 + 6 = 11."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for assignment?",
    "options": ["==", "=", ":=", "!="],
    "correct_answer": "B",
    "hint": "Single equals sign.",
    "explanation": "The = operator is used to assign values."
  },

  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "What is the result of 5 == 5 in C?",
    "options": ["0", "1", "5", "true"],
    "correct_answer": "B",
    "hint": "Relational operators return boolean values.",
    "explanation": "True is represented as 1 in C."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "Which operator is used for logical AND?",
    "options": ["&", "&&", "AND", "||"],
    "correct_answer": "B",
    "hint": "Double symbol operator.",
    "explanation": "&& is the logical AND operator in C."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "What is the result of 10 / 4 in C (integer division)?",
    "options": ["2.5", "2", "3", "2.0"],
    "correct_answer": "B",
    "hint": "Integer division discards decimals.",
    "explanation": "10 / 4 = 2 because fractional part is removed."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "Which operator checks equality?",
    "options": ["=", "==", "!=", "=>"],
    "correct_answer": "B",
    "hint": "Used in comparisons.",
    "explanation": "== is used to compare two values."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "What is the result of !0 in C?",
    "options": ["0", "1", "-1", "Error"],
    "correct_answer": "B",
    "hint": "Logical NOT operator.",
    "explanation": "!0 evaluates to true, which is 1 in C."
  },

  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "What is the output of x = 5; printf(\"%d\", x++ + ++x);?",
    "options": ["10", "11", "12", "Undefined behavior"],
    "correct_answer": "D",
    "hint": "Multiple modifications in one expression.",
    "explanation": "This causes undefined behavior due to multiple updates of x without sequence points."
  },
  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "What is the result of 10 & 7 in C?",
    "options": ["15", "2", "3", "7"],
    "correct_answer": "B",
    "hint": "Bitwise AND operation.",
    "explanation": "10 (1010) & 7 (0111) = 0010 = 2."
  },
  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "What is the result of 5 | 3?",
    "options": ["7", "1", "6", "8"],
    "correct_answer": "A",
    "hint": "Bitwise OR operation.",
    "explanation": "5 (0101) | 3 (0011) = 0111 = 7."
  },
  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "Which operator has highest precedence?",
    "options": ["+", "*", "=", "&&"],
    "correct_answer": "B",
    "hint": "Arithmetic operators vs logical.",
    "explanation": "Multiplication (*) has higher precedence than +, =, and &&."
  },
  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "What is wrong with this expression?\nif(a = b)",
    "options": [
      "Nothing wrong",
      "Assignment instead of comparison",
      "Syntax error",
      "Always false"
    ],
    "correct_answer": "B",
    "hint": "Check = vs ==",
    "explanation": "It assigns b to a instead of comparing values."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "Which operator is used to compare two values for equality?",
    "options": ["=", "==", "===", "!="],
    "correct_answer": "B",
    "hint": "Comparison, not assignment.",
    "explanation": "In C, == is used for equality comparison, while = is for assignment."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which keyword is used for a multi-way branch selection?",
    "options": ["if", "else", "switch", "for"],
    "correct_answer": "C",
    "hint": "Good for checking a single variable against many values.",
    "explanation": "The switch statement allows a variable to be tested for equality against multiple values."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which statement is used for decision making in C?",
    "options": ["loop", "if", "switch", "break"],
    "correct_answer": "B",
    "hint": "Used to check conditions.",
    "explanation": "The if statement is used for decision making based on conditions."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which keyword is used to execute code when if condition is false?",
    "options": ["else", "switch", "case", "loop"],
    "correct_answer": "A",
    "hint": "Opposite of if.",
    "explanation": "else executes when the if condition is false."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which loop checks condition first?",
    "options": ["do-while", "while", "switch", "goto"],
    "correct_answer": "B",
    "hint": "Entry-controlled loop.",
    "explanation": "while loop checks condition before executing the loop body."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which keyword is used to exit a loop early?",
    "options": ["continue", "exit", "break", "stop"],
    "correct_answer": "C",
    "hint": "Used to terminate loop immediately.",
    "explanation": "break is used to exit loops or switch statements."
  },

  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "What is the purpose of the default case in switch?",
    "options": [
      "First case executed",
      "Handles unmatched cases",
      "Ends program",
      "Starts loop"
    ],
    "correct_answer": "B",
    "hint": "Like else in if-else.",
    "explanation": "default executes when no case matches."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "What happens if break is missing in switch case?",
    "options": [
      "Error occurs",
      "Only one case runs",
      "Fall-through to next cases",
      "Program stops"
    ],
    "correct_answer": "C",
    "hint": "Execution continues.",
    "explanation": "Without break, execution continues into next cases (fall-through)."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "Which loop is exit-controlled?",
    "options": ["for", "while", "do-while", "if"],
    "correct_answer": "C",
    "hint": "Condition checked after execution.",
    "explanation": "do-while executes at least once before checking condition."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "Which keyword skips current loop iteration?",
    "options": ["break", "continue", "skip", "pass"],
    "correct_answer": "B",
    "hint": "Moves to next iteration.",
    "explanation": "continue skips current iteration and moves to next."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "What is the output of if(5 > 3)?",
    "options": ["false", "true", "0", "error"],
    "correct_answer": "B",
    "hint": "Relational expression.",
    "explanation": "5 > 3 is true, which evaluates to 1 in C."
  },

  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "What is the output?\nint x = 1;\nswitch(x) {\ncase 1: printf(\"A\");\ncase 2: printf(\"B\");\nbreak;\n}",
    "options": ["A", "B", "AB", "Error"],
    "correct_answer": "C",
    "hint": "Missing break causes fall-through.",
    "explanation": "Case 1 executes and falls through to case 2."
  },
  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "What happens if switch expression is float?",
    "options": [
      "Works normally",
      "Compilation error",
      "Runtime error",
      "Converts to int automatically"
    ],
    "correct_answer": "B",
    "hint": "Switch has restrictions.",
    "explanation": "switch does not allow float or double expressions."
  },
  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "What is wrong with this code?\nif(x=5)",
    "options": [
      "Correct syntax",
      "Assignment instead of comparison",
      "Missing semicolon",
      "Runtime error"
    ],
    "correct_answer": "B",
    "hint": "Check '=' vs '=='",
    "explanation": "x=5 assigns value instead of comparing."
  },
  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "What is the output?\nint i=0;\nwhile(i<3)\n    printf(\"%d\", i);\n    i++;",
    "options": ["012", "000", "Infinite loop", "Error"],
    "correct_answer": "C",
    "hint": "Missing braces matter.",
    "explanation": "Only printf is in loop; i++ runs once → infinite loop."
  },
  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "Which statement about nested if is correct?",
    "options": [
      "Not allowed in C",
      "Only one level allowed",
      "if inside another if is valid",
      "Causes error always"
    ],
    "correct_answer": "C",
    "hint": "Hierarchy of conditions.",
    "explanation": "Nested if statements are allowed in C."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "Which function is used to print output on the screen in C?",
    "options": ["input()", "printf()", "scanf()", "print()"],
    "correct_answer": "B",
    "hint": "\"print formatted\".",
    "explanation": "printf() is used to display output to the console."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "Which function is used to take input from the user?",
    "options": ["printf()", "scanf()", "get()", "input()"],
    "correct_answer": "B",
    "hint": "\"scan formatted\".",
    "explanation": "scanf() reads input from standard input (keyboard)."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "What is the correct format specifier for an integer?",
    "options": ["%f", "%d", "%c", "%s"],
    "correct_answer": "B",
    "hint": "Decimal integer.",
    "explanation": "%d is used for integers."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "To print a floating-point number, we use:",
    "options": ["%d", "%f", "%c", "%i"],
    "correct_answer": "B",
    "hint": "Float format.",
    "explanation": "%f is used for float values."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "Which header file is required for printf and scanf?",
    "options": ["<stdlib.h>", "<stdio.h>", "<math.h>", "<string.h>"],
    "correct_answer": "B",
    "hint": "Standard input/output.",
    "explanation": "stdio.h contains input/output functions."
  },

  {
    "concept": "Input/Output",
    "difficulty": "medium",
    "question_text": "What does \\n do in printf?",
    "options": ["Tab space", "New line", "Backslash", "Nothing"],
    "correct_answer": "B",
    "hint": "Line break.",
    "explanation": "\\n moves the cursor to a new line."
  },
  {
    "concept": "Input/Output",
    "difficulty": "medium",
    "question_text": "Correct way to print variable age:",
    "options": ["printf(age);", "printf(\"%d\", age);", "printf(\"age\");", "print age;"],
    "correct_answer": "B",
    "hint": "Format specifier required.",
    "explanation": "printf(\"%d\", age) is correct."
  },
  {
    "concept": "Input/Output",
    "difficulty": "medium",
    "question_text": "Which format specifier is used for character?",
    "options": ["%d", "%f", "%c", "%s"],
    "correct_answer": "C",
    "hint": "Single character.",
    "explanation": "%c is used for characters."
  },
  {
    "concept": "Input/Output",
    "difficulty": "medium",
    "question_text": "Which function reads formatted input?",
    "options": ["printf()", "scanf()", "gets()", "puts()"],
    "correct_answer": "B",
    "hint": "Opposite of printf.",
    "explanation": "scanf is used for formatted input."
  },
  {
    "concept": "Input/Output",
    "difficulty": "medium",
    "question_text": "What is the output of printf(\"%d\", 10/3);?",
    "options": ["3.33", "3", "4", "Error"],
    "correct_answer": "B",
    "hint": "Integer division.",
    "explanation": "10/3 = 3 in integer division."
  },

  {
    "concept": "Input/Output",
    "difficulty": "hard",
    "question_text": "Why is & used in scanf(\"%d\", &x)?",
    "options": ["Multiplication", "Address of variable", "Logical AND", "Not required"],
    "correct_answer": "B",
    "hint": "Memory address.",
    "explanation": "& gives the memory address of variable."
  },
  {
    "concept": "Input/Output",
    "difficulty": "hard",
    "question_text": "What happens if you use printf(\"%f\", 5);?",
    "options": ["5", "5.000000", "Error", "Garbage value"],
    "correct_answer": "B",
    "hint": "Type conversion may occur.",
    "explanation": "Integer is promoted to float in many compilers."
  },
  {
    "concept": "Input/Output",
    "difficulty": "hard",
    "question_text": "What is wrong with scanf(\"%d %d\", x, y);?",
    "options": ["Nothing", "Missing & operator", "Wrong format", "Too many variables"],
    "correct_answer": "B",
    "hint": "Pointers required.",
    "explanation": "You must use &x and &y in scanf."
  },
  {
    "concept": "Input/Output",
    "difficulty": "hard",
    "question_text": "What will printf(\"%c\", 65); output?",
    "options": ["65", "A", "Error", "Null"],
    "correct_answer": "B",
    "hint": "ASCII value.",
    "explanation": "65 corresponds to character 'A'."
  },
  {
    "concept": "Input/Output",
    "difficulty": "hard",
    "question_text": "Which statement about scanf is correct?",
    "options": [
      "It prints output",
      "It requires variable addresses",
      "It does not use format specifiers",
      "It only reads strings"
    ],
    "correct_answer": "B",
    "hint": "Memory handling.",
    "explanation": "scanf needs memory addresses using & operator."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which keyword is used to make decisions in C?",
    "options": ["loop", "if", "switch", "case"],
    "correct_answer": "B",
    "hint": "Used for conditional execution.",
    "explanation": "The if statement allows the program to execute a block of code only if a condition is true."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "What is the output of this code?\nint x = 5;\nif(x > 0)\n    printf(\"Positive\");",
    "options": ["Nothing", "Positive", "Compile error", "Negative"],
    "correct_answer": "B",
    "hint": "Simple if without else.",
    "explanation": "Since 5 > 0 is true, \"Positive\" is printed."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "The else block executes when the if condition is:",
    "options": ["True", "False", "Zero", "Non-zero"],
    "correct_answer": "B",
    "hint": "else is the alternative path.",
    "explanation": "The else block provides code to run when the condition in the 'if' is false."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "Which is the correct syntax for if-else?",
    "options": ["if (condition) { } else { }", "if condition then else", "if (condition) then else", "if { } else { }"],
    "correct_answer": "A",
    "hint": "Parentheses for the condition, curly braces for blocks.",
    "explanation": "C uses parentheses for the conditional expression and curly braces for the blocks of code."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "In C, the value zero is considered:",
    "options": ["True", "False", "Error", "Positive"],
    "correct_answer": "B",
    "hint": "Any non-zero value is true.",
    "explanation": "In conditional contexts, C treats 0 as false and non-zero values as true."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "What is a 'nested if'?",
    "options": ["if inside another if", "Multiple else statements", "switch inside if", "if without else"],
    "correct_answer": "A",
    "hint": "Think of a Russian doll.",
    "explanation": "Nesting occurs when an 'if' statement is placed within the body of another 'if'."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "The switch statement is primarily used for:",
    "options": ["Range checking", "Multiple discrete values of the same variable", "Floating point comparison", "String comparison"],
    "correct_answer": "B",
    "hint": "Good for menu-driven programs.",
    "explanation": "Switch is efficient for comparing one variable against multiple specific constant values."
  },
  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "Which of these is mandatory to have a valid switch statement?",
    "options": ["default case", "break in every case", "At least one case", "default must be last"],
    "correct_answer": "C",
    "hint": "A switch needs somewhere for the control flow to jump.",
    "explanation": "While 'default' and 'break' are common, a switch must have at least one case to actually do something based on the value."
  },
  {
    "concept": "Control Structures",
    "difficulty": "medium",
    "question_text": "What happens if a 'break' statement is missing in a switch case?",
    "options": ["Compile error", "Fall-through (executes next cases)", "Only that case runs", "Runtime error"],
    "correct_answer": "B",
    "hint": "It continues down.",
    "explanation": "Without a break, the execution 'falls through' to the next case until a break or the end of the switch is reached."
  },
  {
    "concept": "Control Structures",
    "difficulty": "hard",
    "question_text": "Which of the following data types CANNOT be used in a switch expression?",
    "options": ["int", "char", "float", "enum"],
    "correct_answer": "C",
    "hint": "Switch requires an integral type (fixed values).",
    "explanation": "Switch expressions must be of an integral or enumeration type. Floats are not allowed because of precision issues in equality comparisons."
  },
  {
    "concept": "Arrays",
    "difficulty": "easy",
    "question_text": "An array in C is a:",
    "options": ["Collection of different data types", "Collection of same data type elements", "Function", "User-defined data type"],
    "correct_answer": "B",
    "hint": "Fixed size, contiguous memory.",
    "explanation": "An array is a collection of elements of the same data type stored in contiguous memory locations."
  },
  {
    "concept": "Arrays",
    "difficulty": "easy",
    "question_text": "How do you declare a 1D array of 10 integers?",
    "options": ["int a(10);", "int a[10];", "array int a[10];", "int a = 10;"],
    "correct_answer": "B",
    "hint": "Use square brackets for size.",
    "explanation": "The syntax 'int a[10];' is used to declare a 1D array."
  },
  {
    "concept": "Arrays",
    "difficulty": "easy",
    "question_text": "Array index in C starts from:",
    "options": ["1", "0", "-1", "Any number"],
    "correct_answer": "B",
    "hint": "Zero-based indexing.",
    "explanation": "C uses 0 as the starting index for arrays."
  },
  {
    "concept": "Arrays",
    "difficulty": "easy",
    "question_text": "Which operator is used to access array elements?",
    "options": ["()", "[]", "{}", "<>"],
    "correct_answer": "B",
    "hint": "Square brackets.",
    "explanation": "Array elements are accessed using square brackets []."
  },
  {
    "concept": "Arrays",
    "difficulty": "easy",
    "question_text": "Arrays store elements in:",
    "options": ["Random memory locations", "Contiguous memory locations", "Hard disk", "Stack only"],
    "correct_answer": "B",
    "hint": "Memory layout is continuous.",
    "explanation": "Arrays store elements in continuous memory locations."
  },

  {
    "concept": "Arrays",
    "difficulty": "medium",
    "question_text": "What is the maximum index in int arr[5];?",
    "options": ["5", "4", "6", "0"],
    "correct_answer": "B",
    "hint": "Index starts from 0.",
    "explanation": "For size 5 array, index range is 0 to 4."
  },
  {
    "concept": "Arrays",
    "difficulty": "medium",
    "question_text": "A 2D array is also called:",
    "options": ["List", "Matrix", "Stack", "Queue"],
    "correct_answer": "B",
    "hint": "Rows and columns.",
    "explanation": "2D arrays are represented as matrices."
  },
  {
    "concept": "Arrays",
    "difficulty": "medium",
    "question_text": "How do you declare a 2D array of 3x4?",
    "options": ["int a[3,4];", "int a[3][4];", "int a(3)(4);", "int a{3}{4};"],
    "correct_answer": "B",
    "hint": "Multiple square brackets.",
    "explanation": "C uses int a[rows][cols]; syntax."
  },
  {
    "concept": "Arrays",
    "difficulty": "medium",
    "question_text": "What is the default value of uninitialized local array elements?",
    "options": ["0", "Garbage value", "NULL", "1"],
    "correct_answer": "B",
    "hint": "Stack memory behavior.",
    "explanation": "Local arrays contain garbage values if not initialized."
  },
  {
    "concept": "Arrays",
    "difficulty": "medium",
    "question_text": "What happens when array index is negative?",
    "options": ["Returns 0", "Compile error", "Undefined behavior", "Auto correction"],
    "correct_answer": "C",
    "hint": "C does no bounds checking.",
    "explanation": "Accessing negative index causes undefined behavior."
  },

  {
    "concept": "Arrays",
    "difficulty": "hard",
    "question_text": "What is the size of int arr[10] on most systems?",
    "options": ["10 bytes", "40 bytes", "20 bytes", "Depends on compiler only"],
    "correct_answer": "B",
    "hint": "int = 4 bytes usually.",
    "explanation": "10 * 4 bytes = 40 bytes."
  },
  {
    "concept": "Arrays",
    "difficulty": "hard",
    "question_text": "How are arrays passed to functions in C?",
    "options": ["By value", "By reference (pointer)", "By copy", "Not possible"],
    "correct_answer": "B",
    "hint": "Decay to pointer.",
    "explanation": "Arrays decay into pointers when passed to functions."
  },
  {
    "concept": "Arrays",
    "difficulty": "hard",
    "question_text": "What happens if you access arr[100] in int arr[5]?",
    "options": ["Returns 0", "Compile error", "Undefined behavior", "Auto resize"],
    "correct_answer": "C",
    "hint": "No boundary checking in C.",
    "explanation": "Out-of-bounds access leads to undefined behavior."
  },
  {
    "concept": "Arrays",
    "difficulty": "hard",
    "question_text": "Which statement is true about arrays?",
    "options": [
      "They can grow dynamically",
      "They store different data types",
      "They have fixed size in C",
      "They are always heap allocated"
    ],
    "correct_answer": "C",
    "hint": "Size is fixed at declaration.",
    "explanation": "C arrays have fixed size defined at compile time."
  },
  {
    "concept": "Arrays",
    "difficulty": "hard",
    "question_text": "What is the correct reason arrays are efficient?",
    "options": [
      "Random access using index",
      "Dynamic resizing",
      "Different data types storage",
      "Automatic sorting"
    ],
    "correct_answer": "A",
    "hint": "Direct indexing.",
    "explanation": "Arrays allow O(1) access using index due to contiguous memory."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "A string in C is:",
    "options": ["An array of characters ending with \\0", "A built-in data type", "Same as integer array", "A single character"],
    "correct_answer": "A",
    "hint": "Think about how C knows where a string ends — there’s a special terminating character.",
    "explanation": "In C, strings are technically character arrays terminated by a null character ('\\0')."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "How do you declare a string that can hold 20 characters (including terminator)?",
    "options": ["char str[20];", "string str[20];", "char str = \"20\";", "char str(20);"],
    "correct_answer": "A",
    "hint": "In C, strings are just arrays of characters.",
    "explanation": "Strings are declared using character array syntax: char name[size];"
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "Which header file is required for string functions like strlen() and strcpy()?",
    "options": ["<stdio.h>", "<string.h>", "<stdlib.h>", "<math.h>"],
    "correct_answer": "B",
    "hint": "All string-related functions are grouped in one specific standard library header.",
    "explanation": "string.h contains declarations for string manipulation functions."
  },
  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "What is the correct way to initialize a string?",
    "options": ["char str[] = \"Hello\";", "char str = \"Hello\";", "char str[6] = 'Hello';", "char str = 'Hello';"],
    "correct_answer": "A",
    "hint": "String literals use double quotes and automatically include the null character.",
    "explanation": "Double quotes denote a string literal which C treats as a null-terminated char array."
  },
  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "The strlen() function returns:",
    "options": ["Length including \\0", "Length excluding \\0", "Size of array", "Number of words"],
    "correct_answer": "B",
    "hint": "strlen() counts only visible characters, not the terminator.",
    "explanation": "strlen() returns the number of characters in the string before the null terminator."
  },
  {
    "concept": "Strings",
    "difficulty": "hard",
    "question_text": "To read a string with spaces using scanf, we use:",
    "options": ["%s", "%c", "%[^\\n]", "%d"],
    "correct_answer": "C",
    "hint": "%s stops reading at spaces — you need a format that reads until a newline.",
    "explanation": "%[^\\n] tells scanf to read all characters until a newline character is encountered."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "A string in C is a:",
    "options": ["Single character", "Array of characters", "Integer type", "Function"],
    "correct_answer": "B",
    "hint": "Think of characters stored together.",
    "explanation": "A string in C is a sequence (array) of characters ending with '\\0'."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "Which symbol marks the end of a string in C?",
    "options": ["\\n", "\\t", "\\0", "\\r"],
    "correct_answer": "C",
    "hint": "Null character.",
    "explanation": "Strings in C end with the null character '\\0'."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "How do you declare a string in C?",
    "options": ["string s;", "char s[];", "int s[];", "char* s; only"],
    "correct_answer": "B",
    "hint": "Array of characters.",
    "explanation": "Strings are declared as arrays of characters in C."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "Which function is used to find the length of a string?",
    "options": ["strlen()", "size()", "length()", "strsize()"],
    "correct_answer": "A",
    "hint": "String length function.",
    "explanation": "strlen() returns the number of characters in a string excluding '\\0'."
  },
  {
    "concept": "Strings",
    "difficulty": "easy",
    "question_text": "Which header file is required for string functions?",
    "options": ["<stdio.h>", "<string.h>", "<stdlib.h>", "<math.h>"],
    "correct_answer": "B",
    "hint": "String library.",
    "explanation": "All string functions are defined in <string.h>."
  },

  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "strcpy(dest, src) does:",
    "options": ["Compares two strings", "Copies src into dest", "Concatenates strings", "Finds length"],
    "correct_answer": "B",
    "hint": "String copy function.",
    "explanation": "strcpy copies source string into destination."
  },
  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "What does strcmp(str1, str2) return if both strings are equal?",
    "options": ["1", "0", "-1", "True"],
    "correct_answer": "B",
    "hint": "Equality returns zero.",
    "explanation": "strcmp returns 0 when both strings are identical."
  },
  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "Which function is used to concatenate strings?",
    "options": ["strcpy()", "strcmp()", "strcat()", "strlen()"],
    "correct_answer": "C",
    "hint": "Join strings together.",
    "explanation": "strcat joins two strings together."
  },
  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "What is the correct format specifier for strings in printf?",
    "options": ["%c", "%s", "%d", "%f"],
    "correct_answer": "B",
    "hint": "String format.",
    "explanation": "%s is used to print strings."
  },
  {
    "concept": "Strings",
    "difficulty": "medium",
    "question_text": "What happens if string is not null-terminated?",
    "options": ["Works normally", "Undefined behavior", "Compile error", "Auto fixed"],
    "correct_answer": "B",
    "hint": "C relies on \\0.",
    "explanation": "Without '\\0', string functions may read invalid memory."
  },

  {
    "concept": "Strings",
    "difficulty": "hard",
    "question_text": "What is a common mistake in scanf(\"%s\", str);?",
    "options": ["Using & with string", "Not allocating enough memory", "Using %d", "Using printf instead"],
    "correct_answer": "B",
    "hint": "Buffer overflow risk.",
    "explanation": "If input exceeds allocated size, it causes buffer overflow."
  },
  {
    "concept": "Strings",
    "difficulty": "hard",
    "question_text": "What is the time complexity of strlen()?",
    "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    "correct_answer": "B",
    "hint": "It scans each character.",
    "explanation": "strlen iterates through each character until '\\0'."
  },
  {
    "concept": "Strings",
    "difficulty": "hard",
    "question_text": "What happens if you use strcpy without enough space in destination?",
    "options": ["Safe copy", "Buffer overflow", "Compile error", "Auto resize"],
    "correct_answer": "B",
    "hint": "Memory safety issue.",
    "explanation": "It leads to buffer overflow and undefined behavior."
  },
  {
    "concept": "Strings",
    "difficulty": "hard",
    "question_text": "Which function compares strings case-sensitively?",
    "options": ["strcmp()", "strcpy()", "strlen()", "strcat()"],
    "correct_answer": "A",
    "hint": "Comparison function.",
    "explanation": "strcmp compares two strings character by character."
  },
  {
    "concept": "Strings",
    "difficulty": "hard",
    "question_text": "What is required for a valid C string?",
    "options": [
      "Must end with null character",
      "Must contain numbers",
      "Must be fixed size",
      "Must use malloc"
    ],
    "correct_answer": "A",
    "hint": "Termination rule.",
    "explanation": "A valid C string must end with '\\0'."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for incrementing a variable by 1?",
    "options": ["+", "++", "+=", "1+"],
    "correct_answer": "B",
    "hint": "Unary operator.",
    "explanation": "The ++ operator increases the value of a variable by 1."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "What is the result of 5 / 2 in C?",
    "options": ["2.5", "2", "3", "Error"],
    "correct_answer": "B",
    "hint": "Integer division truncates results.",
    "explanation": "In C, integer division results in an integer, discarding the remainder."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "Which operator has higher precedence: * or + ?",
    "options": ["+", "*", "Same precedence", "Depends on parentheses"],
    "correct_answer": "B",
    "hint": "PEMDAS/BODMAS.",
    "explanation": "Multiplication has higher precedence than addition in C."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "The && operator is used for:",
    "options": ["Logical OR", "Logical AND", "Bitwise AND", "Logical NOT"],
    "correct_answer": "B",
    "hint": "Both conditions must be true.",
    "explanation": "&& is the logical AND operator in C."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "The || operator is used for:",
    "options": ["Logical OR", "Logical AND", "Bitwise OR", "Bitwise XOR"],
    "correct_answer": "A",
    "hint": "At least one condition must be true.",
    "explanation": "|| is the logical OR operator in C."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "The ! operator is used for:",
    "options": ["Logical AND", "Factorial", "Logical NOT (Negation)", "Inequality"],
    "correct_answer": "C",
    "hint": "It flips the truth value.",
    "explanation": "! is the logical negation operator."
  },
  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "What is the ternary operator in C?",
    "options": ["if-else", "? :", "switch", "while"],
    "correct_answer": "B",
    "hint": "It's the only operator with three operands.",
    "explanation": "The ternary operator ? : provides a shorthand for if-else expressions."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "The sizeof operator returns:",
    "options": ["Value of variable", "Memory address", "Size in bytes", "Size in bits"],
    "correct_answer": "C",
    "hint": "Useful for memory allocation.",
    "explanation": "sizeof returns the size of a variable or data type in bytes."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "What is the return type of a function that does not return any value?",
    "options": ["int", "null", "void", "empty"],
    "correct_answer": "C",
    "hint": "Void means nothing.",
    "explanation": "'void' indicates a function provides no return value to the caller."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "Which keyword is used to send a value back from a function?",
    "options": ["send", "back", "return", "output"],
    "correct_answer": "C",
    "hint": "Standard C keyword.",
    "explanation": "The 'return' statement is used to send a value back from a function."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "Which function is the starting point of every C program?",
    "options": ["start", "begin", "main", "init"],
    "correct_answer": "C",
    "hint": "Program execution begins here.",
    "explanation": "Execution always starts from the main() function."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "What is one main benefit of functions?",
    "options": ["Faster CPU", "Code reusability", "Less RAM usage", "Auto debugging"],
    "correct_answer": "B",
    "hint": "Avoid repetition.",
    "explanation": "Functions allow code reuse and modular programming."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "Variables declared inside a function are called:",
    "options": ["Global variables", "Local variables", "External variables", "System variables"],
    "correct_answer": "B",
    "hint": "Scope is limited.",
    "explanation": "Variables inside a function have local scope."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "What is a function prototype?",
    "options": ["Function definition", "Function declaration", "Loop structure", "Header file"],
    "correct_answer": "B",
    "hint": "Declared before use.",
    "explanation": "A prototype declares a function before its definition."
  },

  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "A function that calls itself is called:",
    "options": ["Loop function", "Recursive function", "Static function", "Inline function"],
    "correct_answer": "B",
    "hint": "Self-calling function.",
    "explanation": "Recursion is when a function calls itself."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "Local variables are stored in:",
    "options": ["Heap", "Stack", "ROM", "Disk"],
    "correct_answer": "B",
    "hint": "Automatic memory area.",
    "explanation": "Local variables are stored in the stack memory."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "Arguments passed in function call are called:",
    "options": ["Formal parameters", "Actual parameters", "Local variables", "Pointers"],
    "correct_answer": "B",
    "hint": "Values at call time.",
    "explanation": "Actual parameters are values passed to a function."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "Which function terminates program execution?",
    "options": ["return()", "exit()", "stop()", "break()"],
    "correct_answer": "B",
    "hint": "stdlib.h function.",
    "explanation": "exit() terminates the program immediately."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "What is function overloading in C?",
    "options": ["Supported feature", "Not supported", "Loop feature", "Memory feature"],
    "correct_answer": "B",
    "hint": "Compare with C++.",
    "explanation": "C does NOT support function overloading."
  },

  {
    "concept": "Functions",
    "difficulty": "hard",
    "question_text": "What happens if a recursive function has no base case?",
    "options": ["Normal execution", "Infinite recursion", "Compile error", "Optimization"],
    "correct_answer": "B",
    "hint": "Stops condition missing.",
    "explanation": "It leads to infinite recursion and stack overflow."
  },
  {
    "concept": "Functions",
    "difficulty": "hard",
    "question_text": "What is returned if no return statement is used in a non-void function?",
    "options": ["0", "Garbage value", "NULL", "Compiler error"],
    "correct_answer": "B",
    "hint": "Undefined behavior.",
    "explanation": "Missing return in non-void functions leads to undefined behavior."
  },
  {
    "concept": "Functions",
    "difficulty": "hard",
    "question_text": "Which memory is affected by recursive function calls?",
    "options": ["Heap", "Stack", "Static memory", "ROM"],
    "correct_answer": "B",
    "hint": "Function calls stack up.",
    "explanation": "Each recursive call uses stack memory."
  },
  {
    "concept": "Functions",
    "difficulty": "hard",
    "question_text": "What is function scope in C?",
    "options": ["Global access", "Visibility of variables/functions", "Memory size", "Execution speed"],
    "correct_answer": "B",
    "hint": "Where it can be accessed.",
    "explanation": "Scope defines where variables or functions are accessible."
  },
  {
    "concept": "Functions",
    "difficulty": "hard",
    "question_text": "Which is true about function parameters in C?",
    "options": [
      "Passed by reference always",
      "Passed by value by default",
      "Not supported",
      "Only pointers allowed"
    ],
    "correct_answer": "B",
    "hint": "Default behavior.",
    "explanation": "C passes arguments by value unless pointers are used."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "What is a pointer in C?",
    "options": ["A variable that stores a value", "A variable that stores a memory address", "A function", "A data type"],
    "correct_answer": "B",
    "hint": "It 'points' to a location.",
    "explanation": "A pointer is a variable whose value is the address of another variable."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "Which operator is used to get the memory address of a variable?",
    "options": ["*", "&", "&&", "->"],
    "correct_answer": "B",
    "hint": "Address-of operator.",
    "explanation": "The & operator returns the memory address of its operand."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "Which operator is used to access the value at the address held by a pointer?",
    "options": ["&", "*", "->", "."],
    "correct_answer": "B",
    "hint": "Dereference operator.",
    "explanation": "The * operator (when used with a pointer) retrieves the value stored at that address."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "Which operator is used to get the address of a variable?",
    "options": ["*", "&", "#", "@"],
    "correct_answer": "B",
    "hint": "Address-of operator.",
    "explanation": "The & operator returns the memory address of a variable."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "A pointer stores:",
    "options": ["A value", "A memory address", "A function", "A file"],
    "correct_answer": "B",
    "hint": "Think memory location.",
    "explanation": "A pointer stores the address of another variable."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "What is NULL pointer used for?",
    "options": ["Random value", "Points to nothing", "Stores data", "Loops"],
    "correct_answer": "B",
    "hint": "Represents empty reference.",
    "explanation": "NULL indicates that the pointer does not point to any valid memory."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "Which symbol is used for pointer declaration?",
    "options": ["*", "&", "%", "#"],
    "correct_answer": "A",
    "hint": "Used in int *ptr;",
    "explanation": "The * symbol is used to declare a pointer variable."
  },

  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "What is a NULL pointer?",
    "options": ["Uninitialized pointer", "Pointer pointing to address 0", "Invalid pointer only", "Function pointer"],
    "correct_answer": "B",
    "hint": "No valid memory reference.",
    "explanation": "A NULL pointer points to address 0 and represents no valid memory location."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "Size of pointer on a 64-bit system is usually:",
    "options": ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
    "correct_answer": "C",
    "hint": "Memory address size.",
    "explanation": "On 64-bit systems, pointers are 8 bytes."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "In C, array name is treated as:",
    "options": ["Integer", "Pointer to first element", "Function", "Structure"],
    "correct_answer": "B",
    "hint": "arr == &arr[0]",
    "explanation": "Array name decays to a pointer to the first element."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "Which operator is used to access structure members using a pointer?",
    "options": [".", "->", "::", "*"],
    "correct_answer": "B",
    "hint": "Arrow operator.",
    "explanation": "-> is used to access members of a structure via pointer."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "What does ptr++ do for an int pointer?",
    "options": [
      "Increments by 1 byte",
      "Moves to next int location",
      "Increments value only",
      "Decrements pointer"
    ],
    "correct_answer": "B",
    "hint": "Pointer arithmetic depends on data type.",
    "explanation": "ptr++ moves pointer by sizeof(int)."
  },

  {
    "concept": "Pointers",
    "difficulty": "hard",
    "question_text": "What is a dangling pointer?",
    "options": [
      "Pointer to NULL",
      "Pointer to freed memory",
      "Pointer to stack",
      "Pointer to array"
    ],
    "correct_answer": "B",
    "hint": "Memory no longer valid.",
    "explanation": "A dangling pointer points to memory that has been freed."
  },
  {
    "concept": "Pointers",
    "difficulty": "hard",
    "question_text": "What is a void pointer?",
    "options": [
      "Pointer to void function",
      "Generic pointer type",
      "NULL pointer",
      "Uninitialized pointer"
    ],
    "correct_answer": "B",
    "hint": "Can point to any type.",
    "explanation": "void pointer can store address of any data type."
  },
  {
    "concept": "Pointers",
    "difficulty": "hard",
    "question_text": "Can we directly dereference a void pointer?",
    "options": ["Yes", "No", "Only in C++", "Only in arrays"],
    "correct_answer": "B",
    "hint": "Type is unknown.",
    "explanation": "Void pointers must be cast before dereferencing."
  },
  {
    "concept": "Pointers",
    "difficulty": "hard",
    "question_text": "What happens if you access uninitialized pointer?",
    "options": [
      "Works normally",
      "Undefined behavior",
      "Compile error",
      "Safe default value"
    ],
    "correct_answer": "B",
    "hint": "Dangerous memory access.",
    "explanation": "Uninitialized pointers may point to random memory causing undefined behavior."
  },
  {
    "concept": "Pointers",
    "difficulty": "hard",
    "question_text": "Which is true about pointer arithmetic?",
    "options": [
      "Adds 1 byte always",
      "Depends on data type size",
      "Not allowed in C",
      "Only works with arrays"
    ],
    "correct_answer": "B",
    "hint": "Type-based movement.",
    "explanation": "Pointer arithmetic moves based on size of data type."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "easy",
    "question_text": "Which keyword is used to define a structure in C?",
    "options": ["union", "struct", "class", "record"],
    "correct_answer": "B",
    "hint": "Short for structure.",
    "explanation": "The 'struct' keyword defines a user-defined data type that groups related variables."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "medium",
    "question_text": "What is the primary difference between a struct and a union in terms of memory?",
    "options": ["No difference", "struct members share the same space; union members have separate space", "union members share the same space; struct members have separate space", "union is for strings only"],
    "correct_answer": "C",
    "hint": "One is for grouping, one is for space-saving.",
    "explanation": "A struct allocates space for all its members. A union allocates only enough space for its largest member, which all members share."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "easy",
    "question_text": "How do you access a member of a structure variable 's'?",
    "options": ["s->member", "s.member", "s(member)", "s[member]"],
    "correct_answer": "B",
    "hint": "The dot operator.",
    "explanation": "The '.' (dot) operator is used to access members of a structure object directly."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "medium",
    "question_text": "How do you access a member of a structure via a pointer 'ptr'?",
    "options": ["ptr.member", "ptr->member", "ptr(member)", "*ptr.member"],
    "correct_answer": "B",
    "hint": "The arrow operator.",
    "explanation": "The '->' (arrow) operator is shorthand for (*ptr).member."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "medium",
    "question_text": "What is the size of this union?\nunion { int a; char b; double c; };",
    "options": ["Size of int + char + double", "Size of double (largest member)", "Size of char", "Depends on compiler"],
    "correct_answer": "B",
    "hint": "Unions use the same memory block for all members.",
    "explanation": "A union's size is determined by its largest member (typically 'double' here: 8 bytes)."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "medium",
    "question_text": "Can a structure contain another structure as a member?",
    "options": ["No", "Only if it's the same type", "Yes (Nested structures)", "Only as pointers"],
    "correct_answer": "C",
    "hint": "Think of address inside person.",
    "explanation": "C allows nesting of structures to represent hierarchical data."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "hard",
    "question_text": "Why might the sizeof a struct be larger than the sum of its members' sizes?",
    "options": ["Compiler error", "Padding for memory alignment", "Hidden metadata", "It's not possible"],
    "correct_answer": "B",
    "hint": "Efficiency in memory access.",
    "explanation": "Compilers insert extra bytes (padding) between members to ensure they are aligned on memory boundaries for faster access."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "hard",
    "question_text": "Bit fields in structures allow:",
    "options": ["Accessing bits of a variable", "Specifying exactly how many bits each member uses", "Faster math", "Encryption"],
    "correct_answer": "B",
    "hint": "Useful for memory-constrained systems.",
    "explanation": "Bit fields enable compact storage by specifying the bit-width of integer members."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "medium",
    "question_text": "Unions are best used when:",
    "options": ["You need to store multiple values at once", "You need to store only one of several possible values at a time", "You need dynamic arrays", "Memory is infinite"],
    "correct_answer": "B",
    "hint": "It's a way to reuse the same memory for different types.",
    "explanation": "Unions save space by allowing different data types to occupy the same memory location when they aren't needed simultaneously."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "easy",
    "question_text": "A structure can be initialized using:",
    "options": ["[ ]", "{ }", "( )", "< >"],
    "correct_answer": "B",
    "hint": "Brace-enclosed initializer list.",
    "explanation": "Like arrays, structures can be initialized at declaration using curly braces."
  },
  {
    "concept": "Memory Management",
    "difficulty": "easy",
    "question_text": "Which function is used to allocate memory dynamically in C?",
    "options": ["alloc()", "malloc()", "new()", "create()"],
    "correct_answer": "B",
    "hint": "Memory allocation.",
    "explanation": "malloc() allocates a block of uninitialized memory on the heap."
  },
  {
    "concept": "Memory Management",
    "difficulty": "medium",
    "question_text": "How is calloc() different from malloc()?",
    "options": ["It is faster", "It initializes memory to zero", "It takes only one argument", "There is no difference"],
    "correct_answer": "B",
    "hint": "Clear Allocation.",
    "explanation": "calloc() initializes all bits of the allocated memory to zero and takes two arguments (number of elements and size of each)."
  },
  {
    "concept": "Memory Management",
    "difficulty": "medium",
    "question_text": "Which function is used to change the size of a previously allocated memory block?",
    "options": ["resize()", "modify()", "realloc()", "update()"],
    "correct_answer": "C",
    "hint": "Re-allocation.",
    "explanation": "realloc() adjusts the size of an existing heap memory block, potentially moving it."
  },
  {
    "concept": "Memory Management",
    "difficulty": "easy",
    "question_text": "Which function is used to release dynamic memory back to the system?",
    "options": ["delete()", "free()", "release()", "clear()"],
    "correct_answer": "B",
    "hint": "Opposite of malloc.",
    "explanation": "The free() function deallocates memory previously allocated by malloc, calloc, or realloc."
  },
  {
    "concept": "Memory Management",
    "difficulty": "medium",
    "question_text": "Where is dynamic memory (allocated via malloc) stored?",
    "options": ["Stack", "Heap", "Global memory", "Registers"],
    "correct_answer": "B",
    "hint": "Manual memory segment.",
    "explanation": "Dynamic memory allocation happens in the heap segment of a program's memory."
  },
  {
    "concept": "Memory Management",
    "difficulty": "hard",
    "question_text": "What is a memory leak?",
    "options": ["Program crashing due to lack of memory", "Allocating memory and losing the pointer without freeing it", "Accessing memory outside an array", "Slow CPU performance"],
    "correct_answer": "B",
    "hint": "Memory is 'leaked' because it can't be recovered or reused.",
    "explanation": "A memory leak occurs when a program fails to release memory it no longer needs, eventually exhausting available memory."
  },
  {
    "concept": "Memory Management",
    "difficulty": "medium",
    "question_text": "What does malloc() return?",
    "options": ["int pointer", "char pointer", "void pointer", "NULL always"],
    "correct_answer": "C",
    "hint": "A pointer to any type.",
    "explanation": "malloc returns a void * (void pointer), which can be cast to any specific data type pointer."
  },
  {
    "concept": "Memory Management",
    "difficulty": "medium",
    "question_text": "If malloc() fails to allocate the requested memory, it returns:",
    "options": ["0", "NULL", "-1", "Error message"],
    "correct_answer": "B",
    "hint": "Standard way to indicate failure in C pointers.",
    "explanation": "Malloc returns NULL if the requested memory couldn't be allocated (e.g., system out of memory)."
  },
  {
    "concept": "Memory Management",
    "difficulty": "hard",
    "question_text": "To avoid dangling pointers after calling free(ptr), it's good practice to:",
    "options": ["Call free again", "Set ptr = NULL", "Delete the variable", "Restart the program"],
    "correct_answer": "B",
    "hint": "Prevents accidental access to freed memory.",
    "explanation": "Setting a pointer to NULL after freeing it ensures that subsequent checks (if ptr != NULL) will correctly identify it as invalid."
  },
  {
    "concept": "Memory Management",
    "difficulty": "hard",
    "question_text": "Stack memory is ________ than heap memory.",
    "options": ["Slower but larger", "Faster but more limited in size", "Manually managed", "Shared between all processes"],
    "correct_answer": "B",
    "hint": "Fast allocation via pointer decrement/increment.",
    "explanation": "Stack allocation is extremely fast and automatic but has a fixed size limit set at program start."
  },
  {
    "concept": "File Handling",
    "difficulty": "easy",
    "question_text": "Which header file is required for file handling functions in C?",
    "options": ["<file.h>", "<stdio.h>", "<stdlib.h>", "<conio.h>"],
    "correct_answer": "B",
    "hint": "Files are part of standard input/output.",
    "explanation": "stdio.h contains the definitions for FILE structure and functions like fopen, fclose, etc."
  },
  {
    "concept": "File Handling",
    "difficulty": "easy",
    "question_text": "What type of pointer is used to manage files in C?",
    "options": ["int *", "void *", "FILE *", "char *"],
    "correct_answer": "C",
    "hint": "It's a special structure pointer.",
    "explanation": "The FILE type is a structure that stores information about the state of a file stream."
  },
  {
    "concept": "File Handling",
    "difficulty": "easy",
    "question_text": "Which function is used to open a file?",
    "options": ["open()", "fopen()", "file_open()", "load()"],
    "correct_answer": "B",
    "hint": "F-open.",
    "explanation": "fopen() is used to create a new file or open an existing one."
  },
  {
    "concept": "File Handling",
    "difficulty": "medium",
    "question_text": "Which mode is used to open a file for reading only?",
    "options": ["'w'", "'r'", "'a'", "'read'"],
    "correct_answer": "B",
    "hint": "First letter of 'read'.",
    "explanation": "'r' opens a file for reading; if the file doesn't exist, it returns NULL."
  },
  {
    "concept": "File Handling",
    "difficulty": "medium",
    "question_text": "What does the 'w' mode do if the file already exists?",
    "options": ["Appends to it", "Returns an error", "Overwrites it (truncates)", "Does nothing"],
    "correct_answer": "C",
    "hint": "It starts fresh.",
    "explanation": "'w' mode creates a new file or overwrites an existing file's contents."
  },
  {
    "concept": "File Handling",
    "difficulty": "medium",
    "question_text": "Which mode is used to add data to the end of an existing file?",
    "options": ["'w'", "'r'", "'a'", "'+r'"],
    "correct_answer": "C",
    "hint": "First letter of 'append'.",
    "explanation": "'a' (append) mode allows writing to the end of a file without deleting previous content."
  },
  {
    "concept": "File Handling",
    "difficulty": "easy",
    "question_text": "Which function is used to close a file stream?",
    "options": ["close()", "fclose()", "stop()", "end()"],
    "correct_answer": "B",
    "hint": "F-close.",
    "explanation": "fclose() releases resources and ensures all data is written (flushed) to the disk."
  },
  {
    "concept": "File Handling",
    "difficulty": "medium",
    "question_text": "What is EOF in C file handling?",
    "options": ["End Of Function", "End Of File", "Error Of File", "Every Other File"],
    "correct_answer": "B",
    "hint": "It marks the termination of a file.",
    "explanation": "EOF is a constant (usually -1) returned when no more input is available."
  },
  {
    "concept": "File Handling",
    "difficulty": "medium",
    "question_text": "Which function reads a single character from a file?",
    "options": ["read()", "scanf()", "fgetc()", "get()"],
    "correct_answer": "C",
    "hint": "File-get-character.",
    "explanation": "fgetc() fetches the next character from the stream pointed to by the FILE pointer."
  },
  {
    "concept": "File Handling",
    "difficulty": "hard",
    "question_text": "What should fopen() return if a file cannot be opened?",
    "options": ["-1", "0", "NULL", "EXIT_FAILURE"],
    "correct_answer": "C",
    "hint": "Common pointer failure value.",
    "explanation": "If an error occurs while opening a file, fopen returns the value NULL."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "easy",
    "question_text": "All preprocessor directives in C begin with which symbol?",
    "options": ["$", "@", "#", "&"],
    "correct_answer": "C",
    "hint": "Think of hashtag.",
    "explanation": "Preprocessor commands start with '#', telling the compiler to process them before actual compilation."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "medium",
    "question_text": "What is the difference between #include <file.h> and #include \"file.h\"?",
    "options": ["No difference", "<> is for system libraries; \"\" is for user libraries", "<> is for C++; \"\" is for C", "<> is faster"],
    "correct_answer": "B",
    "hint": "Angle brackets vs quotes.",
    "explanation": "Angle brackets search standard system paths; double quotes search the current directory first."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "easy",
    "question_text": "Which directive is used to define a constant macro?",
    "options": ["#const", "#define", "#macro", "#set"],
    "correct_answer": "B",
    "hint": "Defining a name.",
    "explanation": "#define creates a symbolic constant or macro that the preprocessor replaces in the source code."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "hard",
    "question_text": "What does #ifndef do?",
    "options": ["If Next Define", "If Not Defined", "Is Now Fixed", "Include No File"],
    "correct_answer": "B",
    "hint": "Conditional compilation check.",
    "explanation": "#ifndef checks if a macro has NOT been defined, often used in header guards to prevent double inclusion."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "medium",
    "question_text": "Which directive completes an #if or #ifdef block?",
    "options": ["#end", "#endif", "#finish", "#done"],
    "correct_answer": "B",
    "hint": "End-if.",
    "explanation": "Every conditional preprocessor block must be terminated with #endif."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "easy",
    "question_text": "What does #include do?",
    "options": ["Defines variable", "Includes header file", "Runs loop", "Ends program"],
    "correct_answer": "B",
    "hint": "Header inclusion.",
    "explanation": "#include inserts header files."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "easy",
    "question_text": "#define is used for:",
    "options": ["Functions", "Constants/macros", "Loops", "Files"],
    "correct_answer": "B",
    "hint": "Macro definition.",
    "explanation": "#define creates symbolic constants."
  },

  {
    "concept": "Preprocessor Directives",
    "difficulty": "hard",
    "question_text": "What is macro expansion?",
    "options": [
      "Runtime execution",
      "Compile-time replacement",
      "Memory allocation",
      "Loop execution"
    ],
    "correct_answer": "B",
    "hint": "Preprocessing stage.",
    "explanation": "Macros are replaced before compilation."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "hard",
    "question_text": "What is header guard used for?",
    "options": [
      "Speed optimization",
      "Prevent multiple inclusion",
      "Memory control",
      "Loop control"
    ],
    "correct_answer": "B",
    "hint": "#ifndef usage.",
    "explanation": "Header guards prevent duplicate inclusion."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "hard",
    "question_text": "Which stage runs preprocessor?",
    "options": [
      "After compilation",
      "Before compilation",
      "During execution",
      "After execution"
    ],
    "correct_answer": "B",
    "hint": "First step.",
    "explanation": "Preprocessor runs before compilation."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "hard",
    "question_text": "What does the pre-defined macro __FILE__ contain?",
    "options": ["The size of the file", "The name of the current source file", "The file's creation date", "The file's path"],
    "correct_answer": "B",
    "hint": "Current file context.",
    "explanation": "__FILE__ expands to a string literal containing the name of the source file being compiled."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "medium",
    "question_text": "What is the result of this macro: #define MAX(a,b) (a > b ? a : b) if called as MAX(5, 10)?",
    "options": ["5", "10", "Error", "15"],
    "correct_answer": "B",
    "hint": "It's a simple comparison macro.",
    "explanation": "The macro replaces MAX(5, 10) with (5 > 10 ? 5 : 10), which evaluates to 10."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "medium",
    "question_text": "How do you remove a macro's value?",
    "options": ["#remove", "#undef", "#delete", "#clear"],
    "correct_answer": "B",
    "hint": "Un-define.",
    "explanation": "#undef is used to undefine a macro so that it's no longer recognized."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "hard",
    "question_text": "Preprocessor directives are executed by:",
    "options": ["The Compiler", "The Linker", "The Preprocessor", "The CPU"],
    "correct_answer": "C",
    "hint": "It's the very first stage of transformation.",
    "explanation": "The preprocessor follows directives and modifies the source code before it reaches the compiler."
  },
  {
    "concept": "Preprocessor Directives",
    "difficulty": "medium",
    "question_text": "What does #ifdef HEADER_H do?",
    "options": ["Includes HEADER_H", "Checks if HEADER_H is already defined", "Defines HEADER_H", "Tests if header exists"],
    "correct_answer": "B",
    "hint": "If-Defined.",
    "explanation": "#ifdef checks if a specific macro exists."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Implicit type conversion is also known as:",
    "options": ["Forcing", "Promotion", "Coercion", "Narrowing"],
    "correct_answer": "C",
    "hint": "Automatically done by compiler.",
    "explanation": "Type coercion happens automatically when the compiler converts one type to another (e.g. char to int)."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Which is the correct syntax for explicit type casting in C?",
    "options": ["(type)value", "value(type)", "cast(type, value)", "<type>value"],
    "correct_answer": "A",
    "hint": "Target type in parentheses.",
    "explanation": "Explicit casting uses the form (target_type) expression."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "What happens when you cast a float 9.99 to an int?",
    "options": ["It becomes 10", "It becomes 9", "It causes an error", "It becomes 9.99"],
    "correct_answer": "B",
    "hint": "Truncation.",
    "explanation": "Conversion from floating point to integer discards the fractional part (truncation towards zero)."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "Integer promotion occurs when:",
    "options": ["A large type is converted to small", "A small integral type (like char) is used in an expression with int", "A variable is assigned to zero", "A value is printed"],
    "correct_answer": "B",
    "hint": "Small types 'move up' during math.",
    "explanation": "C automatically promotes char and short to int during arithmetic operations for efficiency."
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "What is 'narrowing conversion'?",
    "options": ["Converting from a smaller to a larger type", "Converting from a larger to a smaller type (potential data loss)", "Converting pointers", "Reducing number of variables"],
    "correct_answer": "B",
    "hint": "Think of fitting a big box into a small one.",
    "explanation": "Narrowing occurs when you cast a type with a larger range (like double) to a smaller range (like float), which can lead to overflow or loss of precision."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "When an int is added to a double, the resulting type is:",
    "options": ["int", "double", "float", "long"],
    "correct_answer": "B",
    "hint": "C promotes to the more 'expressive' type.",
    "explanation": "To avoid precision loss, C converts the integer to double before performing the addition."
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "What is the danger of casting a pointer to a smaller integer type?",
    "options": ["No danger", "Pointer is corrupted (address truncation)", "Memory is freed", "Speed is reduced"],
    "correct_answer": "B",
    "hint": "Addresses are usually 64-bit; ints are 32-bit.",
    "explanation": "If a memory address (pointer) is larger than the integer type it's cast to, the address will be truncated, making it invalid."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "Explicit casting is primarily used for:",
    "options": ["Making code run faster", "Overriding default compiler conversions", "Defining new data types", "Reducing file size"],
    "correct_answer": "B",
    "hint": "Giving the programmer more control.",
    "explanation": "Programmers use explicit casts to force a conversion that the compiler wouldn't do automatically (or would warn about)."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Casting a character 'A' to an int results in:",
    "options": ["'A'", "65", "1", "0"],
    "correct_answer": "B",
    "hint": "ASCII value.",
    "explanation": "Characters are stored internally as their ASCII integer codes."
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "Overflow occurred during casting refers to:",
    "options": ["Using too much memory", "Assigning a value too large for the target type", "Looping forever", "A pointer error"],
    "correct_answer": "B",
    "hint": "Variable cannot hold the value.",
    "explanation": "When an assigned value exceeds the range of the target data type, it 'overflows', resulting in incorrect values."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "Which operator is used for bitwise AND?",
    "options": ["&&", "&", "|", "^"],
    "correct_answer": "B",
    "hint": "Single ampersand.",
    "explanation": "& performs a bitwise AND operation, comparing each bit of two integers."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "Which operator is used for bitwise OR?",
    "options": ["||", "|", "&", "~"],
    "correct_answer": "B",
    "hint": "Single vertical bar.",
    "explanation": "| performs a bitwise OR operation."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "The ^ operator in C represents:",
    "options": ["Power (Exponent)", "Bitwise XOR", "Bitwise NOT", "Pointer"],
    "correct_answer": "B",
    "hint": "Exclusive OR.",
    "explanation": "^ is the bitwise XOR (Exclusive OR) operator."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "Which operator is used for bitwise NOT (one's complement)?",
    "options": ["!", "~", "&", "|"],
    "correct_answer": "B",
    "hint": "Tilde symbol.",
    "explanation": "~ flips all bits of its operand (0 becomes 1, 1 becomes 0)."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "What does the << operator do?",
    "options": ["Compares less than", "Left shift bits", "Right shift bits", "Multiplies by 10"],
    "correct_answer": "B",
    "hint": "Moves bits to the left, adding zeros at the end.",
    "explanation": "<< shifts bits to the left, which is equivalent to multiplying by powers of 2."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "What is the equivalent of x >> 1?",
    "options": ["x * 2", "x / 2", "x + 1", "x - 1"],
    "correct_answer": "B",
    "hint": "Right shift by one position.",
    "explanation": "Shifting an integer right by one bit is equivalent to floor division by 2."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "How do you check if the n-th bit of a number x is set?",
    "options": ["x & (1 << n)", "x | (1 << n)", "x ^ (1 << n)", "x >> n"],
    "correct_answer": "A",
    "hint": "Use a mask with only the n-th bit as 1.",
    "explanation": "By shifting 1 left by n and using bitwise AND, you isolate the n-th bit."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "Which operation is used to toggle (flip) a specific bit?",
    "options": ["AND", "OR", "XOR", "NOT"],
    "correct_answer": "C",
    "hint": "XOR with 1 flips a bit.",
    "explanation": "x ^ (1 << n) will toggle the n-th bit of x."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "Which operation is used to set a specific bit to 1?",
    "options": ["x & (1 << n)", "x | (1 << n)", "x ^ (1 << n)", "~x"],
    "correct_answer": "B",
    "hint": "OR with 1 forces the result to 1.",
    "explanation": "Bitwise OR with a bitmask is used to turn on (set) specific bits."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "How do you clear (set to 0) the n-th bit of x?",
    "options": ["x & ~(1 << n)", "x | ~(1 << n)", "x ^ (1 << n)", "x >> n"],
    "correct_answer": "A",
    "hint": "AND with a mask where the n-th bit is 0 and others are 1.",
    "explanation": "Using a negated mask with bitwise AND clears the specific bit while preserving others."
  },
  {
    "concept": "Error Handling",
    "difficulty": "medium",
    "question_text": "Which global variable is used by C functions to indicate an error code?",
    "options": ["error", "err_code", "errno", "status"],
    "correct_answer": "C",
    "hint": "Defined in <errno.h>.",
    "explanation": "errno is a thread-local global integer that stores the error number set by system calls and some library functions."
  },
  {
    "concept": "Error Handling",
    "difficulty": "medium",
    "question_text": "Which function prints a descriptive error message to stderr based on errno?",
    "options": ["printf()", "error()", "perror()", "strerror()"],
    "correct_answer": "C",
    "hint": "P-error.",
    "explanation": "perror() prints a string provided by the user, followed by a colon and the textual representation of the current errno."
  },
  {
    "concept": "Error Handling",
    "difficulty": "easy",
    "question_text": "What is the return value of many C library functions (like malloc or fopen) when an error occurs?",
    "options": ["0", "1", "NULL", "EOF"],
    "correct_answer": "C",
    "hint": "Common pointer failure indicator.",
    "explanation": "Functions returning pointers usually return NULL on failure."
  },
  {
    "concept": "Error Handling",
    "difficulty": "medium",
    "question_text": "Which constant signifies a successful program termination in stdlib.h?",
    "options": ["SUCCESS", "OK", "EXIT_SUCCESS", "EXIT_OK"],
    "correct_answer": "C",
    "hint": "Used with exit() or return from main.",
    "explanation": "EXIT_SUCCESS is typically defined as 0."
  },
  {
    "concept": "Error Handling",
    "difficulty": "hard",
    "question_text": "The assert() macro is used for:",
    "options": ["Recovering from user input errors", "Checking for logic errors during development", "Handling memory leaks", "Input validation"],
    "correct_answer": "B",
    "hint": "Terminates if the expression is false.",
    "explanation": "assert() is used to verify assumptions during debugging; if the condition is false, the program aborts."
  },
  {
    "concept": "Error Handling",
    "difficulty": "hard",
    "question_text": "Which header file is needed for signal handling in C?",
    "options": ["<error.h>", "<signal.h>", "<interrupt.h>", "<system.h>"],
    "correct_answer": "B",
    "hint": "Handling interrupts like Ctrl+C.",
    "explanation": "signal.h provides macros and functions to handle asynchronous events (signals) like segmentation faults or termination requests."
  },
  {
    "concept": "Error Handling",
    "difficulty": "hard",
    "question_text": "A 'Segmentation Fault' usually means:",
    "options": ["The code is too long", "The program tried to access invalid memory", "A math error (division by zero)", "Stack overflow"],
    "correct_answer": "B",
    "hint": "Memory segment violation.",
    "explanation": "Segfaults occur when a program attempts to read or write to a memory address it does not own or have access to."
  },
  {
    "concept": "Error Handling",
    "difficulty": "medium",
    "question_text": "Which function converts an errno number into a readable string?",
    "options": ["perror()", "strerror()", "errstring()", "convert_err()"],
    "correct_answer": "B",
    "hint": "String-error.",
    "explanation": "strerror() returns a pointer to a string describing the error code passed as an argument."
  },
  {
    "concept": "Error Handling",
    "difficulty": "medium",
    "question_text": "In standard C, what should main() return if an error occurred?",
    "options": ["0", "A non-zero value (e.g. 1)", "-1", "NULL"],
    "correct_answer": "B",
    "hint": "Exit status of 0 means success.",
    "explanation": "By convention, returning 0 means success, while any non-zero value indicates an error or abnormal termination."
  },
  {
    "concept": "Error Handling",
    "difficulty": "hard",
    "question_text": "What is a 'stack overflow'?",
    "options": ["Memory leak in the heap", "Too many recursive calls or large local arrays", "Operating system error", "Input Buffer overflow"],
    "correct_answer": "B",
    "hint": "The stack has exhausted its assigned space.",
    "explanation": "Stack overflow occurs when the call stack pointer exceeds the stack bound, usually due to infinite recursion or excessive local variable usage."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "medium",
    "question_text": "What is the time complexity of searching an element in a sorted array using Binary Search?",
    "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    "correct_answer": "B",
    "hint": "The search space is halved in each step.",
    "explanation": "Binary search divides the search interval in half each time, leading to logarithmic complexity."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "easy",
    "question_text": "What is required for a Binary Search to work?",
    "options": ["Unsorted array", "Sorted array", "Array of strings only", "Small array only"],
    "correct_answer": "B",
    "hint": "You need to know which half to discard.",
    "explanation": "Binary search relies on the array being sorted to decide whether the target is in the left or right half."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "medium",
    "question_text": "Which sorting algorithm is generally considered to have a worst-case complexity of O(n^2)?",
    "options": ["Merge Sort", "Quick Sort (average case)", "Bubble Sort", "Heap Sort"],
    "correct_answer": "C",
    "hint": "Uses nested loops to swap adjacent elements.",
    "explanation": "Bubble Sort compares each pair of adjacent elements and swaps them if they are in the wrong order, leading to O(n^2)."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "medium",
    "question_text": "What is a 'base case' in a recursive function?",
    "options": ["The largest input possible", "The condition that stops the recursion", "The entry point", "A special data type"],
    "correct_answer": "B",
    "hint": "Prevents infinite recursion.",
    "explanation": "The base case provides a direct answer for the simplest input, allowing the recursive calls to eventually terminate."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "hard",
    "question_text": "How can you swap two integers a and b WITHOUT using a temporary variable?",
    "options": ["a = a + b; b = a - b; a = a - b;", "a = b; b = a;", "a = a * b; b = a / b; a = a / b;", "Not possible in C"],
    "correct_answer": "A",
    "hint": "Logic involves addition and subtraction.",
    "explanation": "This sequence effectively swaps the values by storing the sum and then deriving the individual values back."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "medium",
    "question_text": "To find the largest element in an unsorted array, you must at least visit:",
    "options": ["Half the elements", "All the elements once (O(n))", "None", "The first element only"],
    "correct_answer": "B",
    "hint": "You can't be sure until you've checked everyone.",
    "explanation": "Finding a maximum in an unsorted list requires checking every element, resulting in linear time complexity."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "medium",
    "question_text": "What sequence is defined by F(n) = F(n-1) + F(n-2)?",
    "options": ["Prime numbers", "Fibonacci sequence", "Factorial", "Geometric progression"],
    "correct_answer": "B",
    "hint": "0, 1, 1, 2, 3, 5...",
    "explanation": "The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the previous two."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "easy",
    "question_text": "A word that reads the same forwards and backwards is called a:",
    "options": ["Anagram", "Palindrome", "Synonym", "Isogram"],
    "correct_answer": "B",
    "hint": "Example: 'racecar'.",
    "explanation": "Palindromes maintain their character sequence regardless of processing direction."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "medium",
    "question_text": "The recursive formula for Factorial(n) is:",
    "options": ["n + Factorial(n-1)", "n * Factorial(n-1)", "Factorial(n) * Factorial(n-1)", "n / Factorial(n-1)"],
    "correct_answer": "B",
    "hint": "5! = 5 * 4 * 3 * 2 * 1.",
    "explanation": "Factorial of n is n multiplied by the factorial of (n-1)."
  },
  {
    "concept": "Problem Solving",
    "difficulty": "hard",
    "question_text": "In a nested loop pattern for a square of size n: for(i=0; i<n; i++) for(j=0; j<n; j++) printf('*'); - how many stars are printed?",
    "options": ["n", "2n", "n^2", "n+1"],
    "correct_answer": "C",
    "hint": "Inner loop runs n times for each of the n outer iterations.",
    "explanation": "Total iterations = outer_limit * inner_limit = n * n."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "A function in C is used to:",
    "options": ["Repeat code without rewriting", "Store data", "Declare variables only", "Create arrays"],
    "correct_answer": "A",
    "hint": "Think about reducing repetition — functions help reuse the same logic multiple times.",
    "explanation": "Functions provide modularity and allow programmers to reuse code blocks rather than duplicating them."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "The correct syntax to declare a function is:",
    "options": ["return_type function_name();", "function_name() return_type;", "declare function function_name();", "int function_name;"],
    "correct_answer": "A",
    "hint": "In C, declaration always starts with the return type, followed by the function name.",
    "explanation": "A function declaration (prototype) specifies the return type, the function name, and its parameters."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "In older C standards, if no return type is specified for a function, it defaults to:",
    "options": ["void", "int", "char", "Nothing"],
    "correct_answer": "B",
    "hint": "C was originally loosely typed in some regards regarding returns.",
    "explanation": "Historically, C functions defaulted to returning an integer if the type was omitted (though this is deprecated in modern C)."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "To pass values to a function we use:",
    "options": ["Parameters", "Global variables only", "Arrays only", "Pointers only"],
    "correct_answer": "A",
    "hint": "Values are sent into functions through inputs defined in parentheses.",
    "explanation": "Parameters allow data to be passed from the caller to the function code."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "What is recursion in C?",
    "options": ["A function calling itself", "A function calling another function", "A loop inside a function", "Multiple return statements"],
    "correct_answer": "A",
    "hint": "Think of a function solving a problem by breaking it into smaller versions of itself.",
    "explanation": "Recursion occurs when a function calls itself directly or indirectly."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "A function that does not return any value has return type:",
    "options": ["int", "void", "float", "char"],
    "correct_answer": "B",
    "hint": "There’s a keyword in C specifically used when nothing is returned.",
    "explanation": "The 'void' keyword explicitly states that the function provides no return value."
  },
  {
    "concept": "Functions",
    "difficulty": "medium",
    "question_text": "Parameters defined in the function header are called ________, while values passed during the call are ________.",
    "options": ["Actual arguments, Formal parameters", "Formal parameters, Actual arguments", "Both are called Local variables", "Constants, Variables"],
    "correct_answer": "B",
    "hint": "The name changes depending on where they are used — calling vs defining.",
    "explanation": "Formal parameters appear in the function definition/declaration; actual arguments are the real values passed in the function call."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "The scope of variables declared inside a function is:",
    "options": ["Global", "Local (only within the function)", "File level", "Program level"],
    "correct_answer": "B",
    "hint": "Variables inside a function cannot be accessed outside of it.",
    "explanation": "Local variables are only 'visible' and alive within the block where they are defined."
  },
  {
    "concept": "Functions",
    "difficulty": "easy",
    "question_text": "Which of the following is true about the main() function?",
    "options": ["It is user-defined", "It is a special function and the entry point of the program", "It is optional", "It is a library function"],
    "correct_answer": "B",
    "hint": "Every C program starts execution from a specific function.",
    "explanation": "Execution of every C program begins at the standard main() function."
  },
  {
    "concept": "Functions",
    "difficulty": "hard",
    "question_text": "When is a function prototype strictly required?",
    "options": ["When the function is defined before main()", "When the function is defined after it is called (e.g. after main())", "When the function returns void", "It is never strictly required"],
    "correct_answer": "B",
    "hint": "The compiler needs to know about the function before it is used.",
    "explanation": "In C, you must declare a function before it is used. If the definition comes later in the file, a prototype must appear before the first call."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "A pointer is a variable that stores:",
    "options": ["A value", "The address of another variable", "A string", "A function"],
    "correct_answer": "B",
    "hint": "Pointers don’t store actual data — they store where the data is located in memory.",
    "explanation": "Pointers hold memory addresses, allowing indirect access to data stored in those locations."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "How do you declare a pointer to an integer?",
    "options": ["int *p;", "int p;", "pointer int p;", "int &p;"],
    "correct_answer": "A",
    "hint": "The * symbol is used with the variable name to indicate it’s a pointer.",
    "explanation": "The asterisk (*) used in a declaration declares the variable as a pointer to the specified type."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "The & operator is used to:",
    "options": ["Get the value at address", "Get the address of a variable", "Multiply", "Logical AND"],
    "correct_answer": "B",
    "hint": "Think of & as “address of” operator.",
    "explanation": "The unary operator & returns the address of its operand."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "The * operator (dereference) is used to:",
    "options": ["Declare a pointer", "Access the value at the address stored in pointer", "Multiply two numbers", "Get address"],
    "correct_answer": "B",
    "hint": "Once you have an address, * lets you access the value stored there.",
    "explanation": "Dereferencing a pointer using * allows you to read or modify the content of the memory it points to."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "What is the output of this code?\nint x = 10;\nint *p = &x;\nprintf(\"%d\", *p);",
    "options": ["Address of x", "10", "Garbage", "Error"],
    "correct_answer": "B",
    "hint": "p stores the address of x, and *p gives the value stored at that address.",
    "explanation": "The pointer p points to x. Dereferencing p (*p) yields the value of x, which is 10."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "Pointers are useful because they allow:",
    "options": ["Dynamic memory allocation", "Passing by reference", "Efficient array handling", "All of the above"],
    "correct_answer": "D",
    "hint": "Pointers are powerful because they support multiple advanced features in C.",
    "explanation": "Pointers are fundamental for heap management, modifying function arguments, and navigating data structures efficiently."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "An uninitialized pointer (wild pointer) contain:",
    "options": ["0", "Garbage address", "NULL", "Safe address"],
    "correct_answer": "B",
    "hint": "If you don’t assign a pointer, it may point to a random memory location.",
    "explanation": "Uninitialized local pointers contain arbitrary memory addresses, which can lead to crashes if accessed."
  },
  {
    "concept": "Pointers",
    "difficulty": "easy",
    "question_text": "A NULL pointer points to:",
    "options": ["Address 0", "Any random address", "Last memory location", "Heap"],
    "correct_answer": "A",
    "hint": "NULL represents a pointer that intentionally points to “nothing.”",
    "explanation": "In C, NULL is a macro for 0, signifying that the pointer does not reference a valid object."
  },
  {
    "concept": "Pointers",
    "difficulty": "hard",
    "question_text": "Pointer arithmetic: p++ on an int pointer 'p' increases the address by:",
    "options": ["1 byte", "Size of int (usually 4 bytes)", "8 bytes", "No change"],
    "correct_answer": "B",
    "hint": "Pointer movement depends on the data type size it is pointing to.",
    "explanation": "Adding 1 to a pointer increments its value by the size of the type it points to, moving it to the next element."
  },
  {
    "concept": "Pointers",
    "difficulty": "medium",
    "question_text": "An array name itself acts as:",
    "options": ["A constant pointer to its first element", "A normal variable", "A function pointer", "A string"],
    "correct_answer": "A",
    "hint": "The array name represents the starting address of its first element.",
    "explanation": "When an array name is used in an expression, it generally decays into a pointer to its first element."
  },
  {
    "concept": "File Handling",
    "difficulty": "easy",
    "question_text": "Which function writes to a file?",
    "options": ["fwrite()", "write()", "filewrite()", "put()"],
    "correct_answer": "A",
    "hint": "File write function.",
    "explanation": "fwrite is used to write data to files."
  },
  {
    "concept": "File Handling",
    "difficulty": "easy",
    "question_text": "Which mode creates a file if it doesn't exist?",
    "options": ["r", "w", "x", "d"],
    "correct_answer": "B",
    "hint": "Write mode.",
    "explanation": "w mode creates file if not exists."
  },

  {
    "concept": "File Handling",
    "difficulty": "hard",
    "question_text": "What happens if you open a file in 'w' mode?",
    "options": [
      "Appends data",
      "Deletes previous content",
      "Reads file",
      "Fails always"
    ],
    "correct_answer": "B",
    "hint": "Overwrite behavior.",
    "explanation": "w mode truncates existing file content."
  },
  {
    "concept": "File Handling",
    "difficulty": "hard",
    "question_text": "Which function checks file errors?",
    "options": ["ferror()", "fileerror()", "check()", "error()"],
    "correct_answer": "A",
    "hint": "Error checking function.",
    "explanation": "ferror checks stream errors."
  },
  {
    "concept": "File Handling",
    "difficulty": "hard",
    "question_text": "What is file pointer used for?",
    "options": [
      "Memory allocation",
      "Tracking file position",
      "Loop control",
      "Compilation"
    ],
    "correct_answer": "B",
    "hint": "Cursor in file.",
    "explanation": "File pointer tracks position in file stream."
  },
  {
    "concept": "Memory Management",
    "difficulty": "easy",
    "question_text": "Which operator is used to allocate memory dynamically?",
    "options": ["new", "malloc()", "alloc", "create"],
    "correct_answer": "B",
    "hint": "Heap allocation function.",
    "explanation": "malloc allocates memory in heap."
  },
  {
    "concept": "Memory Management",
    "difficulty": "easy",
    "question_text": "Which memory is automatically managed?",
    "options": ["Heap", "Stack", "Disk", "ROM"],
    "correct_answer": "B",
    "hint": "Function calls use it.",
    "explanation": "Stack memory is automatically managed."
  },

  {
    "concept": "Memory Management",
    "difficulty": "hard",
    "question_text": "What is double free error?",
    "options": [
      "Freeing memory twice",
      "Allocating twice",
      "Stack overflow",
      "Memory leak"
    ],
    "correct_answer": "A",
    "hint": "Dangerous operation.",
    "explanation": "Freeing already freed memory causes undefined behavior."
  },
  {
    "concept": "Memory Management",
    "difficulty": "hard",
    "question_text": "What happens if malloc is not freed?",
    "options": [
      "Program becomes faster",
      "Memory leak occurs",
      "Compiler error",
      "Nothing happens"
    ],
    "correct_answer": "B",
    "hint": "Lost memory.",
    "explanation": "Unfreed memory accumulates leading to memory leaks."
  },
  {
    "concept": "Memory Management",
    "difficulty": "hard",
    "question_text": "Which function reallocates memory safely?",
    "options": ["malloc", "free", "realloc", "calloc"],
    "correct_answer": "C",
    "hint": "Resize memory block.",
    "explanation": "realloc adjusts previously allocated memory size."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "easy",
    "question_text": "Which keyword is used to define a structure in C?",
    "options": ["struct", "structure", "data", "class"],
    "correct_answer": "A",
    "hint": "C keyword for grouping variables.",
    "explanation": "struct is used to define structures in C."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "easy",
    "question_text": "Structures are used to:",
    "options": ["Store multiple data types", "Store only integers", "Perform calculations", "Create loops"],
    "correct_answer": "A",
    "hint": "Think grouping different types.",
    "explanation": "Structures allow grouping different data types under one name."
  },

  {
    "concept": "Structures & Unions",
    "difficulty": "hard",
    "question_text": "What is the main difference between structure and union?",
    "options": [
      "Structure uses less memory",
      "Union shares memory among members",
      "Structure cannot store data",
      "Union stores multiple values at once safely"
    ],
    "correct_answer": "B",
    "hint": "Memory sharing concept.",
    "explanation": "Union members share the same memory location."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "hard",
    "question_text": "Which statement is true about union?",
    "options": [
      "All members can store values simultaneously",
      "Only one member can hold value at a time",
      "Union uses more memory than struct",
      "Union is same as array"
    ],
    "correct_answer": "B",
    "hint": "Overwrite behavior.",
    "explanation": "Union stores one value at a time because memory is shared."
  },
  {
    "concept": "Structures & Unions",
    "difficulty": "hard",
    "question_text": "What happens when you assign value to one member of a union?",
    "options": [
      "Other members become invalid",
      "All members updated",
      "Memory doubles",
      "Compile error"
    ],
    "correct_answer": "A",
    "hint": "Shared memory effect.",
    "explanation": "All members share same memory, so changing one affects others."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "Which operator is used for bitwise AND in C?",
    "options": ["&", "|", "^", "&&"],
    "correct_answer": "A",
    "hint": "Single ampersand.",
    "explanation": "The & operator performs bitwise AND."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "Which operator is used for bitwise OR?",
    "options": ["&", "|", "^", "~"],
    "correct_answer": "B",
    "hint": "Vertical bar symbol.",
    "explanation": "| performs bitwise OR operation."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "Binary of 1 << 1 is equal to:",
    "options": ["1", "2", "3", "4"],
    "correct_answer": "B",
    "hint": "Left shift doubles value.",
    "explanation": "1 << 1 shifts bits left giving 2."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "Bitwise operations work on:",
    "options": ["Characters", "Bits", "Strings", "Files"],
    "correct_answer": "B",
    "hint": "Binary level operations.",
    "explanation": "Bitwise operators work on binary representation of numbers."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "easy",
    "question_text": "0 & 1 equals:",
    "options": ["1", "0", "2", "Undefined"],
    "correct_answer": "B",
    "hint": "AND rule.",
    "explanation": "AND returns 1 only if both bits are 1."
  },

  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "The ^ operator in C represents:",
    "options": ["Power", "Bitwise XOR", "Bitwise NOT", "Pointer"],
    "correct_answer": "B",
    "hint": "Exclusive OR.",
    "explanation": "^ is bitwise XOR operator."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "Which operator is used for bitwise NOT?",
    "options": ["!", "~", "&", "|"],
    "correct_answer": "B",
    "hint": "Tilde symbol.",
    "explanation": "~ flips all bits."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "What does << operator do?",
    "options": ["Divide by 2", "Left shift bits", "Right shift bits", "Modulo operation"],
    "correct_answer": "B",
    "hint": "Shifts bits left.",
    "explanation": "<< shifts bits left (multiply by 2)."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "What is x >> 1 equivalent to?",
    "options": ["x * 2", "x / 2", "x + 1", "x - 1"],
    "correct_answer": "B",
    "hint": "Right shift halves value.",
    "explanation": "Right shift divides number by 2."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "medium",
    "question_text": "What does 1 | 0 equal?",
    "options": ["0", "1", "2", "Undefined"],
    "correct_answer": "B",
    "hint": "OR operation.",
    "explanation": "OR returns 1 if any bit is 1."
  },

  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "What is the result of 5 & 3?",
    "options": ["1", "2", "3", "0"],
    "correct_answer": "A",
    "hint": "Binary AND: 101 & 011",
    "explanation": "5 (101) & 3 (011) = 001 = 1"
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "What is the result of 4 | 1?",
    "options": ["0", "1", "4", "5"],
    "correct_answer": "D",
    "hint": "Binary OR.",
    "explanation": "4 (100) | 1 (001) = 101 = 5"
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "What happens in ~5 (on 32-bit system)?",
    "options": ["-5", "-6", "5", "6"],
    "correct_answer": "B",
    "hint": "Two's complement.",
    "explanation": "~5 = -6 in two's complement representation."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "Which operation is used to toggle a bit?",
    "options": ["&", "|", "^", "~"],
    "correct_answer": "C",
    "hint": "XOR flips bits.",
    "explanation": "XOR toggles bits (0->1, 1->0)."
  },
  {
    "concept": "Bitwise Operations",
    "difficulty": "hard",
    "question_text": "What is a common use of bitwise operations?",
    "options": [
      "File handling",
      "Low-level hardware control",
      "Loop execution",
      "String manipulation"
    ],
    "correct_answer": "B",
    "hint": "System programming.",
    "explanation": "Bitwise operations are used in embedded systems and performance optimization."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Type casting in C is used to:",
    "options": ["Loop values", "Convert one data type to another", "Store arrays", "Define functions"],
    "correct_answer": "B",
    "hint": "Changing data type.",
    "explanation": "Type casting converts a variable from one data type to another."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Which symbol is used for explicit type casting?",
    "options": ["()", "{}", "[]", "<>"],
    "correct_answer": "A",
    "hint": "Same symbol as function call style.",
    "explanation": "(type) is used for explicit casting in C."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Which conversion is automatic in C?",
    "options": ["Explicit casting", "Implicit casting", "Manual casting", "Pointer casting"],
    "correct_answer": "B",
    "hint": "Done by compiler automatically.",
    "explanation": "Implicit casting is done automatically by the compiler."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "Which type has higher precision?",
    "options": ["int", "float", "char", "short"],
    "correct_answer": "B",
    "hint": "Decimal support.",
    "explanation": "float has higher precision than integer types."
  },
  {
    "concept": "Type Casting",
    "difficulty": "easy",
    "question_text": "char to int conversion is an example of:",
    "options": ["Narrowing", "Widening", "Error", "Overflow"],
    "correct_answer": "B",
    "hint": "Smaller to larger type.",
    "explanation": "char to int is widening conversion."
  },

  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "What happens when you cast 9.99 to int?",
    "options": ["10", "9", "Error", "9.99"],
    "correct_answer": "B",
    "hint": "Fraction removed.",
    "explanation": "Decimal part is truncated."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "Integer promotion occurs when:",
    "options": [
      "Large type converted to small",
      "Small types like char are promoted to int",
      "Float converted to char",
      "Double converted to int always"
    ],
    "correct_answer": "B",
    "hint": "Automatic upgrade.",
    "explanation": "Small integer types are promoted to int in expressions."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "When int is added to double, result type is:",
    "options": ["int", "double", "float", "char"],
    "correct_answer": "B",
    "hint": "Higher precision wins.",
    "explanation": "C promotes int to double before operation."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "Which is implicit conversion?",
    "options": ["(int)3.14", "int x = 5;", "5 + 2.5", "char c = 'A'"],
    "correct_answer": "C",
    "hint": "Compiler does it automatically.",
    "explanation": "5 is promoted to float/double automatically."
  },
  {
    "concept": "Type Casting",
    "difficulty": "medium",
    "question_text": "Which data loss may occur in casting?",
    "options": ["Widening", "Narrowing", "Promotion", "Conversion"],
    "correct_answer": "B",
    "hint": "Big to small.",
    "explanation": "Narrowing conversion can lose data."
  },

  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "What is the result of (int)(float)5.9 + 2?",
    "options": ["7.9", "7", "8", "6"],
    "correct_answer": "B",
    "hint": "First truncate, then add.",
    "explanation": "(int)5.9 = 5, then 5 + 2 = 7"
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "What is type coercion?",
    "options": [
      "Manual casting",
      "Automatic type conversion",
      "Pointer conversion",
      "Memory allocation"
    ],
    "correct_answer": "B",
    "hint": "Compiler decides conversion.",
    "explanation": "Type coercion is automatic conversion by compiler."
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "What happens in float f = 5 / 2; ?",
    "options": ["2.5", "2", "3", "Error"],
    "correct_answer": "B",
    "hint": "Integer division first.",
    "explanation": "5/2 = 2 (integer division), then assigned to float."
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "Which prevents precision loss?",
    "options": ["Narrowing", "Widening", "Overflow", "Truncation"],
    "correct_answer": "B",
    "hint": "Larger type conversion.",
    "explanation": "Widening conversion preserves data."
  },
  {
    "concept": "Type Casting",
    "difficulty": "hard",
    "question_text": "Which is dangerous in casting?",
    "options": [
      "int to float",
      "float to int",
      "char to int",
      "int to double"
    ],
    "correct_answer": "B",
    "hint": "Loss of decimal part.",
    "explanation": "float to int can lose fractional data."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which symbol is used to end a statement in C?",
    "options": [".", ";", ":", ","],
    "correct_answer": "B",
    "hint": "Statement terminator.",
    "explanation": "In C, every statement ends with a semicolon (;)."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which of the following is a correct C comment?",
    "options": ["// comment", "# comment", "<!-- comment -->", "** comment **"],
    "correct_answer": "A",
    "hint": "Single-line comment.",
    "explanation": "// is used for single-line comments in C."
  },
  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "Which of the following is a correct C program entry point?",
    "options": ["start()", "main()", "init()", "begin()"],
    "correct_answer": "B",
    "hint": "Execution starts here.",
    "explanation": "Execution of a C program always starts from main()."
  },
  {
    "concept": "Basics",
    "difficulty": "medium",
    "question_text": "Which header file is required for basic input/output operations?",
    "options": ["stdlib.h", "stdio.h", "math.h", "string.h"],
    "correct_answer": "B",
    "hint": "Standard I/O library.",
    "explanation": "stdio.h contains printf and scanf."
  },
  {
    "concept": "Basics",
    "difficulty": "hard",
    "question_text": "What happens if main() does not return a value?",
    "options": ["Compile error", "Returns 0 automatically", "Runtime error", "Infinite loop"],
    "correct_answer": "B",
    "hint": "C standard behavior.",
    "explanation": "In modern C, main() implicitly returns 0 if not specified."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which keyword is used for floating-point numbers?",
    "options": ["int", "float", "char", "double only"],
    "correct_answer": "B",
    "hint": "Decimal numbers.",
    "explanation": "float is used for decimal values."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which data type stores a single character?",
    "options": ["int", "char", "string", "float"],
    "correct_answer": "B",
    "hint": "One character only.",
    "explanation": "char stores a single character."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "Which storage class keeps variable value throughout program execution?",
    "options": ["auto", "register", "static", "extern"],
    "correct_answer": "C",
    "hint": "Persistent storage.",
    "explanation": "static variables retain values across function calls."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "medium",
    "question_text": "Which of the following is NOT a valid C data type?",
    "options": ["int", "float", "string", "char"],
    "correct_answer": "C",
    "hint": "C does not have built-in string type.",
    "explanation": "C uses char arrays instead of string type."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "hard",
    "question_text": "What is size of char in C (standard)?",
    "options": ["1 byte", "2 bytes", "4 bytes", "Depends"],
    "correct_answer": "A",
    "hint": "Minimum addressable unit.",
    "explanation": "char is always 1 byte by standard."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which loop is used when condition is checked first?",
    "options": ["for", "while", "do-while", "switch"],
    "correct_answer": "B",
    "hint": "Entry-controlled loop.",
    "explanation": "while loop checks condition before execution."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which keyword stops a loop immediately?",
    "options": ["stop", "exit", "break", "return"],
    "correct_answer": "C",
    "hint": "Used inside loops.",
    "explanation": "break terminates loop execution."
  },
  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "What does continue statement do?",
    "options": ["Stops loop", "Skips current iteration", "Ends program", "Restarts program"],
    "correct_answer": "B",
    "hint": "Skip step.",
    "explanation": "continue skips the current iteration."
  },
  {
    "concept": "Loops",
    "difficulty": "medium",
    "question_text": "Which loop is best for unknown number of iterations?",
    "options": ["for", "while", "switch", "goto"],
    "correct_answer": "B",
    "hint": "Condition-based loop.",
    "explanation": "while loop is used when iterations are unknown."
  },
  {
    "concept": "Loops",
    "difficulty": "hard",
    "question_text": "What happens if loop condition is always true?",
    "options": ["Normal execution", "Infinite loop", "Compile error", "Program stops"],
    "correct_answer": "B",
    "hint": "Never ends.",
    "explanation": "Always true condition creates infinite loop."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for multiplication?",
    "options": ["+", "-", "*", "/"],
    "correct_answer": "C",
    "hint": "Math operator.",
    "explanation": "* is used for multiplication."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for division?",
    "options": ["%", "/", "*", "+"],
    "correct_answer": "B",
    "hint": "Divide symbol.",
    "explanation": "/ is used for division."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "What is result of 5 / 2 in C (int)?",
    "options": ["2.5", "2", "3", "2.0"],
    "correct_answer": "B",
    "hint": "Integer division.",
    "explanation": "Integer division removes decimal part."
  },
  {
    "concept": "Operators",
    "difficulty": "medium",
    "question_text": "Which operator is used for logical AND?",
    "options": ["&", "&&", "|", "||"],
    "correct_answer": "B",
    "hint": "Double ampersand.",
    "explanation": "&& is logical AND."
  },
  {
    "concept": "Operators",
    "difficulty": "hard",
    "question_text": "What is precedence of operators in C determined by?",
    "options": ["Execution speed", "Compiler rules", "Memory size", "Variable type"],
    "correct_answer": "B",
    "hint": "Order of evaluation.",
    "explanation": "Operator precedence is defined by C language rules."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which symbol is used to start a block of code in C?",
    "options": ["(", "{", "[", "<"],
    "correct_answer": "B",
    "hint": "Curly braces.",
    "explanation": "Curly braces { } define blocks of code in C."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "C language is mainly considered a:",
    "options": ["Markup language", "Programming language", "Database", "Operating system"],
    "correct_answer": "B",
    "hint": "Used to write software.",
    "explanation": "C is a general-purpose programming language."
  },
  {
    "concept": "Basics",
    "difficulty": "easy",
    "question_text": "Which symbol is used for single-line comments in C?",
    "options": ["//", "/*", "#", "--"],
    "correct_answer": "A",
    "hint": "Two forward slashes.",
    "explanation": "// is used for writing single-line comments."
  },

  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which data type is used for whole numbers?",
    "options": ["float", "char", "int", "double"],
    "correct_answer": "C",
    "hint": "Integer values.",
    "explanation": "int is used to store integer numbers."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Which keyword is used for double precision values?",
    "options": ["float", "double", "decimal", "real"],
    "correct_answer": "B",
    "hint": "Higher precision floating point.",
    "explanation": "double stores high precision decimal numbers."
  },
  {
    "concept": "Variables and Data Types",
    "difficulty": "easy",
    "question_text": "Variable names in C can contain:",
    "options": ["Spaces", "Special symbols", "Letters and digits", "Only numbers"],
    "correct_answer": "C",
    "hint": "Identifier rules.",
    "explanation": "Variable names may contain letters, digits, and underscores."
  },

  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which loop repeats while a condition is true?",
    "options": ["switch", "while", "break", "goto"],
    "correct_answer": "B",
    "hint": "Condition-controlled loop.",
    "explanation": "while loop runs repeatedly while condition remains true."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which loop is guaranteed to execute at least once?",
    "options": ["for", "while", "do-while", "nested"],
    "correct_answer": "C",
    "hint": "Condition checked after execution.",
    "explanation": "do-while executes body before checking condition."
  },
  {
    "concept": "Loops",
    "difficulty": "easy",
    "question_text": "Which keyword skips the current loop iteration?",
    "options": ["break", "skip", "continue", "pass"],
    "correct_answer": "C",
    "hint": "Move to next iteration.",
    "explanation": "continue skips remaining statements in current iteration."
  },

  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator is used for subtraction?",
    "options": ["+", "-", "*", "/"],
    "correct_answer": "B",
    "hint": "Minus sign.",
    "explanation": "- is used for subtraction."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator gives remainder after division?",
    "options": ["/", "%", "*", "+"],
    "correct_answer": "B",
    "hint": "Modulo operator.",
    "explanation": "% returns remainder after division."
  },
  {
    "concept": "Operators",
    "difficulty": "easy",
    "question_text": "Which operator increases a value by 1?",
    "options": ["--", "++", "+=", "**"],
    "correct_answer": "B",
    "hint": "Increment operator.",
    "explanation": "++ increments variable value by one."
  },

  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which statement is used for decision making?",
    "options": ["if", "loop", "printf", "scanf"],
    "correct_answer": "A",
    "hint": "Conditional statement.",
    "explanation": "if statement is used to make decisions."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "Which keyword is used with if for alternative execution?",
    "options": ["switch", "else", "break", "case"],
    "correct_answer": "B",
    "hint": "Alternative path.",
    "explanation": "else executes when if condition is false."
  },
  {
    "concept": "Control Structures",
    "difficulty": "easy",
    "question_text": "switch statements use ______ labels.",
    "options": ["loop", "case", "goto", "continue"],
    "correct_answer": "B",
    "hint": "Branch labels.",
    "explanation": "switch uses case labels for branching."
  },

  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "Which function prints formatted output?",
    "options": ["scanf()", "printf()", "input()", "display()"],
    "correct_answer": "B",
    "hint": "Print formatted.",
    "explanation": "printf() displays formatted output."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "Which format specifier is used for strings?",
    "options": ["%d", "%f", "%s", "%c"],
    "correct_answer": "C",
    "hint": "String format.",
    "explanation": "%s is used for strings."
  },
  {
    "concept": "Input/Output",
    "difficulty": "easy",
    "question_text": "Which escape sequence prints a tab space?",
    "options": ["\\n", "\\t", "\\b", "\\a"],
    "correct_answer": "B",
    "hint": "Tab character.",
    "explanation": "\\t inserts a horizontal tab."
  }




];

const normalizeOptions = (options = []) => {
  return options.map((option, index) => {
    if (typeof option === "string") {
      return {
        label: optionLabels[index],
        text: option,
        misconceptionTag: "",
      };
    }

    return {
      label: option.label || optionLabels[index],
      text: option.text || "",
      misconceptionTag: option.misconceptionTag || "",
    };
  });
};

const buildModulesFromQuestions = (questions) => {
  const moduleMap = new Map();

  questions.forEach((question) => {
    const concept = normalizeConcept(question.concept);
    const conceptKey = getConceptKey(concept);

    if (!moduleMap.has(conceptKey)) {
      moduleMap.set(conceptKey, {
        title: concept,
        name: concept,
        slug: makeSlug(concept),
        code: makeCode(concept),
        description: `${concept} MCQ practice for C programming.`,
        explanation: `This module contains MCQ questions related to ${concept}.`,
        orderNo: moduleMap.size + 1,
        totalQuestions: 0,
        isActive: true,
      });
    }

    const existingModule = moduleMap.get(conceptKey);
    existingModule.totalQuestions += 1;
  });

  return Array.from(moduleMap.values());
};

const convertQuestions = (questions, moduleIdMap) => {
  const orderCounter = {};

  return questions.map((question) => {
    const concept = normalizeConcept(question.concept);
    const conceptKey = getConceptKey(concept);

    orderCounter[conceptKey] = (orderCounter[conceptKey] || 0) + 1;

    return {
      module: moduleIdMap[conceptKey],
      concept,
      difficulty: question.difficulty || "easy",
      orderNo: question.orderNo || orderCounter[conceptKey],

      questionText: question.questionText || question.question_text,

      options: normalizeOptions(question.options),

      correctAnswer: question.correctAnswer || question.correct_answer,

      hint: question.hint || "",
      detailedHint:
        question.detailedHint || question.detailed_hint || question.hint || "",
      explanation: question.explanation || "",

      isActive: true,
    };
  });
};

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      throw new Error(
        "rawQuestions is empty. Paste your questions inside rawQuestions array."
      );
    }

    await LearningModule.deleteMany({});
    await Question.deleteMany({});

    const modules = buildModulesFromQuestions(rawQuestions);

    const createdModules = await LearningModule.insertMany(modules);

    const moduleIdMap = {};

    createdModules.forEach((module) => {
      const conceptKey = getConceptKey(module.title || module.name);
      moduleIdMap[conceptKey] = module._id;
    });

    const convertedQuestions = convertQuestions(rawQuestions, moduleIdMap);

    await Question.insertMany(convertedQuestions);

    console.log("Task giving seed completed successfully");
    console.log(`Inserted modules: ${createdModules.length}`);
    console.log(`Inserted questions: ${convertedQuestions.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();