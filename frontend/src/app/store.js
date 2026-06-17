import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import curriculumReducer from "../features/curriculum/curriculumSlice";
import assessmentReducer from "../features/assessment/assessmentSlice";
import taskGivingReducer from "../features/taskGiving/taskGivingSlice";
import adminReducer from "../features/admin/adminSlice";
import studentAnalyticsReducer from "../features/studentAnalytics/studentAnalyticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    curriculum: curriculumReducer,
    assessment: assessmentReducer,
    taskGiving: taskGivingReducer,
    admin: adminReducer,
    studentAnalytics: studentAnalyticsReducer,
  },
});

export default store;