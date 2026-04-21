import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { enrollmentAPI } from "./enrollment.api";

const initialState = {
  studentEnrollments: [],
  pendingRequests: [],
  allEnrollments: [],
  loading: false,
  error: null,
};

export const enroll = createAsyncThunk(
  "enrollment/enroll",
  async (courseId, { rejectWithValue, dispatch }) => {
    try {
      const response = await enrollmentAPI.enroll(courseId);
      dispatch(getMyEnrollments());
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "something went wrong",
      );
    }
  },
);

export const getAllEnrollments = createAsyncThunk(
  "enrollment/getAllEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getAllEnrollments();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "something went wrong",
      );
    }
  },
);

export const getMyEnrollments = createAsyncThunk(
  "enrollment/getMyEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "something went wrong",
      );
    }
  },
);

export const getPendingRequests = createAsyncThunk(
  "enrollment/getPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getPendingRequests();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "something went wrong",
      );
    }
  },
);

export const approveOrReject = createAsyncThunk(
  "enrollment/approveOrReject",
  async (
    { enrollmentId, status, rejectionReason },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await enrollmentAPI.approveOrReject(
        enrollmentId,
        status,
        rejectionReason,
      );
      dispatch(getMyEnrollments());
      dispatch(getPendingRequests());
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "something went wrong",
      );
    }
  },
);

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(enroll.fulfilled, (state, action) => {
        state.loading = false;
        state.studentEnrollments.push(action.payload);
        state.allEnrollments.push(action.payload);
      })
      .addCase(enroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllEnrollments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.allEnrollments = action.payload.enrollments;
      })
      .addCase(getAllEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyEnrollments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.studentEnrollments = action.payload.enrollments;
      })
      .addCase(getMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPendingRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload.enrollments;
      })
      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveOrReject.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveOrReject.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          (enrollment) => enrollment._id !== action.payload._id,
        );
        state.studentEnrollments.push(action.payload);
      })
      .addCase(approveOrReject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default enrollmentSlice.reducer;
