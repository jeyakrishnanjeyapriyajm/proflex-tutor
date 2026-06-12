import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAssessment: null,
  questions: [],
  result: null,
  loading: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setAssessmentLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAssessmentQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setCurrentAssessment: (state, action) => {
      state.currentAssessment = action.payload;
    },
    setAssessmentResult: (state, action) => {
      state.result = action.payload;
    },
    setAssessmentError: (state, action) => {
      state.error = action.payload;
    },
    clearAssessment: (state) => {
      state.currentAssessment = null;
      state.questions = [];
      state.result = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAssessmentLoading,
  setAssessmentQuestions,
  setCurrentAssessment,
  setAssessmentResult,
  setAssessmentError,
  clearAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;