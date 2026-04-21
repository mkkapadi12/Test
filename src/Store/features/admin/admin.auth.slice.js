import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAdminProfileAPI,
  loginAdminAPI,
  registerAdminAPI,
} from "./admin.auth.api";

const initialState = {
  admin: null,
  token: localStorage.getItem("admintestToken") || null,
  loading: false,
  error: null,
};

// REGISTER ADMIN
export const registerAdmin = createAsyncThunk(
  "adminAuth/register",
  async (data, { rejectWithValue }) => {
    try {
      const result = await registerAdminAPI(data);
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

// LOGIN ADMIN
export const loginAdmin = createAsyncThunk(
  "adminAuth/login",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await loginAdminAPI(data);
      localStorage.setItem("admintestToken", result.token);

      await dispatch(getAdminProfile());

      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data?.message || "Login Failed!");
    }
  },
);

// GET ADMIN PROFILE
export const getAdminProfile = createAsyncThunk(
  "adminAuth/profile",
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminProfileAPI();
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

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("admintestToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginAdmin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // localStorage.removeItem("admintestToken");
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
