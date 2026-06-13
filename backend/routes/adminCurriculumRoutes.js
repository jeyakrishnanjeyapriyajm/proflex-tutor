// const express = require("express");

// const {
//   getCurriculumModules,
//   createCurriculumModule,
//   updateCurriculumModule,
//   deleteCurriculumModule,
//   toggleCurriculumModuleStatus,
//   getLessonsByModule,
//   createLesson,
//   updateLesson,
//   deleteLesson,
// } = require("../controllers/adminCurriculumController");

// const { protect } = require("../middlewares/authmiddleware");
// const { authorizeRoles } = require("../middlewares/rolemiddleware");

// const router = express.Router();

// router.use(protect);
// router.use(authorizeRoles("admin"));

// // Module management
// router.get("/modules", getCurriculumModules);
// router.post("/modules", createCurriculumModule);
// router.patch("/modules/:moduleId", updateCurriculumModule);
// router.delete("/modules/:moduleId", deleteCurriculumModule);
// router.patch("/modules/:moduleId/toggle-status", toggleCurriculumModuleStatus);

// // Lesson management
// router.get("/modules/:moduleId/lessons", getLessonsByModule);
// router.post("/modules/:moduleId/lessons", createLesson);
// router.patch("/lessons/:lessonId", updateLesson);
// router.delete("/lessons/:lessonId", deleteLesson);

// module.exports = router;