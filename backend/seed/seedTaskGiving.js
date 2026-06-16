/* eslint-disable no-console */
require("dotenv").config();
const mongoose = require("mongoose");

const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const addModuleToQuestions = (questions, moduleId) =>
  questions.map((question) => ({
    ...question,
    module: moduleId,
  }));

const seedLearningModules = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI or MONGODB_URI is missing in .env");
  }

  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  await LearningModule.deleteMany({});
  await Question.deleteMany({});
  console.log("Old learning modules and questions removed");


  // MODULE 1 – Input / Output
  // ─────────────────────────────────────────────
  const module1 = await LearningModule.create({
    name: "Input / Output",
    code: "INPUT_OUTPUT",
    description: "Basic printf and scanf, format specifiers, escape sequences MCQ practice.",
    orderNo: 1,
    totalQuestions: 36,
    isActive: true,
  });

  const module1Questions = [
  
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 1,
      questionText: "Which function is used to print output on the screen in C?",
      options: [
        { label: "A", text: "input()", misconceptionTag: "python_confusion" },
        { label: "B", text: "printf()", misconceptionTag: "" },
        { label: "C", text: "scanf()", misconceptionTag: "input_mixup" },
        { label: "D", text: "print()", misconceptionTag: "python_confusion" },
      ],
      correctAnswer: "B",
      hint: "\"print formatted\".",
      explanation: "printf() is used to display output to the console."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 2,
      questionText: "Which function is used to take input from the user?",
      options: [
        { label: "A", text: "printf()", misconceptionTag: "output_mixup" },
        { label: "B", text: "scanf()", misconceptionTag: "" },
        { label: "C", text: "get()", misconceptionTag: "other_lang" },
        { label: "D", text: "input()", misconceptionTag: "python_confusion" },
      ],
      correctAnswer: "B",
      hint: "\"scan formatted\".",
      explanation: "scanf() reads input from standard input (keyboard)."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 3,
      questionText: "What is the correct format specifier for an integer?",
      options: [
        { label: "A", text: "%f", misconceptionTag: "float_confusion" },
        { label: "B", text: "%d", misconceptionTag: "" },
        { label: "C", text: "%c", misconceptionTag: "char_confusion" },
        { label: "D", text: "%s", misconceptionTag: "string_confusion" },
      ],
      correctAnswer: "B",
      hint: "Decimal integer.",
      explanation: "%d is used for integers."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 4,
      questionText: "To print a floating-point number, we use:",
      options: [
        { label: "A", text: "%d", misconceptionTag: "int_confusion" },
        { label: "B", text: "%f", misconceptionTag: "" },
        { label: "C", text: "%c", misconceptionTag: "char_confusion" },
        { label: "D", text: "%i", misconceptionTag: "int_confusion" },
      ],
      correctAnswer: "B",
      hint: "Float format.",
      explanation: "%f is used for float values."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 5,
      questionText: "Which header file is required for printf and scanf?",
      options: [
        { label: "A", text: "<stdlib.h>", misconceptionTag: "stdlib_confusion" },
        { label: "B", text: "<stdio.h>", misconceptionTag: "" },
        { label: "C", text: "<math.h>", misconceptionTag: "math_confusion" },
        { label: "D", text: "<string.h>", misconceptionTag: "string_confusion" },
      ],
      correctAnswer: "B",
      hint: "Standard input/output.",
      explanation: "stdio.h contains input/output functions."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 6,
      questionText: 'What does "\\n" do in printf?',
      options: [
        { label: "A", text: "Tab space", misconceptionTag: "tab_confusion" },
        { label: "B", text: "New line", misconceptionTag: "" },
        { label: "C", text: "Backslash", misconceptionTag: "backslash" },
        { label: "D", text: "Nothing", misconceptionTag: "nothing" },
      ],
      correctAnswer: "B",
      hint: "Line break.",
      explanation: "\\n moves the cursor to a new line."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 7,
      questionText: "Which format specifier is used for character?",
      options: [
        { label: "A", text: "%d", misconceptionTag: "int" },
        { label: "B", text: "%f", misconceptionTag: "float" },
        { label: "C", text: "%c", misconceptionTag: "" },
        { label: "D", text: "%s", misconceptionTag: "string" },
      ],
      correctAnswer: "C",
      hint: "Single character.",
      explanation: "%c is used for characters."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 8,
      questionText: "Which function reads formatted input?",
      options: [
        { label: "A", text: "printf()", misconceptionTag: "output" },
        { label: "B", text: "scanf()", misconceptionTag: "" },
        { label: "C", text: "gets()", misconceptionTag: "gets" },
        { label: "D", text: "puts()", misconceptionTag: "puts" },
      ],
      correctAnswer: "B",
      hint: "Opposite of printf.",
      explanation: "scanf is used for formatted input."
    },

  
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 9,
      questionText: "Correct way to print variable age:",
      options: [
        { label: "A", text: "printf(age);", misconceptionTag: "no_format" },
        { label: "B", text: "printf(\"%d\", age);", misconceptionTag: "" },
        { label: "C", text: "printf(\"age\");", misconceptionTag: "literal" },
        { label: "D", text: "print age;", misconceptionTag: "other_lang" },
      ],
      correctAnswer: "B",
      hint: "Format specifier required.",
      explanation: "printf(\"%d\", age) is correct."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 10,
      questionText: "What is the output of printf(\"%d\", 10/3);?",
      options: [
        { label: "A", text: "3.33", misconceptionTag: "float" },
        { label: "B", text: "3", misconceptionTag: "" },
        { label: "C", text: "4", misconceptionTag: "rounding" },
        { label: "D", text: "Error", misconceptionTag: "error" },
      ],
      correctAnswer: "B",
      hint: "Integer division.",
      explanation: "10/3 = 3 in integer division."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 11,
      questionText: "What does %s format specifier represent in printf()?",
      options: [
        { label: "A", text: "Character", misconceptionTag: "char" },
        { label: "B", text: "String", misconceptionTag: "" },
        { label: "C", text: "Integer", misconceptionTag: "int" },
        { label: "D", text: "Float", misconceptionTag: "float" },
      ],
      correctAnswer: "B",
      hint: "String format.",
      explanation: "%s is used to print strings."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 12,
      questionText: "Which scanf() format specifier reads a string?",
      options: [
        { label: "A", text: "%d", misconceptionTag: "int" },
        { label: "B", text: "%c", misconceptionTag: "char" },
        { label: "C", text: "%s", misconceptionTag: "" },
        { label: "D", text: "%f", misconceptionTag: "float" },
      ],
      correctAnswer: "C",
      hint: "Think string.",
      explanation: "%s is used to read a string in scanf()."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 13,
      questionText: "What does %f format specifier represent in printf()?",
      options: [
        { label: "A", text: "Integer", misconceptionTag: "int" },
        { label: "B", text: "Floating-point number", misconceptionTag: "" },
        { label: "C", text: "Character", misconceptionTag: "char" },
        { label: "D", text: "String", misconceptionTag: "string" },
      ],
      correctAnswer: "B",
      hint: "f stands for float.",
      explanation: "%f is the format specifier for printing floating-point numbers."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 14,
      questionText: 'What happens if you use printf("%f", 5);?',
      options: [
        { label: "A", text: "5", misconceptionTag: "int_only" },
        { label: "B", text: "5.000000", misconceptionTag: "auto_conversion_confusion" },
        { label: "C", text: "Compile-time error", misconceptionTag: "compile_error_confusion" },
        { label: "D", text: "Undefined behavior / garbage output", misconceptionTag: "" },
      ],
      correctAnswer: "D",
      hint: "%f expects a double argument.",
      explanation: "printf is variadic. Passing an int for %f is a format-argument mismatch, so the behavior is undefined."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 15,
      questionText: "Which escape sequence prints a tab space?",
      options: [
        { label: "A", text: "\\n", misconceptionTag: "newline" },
        { label: "B", text: "\\t", misconceptionTag: "" },
        { label: "C", text: "\\b", misconceptionTag: "backspace" },
        { label: "D", text: "\\a", misconceptionTag: "alert" },
      ],
      correctAnswer: "B",
      hint: "Tab character.",
      explanation: "\\t inserts a horizontal tab."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 16,
      questionText: "What is the output of printf(\"%d\", 5 + 3)?",
      options: [
        { label: "A", text: "5 + 3", misconceptionTag: "literal" },
        { label: "B", text: "53", misconceptionTag: "concat" },
        { label: "C", text: "8", misconceptionTag: "" },
        { label: "D", text: "Error", misconceptionTag: "error" },
      ],
      correctAnswer: "C",
      hint: "The expression is evaluated before printing.",
      explanation: "printf() evaluates expressions before printing; 5+3 = 8."
    },

  
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 17,
      questionText: 'Why is & used in scanf("%d", &x)?',
      options: [
        { label: "A", text: "Multiplication", misconceptionTag: "multiply" },
        { label: "B", text: "Address of variable", misconceptionTag: "" },
        { label: "C", text: "Logical AND", misconceptionTag: "logical" },
        { label: "D", text: "Not required", misconceptionTag: "not_needed" },
      ],
      correctAnswer: "B",
      hint: "Memory address.",
      explanation: "& gives the memory address of variable."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 18,
      questionText: 'What is wrong with scanf("%d %d", x, y);?',
      options: [
        { label: "A", text: "Nothing", misconceptionTag: "nothing" },
        { label: "B", text: "Missing & operator", misconceptionTag: "" },
        { label: "C", text: "Wrong format", misconceptionTag: "format" },
        { label: "D", text: "Too many variables", misconceptionTag: "variables" },
      ],
      correctAnswer: "B",
      hint: "Pointers required.",
      explanation: "You must use &x and &y in scanf."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 19,
      questionText: 'What will printf("%c", 65); output?',
      options: [
        { label: "A", text: "65", misconceptionTag: "number" },
        { label: "B", text: "A", misconceptionTag: "" },
        { label: "C", text: "Error", misconceptionTag: "error" },
        { label: "D", text: "Null", misconceptionTag: "null" },
      ],
      correctAnswer: "B",
      hint: "ASCII value.",
      explanation: "65 corresponds to character 'A'."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 20,
      questionText: 'What happens if you omit & in scanf("%d", num)?',
      options: [
        { label: "A", text: "It reads normally", misconceptionTag: "normal" },
        { label: "B", text: "Compiler error", misconceptionTag: "compile" },
        { label: "C", text: "Undefined behavior / crash", misconceptionTag: "" },
        { label: "D", text: "Prints 0", misconceptionTag: "zero" },
      ],
      correctAnswer: "C",
      hint: "scanf needs the address, not the value.",
      explanation: "Omitting & passes the variable's value as an address, causing undefined behavior."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 21,
      questionText: "Which statement about scanf is correct?",
      options: [
        { label: "A", text: "It prints output", misconceptionTag: "printf" },
        { label: "B", text: "It requires variable addresses", misconceptionTag: "" },
        { label: "C", text: "It does not use format specifiers", misconceptionTag: "no_format" },
        { label: "D", text: "It only reads strings", misconceptionTag: "strings_only" },
      ],
      correctAnswer: "B",
      hint: "Memory handling.",
      explanation: "scanf needs memory addresses using & operator."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 22,
      questionText: "To read a string with spaces using scanf, we can use:",
      options: [
        { label: "A", text: "%s", misconceptionTag: "stops_at_space" },
        { label: "B", text: "%c", misconceptionTag: "char" },
        { label: "C", text: "%[^\\n]", misconceptionTag: "" },
        { label: "D", text: "%d", misconceptionTag: "int" },
      ],
      correctAnswer: "C",
      hint: "%s stops reading at spaces.",
      explanation: "%[^\\n] tells scanf to read all characters until a newline."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 23,
      questionText: "What is the difference between printf and puts()?",
      options: [
        { label: "A", text: "No difference", misconceptionTag: "same" },
        { label: "B", text: "puts() adds newline automatically", misconceptionTag: "" },
        { label: "C", text: "printf cannot print strings", misconceptionTag: "printf_limit" },
        { label: "D", text: "puts() is for numbers only", misconceptionTag: "numbers" },
      ],
      correctAnswer: "B",
      hint: "puts adds \\n.",
      explanation: "puts() automatically appends a newline after printing the string."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 24,
      questionText: "What happens when you use wrong format specifier in printf?",
      options: [
        { label: "A", text: "Always compile error", misconceptionTag: "compile" },
        { label: "B", text: "Undefined behavior or garbage output", misconceptionTag: "" },
        { label: "C", text: "Automatic type conversion", misconceptionTag: "auto" },
        { label: "D", text: "Nothing happens", misconceptionTag: "nothing" },
      ],
      correctAnswer: "B",
      hint: "Mismatch between specifier and argument.",
      explanation: "Wrong format specifier leads to undefined behavior."
    }
  ];











  // ─────────────────────────────────────────────
  // MODULE 2 – Variables and Data Types
  // ─────────────────────────────────────────────
  const module2 = await LearningModule.create({
    name: "Variables and Data Types",
    code: "VARIABLES_DATA_TYPES",
    description: "Variables, data types, constants, scope and initialization MCQ practice.",
    orderNo: 2,
    totalQuestions: 36,
    isActive: true,
  });

  const module2Questions = [
  
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 1,
      questionText: "Which keyword is used to declare an integer variable in C?",
      options: [
        { label: "A", text: "integer", misconceptionTag: "full_name_confusion" },
        { label: "B", text: "int", misconceptionTag: "" },
        { label: "C", text: "num", misconceptionTag: "other_lang_confusion" },
        { label: "D", text: "var", misconceptionTag: "js_confusion" },
      ],
      correctAnswer: "B",
      hint: "C uses short specific keywords for data types.",
      explanation: "int is the standard keyword to declare integer variables. Writing integer instead of int causes 'unknown type name' error."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 2,
      questionText: "What is the correct way to declare and initialize a character variable?",
      options: [
        { label: "A", text: "char ch = \"A\";", misconceptionTag: "string_in_char" },
        { label: "B", text: "char ch = 'A';", misconceptionTag: "" },
        { label: "C", text: "char ch = A;", misconceptionTag: "missing_quotes" },
        { label: "D", text: "character ch = 'A';", misconceptionTag: "full_name_confusion" },
      ],
      correctAnswer: "B",
      hint: "Single characters use single quotes.",
      explanation: "Character literals are enclosed in single quotes ' '. Double quotes are for strings."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 3,
      questionText: "Which of the following is a valid variable name?",
      options: [
        { label: "A", text: "2age", misconceptionTag: "starts_with_digit" },
        { label: "B", text: "age_2", misconceptionTag: "" },
        { label: "C", text: "age#", misconceptionTag: "special_char" },
        { label: "D", text: "int", misconceptionTag: "keyword_as_name" },
      ],
      correctAnswer: "B",
      hint: "Cannot start with digit or use special symbols except underscore.",
      explanation: "Variable names must start with a letter or underscore and can contain digits after that."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 4,
      questionText: "The const keyword is used to create:",
      options: [
        { label: "A", text: "A mutable variable", misconceptionTag: "opposite_meaning" },
        { label: "B", text: "A read-only constant", misconceptionTag: "" },
        { label: "C", text: "A macro", misconceptionTag: "define_confusion" },
        { label: "D", text: "A function", misconceptionTag: "function_confusion" },
      ],
      correctAnswer: "B",
      hint: "Constant means value cannot change.",
      explanation: "const makes a variable read-only after initialization."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 5,
      questionText: "Which data type is used to store decimal numbers in C?",
      options: [
        { label: "A", text: "int", misconceptionTag: "whole_number" },
        { label: "B", text: "char", misconceptionTag: "character" },
        { label: "C", text: "float", misconceptionTag: "" },
        { label: "D", text: "bool", misconceptionTag: "cpp_confusion" },
      ],
      correctAnswer: "C",
      hint: "Used for numbers with fractions.",
      explanation: "float is used to store decimal values like 3.14."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 6,
      questionText: "Which symbol is used to end a statement in C?",
      options: [
        { label: "A", text: ".", misconceptionTag: "fullstop" },
        { label: "B", text: ",", misconceptionTag: "comma" },
        { label: "C", text: ";", misconceptionTag: "" },
        { label: "D", text: ":", misconceptionTag: "colon" },
      ],
      correctAnswer: "C",
      hint: "Every statement in C ends with this punctuation mark.",
      explanation: "A semicolon (;) is used to terminate statements in C."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 7,
      questionText: "What is the correct way to store a single character?",
      options: [
        { label: "A", text: "char c = \"A\";", misconceptionTag: "double_quotes" },
        { label: "B", text: "char c = 'A';", misconceptionTag: "" },
        { label: "C", text: "char c = A;", misconceptionTag: "no_quotes" },
        { label: "D", text: "character c = 'A';", misconceptionTag: "full_keyword" },
      ],
      correctAnswer: "B",
      hint: "Use single quotes for characters.",
      explanation: "Character literals must be enclosed in single quotes ' '."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 8,
      questionText: "Which of the following is a correct variable declaration?",
      options: [
        { label: "A", text: "int 123abc;", misconceptionTag: "starts_with_number" },
        { label: "B", text: "int abc123;", misconceptionTag: "" },
        { label: "C", text: "int abc#123;", misconceptionTag: "special_char" },
        { label: "D", text: "int int;", misconceptionTag: "keyword" },
      ],
      correctAnswer: "B",
      hint: "Cannot start with digit or use special characters (except _).",
      explanation: "Variable names must start with a letter or underscore."
    },

    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 9,
      questionText: "Global variables are automatically initialized to:",
      options: [
        { label: "A", text: "Garbage value", misconceptionTag: "local_confusion" },
        { label: "B", text: "0", misconceptionTag: "" },
        { label: "C", text: "1", misconceptionTag: "wrong_default" },
        { label: "D", text: "Undefined", misconceptionTag: "undefined_confusion" },
      ],
      correctAnswer: "B",
      hint: "Scope affects default initialization.",
      explanation: "Global and static variables are automatically initialized to zero."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 10,
      questionText: "What is the usual size of int on modern 64-bit systems?",
      options: [
        { label: "A", text: "2 bytes", misconceptionTag: "old_system" },
        { label: "B", text: "4 bytes", misconceptionTag: "" },
        { label: "C", text: "8 bytes", misconceptionTag: "long_confusion" },
        { label: "D", text: "1 byte", misconceptionTag: "char_size" },
      ],
      correctAnswer: "B",
      hint: "Standard C implementation.",
      explanation: "int is typically 4 bytes (32-bit) on modern systems."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 11,
      questionText: "#define PI 3.14 is an example of:",
      options: [
        { label: "A", text: "Variable", misconceptionTag: "variable_confusion" },
        { label: "B", text: "Macro", misconceptionTag: "" },
        { label: "C", text: "Function", misconceptionTag: "function_confusion" },
        { label: "D", text: "Pointer", misconceptionTag: "pointer_confusion" },
      ],
      correctAnswer: "B",
      hint: "Handled before compilation.",
      explanation: "#define creates a macro replacement before compilation."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 12,
      questionText: "What happens in int x = 7.8;?",
      options: [
        { label: "A", text: "Compile error", misconceptionTag: "type_error" },
        { label: "B", text: "x becomes 7", misconceptionTag: "" },
        { label: "C", text: "x becomes 8", misconceptionTag: "rounding_confusion" },
        { label: "D", text: "x becomes 7.8", misconceptionTag: "no_truncation" },
      ],
      correctAnswer: "B",
      hint: "Type conversion rules apply.",
      explanation: "Decimal part is truncated when storing float into int."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 13,
      questionText: "Uninitialized local variables contain:",
      options: [
        { label: "A", text: "0", misconceptionTag: "global_confusion" },
        { label: "B", text: "Garbage value", misconceptionTag: "" },
        { label: "C", text: "Null", misconceptionTag: "pointer_confusion" },
        { label: "D", text: "Undefined constant", misconceptionTag: "undefined" },
      ],
      correctAnswer: "B",
      hint: "Stack memory is not cleared automatically.",
      explanation: "Local variables contain garbage values if not initialized."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 14,
      questionText: "Which keyword creates a read-only variable?",
      options: [
        { label: "A", text: "static", misconceptionTag: "static_confusion" },
        { label: "B", text: "const", misconceptionTag: "" },
        { label: "C", text: "final", misconceptionTag: "java_confusion" },
        { label: "D", text: "readonly", misconceptionTag: "csharp_confusion" },
      ],
      correctAnswer: "B",
      hint: "Value cannot be changed after initialization.",
      explanation: "const makes a variable read-only."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 15,
      questionText: "The usual size of char in C is:",
      options: [
        { label: "A", text: "2 bytes", misconceptionTag: "unicode_confusion" },
        { label: "B", text: "1 byte", misconceptionTag: "" },
        { label: "C", text: "4 bytes", misconceptionTag: "int_confusion" },
        { label: "D", text: "8 bytes", misconceptionTag: "pointer" },
      ],
      correctAnswer: "B",
      hint: "Smallest addressable unit.",
      explanation: "char is always 1 byte in standard C."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 16,
      questionText: "What is the default value of a global int variable?",
      options: [
        { label: "A", text: "Garbage", misconceptionTag: "local_mistake" },
        { label: "B", text: "0", misconceptionTag: "" },
        { label: "C", text: "1", misconceptionTag: "wrong_default" },
        { label: "D", text: "Undefined", misconceptionTag: "undefined" },
      ],
      correctAnswer: "B",
      hint: "Globals are zero-initialized.",
      explanation: "Global variables are automatically initialized to 0."
    },

 
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 17,
      questionText: "What will be the output?\n\nint x = 10;\nprintf(\"%d\", x++ + ++x);",
      options: [
        { label: "A", text: "20", misconceptionTag: "simple_add" },
        { label: "B", text: "21", misconceptionTag: "increment_order" },
        { label: "C", text: "22", misconceptionTag: "increment_order" },
        { label: "D", text: "Undefined behavior", misconceptionTag: "" },
      ],
      correctAnswer: "D",
      hint: "Multiple modifications in same expression.",
      explanation: "This causes undefined behavior because x is modified more than once without sequence points."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 18,
      questionText: "Which of the following is NOT a valid C data type?",
      options: [
        { label: "A", text: "float", misconceptionTag: "" },
        { label: "B", text: "real", misconceptionTag: "" },
        { label: "C", text: "double", misconceptionTag: "" },
        { label: "D", text: "char", misconceptionTag: "" },
      ],
      correctAnswer: "B",
      hint: "Check built-in types.",
      explanation: "C does not have a data type called 'real'."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 19,
      questionText: "What happens if a const variable is modified?",
      options: [
        { label: "A", text: "Runs normally", misconceptionTag: "runtime" },
        { label: "B", text: "Warning", misconceptionTag: "warning_only" },
        { label: "C", text: "Compilation error", misconceptionTag: "" },
        { label: "D", text: "Runtime error", misconceptionTag: "runtime" },
      ],
      correctAnswer: "C",
      hint: "const means read-only.",
      explanation: "Modifying a const variable causes a compilation error."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 20,
      questionText: "What will be the output?\n\nchar ch = 97;\nprintf(\"%c\", ch);",
      options: [
        { label: "A", text: "97", misconceptionTag: "number_print" },
        { label: "B", text: "A", misconceptionTag: "uppercase" },
        { label: "C", text: "a", misconceptionTag: "" },
        { label: "D", text: "Error", misconceptionTag: "type_error" },
      ],
      correctAnswer: "C",
      hint: "ASCII mapping.",
      explanation: "ASCII value 97 corresponds to 'a'."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 21,
      questionText: "Which statement is correct about variables in C?",
      options: [
        { label: "A", text: "Variable names can start with digits", misconceptionTag: "digit_start" },
        { label: "B", text: "Keywords can be used as variable names", misconceptionTag: "keyword_use" },
        { label: "C", text: "Variable names can contain spaces", misconceptionTag: "space_in_name" },
        { label: "D", text: "Keywords cannot be used as variable names", misconceptionTag: "" },
      ],
      correctAnswer: "D",
      hint: "Reserved words rule.",
      explanation: "C keywords like int, float, return cannot be used as variable names."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 22,
      questionText: "What is the behavior of an uninitialized global pointer?",
      options: [
        { label: "A", text: "NULL", misconceptionTag: "" },
        { label: "B", text: "Garbage address", misconceptionTag: "local_pointer_confusion" },
        { label: "C", text: "Random non-zero address", misconceptionTag: "random_address_confusion" },
        { label: "D", text: "Compiler error", misconceptionTag: "error" },
      ],
      correctAnswer: "A",
      hint: "Objects with static storage duration are zero-initialized.",
      explanation: "A global pointer has static storage duration, so it is initialized to the null pointer value, commonly written as NULL."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 23,
      questionText: "Size of int * on a 64-bit system is usually:",
      options: [
        { label: "A", text: "4 bytes", misconceptionTag: "int_size" },
        { label: "B", text: "8 bytes", misconceptionTag: "" },
        { label: "C", text: "Depends on pointed type", misconceptionTag: "type_confusion" },
        { label: "D", text: "1 byte", misconceptionTag: "char" },
      ],
      correctAnswer: "B",
      hint: "Pointer size depends on architecture.",
      explanation: "On 64-bit systems, all pointers are typically 8 bytes."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 24,
      questionText: "What is the storage class that has default value 0 and retains value between function calls?",
      options: [
        { label: "A", text: "auto", misconceptionTag: "auto" },
        { label: "B", text: "register", misconceptionTag: "register" },
        { label: "C", text: "static", misconceptionTag: "" },
        { label: "D", text: "extern", misconceptionTag: "extern" },
      ],
      correctAnswer: "C",
      hint: "Persistent across calls.",
      explanation: "static variables retain their value and are initialized to 0."
    }
  ];



  // ─────────────────────────────────────────────
  // MODULE 3 – Loops
  // ─────────────────────────────────────────────
  const module3 = await LearningModule.create({
    name: "Loops",
    code: "LOOPS",
    description: "for, while, do-while, nested loops, break and continue MCQ practice.",
    orderNo: 3,
    totalQuestions: 36,
    isActive: true,
  });

  const module3Questions = [
  
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 1,
      questionText: "Which loop is best when you know the number of iterations in advance?",
      options: [
        { label: "A", text: "while", misconceptionTag: "while_confusion" },
        { label: "B", text: "do-while", misconceptionTag: "do_while_confusion" },
        { label: "C", text: "for", misconceptionTag: "" },
        { label: "D", text: "switch", misconceptionTag: "switch_confusion" },
      ],
      correctAnswer: "C",
      hint: "This loop combines initialization, condition, and update in one line.",
      explanation: "The for loop is ideal when the exact number of repetitions is known beforehand."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 2,
      questionText: "How many times will this loop run?\nfor(int i = 0; i < 5; i++)\n    printf(\"Hi\");",
      options: [
        { label: "A", text: "4 times", misconceptionTag: "off_by_one" },
        { label: "B", text: "5 times", misconceptionTag: "" },
        { label: "C", text: "6 times", misconceptionTag: "off_by_one" },
        { label: "D", text: "Infinite", misconceptionTag: "infinite_loop" },
      ],
      correctAnswer: "B",
      hint: "The condition i < 5 is checked before each iteration.",
      explanation: "i takes values 0, 1, 2, 3, 4 → 5 iterations."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 3,
      questionText: "What is the correct syntax for a while loop?",
      options: [
        { label: "A", text: "while(condition) { }", misconceptionTag: "" },
        { label: "B", text: "while { } condition", misconceptionTag: "syntax_error" },
        { label: "C", text: "while (condition);", misconceptionTag: "empty_body" },
        { label: "D", text: "while condition do { }", misconceptionTag: "pascal_confusion" },
      ],
      correctAnswer: "A",
      hint: "Condition goes inside parentheses.",
      explanation: "C uses while(condition) followed by a block or statement."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 4,
      questionText: "What is a nested loop?",
      options: [
        { label: "A", text: "A loop inside another loop", misconceptionTag: "" },
        { label: "B", text: "Two loops in sequence", misconceptionTag: "sequence_confusion" },
        { label: "C", text: "Loop with no condition", misconceptionTag: "infinite" },
        { label: "D", text: "Infinite loop only", misconceptionTag: "infinite" },
      ],
      correctAnswer: "A",
      hint: "Think of loops inside loops.",
      explanation: "A nested loop means one loop is placed inside another loop."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 5,
      questionText: "Which loop will always execute at least once?",
      options: [
        { label: "A", text: "for", misconceptionTag: "for_confusion" },
        { label: "B", text: "while", misconceptionTag: "while_confusion" },
        { label: "C", text: "do-while", misconceptionTag: "" },
        { label: "D", text: "switch", misconceptionTag: "switch_confusion" },
      ],
      correctAnswer: "C",
      hint: "Condition is checked after execution.",
      explanation: "do-while executes the body first, then checks condition."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 6,
      questionText: "Which keyword is used to exit a loop early?",
      options: [
        { label: "A", text: "continue", misconceptionTag: "continue_confusion" },
        { label: "B", text: "exit", misconceptionTag: "exit_function" },
        { label: "C", text: "break", misconceptionTag: "" },
        { label: "D", text: "stop", misconceptionTag: "other_lang" },
      ],
      correctAnswer: "C",
      hint: "Used to terminate loop immediately.",
      explanation: "break is used to exit loops or switch statements."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 7,
      questionText: "Which loop checks condition first?",
      options: [
        { label: "A", text: "do-while", misconceptionTag: "do_while" },
        { label: "B", text: "while", misconceptionTag: "" },
        { label: "C", text: "switch", misconceptionTag: "switch" },
        { label: "D", text: "goto", misconceptionTag: "goto" },
      ],
      correctAnswer: "B",
      hint: "Entry-controlled loop.",
      explanation: "while loop checks condition before executing the loop body."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 8,
      questionText: "What does the continue statement do in a loop?",
      options: [
        { label: "A", text: "Stops the loop completely", misconceptionTag: "break_confusion" },
        { label: "B", text: "Skips the current iteration", misconceptionTag: "" },
        { label: "C", text: "Ends the program", misconceptionTag: "exit" },
        { label: "D", text: "Restarts the loop", misconceptionTag: "restart" },
      ],
      correctAnswer: "B",
      hint: "Moves to next iteration.",
      explanation: "continue skips current iteration and moves to next."
    },

 
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 9,
      questionText: "Which loop executes at least once even if the condition is false?",
      options: [
        { label: "A", text: "for", misconceptionTag: "for" },
        { label: "B", text: "while", misconceptionTag: "while" },
        { label: "C", text: "do-while", misconceptionTag: "" },
        { label: "D", text: "if", misconceptionTag: "if_confusion" },
      ],
      correctAnswer: "C",
      hint: "Exit-controlled loop.",
      explanation: "do-while checks condition after executing the loop body."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 10,
      questionText: "Which of the following creates an infinite loop?",
      options: [
        { label: "A", text: "for(;;)", misconceptionTag: "" },
        { label: "B", text: "while(1)", misconceptionTag: "" },
        { label: "C", text: "while(true)", misconceptionTag: "" },
        { label: "D", text: "All of the above", misconceptionTag: "" },
      ],
      correctAnswer: "D",
      hint: "All conditions are always true.",
      explanation: "All given options create loops that never terminate."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 11,
      questionText: "In a for loop, which parts can be omitted?",
      options: [
        { label: "A", text: "Initialization only", misconceptionTag: "partial" },
        { label: "B", text: "Condition only", misconceptionTag: "partial" },
        { label: "C", text: "Update only", misconceptionTag: "partial" },
        { label: "D", text: "All parts can be omitted", misconceptionTag: "" },
      ],
      correctAnswer: "D",
      hint: "for(;;) is valid in C.",
      explanation: "All three parts of a for loop are optional in C."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 12,
      questionText: "A do-while loop is also called:",
      options: [
        { label: "A", text: "Entry-controlled loop", misconceptionTag: "entry" },
        { label: "B", text: "Exit-controlled loop", misconceptionTag: "" },
        { label: "C", text: "Pre-test loop", misconceptionTag: "pretest" },
        { label: "D", text: "Infinite loop", misconceptionTag: "infinite" },
      ],
      correctAnswer: "B",
      hint: "Condition is checked at the end.",
      explanation: "Since condition is checked after execution, it's exit-controlled."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 13,
      questionText: "What is the output count?\nfor(int i=0; i<3; i++) for(int j=0; j<2; j++) printf(\"*\");",
      options: [
        { label: "A", text: "3", misconceptionTag: "outer_only" },
        { label: "B", text: "2", misconceptionTag: "inner_only" },
        { label: "C", text: "6", misconceptionTag: "" },
        { label: "D", text: "5", misconceptionTag: "off_by_one" },
      ],
      correctAnswer: "C",
      hint: "Multiply outer and inner loop iterations.",
      explanation: "3 outer × 2 inner = 6 prints."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 14,
      questionText: "What happens if you write while(condition); ?",
      options: [
        { label: "A", text: "Loop executes normally", misconceptionTag: "normal" },
        { label: "B", text: "Infinite loop with empty body", misconceptionTag: "" },
        { label: "C", text: "Syntax error", misconceptionTag: "syntax" },
        { label: "D", text: "Loop runs once", misconceptionTag: "once" },
      ],
      correctAnswer: "B",
      hint: "Semicolon becomes loop body.",
      explanation: "The loop runs an empty statement repeatedly, causing a potential infinite loop."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 15,
      questionText: "What does break do inside a nested loop?",
      options: [
        { label: "A", text: "Exits only the inner loop", misconceptionTag: "" },
        { label: "B", text: "Exits all loops", misconceptionTag: "all_loops" },
        { label: "C", text: "Skips current iteration", misconceptionTag: "continue" },
        { label: "D", text: "Causes error", misconceptionTag: "error" },
      ],
      correctAnswer: "A",
      hint: "Only the innermost loop is affected.",
      explanation: "break exits only the innermost loop it is placed in."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 16,
      questionText: "Which loop is most suitable when the number of iterations is not known?",
      options: [
        { label: "A", text: "for", misconceptionTag: "for" },
        { label: "B", text: "while", misconceptionTag: "" },
        { label: "C", text: "do-while", misconceptionTag: "do_while" },
        { label: "D", text: "switch", misconceptionTag: "switch" },
      ],
      correctAnswer: "B",
      hint: "Condition-based loop.",
      explanation: "while loop is preferred when iterations depend on a runtime condition."
    },

 
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 17,
      questionText: "What is the output?\nint i=0;\nwhile(i++ < 3)\n    printf(\"%d\", i);",
      options: [
        { label: "A", text: "012", misconceptionTag: "pre_increment" },
        { label: "B", text: "123", misconceptionTag: "" },
        { label: "C", text: "0123", misconceptionTag: "off_by_one" },
        { label: "D", text: "1234", misconceptionTag: "off_by_one" },
      ],
      correctAnswer: "B",
      hint: "Post-increment affects comparison timing.",
      explanation: "i is incremented after comparison, producing 1,2,3."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 18,
      questionText: "What is the result of this nested loop?\nfor(int i=1;i<=2;i++)\n for(int j=1;j<=3;j++)\n  printf(\"%d%d\", i,j);",
      options: [
        { label: "A", text: "6 outputs", misconceptionTag: "" },
        { label: "B", text: "5 outputs", misconceptionTag: "off_by_one" },
        { label: "C", text: "4 outputs", misconceptionTag: "wrong_calc" },
        { label: "D", text: "3 outputs", misconceptionTag: "outer_only" },
      ],
      correctAnswer: "A",
      hint: "Multiply iterations.",
      explanation: "2 outer × 3 inner = 6 outputs."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 19,
      questionText: "What happens in for(;;)?",
      options: [
        { label: "A", text: "Runs once", misconceptionTag: "once" },
        { label: "B", text: "Syntax error", misconceptionTag: "syntax" },
        { label: "C", text: "Infinite loop", misconceptionTag: "" },
        { label: "D", text: "No execution", misconceptionTag: "no_exec" },
      ],
      correctAnswer: "C",
      hint: "Empty for loop conditions.",
      explanation: "All parts missing means condition is always true → infinite loop."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 20,
      questionText: "What is wrong with this code?\nwhile(x=5)\n{ printf(\"Hello\"); }",
      options: [
        { label: "A", text: "Nothing wrong", misconceptionTag: "assignment_ok" },
        { label: "B", text: "Comparison missing (assignment used)", misconceptionTag: "" },
        { label: "C", text: "Syntax error", misconceptionTag: "syntax" },
        { label: "D", text: "Loop runs once", misconceptionTag: "once" },
      ],
      correctAnswer: "B",
      hint: "Assignment vs comparison.",
      explanation: "x=5 assigns value 5, which is always true → infinite loop."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 21,
      questionText: "What happens if break is used in the outer loop of nested loops?",
      options: [
        { label: "A", text: "Only inner loop stops", misconceptionTag: "inner" },
        { label: "B", text: "The outer loop stops", misconceptionTag: "" },
        { label: "C", text: "Program terminates", misconceptionTag: "exit" },
        { label: "D", text: "Infinite loop", misconceptionTag: "infinite" },
      ],
      correctAnswer: "B",
      hint: "break exits the loop that directly contains it.",
      explanation: "If break is placed in the outer loop body, it terminates the outer loop. If it is placed inside the inner loop, it only terminates the inner loop."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 22,
      questionText: "Which is true about do-while loop?",
      options: [
        { label: "A", text: "Condition checked before body", misconceptionTag: "while" },
        { label: "B", text: "Body executes at least once", misconceptionTag: "" },
        { label: "C", text: "Cannot be nested", misconceptionTag: "nesting" },
        { label: "D", text: "Always infinite", misconceptionTag: "infinite" },
      ],
      correctAnswer: "B",
      hint: "Post-test loop.",
      explanation: "do-while guarantees at least one execution of the body."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 23,
      questionText: "What is the output of:\nint i=0;\nwhile(i<3)\n    printf(\"%d\", i);\n    i++;",
      options: [
        { label: "A", text: "012", misconceptionTag: "with_braces" },
        { label: "B", text: "000", misconceptionTag: "wrong" },
        { label: "C", text: "Infinite loop", misconceptionTag: "" },
        { label: "D", text: "Error", misconceptionTag: "syntax" },
      ],
      correctAnswer: "C",
      hint: "Missing braces matter.",
      explanation: "Only printf is inside the loop; i++ runs once → infinite loop printing 0."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 24,
      questionText: "In C, for(;;) with no break inside will:",
      options: [
        { label: "A", text: "Compile error", misconceptionTag: "syntax" },
        { label: "B", text: "Run once", misconceptionTag: "once" },
        { label: "C", text: "Infinite loop", misconceptionTag: "" },
        { label: "D", text: "Not execute", misconceptionTag: "no_exec" },
      ],
      correctAnswer: "C",
      hint: "Empty condition defaults to true.",
      explanation: "for(;;) is a standard way to write an infinite loop in C."
    }
  ];


  // ─────────────────────────────────────────────
  // MODULE 4 – Functions
  // ─────────────────────────────────────────────
  const module4 = await LearningModule.create({
    name: "Functions",
    code: "FUNCTIONS",
    description: "Function declaration, definition, parameters, recursion, scope and prototypes MCQ practice.",
    orderNo: 4,
    totalQuestions: 36,
    isActive: true,
  });

  const module4Questions = [
 
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 1,
      questionText: "What is the return type of a function that does not return any value?",
      options: [
        { label: "A", text: "int", misconceptionTag: "default_int" },
        { label: "B", text: "null", misconceptionTag: "java_confusion" },
        { label: "C", text: "void", misconceptionTag: "" },
        { label: "D", text: "empty", misconceptionTag: "other_lang" },
      ],
      correctAnswer: "C",
      hint: "Void means nothing.",
      explanation: "'void' indicates a function provides no return value to the caller."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 2,
      questionText: "Which keyword is used to send a value back from a function?",
      options: [
        { label: "A", text: "send", misconceptionTag: "other_lang" },
        { label: "B", text: "back", misconceptionTag: "other_lang" },
        { label: "C", text: "return", misconceptionTag: "" },
        { label: "D", text: "output", misconceptionTag: "other_lang" },
      ],
      correctAnswer: "C",
      hint: "Standard C keyword.",
      explanation: "The 'return' statement is used to send a value back from a function."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 3,
      questionText: "Which function is the starting point of every C program?",
      options: [
        { label: "A", text: "start()", misconceptionTag: "other_lang" },
        { label: "B", text: "begin()", misconceptionTag: "other_lang" },
        { label: "C", text: "main", misconceptionTag: "" },
        { label: "D", text: "init()", misconceptionTag: "other_lang" },
      ],
      correctAnswer: "C",
      hint: "Program execution begins here.",
      explanation: "Execution always starts from the main() function."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 4,
      questionText: "What is one main benefit of functions?",
      options: [
        { label: "A", text: "Faster CPU", misconceptionTag: "performance_myth" },
        { label: "B", text: "Code reusability", misconceptionTag: "" },
        { label: "C", text: "Less RAM usage", misconceptionTag: "memory_myth" },
        { label: "D", text: "Auto debugging", misconceptionTag: "debugging_myth" },
      ],
      correctAnswer: "B",
      hint: "Avoid repetition.",
      explanation: "Functions allow code reuse and modular programming."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 5,
      questionText: "Variables declared inside a function are called:",
      options: [
        { label: "A", text: "Global variables", misconceptionTag: "global_confusion" },
        { label: "B", text: "Local variables", misconceptionTag: "" },
        { label: "C", text: "External variables", misconceptionTag: "extern" },
        { label: "D", text: "System variables", misconceptionTag: "system" },
      ],
      correctAnswer: "B",
      hint: "Scope is limited.",
      explanation: "Variables inside a function have local scope."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 6,
      questionText: "What is a function prototype?",
      options: [
        { label: "A", text: "Function definition", misconceptionTag: "definition_confusion" },
        { label: "B", text: "Function declaration", misconceptionTag: "" },
        { label: "C", text: "Loop structure", misconceptionTag: "loop" },
        { label: "D", text: "Header file", misconceptionTag: "header" },
      ],
      correctAnswer: "B",
      hint: "Declared before use.",
      explanation: "A prototype declares a function before its definition."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 7,
      questionText: "A function in C is used to:",
      options: [
        { label: "A", text: "Store data", misconceptionTag: "variable" },
        { label: "B", text: "Repeat code without rewriting", misconceptionTag: "" },
        { label: "C", text: "Declare variables only", misconceptionTag: "variable" },
        { label: "D", text: "Create arrays", misconceptionTag: "array" },
      ],
      correctAnswer: "B",
      hint: "Think about reducing repetition.",
      explanation: "Functions provide modularity and allow programmers to reuse code blocks."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 8,
      questionText: "The correct syntax to declare a function is:",
      options: [
        { label: "A", text: "return_type function_name();", misconceptionTag: "" },
        { label: "B", text: "function_name() return_type;", misconceptionTag: "wrong_order" },
        { label: "C", text: "declare function function_name();", misconceptionTag: "other_lang" },
        { label: "D", text: "int function_name;", misconceptionTag: "variable" },
      ],
      correctAnswer: "A",
      hint: "Starts with return type.",
      explanation: "A function declaration (prototype) specifies the return type, name, and parameters."
    },

  
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 9,
      questionText: "A function that calls itself is called:",
      options: [
        { label: "A", text: "Loop function", misconceptionTag: "loop" },
        { label: "B", text: "Recursive function", misconceptionTag: "" },
        { label: "C", text: "Static function", misconceptionTag: "static" },
        { label: "D", text: "Inline function", misconceptionTag: "inline" },
      ],
      correctAnswer: "B",
      hint: "Self-calling function.",
      explanation: "Recursion is when a function calls itself."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 10,
      questionText: "Local variables are stored in:",
      options: [
        { label: "A", text: "Heap", misconceptionTag: "heap" },
        { label: "B", text: "Stack", misconceptionTag: "" },
        { label: "C", text: "ROM", misconceptionTag: "rom" },
        { label: "D", text: "Disk", misconceptionTag: "disk" },
      ],
      correctAnswer: "B",
      hint: "Automatic memory area.",
      explanation: "Local variables are stored in the stack memory."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 11,
      questionText: "Arguments passed in function call are called:",
      options: [
        { label: "A", text: "Formal parameters", misconceptionTag: "formal" },
        { label: "B", text: "Actual parameters", misconceptionTag: "" },
        { label: "C", text: "Local variables", misconceptionTag: "local" },
        { label: "D", text: "Pointers", misconceptionTag: "pointer" },
      ],
      correctAnswer: "B",
      hint: "Values at call time.",
      explanation: "Actual parameters are values passed to a function."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 12,
      questionText: "Which function terminates program execution?",
      options: [
        { label: "A", text: "return()", misconceptionTag: "return" },
        { label: "B", text: "exit()", misconceptionTag: "" },
        { label: "C", text: "stop()", misconceptionTag: "other_lang" },
        { label: "D", text: "break()", misconceptionTag: "break" },
      ],
      correctAnswer: "B",
      hint: "stdlib.h function.",
      explanation: "exit() terminates the program immediately."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 13,
      questionText: "What is function overloading in C?",
      options: [
        { label: "A", text: "Supported feature", misconceptionTag: "cpp" },
        { label: "B", text: "Not supported", misconceptionTag: "" },
        { label: "C", text: "Loop feature", misconceptionTag: "loop" },
        { label: "D", text: "Memory feature", misconceptionTag: "memory" },
      ],
      correctAnswer: "B",
      hint: "Compare with C++.",
      explanation: "C does NOT support function overloading."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 14,
      questionText: "Parameters defined in the function header are called ________.",
      options: [
        { label: "A", text: "Actual arguments", misconceptionTag: "actual" },
        { label: "B", text: "Formal parameters", misconceptionTag: "" },
        { label: "C", text: "Global variables", misconceptionTag: "global" },
        { label: "D", text: "Constants", misconceptionTag: "const" },
      ],
      correctAnswer: "B",
      hint: "Defined in function header.",
      explanation: "Formal parameters appear in the function definition."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 15,
      questionText: "The scope of variables declared inside a function is:",
      options: [
        { label: "A", text: "Global", misconceptionTag: "global" },
        { label: "B", text: "Local (only within the function)", misconceptionTag: "" },
        { label: "C", text: "File level", misconceptionTag: "file" },
        { label: "D", text: "Program level", misconceptionTag: "program" },
      ],
      correctAnswer: "B",
      hint: "Variables inside a function cannot be accessed outside of it.",
      explanation: "Local variables are only visible within the block where they are defined."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 16,
      questionText: "Which is true about the main() function?",
      options: [
        { label: "A", text: "It is user-defined", misconceptionTag: "user" },
        { label: "B", text: "It is a special function and the entry point", misconceptionTag: "" },
        { label: "C", text: "It is optional", misconceptionTag: "optional" },
        { label: "D", text: "It is a library function", misconceptionTag: "library" },
      ],
      correctAnswer: "B",
      hint: "Every C program starts execution from a specific function.",
      explanation: "Execution of every C program begins at the standard main() function."
    },

  
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 17,
      questionText: "What happens if a recursive function has no base case?",
      options: [
        { label: "A", text: "Normal execution", misconceptionTag: "normal" },
        { label: "B", text: "Infinite recursion", misconceptionTag: "" },
        { label: "C", text: "Compile error", misconceptionTag: "compile" },
        { label: "D", text: "Optimization", misconceptionTag: "optimize" },
      ],
      correctAnswer: "B",
      hint: "Stops condition missing.",
      explanation: "It leads to infinite recursion and stack overflow."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 18,
      questionText: "What is returned if no return statement is used in a non-void function?",
      options: [
        { label: "A", text: "0", misconceptionTag: "zero" },
        { label: "B", text: "Garbage value", misconceptionTag: "" },
        { label: "C", text: "NULL", misconceptionTag: "null" },
        { label: "D", text: "Compiler error", misconceptionTag: "error" },
      ],
      correctAnswer: "B",
      hint: "Undefined behavior.",
      explanation: "Missing return in non-void functions leads to undefined behavior."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 19,
      questionText: "Which memory is affected by recursive function calls?",
      options: [
        { label: "A", text: "Heap", misconceptionTag: "heap" },
        { label: "B", text: "Stack", misconceptionTag: "" },
        { label: "C", text: "Static memory", misconceptionTag: "static" },
        { label: "D", text: "ROM", misconceptionTag: "rom" },
      ],
      correctAnswer: "B",
      hint: "Function calls stack up.",
      explanation: "Each recursive call uses stack memory."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 20,
      questionText: "When is a function prototype strictly required?",
      options: [
        { label: "A", text: "When the function is defined before main()", misconceptionTag: "before" },
        { label: "B", text: "When the function is defined after it is called", misconceptionTag: "" },
        { label: "C", text: "When the function returns void", misconceptionTag: "void" },
        { label: "D", text: "It is never strictly required", misconceptionTag: "never" },
      ],
      correctAnswer: "B",
      hint: "The compiler needs to know about the function before it is used.",
      explanation: "If the definition comes later, a prototype must appear before the first call."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 21,
      questionText: "Which is true about function parameters in C?",
      options: [
        { label: "A", text: "Passed by reference always", misconceptionTag: "reference" },
        { label: "B", text: "Passed by value by default", misconceptionTag: "" },
        { label: "C", text: "Not supported", misconceptionTag: "not_supported" },
        { label: "D", text: "Only pointers allowed", misconceptionTag: "pointer_only" },
      ],
      correctAnswer: "B",
      hint: "Default behavior.",
      explanation: "C passes arguments by value unless pointers are used."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 22,
      questionText: "What happens if you call a function before its declaration without a prototype?",
      options: [
        { label: "A", text: "Works normally", misconceptionTag: "works" },
        { label: "B", text: "Implicit declaration warning (old C)", misconceptionTag: "" },
        { label: "C", text: "Always compile error", misconceptionTag: "error" },
        { label: "D", text: "Runtime error", misconceptionTag: "runtime" },
      ],
      correctAnswer: "B",
      hint: "Old C behavior vs modern.",
      explanation: "In modern C, it may cause a warning or error. Best practice is to always use prototype."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 23,
      questionText: "The default return type of a function (if not specified) in older C is:",
      options: [
        { label: "A", text: "void", misconceptionTag: "void" },
        { label: "B", text: "int", misconceptionTag: "" },
        { label: "C", text: "char", misconceptionTag: "char" },
        { label: "D", text: "float", misconceptionTag: "float" },
      ],
      correctAnswer: "B",
      hint: "Historical C behavior.",
      explanation: "In pre-ANSI C, functions defaulted to returning int."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 24,
      questionText: "To modify the original value of a variable inside a function, we should use:",
      options: [
        { label: "A", text: "Pass by value", misconceptionTag: "value" },
        { label: "B", text: "Pass by pointer (address)", misconceptionTag: "" },
        { label: "C", text: "Global variable only", misconceptionTag: "global" },
        { label: "D", text: "Static variable", misconceptionTag: "static" },
      ],
      correctAnswer: "B",
      hint: "Need address to modify original.",
      explanation: "Passing pointer allows function to modify the caller's variable."
    }
  ];


  // ─────────────────────────────────────────────
  // EXTRA QUESTIONS FOR RECOVERY PRACTICE
  // 12 more questions per module: 4 easy, 4 medium, 4 hard
  // ─────────────────────────────────────────────

  const additionalModule1Questions = [
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 25,
      questionText: "Which format specifier is used to print a double value using printf()?",
      options: [
        { label: "A", text: "%d", misconceptionTag: "int_confusion" },
        { label: "B", text: "%lf", misconceptionTag: "scanf_printf_mixup" },
        { label: "C", text: "%f", misconceptionTag: "" },
        { label: "D", text: "%c", misconceptionTag: "char_confusion" },
      ],
      correctAnswer: "C",
      hint: "printf uses %f for both float and double values.",
      explanation: "In printf(), %f is used to print floating-point values. Float arguments are promoted to double in variadic functions."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 26,
      questionText: "Which escape sequence is used to print a backslash character?",
      options: [
        { label: "A", text: "\\\\", misconceptionTag: "" },
        { label: "B", text: "\\n", misconceptionTag: "newline_confusion" },
        { label: "C", text: "\\t", misconceptionTag: "tab_confusion" },
        { label: "D", text: "//", misconceptionTag: "comment_confusion" },
      ],
      correctAnswer: "A",
      hint: "A backslash must be escaped using another backslash.",
      explanation: "\\\\ prints one backslash because the first backslash escapes the second one."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 27,
      questionText: "Which function can be used to print a single character to the screen?",
      options: [
        { label: "A", text: "putchar()", misconceptionTag: "" },
        { label: "B", text: "getchar()", misconceptionTag: "input_output_mixup" },
        { label: "C", text: "scanf()", misconceptionTag: "input_mixup" },
        { label: "D", text: "readchar()", misconceptionTag: "non_c_function" },
      ],
      correctAnswer: "A",
      hint: "The name means put one character.",
      explanation: "putchar() prints a single character to standard output."
    },
    {
      concept: "Input / Output",
      difficulty: "easy",
      orderNo: 28,
      questionText: "Which function can read one character from standard input?",
      options: [
        { label: "A", text: "putchar()", misconceptionTag: "output_mixup" },
        { label: "B", text: "getchar()", misconceptionTag: "" },
        { label: "C", text: "printf()", misconceptionTag: "output_mixup" },
        { label: "D", text: "printchar()", misconceptionTag: "non_c_function" },
      ],
      correctAnswer: "B",
      hint: "The name means get one character.",
      explanation: "getchar() reads one character from standard input."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 29,
      questionText: "What is the correct scanf() statement to read a float variable f?",
      options: [
        { label: "A", text: "scanf(\"%f\", f);", misconceptionTag: "missing_address" },
        { label: "B", text: "scanf(\"%d\", &f);", misconceptionTag: "wrong_specifier" },
        { label: "C", text: "scanf(\"%f\", &f);", misconceptionTag: "" },
        { label: "D", text: "scanf(\"%lf\", &f);", misconceptionTag: "double_float_mixup" },
      ],
      correctAnswer: "C",
      hint: "scanf needs both the correct specifier and address.",
      explanation: "For a float variable, scanf uses %f and the address &f."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 30,
      questionText: "What is the output of printf(\"%.2f\", 3.14159);?",
      options: [
        { label: "A", text: "3.14159", misconceptionTag: "precision_ignored" },
        { label: "B", text: "3.14", misconceptionTag: "" },
        { label: "C", text: "3", misconceptionTag: "integer_confusion" },
        { label: "D", text: "3.15", misconceptionTag: "wrong_rounding" },
      ],
      correctAnswer: "B",
      hint: "%.2f prints two digits after the decimal point.",
      explanation: "%.2f formats the floating-point number to two decimal places, so 3.14159 becomes 3.14."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 31,
      questionText: "What is the output of printf(\"%5d\", 42);?",
      options: [
        { label: "A", text: "42", misconceptionTag: "width_ignored" },
        { label: "B", text: "00042", misconceptionTag: "zero_padding_confusion" },
        { label: "C", text: "   42", misconceptionTag: "" },
        { label: "D", text: "42   ", misconceptionTag: "left_align_confusion" },
      ],
      correctAnswer: "C",
      hint: "%5d means width 5, right aligned by default.",
      explanation: "%5d prints the integer in a field of width 5, adding spaces before 42."
    },
    {
      concept: "Input / Output",
      difficulty: "medium",
      orderNo: 32,
      questionText: "What is the output of printf(\"%-5dX\", 42);?",
      options: [
        { label: "A", text: "42   X", misconceptionTag: "" },
        { label: "B", text: "   42X", misconceptionTag: "right_align_confusion" },
        { label: "C", text: "00042X", misconceptionTag: "zero_padding_confusion" },
        { label: "D", text: "42X", misconceptionTag: "width_ignored" },
      ],
      correctAnswer: "A",
      hint: "The minus sign makes it left aligned.",
      explanation: "%-5d prints 42 left aligned in a width of 5, then prints X."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 33,
      questionText: "Which scanf() format is correct for reading a double variable d?",
      options: [
        { label: "A", text: "scanf(\"%f\", &d);", misconceptionTag: "float_double_mixup" },
        { label: "B", text: "scanf(\"%lf\", &d);", misconceptionTag: "" },
        { label: "C", text: "scanf(\"%d\", &d);", misconceptionTag: "int_confusion" },
        { label: "D", text: "scanf(\"%c\", &d);", misconceptionTag: "char_confusion" },
      ],
      correctAnswer: "B",
      hint: "scanf uses %lf for double.",
      explanation: "When reading a double using scanf(), the correct specifier is %lf."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 34,
      questionText: "What is the problem with scanf(\"%s\", name); if name is char name[10]?",
      options: [
        { label: "A", text: "It cannot read characters", misconceptionTag: "string_confusion" },
        { label: "B", text: "It may overflow if input is too long", misconceptionTag: "" },
        { label: "C", text: "It always reads spaces", misconceptionTag: "space_confusion" },
        { label: "D", text: "It needs &name always", misconceptionTag: "array_address_confusion" },
      ],
      correctAnswer: "B",
      hint: "%s does not automatically limit input length.",
      explanation: "scanf(\"%s\", name) can overflow the array if the user enters more characters than the array can store."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 35,
      questionText: "Which statement correctly limits scanf string input to 9 characters for char name[10]?",
      options: [
        { label: "A", text: "scanf(\"%9s\", name);", misconceptionTag: "" },
        { label: "B", text: "scanf(\"%10s\", name);", misconceptionTag: "null_terminator_confusion" },
        { label: "C", text: "scanf(\"%s9\", name);", misconceptionTag: "wrong_syntax" },
        { label: "D", text: "scanf(\"%s\", &name);", misconceptionTag: "array_address_confusion" },
      ],
      correctAnswer: "A",
      hint: "Leave one space for the null terminator.",
      explanation: "%9s reads at most 9 characters, leaving space for the terminating null character in a 10-character array."
    },
    {
      concept: "Input / Output",
      difficulty: "hard",
      orderNo: 36,
      questionText: "What does printf(\"%%\"); print?",
      options: [
        { label: "A", text: "%", misconceptionTag: "" },
        { label: "B", text: "%%", misconceptionTag: "double_percent_confusion" },
        { label: "C", text: "Nothing", misconceptionTag: "empty_output" },
        { label: "D", text: "Error", misconceptionTag: "format_error" },
      ],
      correctAnswer: "A",
      hint: "Use %% to print a literal percent sign.",
      explanation: "In printf(), %% is used to print one percent sign."
    }
  ];

  const additionalModule2Questions = [
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 25,
      questionText: "Which data type is commonly used to store a larger integer than int?",
      options: [
        { label: "A", text: "long", misconceptionTag: "" },
        { label: "B", text: "float", misconceptionTag: "decimal_confusion" },
        { label: "C", text: "char", misconceptionTag: "char_confusion" },
        { label: "D", text: "real", misconceptionTag: "non_c_type" },
      ],
      correctAnswer: "A",
      hint: "Think of long integer.",
      explanation: "long is commonly used when a larger integer range than int is needed."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 26,
      questionText: "Which of the following is a valid C identifier?",
      options: [
        { label: "A", text: "total marks", misconceptionTag: "space_in_name" },
        { label: "B", text: "total_marks", misconceptionTag: "" },
        { label: "C", text: "total-marks", misconceptionTag: "hyphen_confusion" },
        { label: "D", text: "3total", misconceptionTag: "starts_with_digit" },
      ],
      correctAnswer: "B",
      hint: "Underscore is allowed; spaces and hyphens are not.",
      explanation: "total_marks is valid because it starts with a letter and uses only letters and underscore."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 27,
      questionText: "Which data type is used to store a single character?",
      options: [
        { label: "A", text: "char", misconceptionTag: "" },
        { label: "B", text: "string", misconceptionTag: "string_confusion" },
        { label: "C", text: "text", misconceptionTag: "non_c_type" },
        { label: "D", text: "word", misconceptionTag: "non_c_type" },
      ],
      correctAnswer: "A",
      hint: "Single character type.",
      explanation: "char is used to store a single character in C."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "easy",
      orderNo: 28,
      questionText: "Which declaration stores a decimal value correctly?",
      options: [
        { label: "A", text: "int pi = 3.14;", misconceptionTag: "int_for_decimal" },
        { label: "B", text: "float pi = 3.14;", misconceptionTag: "" },
        { label: "C", text: "char pi = 3.14;", misconceptionTag: "char_confusion" },
        { label: "D", text: "number pi = 3.14;", misconceptionTag: "non_c_type" },
      ],
      correctAnswer: "B",
      hint: "Use a floating-point type.",
      explanation: "float can store decimal values such as 3.14."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 29,
      questionText: "What is the result of sizeof(char) in C?",
      options: [
        { label: "A", text: "1", misconceptionTag: "" },
        { label: "B", text: "2", misconceptionTag: "unicode_confusion" },
        { label: "C", text: "4", misconceptionTag: "int_confusion" },
        { label: "D", text: "Depends on compiler", misconceptionTag: "implementation_confusion" },
      ],
      correctAnswer: "A",
      hint: "The C standard defines it.",
      explanation: "sizeof(char) is always 1 byte in C."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 30,
      questionText: "What will int x = 5 / 2; store in x?",
      options: [
        { label: "A", text: "2.5", misconceptionTag: "float_division_confusion" },
        { label: "B", text: "2", misconceptionTag: "" },
        { label: "C", text: "3", misconceptionTag: "rounding_confusion" },
        { label: "D", text: "Error", misconceptionTag: "division_error" },
      ],
      correctAnswer: "B",
      hint: "Both operands are integers.",
      explanation: "Integer division discards the decimal part, so 5 / 2 gives 2."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 31,
      questionText: "What is the purpose of casting in C?",
      options: [
        { label: "A", text: "To change variable name", misconceptionTag: "name_confusion" },
        { label: "B", text: "To explicitly convert one type to another", misconceptionTag: "" },
        { label: "C", text: "To declare a function", misconceptionTag: "function_confusion" },
        { label: "D", text: "To create a loop", misconceptionTag: "loop_confusion" },
      ],
      correctAnswer: "B",
      hint: "Example: (float)x.",
      explanation: "Casting explicitly converts a value from one type to another, such as converting int to float."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "medium",
      orderNo: 32,
      questionText: "What value is stored in x after int x = (int)3.99;?",
      options: [
        { label: "A", text: "3", misconceptionTag: "" },
        { label: "B", text: "4", misconceptionTag: "rounding_confusion" },
        { label: "C", text: "3.99", misconceptionTag: "no_conversion" },
        { label: "D", text: "Error", misconceptionTag: "cast_error" },
      ],
      correctAnswer: "A",
      hint: "Casting to int removes the decimal part.",
      explanation: "The cast to int truncates the decimal part, so x stores 3."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 33,
      questionText: "Which expression gives floating-point division for integers a and b?",
      options: [
        { label: "A", text: "a / b", misconceptionTag: "integer_division" },
        { label: "B", text: "(float)a / b", misconceptionTag: "" },
        { label: "C", text: "int(a) / b", misconceptionTag: "wrong_cast_syntax" },
        { label: "D", text: "a // b", misconceptionTag: "python_confusion" },
      ],
      correctAnswer: "B",
      hint: "Convert at least one operand to float before division.",
      explanation: "(float)a / b makes one operand floating-point, so the division result is floating-point."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 34,
      questionText: "What is the output?\nint x = 5;\nprintf(\"%d\", sizeof(x++));",
      options: [
        { label: "A", text: "5", misconceptionTag: "value_confusion" },
        { label: "B", text: "6", misconceptionTag: "increment_confusion" },
        { label: "C", text: "Size of int", misconceptionTag: "" },
        { label: "D", text: "Undefined behavior", misconceptionTag: "undefined_confusion" },
      ],
      correctAnswer: "C",
      hint: "sizeof does not evaluate x++ for ordinary expressions.",
      explanation: "sizeof(x++) gives the size of the type of x. The increment is not performed in this case."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 35,
      questionText: "Which declaration creates an unsigned integer variable?",
      options: [
        { label: "A", text: "unsigned int x;", misconceptionTag: "" },
        { label: "B", text: "positive int x;", misconceptionTag: "non_c_keyword" },
        { label: "C", text: "int unsigned x = -1;", misconceptionTag: "syntax_confusion" },
        { label: "D", text: "nonnegative int x;", misconceptionTag: "non_c_keyword" },
      ],
      correctAnswer: "A",
      hint: "C has the unsigned modifier.",
      explanation: "unsigned int declares an integer type that stores only non-negative values."
    },
    {
      concept: "Variables and Data Types",
      difficulty: "hard",
      orderNo: 36,
      questionText: "What happens when an unsigned int is assigned -1?",
      options: [
        { label: "A", text: "It stores -1", misconceptionTag: "signed_confusion" },
        { label: "B", text: "It becomes a large positive value", misconceptionTag: "" },
        { label: "C", text: "Compilation always fails", misconceptionTag: "compile_error_confusion" },
        { label: "D", text: "It stores 0", misconceptionTag: "zero_confusion" },
      ],
      correctAnswer: "B",
      hint: "Unsigned values wrap modulo their range.",
      explanation: "Assigning -1 to an unsigned integer converts it modulo the unsigned range, usually producing the maximum unsigned value."
    }
  ];

  const additionalModule3Questions = [
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 25,
      questionText: "Which part of a for loop usually changes the loop variable?",
      options: [
        { label: "A", text: "Initialization", misconceptionTag: "initialization_confusion" },
        { label: "B", text: "Condition", misconceptionTag: "condition_confusion" },
        { label: "C", text: "Update expression", misconceptionTag: "" },
        { label: "D", text: "Header file", misconceptionTag: "header_confusion" },
      ],
      correctAnswer: "C",
      hint: "Usually i++ or i--.",
      explanation: "The update expression changes the loop variable after each iteration."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 26,
      questionText: "How many times does this run?\nfor(int i = 1; i <= 3; i++) printf(\"Hi\");",
      options: [
        { label: "A", text: "2", misconceptionTag: "off_by_one" },
        { label: "B", text: "3", misconceptionTag: "" },
        { label: "C", text: "4", misconceptionTag: "off_by_one" },
        { label: "D", text: "Infinite", misconceptionTag: "infinite_loop" },
      ],
      correctAnswer: "B",
      hint: "Values of i are 1, 2, and 3.",
      explanation: "The loop runs for i = 1, 2, and 3, so it executes 3 times."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 27,
      questionText: "Which loop is entry-controlled?",
      options: [
        { label: "A", text: "while", misconceptionTag: "" },
        { label: "B", text: "do-while", misconceptionTag: "exit_controlled_confusion" },
        { label: "C", text: "switch", misconceptionTag: "selection_confusion" },
        { label: "D", text: "goto only", misconceptionTag: "goto_confusion" },
      ],
      correctAnswer: "A",
      hint: "The condition is checked before entering.",
      explanation: "while is an entry-controlled loop because the condition is tested before the body executes."
    },
    {
      concept: "Loops",
      difficulty: "easy",
      orderNo: 28,
      questionText: "Which statement skips to the next loop iteration?",
      options: [
        { label: "A", text: "break", misconceptionTag: "break_confusion" },
        { label: "B", text: "continue", misconceptionTag: "" },
        { label: "C", text: "return", misconceptionTag: "function_confusion" },
        { label: "D", text: "stop", misconceptionTag: "non_c_keyword" },
      ],
      correctAnswer: "B",
      hint: "It continues with the next iteration.",
      explanation: "continue skips the rest of the current iteration and moves to the next iteration."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 29,
      questionText: "What is the output?\nfor(int i=1; i<=3; i++) printf(\"%d\", i);",
      options: [
        { label: "A", text: "012", misconceptionTag: "start_value_confusion" },
        { label: "B", text: "123", misconceptionTag: "" },
        { label: "C", text: "1234", misconceptionTag: "condition_confusion" },
        { label: "D", text: "111", misconceptionTag: "increment_confusion" },
      ],
      correctAnswer: "B",
      hint: "Trace i from 1 to 3.",
      explanation: "The loop prints i for values 1, 2, and 3, producing 123."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 30,
      questionText: "What is the output?\nfor(int i=0; i<5; i+=2) printf(\"%d\", i);",
      options: [
        { label: "A", text: "024", misconceptionTag: "" },
        { label: "B", text: "01234", misconceptionTag: "increment_by_one_confusion" },
        { label: "C", text: "246", misconceptionTag: "start_value_confusion" },
        { label: "D", text: "02", misconceptionTag: "condition_confusion" },
      ],
      correctAnswer: "A",
      hint: "i increases by 2.",
      explanation: "i takes values 0, 2, and 4 before the condition i < 5 becomes false."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 31,
      questionText: "What does continue do in this loop?\nfor(int i=1;i<=3;i++){ if(i==2) continue; printf(\"%d\", i); }",
      options: [
        { label: "A", text: "123", misconceptionTag: "continue_ignored" },
        { label: "B", text: "13", misconceptionTag: "" },
        { label: "C", text: "2", misconceptionTag: "condition_confusion" },
        { label: "D", text: "12", misconceptionTag: "break_confusion" },
      ],
      correctAnswer: "B",
      hint: "When i is 2, printf is skipped.",
      explanation: "continue skips the printf when i == 2, so only 1 and 3 are printed."
    },
    {
      concept: "Loops",
      difficulty: "medium",
      orderNo: 32,
      questionText: "What is the output count?\nfor(int i=0;i<2;i++){ for(int j=0;j<4;j++) printf(\"*\"); }",
      options: [
        { label: "A", text: "6", misconceptionTag: "wrong_multiplication" },
        { label: "B", text: "8", misconceptionTag: "" },
        { label: "C", text: "4", misconceptionTag: "inner_only" },
        { label: "D", text: "2", misconceptionTag: "outer_only" },
      ],
      correctAnswer: "B",
      hint: "Outer iterations × inner iterations.",
      explanation: "The outer loop runs 2 times and the inner loop runs 4 times each, so 8 stars are printed."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 33,
      questionText: "What is the output?\nint i = 5;\nwhile(i > 0) printf(\"%d\", i--);",
      options: [
        { label: "A", text: "54321", misconceptionTag: "" },
        { label: "B", text: "43210", misconceptionTag: "post_decrement_confusion" },
        { label: "C", text: "543210", misconceptionTag: "condition_confusion" },
        { label: "D", text: "Infinite loop", misconceptionTag: "decrement_ignored" },
      ],
      correctAnswer: "A",
      hint: "i is printed before being decremented.",
      explanation: "The loop prints 5,4,3,2,1 and stops when i becomes 0."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 34,
      questionText: "What is the output?\nfor(int i=1;i<=3;i++){ if(i==2) break; printf(\"%d\", i); }",
      options: [
        { label: "A", text: "123", misconceptionTag: "break_ignored" },
        { label: "B", text: "13", misconceptionTag: "continue_confusion" },
        { label: "C", text: "1", misconceptionTag: "" },
        { label: "D", text: "2", misconceptionTag: "condition_confusion" },
      ],
      correctAnswer: "C",
      hint: "break stops the loop before printing 2.",
      explanation: "When i becomes 2, break exits the loop, so only 1 was printed."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 35,
      questionText: "What is the output?\nint i = 0;\ndo { printf(\"%d\", i); i++; } while(i < 0);",
      options: [
        { label: "A", text: "No output", misconceptionTag: "while_confusion" },
        { label: "B", text: "0", misconceptionTag: "" },
        { label: "C", text: "01", misconceptionTag: "condition_confusion" },
        { label: "D", text: "Infinite loop", misconceptionTag: "infinite_confusion" },
      ],
      correctAnswer: "B",
      hint: "do-while executes once before checking the condition.",
      explanation: "The body runs once and prints 0, then the condition i < 0 is false."
    },
    {
      concept: "Loops",
      difficulty: "hard",
      orderNo: 36,
      questionText: "What is the output?\nfor(int i=0;i<3;i++)\n  for(int j=0;j<i;j++)\n    printf(\"*\");",
      options: [
        { label: "A", text: "1 star", misconceptionTag: "outer_only" },
        { label: "B", text: "2 stars", misconceptionTag: "wrong_count" },
        { label: "C", text: "3 stars", misconceptionTag: "" },
        { label: "D", text: "6 stars", misconceptionTag: "full_nested_multiply" },
      ],
      correctAnswer: "C",
      hint: "Inner loop runs 0, then 1, then 2 times.",
      explanation: "For i=0 it prints 0 stars, for i=1 it prints 1, and for i=2 it prints 2. Total = 3 stars."
    }
  ];

  const additionalModule4Questions = [
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 25,
      questionText: "What is a parameter in a function?",
      options: [
        { label: "A", text: "A value received by a function", misconceptionTag: "" },
        { label: "B", text: "A loop counter only", misconceptionTag: "loop_confusion" },
        { label: "C", text: "A header file", misconceptionTag: "header_confusion" },
        { label: "D", text: "A compiler error", misconceptionTag: "error_confusion" },
      ],
      correctAnswer: "A",
      hint: "It appears inside the function parentheses.",
      explanation: "A parameter is a variable in a function header that receives a value when the function is called."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 26,
      questionText: "Which symbol pair is used after a function name?",
      options: [
        { label: "A", text: "[]", misconceptionTag: "array_confusion" },
        { label: "B", text: "{}", misconceptionTag: "block_confusion" },
        { label: "C", text: "()", misconceptionTag: "" },
        { label: "D", text: "<> ", misconceptionTag: "header_confusion" },
      ],
      correctAnswer: "C",
      hint: "Function calls use parentheses.",
      explanation: "Function names are followed by parentheses, such as sum()."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 27,
      questionText: "Which of these is a valid function call?",
      options: [
        { label: "A", text: "add;", misconceptionTag: "missing_parentheses" },
        { label: "B", text: "call add();", misconceptionTag: "non_c_keyword" },
        { label: "C", text: "add();", misconceptionTag: "" },
        { label: "D", text: "function add;", misconceptionTag: "non_c_syntax" },
      ],
      correctAnswer: "C",
      hint: "Use the function name followed by parentheses.",
      explanation: "add(); is a valid function call in C."
    },
    {
      concept: "Functions",
      difficulty: "easy",
      orderNo: 28,
      questionText: "Which return type should be used for a function that returns an integer?",
      options: [
        { label: "A", text: "float", misconceptionTag: "float_confusion" },
        { label: "B", text: "char", misconceptionTag: "char_confusion" },
        { label: "C", text: "int", misconceptionTag: "" },
        { label: "D", text: "void", misconceptionTag: "void_confusion" },
      ],
      correctAnswer: "C",
      hint: "Integer return type.",
      explanation: "A function that returns an integer should have return type int."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 29,
      questionText: "What is the output?\nint add(int a, int b){ return a+b; }\nprintf(\"%d\", add(2,3));",
      options: [
        { label: "A", text: "2", misconceptionTag: "first_arg_only" },
        { label: "B", text: "3", misconceptionTag: "second_arg_only" },
        { label: "C", text: "5", misconceptionTag: "" },
        { label: "D", text: "Error", misconceptionTag: "function_call_confusion" },
      ],
      correctAnswer: "C",
      hint: "The function returns a+b.",
      explanation: "add(2,3) returns 5, so printf prints 5."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 30,
      questionText: "What is the output?\nvoid show(){ printf(\"Hi\"); }\nshow();",
      options: [
        { label: "A", text: "No output", misconceptionTag: "void_confusion" },
        { label: "B", text: "Hi", misconceptionTag: "" },
        { label: "C", text: "show", misconceptionTag: "function_name_confusion" },
        { label: "D", text: "Error because void cannot print", misconceptionTag: "void_error_confusion" },
      ],
      correctAnswer: "B",
      hint: "void means no return value, not no output.",
      explanation: "The function show() prints Hi. A void function can still perform output."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 31,
      questionText: "Which is true about return in a void function?",
      options: [
        { label: "A", text: "return; can be used without a value", misconceptionTag: "" },
        { label: "B", text: "return 5; is always correct", misconceptionTag: "return_value_confusion" },
        { label: "C", text: "return is not allowed at all", misconceptionTag: "return_not_allowed" },
        { label: "D", text: "return must always return int", misconceptionTag: "int_confusion" },
      ],
      correctAnswer: "A",
      hint: "A void function does not return a value.",
      explanation: "A void function can use return; to exit early, but it should not return a value."
    },
    {
      concept: "Functions",
      difficulty: "medium",
      orderNo: 32,
      questionText: "What is the role of a function prototype?",
      options: [
        { label: "A", text: "It tells the compiler the function name, return type, and parameters", misconceptionTag: "" },
        { label: "B", text: "It executes the function", misconceptionTag: "execution_confusion" },
        { label: "C", text: "It stores local variables", misconceptionTag: "variable_confusion" },
        { label: "D", text: "It replaces a loop", misconceptionTag: "loop_confusion" },
      ],
      correctAnswer: "A",
      hint: "Declaration before definition.",
      explanation: "A function prototype informs the compiler about the function before it is called."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 33,
      questionText: "What is the output?\nint f(int x){ return x * 2; }\nprintf(\"%d\", f(f(2)));",
      options: [
        { label: "A", text: "2", misconceptionTag: "inner_call_ignored" },
        { label: "B", text: "4", misconceptionTag: "one_call_only" },
        { label: "C", text: "8", misconceptionTag: "" },
        { label: "D", text: "Error", misconceptionTag: "nested_call_confusion" },
      ],
      correctAnswer: "C",
      hint: "Evaluate the inner function call first.",
      explanation: "f(2) gives 4, then f(4) gives 8."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 34,
      questionText: "What is the output?\nint x = 5;\nvoid change(int x){ x = 10; }\nchange(x);\nprintf(\"%d\", x);",
      options: [
        { label: "A", text: "10", misconceptionTag: "pass_by_reference_confusion" },
        { label: "B", text: "5", misconceptionTag: "" },
        { label: "C", text: "0", misconceptionTag: "default_value_confusion" },
        { label: "D", text: "Error", misconceptionTag: "function_error_confusion" },
      ],
      correctAnswer: "B",
      hint: "C passes arguments by value.",
      explanation: "change() receives a copy of x. Changing the copy does not affect the original variable in main."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 35,
      questionText: "What is the output?\nvoid change(int *p){ *p = 10; }\nint x = 5;\nchange(&x);\nprintf(\"%d\", x);",
      options: [
        { label: "A", text: "5", misconceptionTag: "pointer_ignored" },
        { label: "B", text: "10", misconceptionTag: "" },
        { label: "C", text: "Address of x", misconceptionTag: "address_confusion" },
        { label: "D", text: "Error", misconceptionTag: "pointer_syntax_confusion" },
      ],
      correctAnswer: "B",
      hint: "The function receives the address of x.",
      explanation: "Using a pointer allows the function to modify the original variable, so x becomes 10."
    },
    {
      concept: "Functions",
      difficulty: "hard",
      orderNo: 36,
      questionText: "What is the base case in recursion?",
      options: [
        { label: "A", text: "The condition that stops recursive calls", misconceptionTag: "" },
        { label: "B", text: "The first function parameter", misconceptionTag: "parameter_confusion" },
        { label: "C", text: "The return type", misconceptionTag: "return_type_confusion" },
        { label: "D", text: "The main function", misconceptionTag: "main_confusion" },
      ],
      correctAnswer: "A",
      hint: "Without it, recursion does not stop.",
      explanation: "The base case is the stopping condition that prevents infinite recursion."
    }
  ];

  module1Questions.push(...additionalModule1Questions);
  module2Questions.push(...additionalModule2Questions);
  module3Questions.push(...additionalModule3Questions);
  module4Questions.push(...additionalModule4Questions);

  module1.totalQuestions = module1Questions.length;
  module2.totalQuestions = module2Questions.length;
  module3.totalQuestions = module3Questions.length;
  module4.totalQuestions = module4Questions.length;

  await module1.save();
  await module2.save();
  await module3.save();
  await module4.save();


  const allQuestions = [
    ...addModuleToQuestions(module1Questions, module1._id),
    ...addModuleToQuestions(module2Questions, module2._id),
    ...addModuleToQuestions(module3Questions, module3._id),
    ...addModuleToQuestions(module4Questions, module4._id),
  ];

  await Question.insertMany(allQuestions);

  console.log(`Seed completed: 4 modules and ${allQuestions.length} questions inserted`);

  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};

seedLearningModules().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.connection.close();
  process.exit(1);
});
