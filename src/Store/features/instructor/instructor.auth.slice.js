import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { INSTRUCTOR_AUTH_API } from "./instructor.auth.api";

const initialState = {
  instructor: null,
  token: localStorage.getItem("instructortestToken") || null,
  loading: false,
  error: null,
};

export const registerInstructor = createAsyncThunk(
  "instructor/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await INSTRUCTOR_AUTH_API.registerInstructor({
        name,
        email,
        password,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const loginInstructor = createAsyncThunk(
  "instructor/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await INSTRUCTOR_AUTH_API.loginInstructor({
        email,
        password,
      });
      localStorage.setItem("instructortestToken", response.token);
      await dispatch(getInstructorProfile());
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const getInstructorProfile = createAsyncThunk(
  "instructor/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await INSTRUCTOR_AUTH_API.getInstructorProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    logout: (state) => {
      state.instructor = null;
      state.token = null;
      localStorage.removeItem("instructortestToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginInstructor.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getInstructorProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInstructorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.instructor = action.payload.instructor;
      })
      .addCase(getInstructorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = instructorSlice.actions;
export default instructorSlice.reducer;
