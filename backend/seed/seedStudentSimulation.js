require("dotenv").config();

const connectDB = require("../config/db");

const User = require("../models/User");
const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const QuestionAttempt = require("../models/QuestionAttempt");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const StudentConceptMastery = require("../models/StudentConceptMastery");
const DecisionLog = require("../models/DecisionLog");

const STUDENT_COUNT = 50;
const PASSWORD = "123456";

const BKT = {
  pL0: 0.3,
  pT: 0.12,
  pG: 0.2,
  pS: 0.1,
};

const EXPECTED_TIME = {
  easy: 45,
  medium: 90,
  hard: 150,
};

const students = [
  { name: "Aarav Sanjeev", email: "aarav.sanjeev01@gmail.com" },
  { name: "Abinaya Rajkumar", email: "abinaya.rajkumar02@gmail.com" },
  { name: "Ahamed Rifky", email: "ahamed.rifky03@gmail.com" },
  { name: "Akash Tharmarajah", email: "akash.tharmarajah04@gmail.com" },
  { name: "Amaya Perera", email: "amaya.perera05@gmail.com" },
  { name: "Anjali Sivakumar", email: "anjali.sivakumar06@gmail.com" },
  { name: "Arjun Nadarajah", email: "arjun.nadarajah07@gmail.com" },
  { name: "Ashani Fernando", email: "ashani.fernando08@gmail.com" },
  { name: "Bavishan Kumar", email: "bavishan.kumar09@gmail.com" },
  { name: "Dilani Wijesinghe", email: "dilani.wijesinghe10@gmail.com" },
  { name: "Dinesh Yogarajah", email: "dinesh.yogarajah11@gmail.com" },
  { name: "Farzana Fathima", email: "farzana.fathima12@gmail.com" },
  { name: "Gayan Madushan", email: "gayan.madushan13@gmail.com" },
  { name: "Harini Prasanna", email: "harini.prasanna14@gmail.com" },
  { name: "Hasini Jayawardena", email: "hasini.jayawardena15@gmail.com" },
  { name: "Imran Ahamed", email: "imran.ahamed16@gmail.com" },
  { name: "Ishara Lakmal", email: "ishara.lakmal17@gmail.com" },
  { name: "Janani Kirushan", email: "janani.kirushan18@gmail.com" },
  { name: "Kajan Theeban", email: "kajan.theeban19@gmail.com" },
  { name: "Kavindi Silva", email: "kavindi.silva20@gmail.com" },
  { name: "Keshan Pradeep", email: "keshan.pradeep21@gmail.com" },
  { name: "Kishani Rajendran", email: "kishani.rajendran22@gmail.com" },
  { name: "Kogila Vigneswaran", email: "kogila.vigneswaran23@gmail.com" },
  { name: "Lahiru Nuwan", email: "lahiru.nuwan24@gmail.com" },
  { name: "Lavanya Sivapalan", email: "lavanya.sivapalan25@gmail.com" },
  { name: "Madhushan Perera", email: "madhushan.perera26@gmail.com" },
  { name: "Malith Bandara", email: "malith.bandara27@gmail.com" },
  { name: "Meera Sathees", email: "meera.sathees28@gmail.com" },
  { name: "Mohamed Azeem", email: "mohamed.azeem29@gmail.com" },
  { name: "Naveen Raj", email: "naveen.raj30@gmail.com" },
  { name: "Nethmi Dissanayake", email: "nethmi.dissanayake31@gmail.com" },
  { name: "Niroshan Prakash", email: "niroshan.prakash32@gmail.com" },
  { name: "Nivetha Suresh", email: "nivetha.suresh33@gmail.com" },
  { name: "Pavithra Selvarajah", email: "pavithra.selvarajah34@gmail.com" },
  { name: "Praveen Tharshan", email: "praveen.tharshan35@gmail.com" },
  { name: "Priyanka Yogeswaran", email: "priyanka.yogeswaran36@gmail.com" },
  { name: "Ramesh Kannan", email: "ramesh.kannan37@gmail.com" },
  { name: "Rashmi Fernando", email: "rashmi.fernando38@gmail.com" },
  { name: "Ravindu Lakshan", email: "ravindu.lakshan39@gmail.com" },
  { name: "Rifna Shazna", email: "rifna.shazna40@gmail.com" },
  { name: "Roshini Karthik", email: "roshini.karthik41@gmail.com" },
  { name: "Sahan Maduranga", email: "sahan.maduranga42@gmail.com" },
  { name: "Sanjana De Silva", email: "sanjana.desilva43@gmail.com" },
  { name: "Sathya Ruban", email: "sathya.ruban44@gmail.com" },
  { name: "Shalini Mahendran", email: "shalini.mahendran45@gmail.com" },
  { name: "Tharindu Sampath", email: "tharindu.sampath46@gmail.com" },
  { name: "Tharushi Nimesha", email: "tharushi.nimesha47@gmail.com" },
  { name: "Thivya Kugathasan", email: "thivya.kugathasan48@gmail.com" },
  { name: "Yalini Kanesh", email: "yalini.kanesh49@gmail.com" },
  { name: "Zahra Naleefa", email: "zahra.naleefa50@gmail.com" },
];

