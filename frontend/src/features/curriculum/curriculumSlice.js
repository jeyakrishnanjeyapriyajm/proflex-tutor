import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCurriculumModules,
  getModuleById,
} from "./curriculumApi";

export const fetchCurriculumModules = createAsyncThunk(
  "curriculum/fetchModules",
  async (_, thunkAPI) => {
    try {
      return await getCurriculumModules();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load curriculum"
      );
    }
  }
);

export const fetchModuleById = createAsyncThunk(
  "curriculum/fetchModuleById",
  async (moduleId, thunkAPI) => {
    try {
      return await getModuleById(moduleId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load module"
      );
    }
  }
);

const curriculumSlice = createSlice({
  name: "curriculum",
  initialState: {
    modules: [],
    selectedModule: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedModule: (state) => {
      state.selectedModule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurriculumModules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurriculumModules.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchCurriculumModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchModuleById.fulfilled, (state, action) => {
        state.selectedModule = action.payload;
      });
  },
});

export const { clearSelectedModule } = curriculumSlice.actions;
export default curriculumSlice.reducer;