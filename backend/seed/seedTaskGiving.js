// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// const LearningModule = require("../models/LearningModule");
// const Question = require("../models/Question");

// dotenv.config();

// const run = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected");

//     await LearningModule.deleteMany({});
//     await Question.deleteMany({});

//     const module = await LearningModule.create({
//       name: "Input / Output",
//       code: "INPUT_OUTPUT",
//       description: "Basic printf and scanf MCQ practice.",
//       orderNo: 1,
//       totalQuestions: 10,
//       isActive: true,
//     });

//     const questions = [
//       {
//         concept: "Input / Output",
//         difficulty: "easy",
//         orderNo: 1,
//         questionText:
//           "What header file must be included to use printf() and scanf()?",
//         options: [
//           {
//             label: "A",
//             text: "<stdlib.h>",
//             misconceptionTag: "wrong_header",
//           },
//           {
//             label: "B",
//             text: "<stdio.h>",
//             misconceptionTag: "",
//           },
//           {
//             label: "C",
//             text: "<conio.h>",
//             misconceptionTag: "old_compiler_header",
//           },
//           {
//             label: "D",
//             text: "<math.h>",
//             misconceptionTag: "math_header_confusion",
//           },
//         ],
//         correctAnswer: "B",
//         hint: "printf and scanf are standard input/output functions.",
//         detailedHint: "The standard input/output library is stdio.h.",
//         explanation:
//           "printf() and scanf() are declared inside the stdio.h header file.",
//       },
//       {
//         concept: "Input / Output",
//         difficulty: "easy",
//         orderNo: 2,
//         questionText: 'What does the "\\n" escape sequence represent?',
//         options: [
//           {
//             label: "A",
//             text: "New Tab",
//             misconceptionTag: "escape_sequence_confusion",
//           },
//           {
//             label: "B",
//             text: "New Line",
//             misconceptionTag: "",
//           },
//           {
//             label: "C",
//             text: "Null Character",
//             misconceptionTag: "null_character_confusion",
//           },
//           {
//             label: "D",
//             text: "Backspace",
//             misconceptionTag: "escape_sequence_confusion",
//           },
//         ],
//         correctAnswer: "B",
//         hint: "It moves the output to the next line.",
//         detailedHint: "\\n is used to print a line break.",
//         explanation: "\\n represents a newline character in C.",
//       },
//       {
//         concept: "Input / Output",
//         difficulty: "easy",
//         orderNo: 3,
//         questionText: 'What does the "&" symbol mean when used with scanf()?',
//         options: [
//           {
//             label: "A",
//             text: "Value of operator",
//             misconceptionTag: "operator_confusion",
//           },
//           {
//             label: "B",
//             text: "Address-of operator",
//             misconceptionTag: "",
//           },
//           {
//             label: "C",
//             text: "Logical AND",
//             misconceptionTag: "logical_and_confusion",
//           },
//           {
//             label: "D",
//             text: "Pointer dereference",
//             misconceptionTag: "pointer_confusion",
//           },
//         ],
//         correctAnswer: "B",
//         hint: "scanf needs the memory address of the variable.",
//         detailedHint: "The & operator gives the address of a variable.",
//         explanation:
//           "In scanf(), & is used to pass the address where the input value should be stored.",
//       },
//     ];

//     for (const question of questions) {
//       await Question.create({
//         module: module._id,
//         ...question,
//         isActive: true,
//       });
//     }

