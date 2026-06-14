const LearningModule = require("../models/LearningModule");
const Lesson = require("../models/Lesson");

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

// GET ALL MODULES
const getCurriculumModules = async (req, res) => {
  try {
    const modules = await LearningModule.find({})
      .sort({ orderNo: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: modules.length,
      modules,
    });
  } catch (error) {
    console.error("GET CURRICULUM MODULES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load curriculum modules",
      error: error.message,
    });
  }
};

// CREATE MODULE
const createCurriculumModule = async (req, res) => {
  try {
    const {
      title,
      name,
      description,
      explanation,
      orderNo,
      level,
      estimatedTime,
      totalQuestions,
      concepts,
      learningObjectives,
    } = req.body;

    const moduleTitle = title || name;

    if (!moduleTitle) {
      return res.status(400).json({
        success: false,
        message: "Module title is required",
      });
    }

    const slug = makeSlug(moduleTitle);
    const code = makeCode(moduleTitle);

    const existingModule = await LearningModule.findOne({
      $or: [{ slug }, { code }],
    });

    if (existingModule) {
      return res.status(400).json({
        success: false,
        message: "Module already exists",
      });
    }

    const module = await LearningModule.create({
      title: moduleTitle,
      name: moduleTitle,
      slug,
      code,
      description: description || "",
      explanation: explanation || description || "",
      orderNo: Number(orderNo) || 1,
      level: level || "Beginner",
      estimatedTime: estimatedTime || "30 minutes",
      totalQuestions: Number(totalQuestions) || 0,
      concepts: concepts || [],
      learningObjectives: learningObjectives || [],
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Curriculum module created successfully",
      module,
    });
  } catch (error) {
    console.error("CREATE CURRICULUM MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create curriculum module",
      error: error.message,
    });
  }
};

// UPDATE MODULE
const updateCurriculumModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await LearningModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const {
      title,
      name,
      description,
      explanation,
      orderNo,
      level,
      estimatedTime,
      totalQuestions,
      concepts,
      learningObjectives,
    } = req.body;

    const moduleTitle = title || name;

    if (moduleTitle) {
      module.title = moduleTitle;
      module.name = moduleTitle;
      module.slug = makeSlug(moduleTitle);
      module.code = makeCode(moduleTitle);
    }

    if (description !== undefined) module.description = description;
    if (explanation !== undefined) module.explanation = explanation;
    if (orderNo !== undefined) module.orderNo = Number(orderNo);
    if (level !== undefined) module.level = level;
    if (estimatedTime !== undefined) module.estimatedTime = estimatedTime;
    if (totalQuestions !== undefined) {
      module.totalQuestions = Number(totalQuestions);
    }
    if (concepts !== undefined) module.concepts = concepts;
    if (learningObjectives !== undefined) {
      module.learningObjectives = learningObjectives;
    }

    await module.save();

    return res.status(200).json({
      success: true,
      message: "Curriculum module updated successfully",
      module,
    });
  } catch (error) {
    console.error("UPDATE CURRICULUM MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update curriculum module",
      error: error.message,
    });
  }
};

// SOFT DELETE MODULE
const deleteCurriculumModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await LearningModule.findByIdAndUpdate(
      moduleId,
      { isActive: false },
      { new: true }
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Curriculum module disabled successfully",
      module,
    });
  } catch (error) {
    console.error("DELETE CURRICULUM MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete curriculum module",
      error: error.message,
    });
  }
};

// TOGGLE MODULE STATUS
const toggleCurriculumModuleStatus = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await LearningModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    module.isActive = !module.isActive;
    await module.save();

    return res.status(200).json({
      success: true,
      message: module.isActive
        ? "Module activated successfully"
        : "Module deactivated successfully",
      module,
    });
  } catch (error) {
    console.error("TOGGLE MODULE STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update module status",
      error: error.message,
    });
  }
};

// GET LESSONS BY MODULE
const getLessonsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const lessons = await Lesson.find({ module: moduleId })
      .sort({ orderNo: 1, createdAt: 1 })
      .populate("module", "title name slug code");

    return res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load lessons",
      error: error.message,
    });
  }
};

// CREATE LESSON
const createLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, description, learningOutcomes, orderNo, estimatedTime } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Lesson title is required",
      });
    }

    const module = await LearningModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const lesson = await Lesson.create({
      module: moduleId,
      title,
      slug: makeSlug(title),
      description: description || "",
      learningOutcomes: learningOutcomes || [],
      orderNo: Number(orderNo) || 1,
      estimatedTime: estimatedTime || "20 minutes",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lesson",
      error: error.message,
    });
  }
};

// UPDATE LESSON
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const { title, description, learningOutcomes, orderNo, estimatedTime } =
      req.body;

    if (title !== undefined) {
      lesson.title = title;
      lesson.slug = makeSlug(title);
    }

    if (description !== undefined) lesson.description = description;
    if (learningOutcomes !== undefined) {
      lesson.learningOutcomes = learningOutcomes;
    }
    if (orderNo !== undefined) lesson.orderNo = Number(orderNo);
    if (estimatedTime !== undefined) lesson.estimatedTime = estimatedTime;

    await lesson.save();

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lesson",
      error: error.message,
    });
  }
};

// DELETE LESSON
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { isActive: false },
      { new: true }
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson disabled successfully",
      lesson,
    });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lesson",
      error: error.message,
    });
  }
};

module.exports = {
  getCurriculumModules,
  createCurriculumModule,
  updateCurriculumModule,
  deleteCurriculumModule,
  toggleCurriculumModuleStatus,
  getLessonsByModule,
  createLesson,
  updateLesson,
  deleteLesson,
};