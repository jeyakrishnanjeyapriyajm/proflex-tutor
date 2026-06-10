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

    const module = await LearningModule.create({
      name: "Input / Output",
      code: "INPUT_OUTPUT",
      description: "Basic printf and scanf MCQ practice.",
      orderNo: 1,
      totalQuestions: 10,
      isActive: true,
    });

    const questions = [
      {
        concept: "Input / Output",
        difficulty: "easy",
        orderNo: 1,
        questionText:
          "What header file must be included to use printf() and scanf()?",
        options: [
          {
            label: "A",
            text: "<stdlib.h>",
            misconceptionTag: "wrong_header",
          },
          {
            label: "B",
            text: "<stdio.h>",
            misconceptionTag: "",
          },
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
          {
            label: "B",
            text: "New Line",
            misconceptionTag: "",
          },
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
          {
            label: "B",
            text: "Address-of operator",
            misconceptionTag: "",
          },
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
    ];

    for (const question of questions) {
      await Question.create({
        module: module._id,
        ...question,
        isActive: true,
      });
    }

    console.log("Task giving seed completed");
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();