//     console.log("Task giving seed completed");
//     await mongoose.disconnect();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// run();

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await LearningModule.deleteMany({});
    await Question.deleteMany({});

    // ─────────────────────────────────────────────
    // MODULE 1 – Input / Output
    // ─────────────────────────────────────────────
    const module1 = await LearningModule.create({
      name: "Input / Output",
      code: "INPUT_OUTPUT",
      description: "Basic printf and scanf MCQ practice.",
      orderNo: 1,
      totalQuestions: 10,
      isActive: true,
    });

    const module1Questions = [
      {
        concept: "Input / Output",
        difficulty: "easy",
        orderNo: 1,
        questionText:
          "What header file must be included to use printf() and scanf()?",
        options: [
          { label: "A", text: "<stdlib.h>", misconceptionTag: "wrong_header" },
          { label: "B", text: "<stdio.h>", misconceptionTag: "" },
          {
            label: "C",
            text: "<conio.h>",
            misconceptionTag: "old_compiler_header",
          },
          {
            label: "D",
            text: "<math.h>",
            misconceptionTag: "math_header_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "printf and scanf are standard input/output functions.",
        detailedHint: "The standard input/output library is stdio.h.",
        explanation:
          "printf() and scanf() are declared inside the stdio.h header file.",
      },
      {
        concept: "Input / Output",
        difficulty: "easy",
        orderNo: 2,
        questionText: 'What does the "\\n" escape sequence represent?',
        options: [
          {
            label: "A",
            text: "New Tab",
            misconceptionTag: "escape_sequence_confusion",
          },
          { label: "B", text: "New Line", misconceptionTag: "" },
          {
            label: "C",
            text: "Null Character",
            misconceptionTag: "null_character_confusion",
          },
          {
            label: "D",
            text: "Backspace",
            misconceptionTag: "escape_sequence_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It moves the output to the next line.",
        detailedHint: "\\n is used to print a line break.",
        explanation: "\\n represents a newline character in C.",
      },
      {
        concept: "Input / Output",
        difficulty: "easy",
        orderNo: 3,
        questionText: 'What does the "&" symbol mean when used with scanf()?',
        options: [
          {
            label: "A",
            text: "Value of operator",
            misconceptionTag: "operator_confusion",
          },
          { label: "B", text: "Address-of operator", misconceptionTag: "" },
          {
            label: "C",
            text: "Logical AND",
            misconceptionTag: "logical_and_confusion",
          },
          {
            label: "D",
            text: "Pointer dereference",
            misconceptionTag: "pointer_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "scanf needs the memory address of the variable.",
        detailedHint: "The & operator gives the address of a variable.",
        explanation:
          "In scanf(), & is used to pass the address where the input value should be stored.",
      },
      {
        concept: "Input / Output",
        difficulty: "easy",
        orderNo: 4,
        questionText:
          "Which format specifier is used to print an integer in printf()?",
        options: [
          {
            label: "A",
            text: "%f",
            misconceptionTag: "float_specifier_confusion",
          },
          {
            label: "B",
            text: "%c",
            misconceptionTag: "char_specifier_confusion",
          },
          { label: "C", text: "%d", misconceptionTag: "" },
          {
            label: "D",
            text: "%s",
            misconceptionTag: "string_specifier_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Think decimal integer.",
        detailedHint: "%d stands for decimal integer.",
        explanation:
          "%d is the format specifier for printing integers in printf().",
      },
      {
        concept: "Input / Output",
        difficulty: "easy",
        orderNo: 5,
        questionText:
          "Which function is used to print output to the console in C?",
        options: [
          { label: "A", text: "print()", misconceptionTag: "python_confusion" },
          { label: "B", text: "cout", misconceptionTag: "cpp_confusion" },
          { label: "C", text: "echo()", misconceptionTag: "php_confusion" },
          { label: "D", text: "printf()", misconceptionTag: "" },
        ],
        correctAnswer: "D",
        hint: "It is a standard C library function.",
        detailedHint: "printf() is defined in <stdio.h>.",
        explanation:
          "printf() is the standard function used to display output in C.",
      },
      {
        concept: "Input / Output",
        difficulty: "medium",
        orderNo: 6,
        questionText: "What does %f format specifier represent in printf()?",
        options: [
          {
            label: "A",
            text: "Integer",
            misconceptionTag: "int_specifier_confusion",
          },
          { label: "B", text: "Floating-point number", misconceptionTag: "" },
          {
            label: "C",
            text: "Character",
            misconceptionTag: "char_specifier_confusion",
          },
          {
            label: "D",
            text: "String",
            misconceptionTag: "string_specifier_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "f stands for float.",
        detailedHint: "%f is used for float and double values.",
        explanation:
          "%f is the format specifier for printing floating-point numbers.",
      },
      {
        concept: "Input / Output",
        difficulty: "medium",
        orderNo: 7,
        questionText: "Which scanf() format specifier reads a string?",
        options: [
          {
            label: "A",
            text: "%d",
            misconceptionTag: "int_specifier_confusion",
          },
          {
            label: "B",
            text: "%c",
            misconceptionTag: "char_specifier_confusion",
          },
          { label: "C", text: "%s", misconceptionTag: "" },
          {
            label: "D",
            text: "%f",
            misconceptionTag: "float_specifier_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Think string.",
        detailedHint: "%s reads a sequence of characters until whitespace.",
        explanation: "%s is used to read a string in scanf().",
      },
      {
        concept: "Input / Output",
        difficulty: "medium",
        orderNo: 8,
        questionText: 'What is the output of printf("%d", 5 + 3)?',
        options: [
          {
            label: "A",
            text: "5 + 3",
            misconceptionTag: "literal_string_confusion",
          },
          {
            label: "B",
            text: "53",
            misconceptionTag: "concatenation_confusion",
          },
          { label: "C", text: "8", misconceptionTag: "" },
          {
            label: "D",
            text: "Error",
            misconceptionTag: "compile_error_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "The expression is evaluated before printing.",
        detailedHint: "C evaluates 5+3 first, resulting in 8.",
        explanation: "printf() evaluates expressions before printing; 5+3 = 8.",
      },
      {
        concept: "Input / Output",
        difficulty: "hard",
        orderNo: 9,
        questionText: 'What happens if you omit & in scanf("%d", num)?',
        options: [
          {
            label: "A",
            text: "It reads normally",
            misconceptionTag: "no_error_confusion",
          },
          {
            label: "B",
            text: "Compiler error",
            misconceptionTag: "compile_error_confusion",
          },
          {
            label: "C",
            text: "Undefined behavior / crash",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Prints 0",
            misconceptionTag: "zero_output_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "scanf needs the address, not the value.",
        detailedHint: "Without &, scanf receives garbage as an address.",
        explanation:
          "Omitting & passes the variable's value as an address, causing undefined behavior.",
      },
      {
        concept: "Input / Output",
        difficulty: "hard",
        orderNo: 10,
        questionText: "Which escape sequence represents a tab character?",
        options: [
          { label: "A", text: "\\n", misconceptionTag: "newline_confusion" },
          {
            label: "B",
            text: "\\r",
            misconceptionTag: "carriage_return_confusion",
          },
          { label: "C", text: "\\t", misconceptionTag: "" },
          { label: "D", text: "\\b", misconceptionTag: "backspace_confusion" },
        ],
        correctAnswer: "C",
        hint: "Think horizontal spacing.",
        detailedHint: "\\t moves the cursor to the next tab stop.",
        explanation:
          "\\t is the escape sequence for a horizontal tab character.",
      },
    ];

    for (const q of module1Questions) {
      await Question.create({ module: module1._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 2 – Variables & Data Types
    // ─────────────────────────────────────────────
    const module2 = await LearningModule.create({
      name: "Variables & Data Types",
      code: "VARIABLES_DATA_TYPES",
      description:
        "Understanding C data types, sizes, and variable declarations.",
      orderNo: 2,
      totalQuestions: 10,
      isActive: true,
    });

    const module2Questions = [
      {
        concept: "Variables & Data Types",
        difficulty: "easy",
        orderNo: 1,
        questionText:
          "Which keyword is used to declare an integer variable in C?",
        options: [
          { label: "A", text: "float", misconceptionTag: "float_confusion" },
          { label: "B", text: "int", misconceptionTag: "" },
          { label: "C", text: "char", misconceptionTag: "char_confusion" },
          { label: "D", text: "double", misconceptionTag: "double_confusion" },
        ],
        correctAnswer: "B",
        hint: "Short for integer.",
        detailedHint: "int is the basic integer data type in C.",
        explanation: "int declares a variable that holds whole number values.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "easy",
        orderNo: 2,
        questionText: "What is the typical size of an int in a 32-bit system?",
        options: [
          {
            label: "A",
            text: "1 byte",
            misconceptionTag: "char_size_confusion",
          },
          {
            label: "B",
            text: "2 bytes",
            misconceptionTag: "short_size_confusion",
          },
          { label: "C", text: "4 bytes", misconceptionTag: "" },
          {
            label: "D",
            text: "8 bytes",
            misconceptionTag: "long_size_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It holds 32 bits.",
        detailedHint: "4 bytes = 32 bits on most systems.",
        explanation:
          "An int is typically 4 bytes (32 bits) on a 32-bit system.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "easy",
        orderNo: 3,
        questionText: "Which data type stores a single character in C?",
        options: [
          {
            label: "A",
            text: "string",
            misconceptionTag: "string_type_confusion",
          },
          { label: "B", text: "char", misconceptionTag: "" },
          { label: "C", text: "int", misconceptionTag: "int_confusion" },
          { label: "D", text: "byte", misconceptionTag: "byte_type_confusion" },
        ],
        correctAnswer: "B",
        hint: "It's 1 byte in size.",
        detailedHint: "char stores one character using its ASCII value.",
        explanation:
          "char is used to store a single character and occupies 1 byte.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "easy",
        orderNo: 4,
        questionText: "Which of the following is a valid variable name in C?",
        options: [
          { label: "A", text: "2name", misconceptionTag: "starts_with_digit" },
          { label: "B", text: "my-var", misconceptionTag: "hyphen_in_name" },
          { label: "C", text: "_myVar", misconceptionTag: "" },
          { label: "D", text: "int", misconceptionTag: "reserved_keyword" },
        ],
        correctAnswer: "C",
        hint: "Variable names can start with underscore or letter.",
        detailedHint: "C identifiers start with a letter or underscore.",
        explanation:
          "_myVar is valid; names can't start with digits or use reserved keywords.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "easy",
        orderNo: 5,
        questionText: "What does the float data type store?",
        options: [
          {
            label: "A",
            text: "Whole numbers",
            misconceptionTag: "int_confusion",
          },
          {
            label: "B",
            text: "Characters",
            misconceptionTag: "char_confusion",
          },
          {
            label: "C",
            text: "Decimal (floating-point) numbers",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Boolean values",
            misconceptionTag: "bool_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It's used for fractional values.",
        detailedHint: "float stores numbers with a decimal point.",
        explanation: "float is used to store floating-point (decimal) numbers.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "medium",
        orderNo: 6,
        questionText: "What is the difference between float and double in C?",
        options: [
          {
            label: "A",
            text: "No difference",
            misconceptionTag: "no_difference_confusion",
          },
          {
            label: "B",
            text: "double has more precision than float",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "float has more precision than double",
            misconceptionTag: "precision_reversal",
          },
          {
            label: "D",
            text: "double is for integers",
            misconceptionTag: "type_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "double means double precision.",
        detailedHint: "double is 8 bytes; float is 4 bytes.",
        explanation:
          "double provides more precision (64-bit) than float (32-bit).",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "medium",
        orderNo: 7,
        questionText: "What is the range of a char data type in C (signed)?",
        options: [
          {
            label: "A",
            text: "0 to 255",
            misconceptionTag: "unsigned_range_confusion",
          },
          { label: "B", text: "-128 to 127", misconceptionTag: "" },
          { label: "C", text: "-256 to 255", misconceptionTag: "wrong_range" },
          {
            label: "D",
            text: "0 to 127",
            misconceptionTag: "ascii_range_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It is 1 byte (8 bits) signed.",
        detailedHint: "Signed 8-bit range is -2^7 to 2^7 - 1.",
        explanation: "A signed char ranges from -128 to 127.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "medium",
        orderNo: 8,
        questionText:
          "What operator is used to find the size of a data type in bytes?",
        options: [
          {
            label: "A",
            text: "length()",
            misconceptionTag: "length_function_confusion",
          },
          {
            label: "B",
            text: "size()",
            misconceptionTag: "size_function_confusion",
          },
          { label: "C", text: "sizeof()", misconceptionTag: "" },
          {
            label: "D",
            text: "typeof()",
            misconceptionTag: "typeof_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It's a built-in operator, not a function.",
        detailedHint: "sizeof() returns the number of bytes a type occupies.",
        explanation:
          "sizeof() is a compile-time operator that returns the size in bytes.",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "hard",
        orderNo: 9,
        questionText:
          "What is the result of sizeof(int) on most 64-bit systems?",
        options: [
          { label: "A", text: "2", misconceptionTag: "16bit_size_confusion" },
          { label: "B", text: "8", misconceptionTag: "long_size_confusion" },
          { label: "C", text: "4", misconceptionTag: "" },
          {
            label: "D",
            text: "Depends on compiler",
            misconceptionTag: "partial_correct",
          },
        ],
        correctAnswer: "C",
        hint: "int is usually 32-bit even on 64-bit systems.",
        detailedHint:
          "int remains 4 bytes on most 64-bit compilers (LP64 model).",
        explanation: "On most 64-bit systems, int is still 4 bytes (32 bits).",
      },
      {
        concept: "Variables & Data Types",
        difficulty: "hard",
        orderNo: 10,
        questionText:
          "Which modifier makes a variable unable to be changed after initialization?",
        options: [
          { label: "A", text: "static", misconceptionTag: "static_confusion" },
          { label: "B", text: "extern", misconceptionTag: "extern_confusion" },
          { label: "C", text: "const", misconceptionTag: "" },
          {
            label: "D",
            text: "volatile",
            misconceptionTag: "volatile_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Think 'constant'.",
        detailedHint:
          "const prevents a variable from being modified after declaration.",
        explanation:
          "const declares a read-only variable; its value cannot be changed.",
      },
    ];

    for (const q of module2Questions) {
      await Question.create({ module: module2._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 3 – Operators
    // ─────────────────────────────────────────────
    const module3 = await LearningModule.create({
      name: "Operators",
      code: "OPERATORS",
      description:
        "Arithmetic, relational, logical, and bitwise operators in C.",
      orderNo: 3,
      totalQuestions: 10,
      isActive: true,
    });

    const module3Questions = [
      {
        concept: "Operators",
        difficulty: "easy",
        orderNo: 1,
        questionText: "What is the result of 10 % 3 in C?",
        options: [
          { label: "A", text: "3", misconceptionTag: "division_confusion" },
          { label: "B", text: "1", misconceptionTag: "" },
          { label: "C", text: "0", misconceptionTag: "zero_confusion" },
          {
            label: "D",
            text: "10",
            misconceptionTag: "no_operation_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "% is the modulus operator.",
        detailedHint: "10 divided by 3 is 3 remainder 1.",
        explanation:
          "The % operator returns the remainder of division. 10 % 3 = 1.",
      },
      {
        concept: "Operators",
        difficulty: "easy",
        orderNo: 2,
        questionText: "Which operator is used for equality comparison in C?",
        options: [
          { label: "A", text: "=", misconceptionTag: "assignment_confusion" },
          { label: "B", text: "!=", misconceptionTag: "not_equal_confusion" },
          { label: "C", text: "==", misconceptionTag: "" },
          {
            label: "D",
            text: "===",
            misconceptionTag: "strict_equality_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Not to be confused with assignment.",
        detailedHint: "== compares two values; = assigns a value.",
        explanation:
          "== is the equality operator; = is the assignment operator.",
      },
      {
        concept: "Operators",
        difficulty: "easy",
        orderNo: 3,
        questionText: "What does the ++ operator do?",
        options: [
          {
            label: "A",
            text: "Decrements by 1",
            misconceptionTag: "decrement_confusion",
          },
          {
            label: "B",
            text: "Multiplies by 2",
            misconceptionTag: "multiply_confusion",
          },
          { label: "C", text: "Increments by 1", misconceptionTag: "" },
          {
            label: "D",
            text: "Adds two variables",
            misconceptionTag: "addition_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It is an increment operator.",
        detailedHint: "x++ or ++x increases x by 1.",
        explanation: "The ++ operator increments a variable's value by 1.",
      },
      {
        concept: "Operators",
        difficulty: "easy",
        orderNo: 4,
        questionText: "Which is a logical AND operator in C?",
        options: [
          { label: "A", text: "&", misconceptionTag: "bitwise_and_confusion" },
          { label: "B", text: "&&", misconceptionTag: "" },
          { label: "C", text: "||", misconceptionTag: "logical_or_confusion" },
          {
            label: "D",
            text: "and",
            misconceptionTag: "python_operator_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It requires both conditions to be true.",
        detailedHint: "&& is the logical AND; & is bitwise AND.",
        explanation:
          "&& is the logical AND operator used in conditional expressions.",
      },
      {
        concept: "Operators",
        difficulty: "easy",
        orderNo: 5,
        questionText: "What is the value of the expression (5 > 3)?",
        options: [
          { label: "A", text: "5", misconceptionTag: "value_return_confusion" },
          { label: "B", text: "0", misconceptionTag: "zero_confusion" },
          { label: "C", text: "1", misconceptionTag: "" },
          {
            label: "D",
            text: "true",
            misconceptionTag: "bool_string_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "C represents true as 1.",
        detailedHint: "In C, true evaluates to 1 and false to 0.",
        explanation: "5 > 3 is true, and C represents true as integer 1.",
      },
      {
        concept: "Operators",
        difficulty: "medium",
        orderNo: 6,
        questionText: "What is the result of 5 & 3 (bitwise AND)?",
        options: [
          { label: "A", text: "7", misconceptionTag: "bitwise_or_confusion" },
          { label: "B", text: "1", misconceptionTag: "" },
          { label: "C", text: "0", misconceptionTag: "zero_confusion" },
          { label: "D", text: "8", misconceptionTag: "addition_confusion" },
        ],
        correctAnswer: "B",
        hint: "Compare each bit of 5 (101) and 3 (011).",
        detailedHint: "101 & 011 = 001 = 1.",
        explanation: "5 in binary is 101, 3 is 011. Bitwise AND gives 001 = 1.",
      },
      {
        concept: "Operators",
        difficulty: "medium",
        orderNo: 7,
        questionText: "What does the ternary operator ?: do?",
        options: [
          {
            label: "A",
            text: "Loops through values",
            misconceptionTag: "loop_confusion",
          },
          {
            label: "B",
            text: "Chooses between two values based on a condition",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Compares three values",
            misconceptionTag: "three_comparison_confusion",
          },
          {
            label: "D",
            text: "Returns null",
            misconceptionTag: "null_return_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It is a shorthand for if-else.",
        detailedHint: "Syntax: condition ? value_if_true : value_if_false.",
        explanation:
          "The ternary operator evaluates a condition and returns one of two values.",
      },
      {
        concept: "Operators",
        difficulty: "medium",
        orderNo: 8,
        questionText:
          "What is the precedence order (highest first) among +, *, and ==?",
        options: [
          {
            label: "A",
            text: "== > + > *",
            misconceptionTag: "equality_first_confusion",
          },
          {
            label: "B",
            text: "+ > * > ==",
            misconceptionTag: "addition_first_confusion",
          },
          { label: "C", text: "* > + > ==", misconceptionTag: "" },
          {
            label: "D",
            text: "All have equal precedence",
            misconceptionTag: "equal_precedence_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Multiplication comes before addition.",
        detailedHint:
          "Relational operators like == have lower precedence than arithmetic ones.",
        explanation: "* has higher precedence than +, which is higher than ==.",
      },
      {
        concept: "Operators",
        difficulty: "hard",
        orderNo: 9,
        questionText: "What is the result of x = 5, then y = x++? What is y?",
        options: [
          {
            label: "A",
            text: "6",
            misconceptionTag: "pre_increment_confusion",
          },
          { label: "B", text: "5", misconceptionTag: "" },
          { label: "C", text: "0", misconceptionTag: "zero_confusion" },
          {
            label: "D",
            text: "Undefined",
            misconceptionTag: "undefined_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Post-increment returns the original value.",
        detailedHint:
          "x++ returns x then increments. y gets 5, then x becomes 6.",
        explanation:
          "Post-increment (x++) assigns current value first, then increments x.",
      },
      {
        concept: "Operators",
        difficulty: "hard",
        orderNo: 10,
        questionText: "What does the left shift operator << do?",
        options: [
          {
            label: "A",
            text: "Divides by 2",
            misconceptionTag: "divide_confusion",
          },
          {
            label: "B",
            text: "Multiplies by a power of 2",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Moves decimal point left",
            misconceptionTag: "decimal_confusion",
          },
          {
            label: "D",
            text: "Converts to negative",
            misconceptionTag: "negative_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Shifting left by n multiplies by 2^n.",
        detailedHint: "x << 1 is equivalent to x * 2.",
        explanation:
          "The left shift operator shifts bits left, effectively multiplying by powers of 2.",
      },
    ];

    for (const q of module3Questions) {
      await Question.create({ module: module3._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 4 – Control Flow (if / else / switch)
    // ─────────────────────────────────────────────
    const module4 = await LearningModule.create({
      name: "Control Flow",
      code: "CONTROL_FLOW",
      description: "if, else, else-if, and switch statements in C.",
      orderNo: 4,
      totalQuestions: 10,
      isActive: true,
    });

    const module4Questions = [
      {
        concept: "Control Flow",
        difficulty: "easy",
        orderNo: 1,
        questionText: "What keyword starts a conditional statement in C?",
        options: [
          { label: "A", text: "when", misconceptionTag: "wrong_keyword" },
          { label: "B", text: "if", misconceptionTag: "" },
          { label: "C", text: "check", misconceptionTag: "wrong_keyword" },
          { label: "D", text: "condition", misconceptionTag: "wrong_keyword" },
        ],
        correctAnswer: "B",
        hint: "It's a very short English word.",
        detailedHint: "if is the fundamental conditional keyword in C.",
        explanation: "The if keyword begins a conditional statement in C.",
      },
      {
        concept: "Control Flow",
        difficulty: "easy",
        orderNo: 2,
        questionText: "What block executes when the if condition is false?",
        options: [
          { label: "A", text: "elif", misconceptionTag: "python_confusion" },
          { label: "B", text: "otherwise", misconceptionTag: "wrong_keyword" },
          { label: "C", text: "else", misconceptionTag: "" },
          { label: "D", text: "default", misconceptionTag: "switch_confusion" },
        ],
        correctAnswer: "C",
        hint: "Opposite of if.",
        detailedHint: "else executes when the if condition evaluates to false.",
        explanation: "The else block runs when the if condition is false.",
      },
      {
        concept: "Control Flow",
        difficulty: "easy",
        orderNo: 3,
        questionText: "In a switch statement, what keyword ends each case?",
        options: [
          { label: "A", text: "exit", misconceptionTag: "exit_confusion" },
          { label: "B", text: "stop", misconceptionTag: "wrong_keyword" },
          { label: "C", text: "end", misconceptionTag: "wrong_keyword" },
          { label: "D", text: "break", misconceptionTag: "" },
        ],
        correctAnswer: "D",
        hint: "It prevents fall-through.",
        detailedHint:
          "Without break, execution falls through to the next case.",
        explanation:
          "break exits the switch block after a matching case executes.",
      },
      {
        concept: "Control Flow",
        difficulty: "easy",
        orderNo: 4,
        questionText: "What does the default case in a switch statement do?",
        options: [
          {
            label: "A",
            text: "Runs always",
            misconceptionTag: "always_run_confusion",
          },
          {
            label: "B",
            text: "Runs when no case matches",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Runs first",
            misconceptionTag: "first_run_confusion",
          },
          {
            label: "D",
            text: "Stops the program",
            misconceptionTag: "stop_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It is the fallback option.",
        detailedHint: "default handles all unmatched values.",
        explanation:
          "The default case runs when none of the case values match the switch expression.",
      },
      {
        concept: "Control Flow",
        difficulty: "easy",
        orderNo: 5,
        questionText:
          "Which of the following is a correct if-else syntax in C?",
        options: [
          {
            label: "A",
            text: "if x > 5 { ... }",
            misconceptionTag: "missing_parentheses",
          },
          {
            label: "B",
            text: "if (x > 5) { ... } else { ... }",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "if [x > 5] { ... }",
            misconceptionTag: "bracket_confusion",
          },
          {
            label: "D",
            text: "if (x > 5) then { ... }",
            misconceptionTag: "then_keyword_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Condition must be inside parentheses.",
        detailedHint: "C requires parentheses around the condition in if.",
        explanation:
          "In C, if requires the condition in parentheses: if (condition) { ... }",
      },
      {
        concept: "Control Flow",
        difficulty: "medium",
        orderNo: 6,
        questionText: "What happens if break is missing from a switch case?",
        options: [
          {
            label: "A",
            text: "Compile error",
            misconceptionTag: "compile_error_confusion",
          },
          {
            label: "B",
            text: "Only that case runs",
            misconceptionTag: "case_only_confusion",
          },
          {
            label: "C",
            text: "Fall-through to the next case",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Program crashes",
            misconceptionTag: "crash_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Execution continues into the next case.",
        detailedHint: "Without break, C continues executing subsequent cases.",
        explanation:
          "Missing break causes fall-through, executing the next case block.",
      },
      {
        concept: "Control Flow",
        difficulty: "medium",
        orderNo: 7,
        questionText: "Can a switch statement use float as its expression?",
        options: [
          {
            label: "A",
            text: "Yes, always",
            misconceptionTag: "float_switch_confusion",
          },
          {
            label: "B",
            text: "Yes, with special syntax",
            misconceptionTag: "special_syntax_confusion",
          },
          { label: "C", text: "No, only integer types", misconceptionTag: "" },
          {
            label: "D",
            text: "Only in C99 and later",
            misconceptionTag: "version_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "switch works with discrete values only.",
        detailedHint: "switch accepts int, char, or enum — not float.",
        explanation:
          "C's switch statement only works with integer (or integer-compatible) types.",
      },
      {
        concept: "Control Flow",
        difficulty: "medium",
        orderNo: 8,
        questionText: "What is the output if x=10 and we check if (x = 5)?",
        options: [
          {
            label: "A",
            text: "Condition is false, nothing prints",
            misconceptionTag: "comparison_confusion",
          },
          {
            label: "B",
            text: "Condition is true, x becomes 5",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Compile error",
            misconceptionTag: "compile_error_confusion",
          },
          {
            label: "D",
            text: "x stays 10",
            misconceptionTag: "no_change_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Assignment inside if evaluates to the assigned value.",
        detailedHint:
          "x = 5 assigns 5 to x and evaluates to 5 (nonzero = true).",
        explanation:
          "if (x = 5) assigns 5 to x; since 5 is nonzero, the condition is true.",
      },
      {
        concept: "Control Flow",
        difficulty: "hard",
        orderNo: 9,
        questionText:
          "Which best describes short-circuit evaluation in if (A && B)?",
        options: [
          {
            label: "A",
            text: "B is always evaluated",
            misconceptionTag: "always_eval_confusion",
          },
          {
            label: "B",
            text: "If A is false, B is not evaluated",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A and B are evaluated in parallel",
            misconceptionTag: "parallel_eval_confusion",
          },
          {
            label: "D",
            text: "If A is true, B is not evaluated",
            misconceptionTag: "reversed_short_circuit",
          },
        ],
        correctAnswer: "B",
        hint: "If the first condition is already false, the whole AND is false.",
        detailedHint: "Short-circuit: A && B skips B when A is false.",
        explanation:
          "In &&, if A is false, B is skipped because the result is already determined.",
      },
      {
        concept: "Control Flow",
        difficulty: "hard",
        orderNo: 10,
        questionText:
          "What does a nested if-else ladder risk if not properly formatted?",
        options: [
          {
            label: "A",
            text: "Memory leak",
            misconceptionTag: "memory_confusion",
          },
          { label: "B", text: "Dangling else problem", misconceptionTag: "" },
          {
            label: "C",
            text: "Stack overflow",
            misconceptionTag: "stack_overflow_confusion",
          },
          {
            label: "D",
            text: "Type mismatch",
            misconceptionTag: "type_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Which if does the else belong to?",
        detailedHint: "An else always pairs with the nearest unpaired if.",
        explanation:
          "The dangling else problem occurs when an else is ambiguously paired with an if.",
      },
    ];

    for (const q of module4Questions) {
      await Question.create({ module: module4._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 5 – Loops
    // ─────────────────────────────────────────────
    const module5 = await LearningModule.create({
      name: "Loops",
      code: "LOOPS",
      description: "for, while, and do-while loop concepts in C.",
      orderNo: 5,
      totalQuestions: 10,
      isActive: true,
    });

    const module5Questions = [
      {
        concept: "Loops",
        difficulty: "easy",
        orderNo: 1,
        questionText: "Which loop is guaranteed to execute at least once?",
        options: [
          { label: "A", text: "for", misconceptionTag: "for_confusion" },
          { label: "B", text: "while", misconceptionTag: "while_confusion" },
          { label: "C", text: "do-while", misconceptionTag: "" },
          {
            label: "D",
            text: "foreach",
            misconceptionTag: "foreach_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "The condition is checked after the body executes.",
        detailedHint: "do-while checks its condition at the bottom.",
        explanation:
          "do-while executes the body first, then checks the condition, so it always runs at least once.",
      },
      {
        concept: "Loops",
        difficulty: "easy",
        orderNo: 2,
        questionText: "What keyword immediately exits a loop in C?",
        options: [
          { label: "A", text: "exit", misconceptionTag: "exit_confusion" },
          { label: "B", text: "stop", misconceptionTag: "wrong_keyword" },
          { label: "C", text: "return", misconceptionTag: "return_confusion" },
          { label: "D", text: "break", misconceptionTag: "" },
        ],
        correctAnswer: "D",
        hint: "Same keyword used in switch.",
        detailedHint: "break exits the nearest enclosing loop or switch.",
        explanation: "break immediately terminates the current loop.",
      },
      {
        concept: "Loops",
        difficulty: "easy",
        orderNo: 3,
        questionText: "What does the continue statement do inside a loop?",
        options: [
          {
            label: "A",
            text: "Exits the loop",
            misconceptionTag: "break_confusion",
          },
          {
            label: "B",
            text: "Restarts the program",
            misconceptionTag: "restart_confusion",
          },
          {
            label: "C",
            text: "Skips the rest of the current iteration",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Pauses execution",
            misconceptionTag: "pause_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It moves to the next iteration.",
        detailedHint:
          "continue skips remaining loop body and goes to the next check.",
        explanation:
          "continue skips the rest of the loop body and goes to the next iteration.",
      },
      {
        concept: "Loops",
        difficulty: "easy",
        orderNo: 4,
        questionText:
          "How many times does the loop execute: for(int i=0; i<5; i++)?",
        options: [
          { label: "A", text: "4", misconceptionTag: "off_by_one" },
          { label: "B", text: "6", misconceptionTag: "over_count" },
          { label: "C", text: "5", misconceptionTag: "" },
          {
            label: "D",
            text: "Infinite",
            misconceptionTag: "infinite_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "i goes from 0 to 4.",
        detailedHint: "i takes values 0,1,2,3,4 — that's 5 iterations.",
        explanation:
          "The loop runs while i < 5, so i = 0,1,2,3,4 — 5 iterations.",
      },
      {
        concept: "Loops",
        difficulty: "easy",
        orderNo: 5,
        questionText: "Which part of a for loop is optional?",
        options: [
          {
            label: "A",
            text: "None — all parts are required",
            misconceptionTag: "required_confusion",
          },
          {
            label: "B",
            text: "Only the increment",
            misconceptionTag: "increment_optional",
          },
          {
            label: "C",
            text: "All three parts are optional",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Only the initialization",
            misconceptionTag: "init_optional",
          },
        ],
        correctAnswer: "C",
        hint: "for(;;) is valid C.",
        detailedHint:
          "for(;;) creates an infinite loop — all three parts are optional.",
        explanation:
          "All three parts of a for loop (init; condition; increment) are optional.",
      },
      {
        concept: "Loops",
        difficulty: "medium",
        orderNo: 6,
        questionText: "What is an infinite loop in C?",
        options: [
          {
            label: "A",
            text: "A loop that never starts",
            misconceptionTag: "never_start_confusion",
          },
          {
            label: "B",
            text: "A loop with no body",
            misconceptionTag: "empty_body_confusion",
          },
          {
            label: "C",
            text: "A loop whose condition never becomes false",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "A loop that uses recursion",
            misconceptionTag: "recursion_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "The loop runs forever.",
        detailedHint: "while(1) is a classic infinite loop.",
        explanation:
          "An infinite loop runs indefinitely because its exit condition is never met.",
      },
      {
        concept: "Loops",
        difficulty: "medium",
        orderNo: 7,
        questionText:
          'What is the output of: int i=1; while(i<=3) { printf("%d ",i); i++; }',
        options: [
          { label: "A", text: "1 2 3 4", misconceptionTag: "off_by_one" },
          {
            label: "B",
            text: "0 1 2 3",
            misconceptionTag: "zero_start_confusion",
          },
          { label: "C", text: "1 2 3", misconceptionTag: "" },
          {
            label: "D",
            text: "Infinite loop",
            misconceptionTag: "infinite_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Loop runs while i <= 3.",
        detailedHint:
          "i starts at 1 and increments to 4 where condition fails.",
        explanation:
          "i takes values 1, 2, 3 before i++ makes i=4 and condition fails.",
      },
      {
        concept: "Loops",
        difficulty: "medium",
        orderNo: 8,
        questionText: "When should you prefer a while loop over a for loop?",
        options: [
          {
            label: "A",
            text: "When you know the exact iteration count",
            misconceptionTag: "for_use_case",
          },
          {
            label: "B",
            text: "When the number of iterations is unknown",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "When iterating over arrays",
            misconceptionTag: "array_confusion",
          },
          {
            label: "D",
            text: "When you need a post-condition check",
            misconceptionTag: "do_while_use_case",
          },
        ],
        correctAnswer: "B",
        hint: "while is condition-driven.",
        detailedHint:
          "while loops are ideal when termination depends on runtime conditions.",
        explanation:
          "while is preferred when the number of iterations is not known in advance.",
      },
      {
        concept: "Loops",
        difficulty: "hard",
        orderNo: 9,
        questionText: "What does break inside a nested loop affect?",
        options: [
          {
            label: "A",
            text: "Exits all loops",
            misconceptionTag: "all_loops_confusion",
          },
          {
            label: "B",
            text: "Exits the outermost loop",
            misconceptionTag: "outer_loop_confusion",
          },
          {
            label: "C",
            text: "Exits only the innermost loop",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Causes a compile error",
            misconceptionTag: "compile_error_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "break only affects its immediate loop.",
        detailedHint: "break exits the nearest enclosing loop.",
        explanation: "break exits only the innermost loop in which it appears.",
      },
      {
        concept: "Loops",
        difficulty: "hard",
        orderNo: 10,
        questionText:
          "What is the complexity of a simple nested for loop (n × n)?",
        options: [
          { label: "A", text: "O(n)", misconceptionTag: "linear_confusion" },
          {
            label: "B",
            text: "O(n log n)",
            misconceptionTag: "loglinear_confusion",
          },
          { label: "C", text: "O(n²)", misconceptionTag: "" },
          {
            label: "D",
            text: "O(2n)",
            misconceptionTag: "exponential_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "n iterations × n iterations.",
        detailedHint: "Each outer iteration runs inner n times: n × n = n².",
        explanation:
          "A nested loop where each runs n times gives O(n²) time complexity.",
      },
    ];

    for (const q of module5Questions) {
      await Question.create({ module: module5._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 6 – Functions
    // ─────────────────────────────────────────────
    const module6 = await LearningModule.create({
      name: "Functions",
      code: "FUNCTIONS",
      description:
        "Function declaration, definition, return types, and parameters in C.",
      orderNo: 6,
      totalQuestions: 10,
      isActive: true,
    });

    const module6Questions = [
      {
        concept: "Functions",
        difficulty: "easy",
        orderNo: 1,
        questionText: "What keyword returns a value from a function?",
        options: [
          { label: "A", text: "give", misconceptionTag: "wrong_keyword" },
          { label: "B", text: "output", misconceptionTag: "wrong_keyword" },
          { label: "C", text: "return", misconceptionTag: "" },
          { label: "D", text: "send", misconceptionTag: "wrong_keyword" },
        ],
        correctAnswer: "C",
        hint: "It ends the function and optionally passes a value back.",
        detailedHint:
          "return exits the function and returns a value to the caller.",
        explanation:
          "return is used to exit a function and send a value back to the caller.",
      },
      {
        concept: "Functions",
        difficulty: "easy",
        orderNo: 2,
        questionText:
          "What return type should a function have if it returns nothing?",
        options: [
          { label: "A", text: "int", misconceptionTag: "int_return_confusion" },
          { label: "B", text: "null", misconceptionTag: "null_type_confusion" },
          { label: "C", text: "void", misconceptionTag: "" },
          {
            label: "D",
            text: "empty",
            misconceptionTag: "empty_type_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It means 'nothing'.",
        detailedHint: "void signals that the function returns no value.",
        explanation:
          "void is the return type for functions that do not return a value.",
      },
      {
        concept: "Functions",
        difficulty: "easy",
        orderNo: 3,
        questionText: "What is a function prototype?",
        options: [
          {
            label: "A",
            text: "The function's body",
            misconceptionTag: "body_confusion",
          },
          {
            label: "B",
            text: "A declaration telling the compiler the function's signature",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A call to the function",
            misconceptionTag: "call_confusion",
          },
          {
            label: "D",
            text: "A comment about the function",
            misconceptionTag: "comment_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It comes before the function definition.",
        detailedHint:
          "A prototype declares return type and parameters without the body.",
        explanation:
          "A function prototype declares the function's return type and parameter list to the compiler.",
      },
      {
        concept: "Functions",
        difficulty: "easy",
        orderNo: 4,
        questionText: "Which function is the entry point of every C program?",
        options: [
          { label: "A", text: "start()", misconceptionTag: "start_confusion" },
          { label: "B", text: "run()", misconceptionTag: "run_confusion" },
          { label: "C", text: "main()", misconceptionTag: "" },
          { label: "D", text: "init()", misconceptionTag: "init_confusion" },
        ],
        correctAnswer: "C",
        hint: "Every C program begins here.",
        detailedHint: "Execution of a C program always starts with main().",
        explanation:
          "main() is the mandatory entry point where C program execution begins.",
      },
      {
        concept: "Functions",
        difficulty: "easy",
        orderNo: 5,
        questionText: "What are formal parameters?",
        options: [
          {
            label: "A",
            text: "Variables passed when calling the function",
            misconceptionTag: "actual_params_confusion",
          },
          {
            label: "B",
            text: "Variables defined in the function signature",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Global variables",
            misconceptionTag: "global_confusion",
          },
          {
            label: "D",
            text: "Constants inside the function",
            misconceptionTag: "constant_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "They appear in the function definition.",
        detailedHint:
          "Formal parameters are placeholders in the function's definition.",
        explanation:
          "Formal parameters are the variables listed in the function definition header.",
      },
      {
        concept: "Functions",
        difficulty: "medium",
        orderNo: 6,
        questionText: "What is pass-by-value in C?",
        options: [
          {
            label: "A",
            text: "Passing the address of a variable",
            misconceptionTag: "pass_by_ref_confusion",
          },
          {
            label: "B",
            text: "Passing a copy of the variable's value",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Passing a pointer to the variable",
            misconceptionTag: "pointer_confusion",
          },
          {
            label: "D",
            text: "Modifying the original variable directly",
            misconceptionTag: "direct_modify_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "The original variable is not affected.",
        detailedHint:
          "Pass-by-value copies the value; changes inside the function don't affect the caller.",
        explanation:
          "Pass-by-value sends a copy; modifications inside the function don't affect the original.",
      },
      {
        concept: "Functions",
        difficulty: "medium",
        orderNo: 7,
        questionText: "What is recursion?",
        options: [
          {
            label: "A",
            text: "A loop that counts down",
            misconceptionTag: "loop_confusion",
          },
          {
            label: "B",
            text: "A function calling itself",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Two functions calling each other",
            misconceptionTag: "mutual_recursion_confusion",
          },
          {
            label: "D",
            text: "A function with no return value",
            misconceptionTag: "void_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "The function calls itself.",
        detailedHint: "Recursion requires a base case to stop.",
        explanation:
          "Recursion is when a function calls itself to solve a smaller sub-problem.",
      },
      {
        concept: "Functions",
        difficulty: "medium",
        orderNo: 8,
        questionText:
          "What is the scope of a local variable inside a function?",
        options: [
          {
            label: "A",
            text: "Entire program",
            misconceptionTag: "global_scope_confusion",
          },
          {
            label: "B",
            text: "All functions in the file",
            misconceptionTag: "file_scope_confusion",
          },
          {
            label: "C",
            text: "Only within that function",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Only the line it is declared on",
            misconceptionTag: "line_scope_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Local means limited to that function.",
        detailedHint:
          "Local variables are created when the function is called and destroyed when it returns.",
        explanation:
          "Local variables exist only within the function where they are declared.",
      },
      {
        concept: "Functions",
        difficulty: "hard",
        orderNo: 9,
        questionText:
          "What happens when a recursive function has no base case?",
        options: [
          {
            label: "A",
            text: "It returns 0",
            misconceptionTag: "zero_return_confusion",
          },
          {
            label: "B",
            text: "It runs once",
            misconceptionTag: "once_run_confusion",
          },
          {
            label: "C",
            text: "Stack overflow / infinite recursion",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Compile error",
            misconceptionTag: "compile_error_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "No stopping condition means it runs forever.",
        detailedHint:
          "Each call adds a frame to the stack, eventually causing overflow.",
        explanation:
          "Without a base case, recursion is infinite and causes a stack overflow.",
      },
      {
        concept: "Functions",
        difficulty: "hard",
        orderNo: 10,
        questionText:
          "What is the return type of main() according to the C standard?",
        options: [
          { label: "A", text: "void", misconceptionTag: "void_main_confusion" },
          { label: "B", text: "int", misconceptionTag: "" },
          { label: "C", text: "char", misconceptionTag: "char_confusion" },
          { label: "D", text: "float", misconceptionTag: "float_confusion" },
        ],
        correctAnswer: "B",
        hint: "It returns an exit status code.",
        detailedHint: "main() returns int; 0 means success.",
        explanation:
          "The C standard requires main() to return int. 0 indicates successful execution.",
      },
    ];

    for (const q of module6Questions) {
      await Question.create({ module: module6._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 7 – Arrays
    // ─────────────────────────────────────────────
    const module7 = await LearningModule.create({
      name: "Arrays",
      code: "ARRAYS",
      description:
        "1D and 2D array declaration, initialization, and indexing in C.",
      orderNo: 7,
      totalQuestions: 10,
      isActive: true,
    });

    const module7Questions = [
      {
        concept: "Arrays",
        difficulty: "easy",
        orderNo: 1,
        questionText: "What is the index of the first element in a C array?",
        options: [
          { label: "A", text: "1", misconceptionTag: "one_based_indexing" },
          {
            label: "B",
            text: "-1",
            misconceptionTag: "negative_index_confusion",
          },
          { label: "C", text: "0", misconceptionTag: "" },
          {
            label: "D",
            text: "Depends on declaration",
            misconceptionTag: "variable_index_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "C uses zero-based indexing.",
        detailedHint: "The first element is at index 0.",
        explanation:
          "C arrays use zero-based indexing; the first element is arr[0].",
      },
      {
        concept: "Arrays",
        difficulty: "easy",
        orderNo: 2,
        questionText: "How do you declare an integer array of size 5 in C?",
        options: [
          {
            label: "A",
            text: "array int a[5];",
            misconceptionTag: "wrong_syntax",
          },
          { label: "B", text: "int a[5];", misconceptionTag: "" },
          {
            label: "C",
            text: "int a(5);",
            misconceptionTag: "parenthesis_confusion",
          },
          {
            label: "D",
            text: "int[5] a;",
            misconceptionTag: "java_syntax_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Type, name, then size in brackets.",
        detailedHint: "Syntax: type name[size];",
        explanation:
          "int a[5]; declares an integer array named a with 5 elements.",
      },
      {
        concept: "Arrays",
        difficulty: "easy",
        orderNo: 3,
        questionText: "What is the last valid index of int arr[10]?",
        options: [
          { label: "A", text: "10", misconceptionTag: "off_by_one" },
          { label: "B", text: "9", misconceptionTag: "" },
          { label: "C", text: "0", misconceptionTag: "first_index_confusion" },
          { label: "D", text: "11", misconceptionTag: "over_bound_confusion" },
        ],
        correctAnswer: "B",
        hint: "0-based indexing: 0 to size-1.",
        detailedHint: "For size 10: valid indices are 0 through 9.",
        explanation: "Indices range from 0 to 9 for a 10-element array.",
      },
      {
        concept: "Arrays",
        difficulty: "easy",
        orderNo: 4,
        questionText:
          "Can you change the size of an array after declaration in C?",
        options: [
          {
            label: "A",
            text: "Yes, using resize()",
            misconceptionTag: "resize_confusion",
          },
          {
            label: "B",
            text: "Yes, automatically",
            misconceptionTag: "auto_resize_confusion",
          },
          {
            label: "C",
            text: "No, arrays are fixed-size",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Only with dynamic arrays",
            misconceptionTag: "partial_correct",
          },
        ],
        correctAnswer: "C",
        hint: "Static arrays in C are fixed.",
        detailedHint: "Once declared, a static array's size cannot change.",
        explanation:
          "Static arrays in C have fixed size determined at declaration.",
      },
      {
        concept: "Arrays",
        difficulty: "easy",
        orderNo: 5,
        questionText: "How are array elements stored in memory?",
        options: [
          {
            label: "A",
            text: "Randomly",
            misconceptionTag: "random_storage_confusion",
          },
          {
            label: "B",
            text: "In reverse order",
            misconceptionTag: "reverse_confusion",
          },
          {
            label: "C",
            text: "In contiguous memory locations",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "In linked nodes",
            misconceptionTag: "linked_list_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Elements are next to each other in memory.",
        detailedHint: "Arrays use contiguous (sequential) memory blocks.",
        explanation:
          "Array elements are stored in consecutive memory locations.",
      },
      {
        concept: "Arrays",
        difficulty: "medium",
        orderNo: 6,
        questionText:
          'What is the output of: int a[] = {1,2,3}; printf("%d", a[1])?',
        options: [
          { label: "A", text: "1", misconceptionTag: "zero_index_confusion" },
          { label: "B", text: "2", misconceptionTag: "" },
          { label: "C", text: "3", misconceptionTag: "two_index_confusion" },
          { label: "D", text: "Error", misconceptionTag: "error_confusion" },
        ],
        correctAnswer: "B",
        hint: "Index 1 is the second element.",
        detailedHint: "a[0]=1, a[1]=2, a[2]=3.",
        explanation: "a[1] accesses the second element which is 2.",
      },
      {
        concept: "Arrays",
        difficulty: "medium",
        orderNo: 7,
        questionText:
          "How do you declare a 2D array with 3 rows and 4 columns?",
        options: [
          {
            label: "A",
            text: "int a[4][3];",
            misconceptionTag: "row_col_reversed",
          },
          {
            label: "B",
            text: "int a[3,4];",
            misconceptionTag: "comma_syntax_confusion",
          },
          { label: "C", text: "int a[3][4];", misconceptionTag: "" },
          {
            label: "D",
            text: "int a(3)(4);",
            misconceptionTag: "parenthesis_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Rows first, columns second.",
        detailedHint: "2D array syntax: type name[rows][cols];",
        explanation:
          "int a[3][4]; declares a 2D array with 3 rows and 4 columns.",
      },
      {
        concept: "Arrays",
        difficulty: "medium",
        orderNo: 8,
        questionText: "What does accessing arr[10] on int arr[10] cause?",
        options: [
          {
            label: "A",
            text: "Returns 0",
            misconceptionTag: "zero_return_confusion",
          },
          {
            label: "B",
            text: "Returns last element",
            misconceptionTag: "last_element_confusion",
          },
          {
            label: "C",
            text: "Out-of-bounds / undefined behavior",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Compile error",
            misconceptionTag: "compile_error_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Valid indices are 0 to 9.",
        detailedHint:
          "arr[10] is one past the last element — undefined behavior.",
        explanation:
          "Accessing beyond the array bound causes undefined behavior.",
      },
      {
        concept: "Arrays",
        difficulty: "hard",
        orderNo: 9,
        questionText:
          "When an array name is used in an expression, it decays to?",
        options: [
          {
            label: "A",
            text: "The size of the array",
            misconceptionTag: "size_confusion",
          },
          {
            label: "B",
            text: "A pointer to the first element",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A copy of all elements",
            misconceptionTag: "copy_confusion",
          },
          {
            label: "D",
            text: "The last element's address",
            misconceptionTag: "last_addr_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Arrays and pointers are closely related.",
        detailedHint: "arr in an expression is equivalent to &arr[0].",
        explanation:
          "An array name decays to a pointer to its first element in most expressions.",
      },
      {
        concept: "Arrays",
        difficulty: "hard",
        orderNo: 10,
        questionText: "How do you pass an array to a function in C?",
        options: [
          {
            label: "A",
            text: "By value (a copy is made)",
            misconceptionTag: "by_value_confusion",
          },
          {
            label: "B",
            text: "By pointer (address of first element)",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Using a special array keyword",
            misconceptionTag: "keyword_confusion",
          },
          {
            label: "D",
            text: "Arrays cannot be passed to functions",
            misconceptionTag: "not_passable_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Arrays decay to pointers when passed.",
        detailedHint:
          "Passing an array passes the address of its first element.",
        explanation:
          "Arrays are passed as a pointer to the first element; no copy is made.",
      },
    ];

    for (const q of module7Questions) {
      await Question.create({ module: module7._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 8 – Strings
    // ─────────────────────────────────────────────
    const module8 = await LearningModule.create({
      name: "Strings",
      code: "STRINGS",
      description:
        "C-style strings, null terminator, and common string functions.",
      orderNo: 8,
      totalQuestions: 10,
      isActive: true,
    });

    const module8Questions = [
      {
        concept: "Strings",
        difficulty: "easy",
        orderNo: 1,
        questionText: "How are strings represented in C?",
        options: [
          {
            label: "A",
            text: "As a built-in string type",
            misconceptionTag: "string_type_confusion",
          },
          {
            label: "B",
            text: "As a char array ending with \\0",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "As a list of ASCII codes",
            misconceptionTag: "ascii_confusion",
          },
          {
            label: "D",
            text: "Using the string keyword",
            misconceptionTag: "string_keyword_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "There's a special terminating character.",
        detailedHint:
          "C strings are char arrays terminated by the null character \\0.",
        explanation:
          "C strings are arrays of chars ending with the null terminator \\0.",
      },
      {
        concept: "Strings",
        difficulty: "easy",
        orderNo: 2,
        questionText: "What character marks the end of a C string?",
        options: [
          { label: "A", text: "\\n", misconceptionTag: "newline_confusion" },
          { label: "B", text: "\\t", misconceptionTag: "tab_confusion" },
          { label: "C", text: "\\0", misconceptionTag: "" },
          { label: "D", text: "#", misconceptionTag: "hash_confusion" },
        ],
        correctAnswer: "C",
        hint: "It's the null character.",
        detailedHint: "\\0 (ASCII 0) is the null terminator.",
        explanation:
          "C strings end with \\0 (null character), which marks the end of the string.",
      },
      {
        concept: "Strings",
        difficulty: "easy",
        orderNo: 3,
        questionText: "Which header provides strlen() and strcpy()?",
        options: [
          {
            label: "A",
            text: "<stdio.h>",
            misconceptionTag: "io_header_confusion",
          },
          {
            label: "B",
            text: "<stdlib.h>",
            misconceptionTag: "stdlib_confusion",
          },
          { label: "C", text: "<string.h>", misconceptionTag: "" },
          { label: "D", text: "<str.h>", misconceptionTag: "wrong_header" },
        ],
        correctAnswer: "C",
        hint: "Think about which header relates to strings.",
        detailedHint: "String manipulation functions are in string.h.",
        explanation:
          "string.h provides string functions like strlen(), strcpy(), strcat().",
      },
      {
        concept: "Strings",
        difficulty: "easy",
        orderNo: 4,
        questionText: 'What does strlen("hello") return?',
        options: [
          { label: "A", text: "6", misconceptionTag: "null_counted_confusion" },
          { label: "B", text: "4", misconceptionTag: "off_by_one" },
          { label: "C", text: "5", misconceptionTag: "" },
          { label: "D", text: "0", misconceptionTag: "zero_confusion" },
        ],
        correctAnswer: "C",
        hint: "Count only the visible characters.",
        detailedHint: "strlen() does not count the null terminator.",
        explanation:
          "strlen() returns the number of characters before \\0. 'hello' has 5 characters.",
      },
      {
        concept: "Strings",
        difficulty: "easy",
        orderNo: 5,
        questionText: "Which function copies one string to another in C?",
        options: [
          {
            label: "A",
            text: "strdup()",
            misconceptionTag: "strdup_confusion",
          },
          {
            label: "B",
            text: "memcpy()",
            misconceptionTag: "memcpy_confusion",
          },
          { label: "C", text: "strcpy()", misconceptionTag: "" },
          {
            label: "D",
            text: "copy()",
            misconceptionTag: "generic_copy_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "str + copy.",
        detailedHint: "strcpy(dest, src) copies src into dest.",
        explanation:
          "strcpy() copies the source string into the destination buffer.",
      },
      {
        concept: "Strings",
        difficulty: "medium",
        orderNo: 6,
        questionText: 'What does strcmp("abc", "abc") return?',
        options: [
          {
            label: "A",
            text: "1",
            misconceptionTag: "positive_return_confusion",
          },
          {
            label: "B",
            text: "-1",
            misconceptionTag: "negative_return_confusion",
          },
          { label: "C", text: "0", misconceptionTag: "" },
          {
            label: "D",
            text: "true",
            misconceptionTag: "bool_return_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Equal strings return zero.",
        detailedHint: "strcmp returns 0 when both strings are equal.",
        explanation: "strcmp() returns 0 when the two strings are identical.",
      },
      {
        concept: "Strings",
        difficulty: "medium",
        orderNo: 7,
        questionText: "Why should you not compare strings with == in C?",
        options: [
          {
            label: "A",
            text: "It's a syntax error",
            misconceptionTag: "syntax_error_confusion",
          },
          {
            label: "B",
            text: "== compares addresses, not contents",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "It compares only the first character",
            misconceptionTag: "first_char_confusion",
          },
          {
            label: "D",
            text: "It always returns true",
            misconceptionTag: "always_true_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "String names are pointers.",
        detailedHint: "== compares pointer addresses, not string content.",
        explanation:
          "Using == on strings compares memory addresses, not actual string content.",
      },
      {
        concept: "Strings",
        difficulty: "medium",
        orderNo: 8,
        questionText: "Which function appends one string to another?",
        options: [
          { label: "A", text: "strjoin()", misconceptionTag: "wrong_function" },
          { label: "B", text: "strcat()", misconceptionTag: "" },
          { label: "C", text: "stradd()", misconceptionTag: "wrong_function" },
          { label: "D", text: "append()", misconceptionTag: "cpp_confusion" },
        ],
        correctAnswer: "B",
        hint: "str + concatenate.",
        detailedHint: "strcat(dest, src) appends src to the end of dest.",
        explanation:
          "strcat() concatenates (appends) one string to the end of another.",
      },
      {
        concept: "Strings",
        difficulty: "hard",
        orderNo: 9,
        questionText: "What is a buffer overflow in the context of C strings?",
        options: [
          {
            label: "A",
            text: "Printing too many characters",
            misconceptionTag: "print_confusion",
          },
          {
            label: "B",
            text: "Writing beyond the allocated string buffer",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Declaring a string too large",
            misconceptionTag: "declaration_confusion",
          },
          {
            label: "D",
            text: "Using strlen incorrectly",
            misconceptionTag: "strlen_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Writing past the end of allocated memory.",
        detailedHint:
          "Buffer overflow writes beyond the array's bounds, corrupting memory.",
        explanation:
          "A buffer overflow occurs when more data is written than the buffer can hold.",
      },
      {
        concept: "Strings",
        difficulty: "hard",
        orderNo: 10,
        questionText:
          "What is the safer alternative to strcpy() to prevent overflow?",
        options: [
          {
            label: "A",
            text: "strncopy()",
            misconceptionTag: "wrong_function",
          },
          { label: "B", text: "safecpy()", misconceptionTag: "wrong_function" },
          { label: "C", text: "strncpy()", misconceptionTag: "" },
          {
            label: "D",
            text: "memcpy()",
            misconceptionTag: "memcpy_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It takes a maximum length parameter.",
        detailedHint: "strncpy(dest, src, n) copies at most n characters.",
        explanation:
          "strncpy() limits the number of copied characters, reducing overflow risk.",
      },
    ];

    for (const q of module8Questions) {
      await Question.create({ module: module8._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 9 – Pointers
    // ─────────────────────────────────────────────
    const module9 = await LearningModule.create({
      name: "Pointers",
      code: "POINTERS",
      description:
        "Pointer declaration, dereferencing, pointer arithmetic in C.",
      orderNo: 9,
      totalQuestions: 10,
      isActive: true,
    });

    const module9Questions = [
      {
        concept: "Pointers",
        difficulty: "easy",
        orderNo: 1,
        questionText: "What does a pointer store?",
        options: [
          {
            label: "A",
            text: "A value directly",
            misconceptionTag: "value_confusion",
          },
          {
            label: "B",
            text: "The address of a memory location",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A copy of a variable",
            misconceptionTag: "copy_confusion",
          },
          {
            label: "D",
            text: "A function name",
            misconceptionTag: "function_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Pointers point to memory.",
        detailedHint: "A pointer holds the memory address of another variable.",
        explanation:
          "A pointer variable stores the memory address of another variable.",
      },
      {
        concept: "Pointers",
        difficulty: "easy",
        orderNo: 2,
        questionText:
          "Which operator is used to get the address of a variable?",
        options: [
          { label: "A", text: "*", misconceptionTag: "dereference_confusion" },
          { label: "B", text: "#", misconceptionTag: "hash_confusion" },
          { label: "C", text: "&", misconceptionTag: "" },
          { label: "D", text: "@", misconceptionTag: "at_sign_confusion" },
        ],
        correctAnswer: "C",
        hint: "Same symbol used in scanf().",
        detailedHint: "&x gives the memory address of x.",
        explanation:
          "The & (address-of) operator returns the memory address of a variable.",
      },
      {
        concept: "Pointers",
        difficulty: "easy",
        orderNo: 3,
        questionText: "What does the * operator do when used with a pointer?",
        options: [
          {
            label: "A",
            text: "Gets the address",
            misconceptionTag: "address_confusion",
          },
          {
            label: "B",
            text: "Multiplies the pointer",
            misconceptionTag: "multiply_confusion",
          },
          {
            label: "C",
            text: "Dereferences the pointer (gets the value at the address)",
            misconceptionTag: "",
          },
          {
            label: "D",
            text: "Declares a float",
            misconceptionTag: "float_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It accesses the value stored at the address.",
        detailedHint:
          "*ptr gives the value stored at the address ptr points to.",
        explanation:
          "The * (dereference) operator accesses the value at the address stored in the pointer.",
      },
      {
        concept: "Pointers",
        difficulty: "easy",
        orderNo: 4,
        questionText: "How do you declare a pointer to an integer?",
        options: [
          {
            label: "A",
            text: "int p;",
            misconceptionTag: "variable_confusion",
          },
          {
            label: "B",
            text: "pointer int p;",
            misconceptionTag: "keyword_confusion",
          },
          { label: "C", text: "int *p;", misconceptionTag: "" },
          {
            label: "D",
            text: "int &p;",
            misconceptionTag: "reference_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "Use * in the declaration.",
        detailedHint: "int *p; declares p as a pointer to int.",
        explanation:
          "int *p; declares p as a pointer that holds the address of an int.",
      },
      {
        concept: "Pointers",
        difficulty: "easy",
        orderNo: 5,
        questionText: "What is a NULL pointer?",
        options: [
          {
            label: "A",
            text: "A pointer pointing to zero value",
            misconceptionTag: "zero_value_confusion",
          },
          {
            label: "B",
            text: "A pointer not pointing to any valid address",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A deleted pointer",
            misconceptionTag: "deleted_confusion",
          },
          {
            label: "D",
            text: "An uninitialized pointer",
            misconceptionTag: "uninitialized_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It is a safe 'empty' pointer.",
        detailedHint: "NULL is typically defined as 0 or (void*)0.",
        explanation:
          "A NULL pointer is one that doesn't point to any valid memory location.",
      },
      {
        concept: "Pointers",
        difficulty: "medium",
        orderNo: 6,
        questionText:
          "What is pointer arithmetic? If int *p points to arr[0], what is p+1?",
        options: [
          {
            label: "A",
            text: "Address + 1 byte",
            misconceptionTag: "byte_confusion",
          },
          {
            label: "B",
            text: "Address + sizeof(int) bytes",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Address + 10 bytes",
            misconceptionTag: "wrong_offset",
          },
          {
            label: "D",
            text: "Address * 2",
            misconceptionTag: "multiply_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Pointer arithmetic scales by the type's size.",
        detailedHint:
          "p+1 advances by sizeof(int) bytes to point to the next int.",
        explanation:
          "Pointer arithmetic increments by the size of the pointed-to type.",
      },
      {
        concept: "Pointers",
        difficulty: "medium",
        orderNo: 7,
        questionText: "What is a dangling pointer?",
        options: [
          {
            label: "A",
            text: "A pointer to a NULL value",
            misconceptionTag: "null_confusion",
          },
          {
            label: "B",
            text: "A pointer pointing to freed/invalid memory",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A pointer that has never been initialized",
            misconceptionTag: "uninitialized_confusion",
          },
          {
            label: "D",
            text: "A pointer to a pointer",
            misconceptionTag: "double_ptr_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "The memory it points to is no longer valid.",
        detailedHint:
          "Dangling pointers occur after free() or when local variables go out of scope.",
        explanation:
          "A dangling pointer points to memory that has been freed or is out of scope.",
      },
      {
        concept: "Pointers",
        difficulty: "medium",
        orderNo: 8,
        questionText:
          "What is the relationship between arrays and pointers in C?",
        options: [
          {
            label: "A",
            text: "They are completely different",
            misconceptionTag: "different_confusion",
          },
          {
            label: "B",
            text: "An array name acts as a pointer to its first element",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Pointers are a type of array",
            misconceptionTag: "reverse_confusion",
          },
          {
            label: "D",
            text: "Arrays are always larger than pointers",
            misconceptionTag: "size_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Array name decays to pointer.",
        detailedHint: "arr is equivalent to &arr[0] in most contexts.",
        explanation:
          "An array name decays to a pointer to its first element in expressions.",
      },
      {
        concept: "Pointers",
        difficulty: "hard",
        orderNo: 9,
        questionText: "What is a pointer to a pointer (double pointer)?",
        options: [
          {
            label: "A",
            text: "A pointer that stores two addresses",
            misconceptionTag: "two_address_confusion",
          },
          {
            label: "B",
            text: "A pointer whose value is another pointer's address",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Two pointers pointing to the same variable",
            misconceptionTag: "same_variable_confusion",
          },
          {
            label: "D",
            text: "A pointer multiplied by 2",
            misconceptionTag: "multiply_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Declared as int **pp;",
        detailedHint: "int **pp stores the address of a pointer to int.",
        explanation:
          "A double pointer stores the address of another pointer variable.",
      },
      {
        concept: "Pointers",
        difficulty: "hard",
        orderNo: 10,
        questionText: "What is the difference between *p++ and (*p)++?",
        options: [
          {
            label: "A",
            text: "No difference",
            misconceptionTag: "no_diff_confusion",
          },
          {
            label: "B",
            text: "*p++ increments pointer; (*p)++ increments value at pointer",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "*p++ increments value; (*p)++ increments pointer",
            misconceptionTag: "reversed_confusion",
          },
          {
            label: "D",
            text: "Both cause compile errors",
            misconceptionTag: "error_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Operator precedence matters here.",
        detailedHint: "++ has higher precedence than *; parentheses override.",
        explanation:
          "*p++ increments the pointer (++ applies to p); (*p)++ increments the value at p.",
      },
    ];

    for (const q of module9Questions) {
      await Question.create({ module: module9._id, ...q, isActive: true });
    }

    // ─────────────────────────────────────────────
    // MODULE 10 – Structures & Unions
    // ─────────────────────────────────────────────
    const module10 = await LearningModule.create({
      name: "Structures & Unions",
      code: "STRUCTURES_UNIONS",
      description: "struct, union, typedef, and accessing members in C.",
      orderNo: 10,
      totalQuestions: 10,
      isActive: true,
    });

    const module10Questions = [
      {
        concept: "Structures & Unions",
        difficulty: "easy",
        orderNo: 1,
        questionText: "What keyword is used to define a structure in C?",
        options: [
          { label: "A", text: "class", misconceptionTag: "cpp_confusion" },
          { label: "B", text: "record", misconceptionTag: "pascal_confusion" },
          { label: "C", text: "struct", misconceptionTag: "" },
          { label: "D", text: "object", misconceptionTag: "object_confusion" },
        ],
        correctAnswer: "C",
        hint: "Short for structure.",
        detailedHint: "struct groups related variables under one name.",
        explanation: "struct is the keyword used to define a structure in C.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "easy",
        orderNo: 2,
        questionText: "How do you access a member of a structure variable?",
        options: [
          {
            label: "A",
            text: "Using -> operator",
            misconceptionTag: "arrow_confusion",
          },
          {
            label: "B",
            text: "Using :: operator",
            misconceptionTag: "scope_confusion",
          },
          { label: "C", text: "Using . (dot) operator", misconceptionTag: "" },
          {
            label: "D",
            text: "Using [] operator",
            misconceptionTag: "array_confusion",
          },
        ],
        correctAnswer: "C",
        hint: "It's a single punctuation character.",
        detailedHint: "variable.member accesses a struct member directly.",
        explanation:
          "The dot (.) operator accesses members of a structure variable.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "easy",
        orderNo: 3,
        questionText:
          "How do you access a member through a pointer to a structure?",
        options: [
          { label: "A", text: "ptr.member", misconceptionTag: "dot_confusion" },
          { label: "B", text: "ptr->member", misconceptionTag: "" },
          {
            label: "C",
            text: "ptr::member",
            misconceptionTag: "scope_confusion",
          },
          {
            label: "D",
            text: "*ptr.member",
            misconceptionTag: "dereference_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Arrow operator.",
        detailedHint: "ptr->member is shorthand for (*ptr).member.",
        explanation:
          "The -> (arrow) operator accesses a structure member through a pointer.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "easy",
        orderNo: 4,
        questionText: "What does typedef do in C?",
        options: [
          {
            label: "A",
            text: "Defines a new data type",
            misconceptionTag: "new_type_confusion",
          },
          {
            label: "B",
            text: "Creates an alias for an existing type",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Imports a library",
            misconceptionTag: "import_confusion",
          },
          {
            label: "D",
            text: "Defines a constant",
            misconceptionTag: "define_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "It gives a type a new name.",
        detailedHint: "typedef allows shorter or more meaningful type names.",
        explanation:
          "typedef creates a new name (alias) for an existing data type.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "easy",
        orderNo: 5,
        questionText: "What is the main difference between struct and union?",
        options: [
          {
            label: "A",
            text: "Structs can have functions, unions cannot",
            misconceptionTag: "function_confusion",
          },
          {
            label: "B",
            text: "Union members share the same memory; struct members have separate memory",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Unions can have more members than structs",
            misconceptionTag: "member_count_confusion",
          },
          {
            label: "D",
            text: "There is no difference",
            misconceptionTag: "no_diff_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Size of union vs struct reflects this.",
        detailedHint:
          "Union size = size of its largest member; struct size = sum of all members.",
        explanation:
          "In a union, all members share the same memory location. In a struct, each member has its own.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "medium",
        orderNo: 6,
        questionText:
          "What is the size of a struct with int (4 bytes) and char (1 byte)?",
        options: [
          {
            label: "A",
            text: "5 bytes always",
            misconceptionTag: "no_padding_confusion",
          },
          {
            label: "B",
            text: "8 bytes (due to padding)",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "4 bytes",
            misconceptionTag: "int_only_confusion",
          },
          {
            label: "D",
            text: "1 byte",
            misconceptionTag: "char_only_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Compilers add padding for alignment.",
        detailedHint:
          "Struct padding aligns members to their natural boundaries.",
        explanation:
          "Due to memory alignment (padding), the struct is typically 8 bytes.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "medium",
        orderNo: 7,
        questionText: "Can a struct contain a pointer to itself?",
        options: [
          {
            label: "A",
            text: "No, that's illegal in C",
            misconceptionTag: "illegal_confusion",
          },
          {
            label: "B",
            text: "Yes, this is used in linked lists",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Only with typedef",
            misconceptionTag: "typedef_confusion",
          },
          {
            label: "D",
            text: "Only in C++",
            misconceptionTag: "cpp_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Self-referential structures are common.",
        detailedHint:
          "struct Node { int data; struct Node *next; } is the classic linked list node.",
        explanation:
          "A struct can contain a pointer to itself, enabling data structures like linked lists.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "medium",
        orderNo: 8,
        questionText: "How do you initialize a struct variable?",
        options: [
          {
            label: "A",
            text: "struct.init()",
            misconceptionTag: "method_confusion",
          },
          {
            label: "B",
            text: "Using = { } with values in order",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Structs cannot be initialized at declaration",
            misconceptionTag: "no_init_confusion",
          },
          {
            label: "D",
            text: "Using new keyword",
            misconceptionTag: "cpp_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Similar to array initialization.",
        detailedHint:
          "struct Point p = {10, 20}; initializes members in order.",
        explanation:
          "Struct variables can be initialized with brace-enclosed values in member order.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "hard",
        orderNo: 9,
        questionText: "What is a bit field in a struct?",
        options: [
          {
            label: "A",
            text: "A field that stores only 0 or 1",
            misconceptionTag: "binary_confusion",
          },
          {
            label: "B",
            text: "A member specifying the number of bits it occupies",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "A pointer to a bit",
            misconceptionTag: "pointer_confusion",
          },
          {
            label: "D",
            text: "A member limited to char type",
            misconceptionTag: "char_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "Useful for memory-efficient flags.",
        detailedHint: "struct { unsigned int flag : 1; } uses 1 bit for flag.",
        explanation:
          "Bit fields specify the exact number of bits a member occupies in a struct.",
      },
      {
        concept: "Structures & Unions",
        difficulty: "hard",
        orderNo: 10,
        questionText:
          "When only one union member is used at a time, what risk exists?",
        options: [
          {
            label: "A",
            text: "Memory leak",
            misconceptionTag: "memory_leak_confusion",
          },
          {
            label: "B",
            text: "Reading a member other than the last written causes undefined behavior",
            misconceptionTag: "",
          },
          {
            label: "C",
            text: "Compile error if wrong member accessed",
            misconceptionTag: "compile_error_confusion",
          },
          {
            label: "D",
            text: "Automatic type conversion",
            misconceptionTag: "type_conv_confusion",
          },
        ],
        correctAnswer: "B",
        hint: "All members share the same memory space.",
        detailedHint:
          "Writing to one union member then reading another reinterprets the bytes.",
        explanation:
          "Reading a union member other than the one last written leads to undefined behavior in C.",
      },
    ];

    for (const q of module10Questions) {
      await Question.create({ module: module10._id, ...q, isActive: true });
    }

    console.log("Seed completed: 10 modules × 10 questions each.");
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
