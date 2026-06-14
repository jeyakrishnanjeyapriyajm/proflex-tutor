import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  pendingInstructors: [],
  questions: [],
  modules: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdminUsers: (state, action) => {
      state.users = action.payload;
    },
    setPendingInstructors: (state, action) => {
      state.pendingInstructors = action.payload;
    },
    setAdminQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setAdminModules: (state, action) => {
      state.modules = action.payload;
    },
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setAdminError: (state, action) => {
      state.error = action.payload;
    },
    clearAdminState: (state) => {
      state.users = [];
      state.pendingInstructors = [];
      state.questions = [];
      state.modules = [];
      state.dashboardStats = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAdminLoading,
  setAdminUsers,
  setPendingInstructors,
  setAdminQuestions,
  setAdminModules,
  setDashboardStats,
  setAdminError,
  clearAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;