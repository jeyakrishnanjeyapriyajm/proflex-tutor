import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getTaskModules,
  startTaskModule,
  getCurrentTask,
  submitTaskAnswer,
} from "../../services/taskGivingService";

export const fetchTaskModules = createAsyncThunk(
  "taskGiving/fetchTaskModules",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getTaskModules();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load modules"
      );
    }
  }
);

export const startModule = createAsyncThunk(
  "taskGiving/startModule",
  async (moduleId, { rejectWithValue }) => {
    try {
      const data = await startTaskModule(moduleId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to start module"
      );
    }
  }
);

export const fetchCurrentTask = createAsyncThunk(
  "taskGiving/fetchCurrentTask",
  async (moduleId, { rejectWithValue }) => {
    try {
      const data = await getCurrentTask(moduleId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load current task"
      );
    }
  }
);

export const submitAnswer = createAsyncThunk(
  "taskGiving/submitAnswer",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await submitTaskAnswer(payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit answer"
      );
    }
  }
);

const initialState = {
  modules: [],
  selectedModule: null,
  progress: null,
  currentQuestion: null,
  result: null,
  support: null,
  qLearning: null,
  completed: false,
  loading: false,
  submitting: false,
  error: null,
};

const taskGivingSlice = createSlice({
  name: "taskGiving",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },

    clearTaskResult: (state) => {
      state.result = null;
      state.support = null;
      state.qLearning = null;
    },

    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
    },

    resetTaskGivingState: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // Load modules
      .addCase(fetchTaskModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload.modules || [];
      })
      .addCase(fetchTaskModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Start module
      .addCase(startModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startModule.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedModule = action.payload.module || state.selectedModule;
        state.progress = action.payload.progress || null;
        state.currentQuestion = action.payload.question || null;
        state.completed = false;
        state.result = null;
        state.support = null;
        state.qLearning = null;
      })
      .addCase(startModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Current task
      .addCase(fetchCurrentTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentTask.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload.progress || state.progress;
        state.currentQuestion = action.payload.question || null;
        state.completed = Boolean(action.payload.completed);
      })
      .addCase(fetchCurrentTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit answer
      .addCase(submitAnswer.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.submitting = false;

        state.result = {
          isCorrect: action.payload.isCorrect,
          isStuck: action.payload.isStuck,
          nextAction: action.payload.nextAction,
          message: action.payload.message,
          attemptNo: action.payload.attemptNo,
          misconceptionTag: action.payload.misconceptionTag,
          misconceptionExplanation: action.payload.misconceptionExplanation,
        };

        state.progress = action.payload.progress || state.progress;
        state.support = action.payload.support || null;
        state.qLearning = action.payload.qLearning || null;
        state.completed = Boolean(action.payload.completed);

        if (action.payload.nextQuestion) {
          state.currentQuestion = action.payload.nextQuestion;
        }

        if (action.payload.completed) {
          state.currentQuestion = null;
        }
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearTaskError,
  clearTaskResult,
  setSelectedModule,
  resetTaskGivingState,
} = taskGivingSlice.actions;

export default taskGivingSlice.reducer;