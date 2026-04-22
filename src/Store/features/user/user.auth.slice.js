import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUserProfileAPI,
  loginUserAPI,
  registerUserAPI,
} from "./user.auth.api";

const initialState = {
  user: null,
  token: localStorage.getItem("usertestToken") || null,
  loading: false,
  error: null,
};

// REGISTER USER
export const registerUser = createAsyncThunk(
  "userAuth/register",
  async (data, { rejectWithValue }) => {
    try {
      const result = await registerUserAPI(data);
      return result;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed",
      );
    }
  },
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  "userAuth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await loginUserAPI(data);
      localStorage.setItem("usertestToken", result.token);

      await dispatch(getUserProfile());

      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || "Login Failed!");
    }
  },
);

// GET USER PROFILE
export const getUserProfile = createAsyncThunk(
  "userAuth/profile",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserProfileAPI();
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch profile",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("usertestToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // localStorage.removeItem("usertestToken");
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
