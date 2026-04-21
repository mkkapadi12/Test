import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseAPI } from "./course.api";

const initialState = {
  courses: [],
  loading: false,
  error: null,
};

export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (course, { rejectWithValue }) => {
    try {
      const response = await courseAPI.createCourse(course);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getAllCourses = createAsyncThunk(
  "course/getAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getAllCourses();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseAPI.deleteCourse(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          (course) => course._id !== action.payload._id,
        );
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
