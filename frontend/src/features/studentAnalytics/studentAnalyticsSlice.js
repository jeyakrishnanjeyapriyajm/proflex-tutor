import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchStudentAnalytics = createAsyncThunk(
  "studentAnalytics/fetchStudentAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/student/analytics");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load student analytics"
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: "",
};

const studentAnalyticsSlice = createSlice({
  name: "studentAnalytics",
  initialState,
  reducers: {
    clearStudentAnalyticsError: (state) => {
      state.error = "";
    },
    resetStudentAnalytics: (state) => {
      state.data = null;
      state.loading = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAnalytics.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchStudentAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = "";
      })
      .addCase(fetchStudentAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load student analytics";
      });
  },
});

export const { clearStudentAnalyticsError, resetStudentAnalytics } =
  studentAnalyticsSlice.actions;

export default studentAnalyticsSlice.reducer;