const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

const round = (value, digits = 2) => {
  return Number((Number(value) || 0).toFixed(digits));
};

const getMasteryLevel = (probability) => {
  if (probability >= 0.7) return "high";
  if (probability >= 0.4) return "medium";
  return "low";
};

const updateBKT = (prior, isCorrect) => {
  let posterior;

  if (isCorrect) {
    posterior =
      (prior * (1 - BKT.pS)) /
      (prior * (1 - BKT.pS) + (1 - prior) * BKT.pG);
  } else {
    posterior =
      (prior * BKT.pS) /
      (prior * BKT.pS + (1 - prior) * (1 - BKT.pG));
  }

  return clamp(posterior + (1 - posterior) * BKT.pT, 0, 1);
};

const getWrongAnswer = (correctAnswer) => {
  const labels = ["A", "B", "C", "D"].filter(
    (label) => label !== correctAnswer
  );

  return randomFrom(labels);
};

const getSupportAction = (masteryLevel, attemptNo) => {
  if (masteryLevel === "low") {
    if (attemptNo >= 3) return "explanation";

    return randomFrom([
      "simple_hint",
      "detailed_hint",
      "worked_example",
      "easier_task",
    ]);
  }

  if (masteryLevel === "medium") {
    return randomFrom(["simple_hint", "similar_task", "detailed_hint"]);
  }

  return randomFrom(["similar_task", "harder_challenge"]);
};

const getReward = ({ isCorrect, isStuck, supportAction }) => {
  if (isCorrect && !isStuck) return round(Math.random() * 0.4 + 0.6, 2);
  if (isCorrect && isStuck) return round(Math.random() * 0.4 + 0.3, 2);

  if (!isCorrect && supportAction === "explanation") {
    return round(Math.random() * 0.2 + 0.1, 2);
  }

  return round(Math.random() * 0.3 - 0.2, 2);
};

const buildDifficultyProbability = (difficulty, ability) => {
  let base = 0.65;

  if (difficulty === "easy") base = 0.82;
  if (difficulty === "medium") base = 0.65;
  if (difficulty === "hard") base = 0.45;

  return clamp(base + ability, 0.2, 0.95);
};

const getStudentAbility = (index) => {
  if (index < 15) return Math.random() * 0.15 - 0.2;
  if (index < 35) return Math.random() * 0.2 - 0.05;
  return Math.random() * 0.2 + 0.05;
};

const getStartedDate = () => {
  const daysAgo = randomNumber(2, 30);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
};

const seedStudentSimulation = async () => {
  try {
    await connectDB();

    console.log("Connected to database");

    const modules = await LearningModule.find({ isActive: true })
      .sort({ orderNo: 1 })
      .lean();

    if (!modules.length) {
      console.log("No active learning modules found. Seed modules first.");
      process.exit(1);
    }

    const questions = await Question.find({ isActive: true })
      .sort({ module: 1, orderNo: 1 })
      .lean();

    if (!questions.length) {
      console.log("No active questions found. Seed question bank first.");
      process.exit(1);
    }

    const seedEmails = students.map((student) => student.email);

    const existingSeedStudents = await User.find({
      email: { $in: seedEmails },
    }).select("_id");

    const existingStudentIds = existingSeedStudents.map((user) => user._id);

    if (existingStudentIds.length > 0) {
      console.log("Removing old simulated student data...");

      await Promise.all([
        QuestionAttempt.deleteMany({ student: { $in: existingStudentIds } }),
        StudentModuleProgress.deleteMany({
          student: { $in: existingStudentIds },
        }),
        StudentConceptMastery.deleteMany({
          student: { $in: existingStudentIds },
        }),
        DecisionLog.deleteMany({ student: { $in: existingStudentIds } }),
        User.deleteMany({ _id: { $in: existingStudentIds } }),
      ]);
    }

    await Question.updateMany(
      {},
      {
        $set: {
          correctCount: 0,
          attemptCount: 0,
        },
      }
    );

    console.log("Creating realistic fake student accounts...");

    const createdStudents = [];

    for (let i = 0; i < STUDENT_COUNT; i += 1) {
      const studentData = students[i];

      const student = await User.create({
        name: studentData.name,
        email: studentData.email,
        password: PASSWORD,
        role: "user",
        requestedRole: "user",
        roleStatus: "approved",
      });

      createdStudents.push(student);
    }

    const questionAttemptBulk = [];
    const progressBulk = [];
    const decisionLogBulk = [];
    const masteryMap = new Map();
    const questionUpdateMap = new Map();

    for (let studentIndex = 0; studentIndex < createdStudents.length; studentIndex += 1) {
      const student = createdStudents[studentIndex];
      const ability = getStudentAbility(studentIndex);

      for (const module of modules) {
        const moduleQuestions = questions
          .filter((question) => String(question.module) === String(module._id))
          .sort((a, b) => a.orderNo - b.orderNo)
          .slice(0, module.totalQuestions || 10);

        if (!moduleQuestions.length) continue;

        const shouldCompleteModule = Math.random() > 0.18;

        const questionLimit = shouldCompleteModule
          ? moduleQuestions.length
          : randomNumber(3, moduleQuestions.length);

        const selectedModuleQuestions = moduleQuestions.slice(0, questionLimit);

        let completedCount = 0;
        let correctCount = 0;
        let wrongCount = 0;
        let hintUsedCount = 0;
        let totalTimeSpentSeconds = 0;
        let overallMasteryTotal = 0;

        const completedQuestionIds = [];
        const wrongQuestionIds = [];
        const blockedQuestionIds = [];
        const blockedQuestionLogs = [];
        const conceptProgress = new Map();

        for (const question of selectedModuleQuestions) {
          const masteryKey = `${student._id}_${question.concept}`;

          if (!masteryMap.has(masteryKey)) {
            masteryMap.set(masteryKey, {
              student: student._id,
              concept: question.concept,
              masteryProbability: BKT.pL0,
              totalAttempts: 0,
              correctAttempts: 0,
              wrongAttempts: 0,
              hintUsedCount: 0,
              stuckCount: 0,
              totalTimeSeconds: 0,
              lastSupportAction: "",
              lastRecommendedDifficulty: "",
            });
          }

          const mastery = masteryMap.get(masteryKey);

          let currentMastery = mastery.masteryProbability;

          const correctProbability = buildDifficultyProbability(
            question.difficulty,
            ability + currentMastery * 0.2
          );

          let isCorrect = Math.random() < correctProbability;

          const wrongFirst = !isCorrect;
          const willRetry = wrongFirst && Math.random() > 0.25;
          const attemptsForQuestion = willRetry ? randomNumber(2, 3) : 1;

          let finalAttemptForQuestion = null;
          let finalDecisionForQuestion = null;

          for (
            let attemptIndex = 1;
            attemptIndex <= attemptsForQuestion;
            attemptIndex += 1
          ) {
            if (attemptIndex > 1) {
              isCorrect = Math.random() < correctProbability + 0.2;
            }

            const expectedTime = EXPECTED_TIME[question.difficulty] || 90;

            const timeTakenSeconds = randomNumber(
              Math.floor(expectedTime * 0.55),
              Math.floor(expectedTime * 1.95)
            );

            const hintUsed =
              !isCorrect ||
              Math.random() < (question.difficulty === "hard" ? 0.35 : 0.18);

            const isTimeStruggle = timeTakenSeconds > expectedTime * 1.4;

            const isStuck =
              !isCorrect && (attemptIndex >= 2 || hintUsed || isTimeStruggle);

            const selectedAnswer = isCorrect
              ? question.correctAnswer
              : getWrongAnswer(question.correctAnswer);

            const selectedOption = question.options.find(
              (option) => option.label === selectedAnswer
            );

            const misconceptionTag =
              selectedOption?.misconceptionTag ||
              (!isCorrect ? "concept_misunderstanding" : "");

            currentMastery = updateBKT(currentMastery, isCorrect);

            const behaviorMasteryProbability = clamp(
              currentMastery +
                (isCorrect ? 0.05 : -0.08) +
                (isStuck ? -0.08 : 0.03) +
                (hintUsed ? -0.03 : 0.02),
              0,
              1
            );

            const finalMasteryProbability = clamp(
              currentMastery * 0.7 + behaviorMasteryProbability * 0.3,
              0,
              1
            );

            const masteryLevel = getMasteryLevel(finalMasteryProbability);

            const supportAction = isStuck
              ? getSupportAction(masteryLevel, attemptIndex)
              : "";

            const nextDifficulty =
              finalMasteryProbability >= 0.7
                ? "hard"
                : finalMasteryProbability >= 0.4
                  ? "medium"
                  : "easy";

            const reward = getReward({
              isCorrect,
              isStuck,
              supportAction,
            });

            const attemptCreatedAt = new Date(
              Date.now() - randomNumber(0, 20) * 24 * 60 * 60 * 1000
            );

            const attemptRecord = {
              student: student._id,
              module: module._id,
              question: question._id,
              selectedAnswer,
              isCorrect,
              attemptNo: attemptIndex,
              timeTakenSeconds,
              hintUsed,
              isStuck,
              misconceptionTag: misconceptionTag || "unknown",
              createdAt: attemptCreatedAt,
              updatedAt: attemptCreatedAt,
            };

            const decisionRecord = {
              student: student._id,
              module: module._id,
              question: question._id,
              concept: question.concept,
              isCorrect,
              isStuck,
              stuckReason: isStuck
                ? hintUsed
                  ? "wrong_answer_with_hint"
                  : "repeated_wrong_attempt"
                : "",
              selectedAnswer,
              correctAnswer: question.correctAnswer,
              attemptNo: attemptIndex,
              timeTakenSeconds,
              hintUsed,
              misconceptionTag: misconceptionTag || "unknown",
              bktMasteryProbability: round(currentMastery, 4),
              behaviorMasteryProbability: round(behaviorMasteryProbability, 4),
              finalMasteryProbability: round(finalMasteryProbability, 4),
              masteryLevel,
              recommendedSupportAction: supportAction,
              recommendedNextDifficulty: nextDifficulty,
              qState: [
                masteryLevel,
                question.difficulty,
                isStuck ? "stuck" : "not_stuck",
                hintUsed ? "hint_used" : "no_hint",
              ],
              qAction: supportAction,
              reward,
              pythonRawResponse: {
                simulated: true,
                model: "BKT + Q-learning simulation",
                note: "Fake realistic dataset generated for dashboard testing",
                bkt: {
                  pL0: BKT.pL0,
                  pT: BKT.pT,
                  pG: BKT.pG,
                  pS: BKT.pS,
                },
              },
              status: "completed",
              createdAt: attemptCreatedAt,
              updatedAt: attemptCreatedAt,
            };

            questionAttemptBulk.push(attemptRecord);
            decisionLogBulk.push(decisionRecord);

            finalAttemptForQuestion = attemptRecord;
            finalDecisionForQuestion = decisionRecord;

            mastery.masteryProbability = finalMasteryProbability;
            mastery.totalAttempts += 1;
            mastery.correctAttempts += isCorrect ? 1 : 0;
            mastery.wrongAttempts += isCorrect ? 0 : 1;
            mastery.hintUsedCount += hintUsed ? 1 : 0;
            mastery.stuckCount += isStuck ? 1 : 0;
            mastery.totalTimeSeconds += timeTakenSeconds;
            mastery.lastSupportAction = supportAction;
            mastery.lastRecommendedDifficulty = nextDifficulty;

            totalTimeSpentSeconds += timeTakenSeconds;
            hintUsedCount += hintUsed ? 1 : 0;

            const updateKey = String(question._id);

            if (!questionUpdateMap.has(updateKey)) {
              questionUpdateMap.set(updateKey, {
                correctCount: 0,
                attemptCount: 0,
              });
            }

            const questionStats = questionUpdateMap.get(updateKey);
            questionStats.attemptCount += 1;
            questionStats.correctCount += isCorrect ? 1 : 0;
          }

          completedCount += 1;

          if (finalAttemptForQuestion?.isCorrect) {
            correctCount += 1;
            completedQuestionIds.push(question._id);
          } else {
            wrongCount += 1;
            wrongQuestionIds.push(question._id);
          }

          if (
            finalAttemptForQuestion &&
            !finalAttemptForQuestion.isCorrect &&
            finalAttemptForQuestion.isStuck
          ) {
            blockedQuestionIds.push(question._id);

            blockedQuestionLogs.push({
              question: question._id,
              reason: "Student stuck after repeated wrong attempt",
              supportAction:
                finalDecisionForQuestion?.recommendedSupportAction || "",
              blockedAt: new Date(),
            });
          }

          if (!conceptProgress.has(question.concept)) {
            conceptProgress.set(question.concept, {
              correct: 0,
              wrong: 0,
              hint: 0,
              mastery: 0,
            });
          }

          const conceptItem = conceptProgress.get(question.concept);

          conceptItem.correct += finalAttemptForQuestion?.isCorrect ? 1 : 0;
          conceptItem.wrong += finalAttemptForQuestion?.isCorrect ? 0 : 1;
          conceptItem.hint += finalAttemptForQuestion?.hintUsed ? 1 : 0;
          conceptItem.mastery = mastery.masteryProbability;

          overallMasteryTotal += mastery.masteryProbability;
        }

        const percentage =
          selectedModuleQuestions.length > 0
            ? round((correctCount / selectedModuleQuestions.length) * 100, 2)
            : 0;

        const overallMasteryScore =
          selectedModuleQuestions.length > 0
            ? round(overallMasteryTotal / selectedModuleQuestions.length, 4)
            : 0;

        const status = shouldCompleteModule ? "completed" : "in_progress";

        progressBulk.push({
          student: student._id,
          module: module._id,
          mainQuestionSequence: selectedModuleQuestions.map(
            (question) => question._id
          ),
          currentSequenceIndex: shouldCompleteModule
            ? selectedModuleQuestions.length
            : Math.max(0, selectedModuleQuestions.length - 1),
          currentOrderNo: shouldCompleteModule
            ? selectedModuleQuestions.length + 1
            : selectedModuleQuestions.length,
          currentQuestion: shouldCompleteModule
            ? null
            : selectedModuleQuestions[selectedModuleQuestions.length - 1]?._id ||
              null,
          totalQuestions: module.totalQuestions || selectedModuleQuestions.length,
          completedCount,
          correctCount,
          wrongCount,
          skippedCount: 0,
          hintUsedCount,
          score: correctCount,
          percentage,
          overallMasteryScore,
          overallMasteryLevel: getMasteryLevel(overallMasteryScore),
          conceptMastery: Array.from(conceptProgress.entries()).map(
            ([concept, item]) => ({
              concept,
              masteryScore: round(item.mastery, 4),
              masteryLevel: getMasteryLevel(item.mastery),
              correctCount: item.correct,
              wrongCount: item.wrong,
              hintUsedCount: item.hint,
              lastUpdatedAt: new Date(),
            })
          ),
          completedQuestionIds,
          wrongQuestionIds,
          skippedQuestionIds: [],
          blockedQuestionIds,
          blockedQuestionLogs,
          usedRecoveryQuestionIds: [],
          reviewUnlockAt: null,
          reviewStartedAt: null,
          reviewReason: "",
          reviewSupportAction: "",
          status,
          stuckQuestion: blockedQuestionIds[0] || null,
          lastRecommendation: {
            action: blockedQuestionLogs[0]?.supportAction || "",
            message: blockedQuestionLogs.length
              ? "AI support was triggered for stuck behavior."
              : "",
            nextQuestion: null,
          },
          totalTimeSpentSeconds,
          startedAt: getStartedDate(),
          lastActivityAt: new Date(),
          completedAt: shouldCompleteModule ? new Date() : null,
          createdAt: getStartedDate(),
          updatedAt: new Date(),
        });
      }
    }

    console.log("Saving question attempts...");
    await QuestionAttempt.insertMany(questionAttemptBulk);

    console.log("Saving student module progress...");
    await StudentModuleProgress.insertMany(progressBulk);

    console.log("Saving decision logs...");
    await DecisionLog.insertMany(decisionLogBulk);

    console.log("Saving student concept mastery...");

    const masteryBulk = Array.from(masteryMap.values()).map((item) => {
      const averageTimeSeconds =
        item.totalAttempts > 0 ? item.totalTimeSeconds / item.totalAttempts : 0;

      return {
        student: item.student,
        concept: item.concept,
        masteryProbability: round(item.masteryProbability, 4),
        masteryLevel: getMasteryLevel(item.masteryProbability),
        totalAttempts: item.totalAttempts,
        correctAttempts: item.correctAttempts,
        wrongAttempts: item.wrongAttempts,
        hintUsedCount: item.hintUsedCount,
        stuckCount: item.stuckCount,
        averageTimeSeconds: round(averageTimeSeconds, 2),
        lastSupportAction: item.lastSupportAction,
        lastRecommendedDifficulty: item.lastRecommendedDifficulty,
        lastUpdated: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await StudentConceptMastery.insertMany(masteryBulk);

    console.log("Updating question statistics...");

    const questionBulkUpdates = Array.from(questionUpdateMap.entries()).map(
      ([questionId, stats]) => ({
        updateOne: {
          filter: { _id: questionId },
          update: {
            $set: {
              correctCount: stats.correctCount,
              attemptCount: stats.attemptCount,
            },
          },
        },
      })
    );

    if (questionBulkUpdates.length > 0) {
      await Question.bulkWrite(questionBulkUpdates);
    }

    console.log("Student simulation seed completed successfully");
    console.log(`Created students: ${createdStudents.length}`);
    console.log(`Created attempts: ${questionAttemptBulk.length}`);
    console.log(`Created progress records: ${progressBulk.length}`);
    console.log(`Created decision logs: ${decisionLogBulk.length}`);
    console.log(`Created concept mastery records: ${masteryBulk.length}`);
    console.log("");
    console.log("Sample login:");
    console.log("Email: aarav.sanjeev01@progflex.test");
    console.log("Password: 123456");

    process.exit(0);
  } catch (error) {
    console.error("SEED STUDENT SIMULATION ERROR:", error);
    process.exit(1);
  }
};

seedStudentSimulation();