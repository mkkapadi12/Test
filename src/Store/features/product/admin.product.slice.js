import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createProductAPI,
  deleteProductAPI,
  getAllproductsAPI,
} from "./admin.product.api";

const initialState = {
  products: [],
  loading: false,
  error: null,
};

export const getAllProducts = createAsyncThunk(
  "admin/products",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllproductsAPI();
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createProduct = createAsyncThunk(
  "admin/products/create",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const result = await createProductAPI(data);
      await dispatch(getAllProducts());
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "admin/products/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await deleteProductAPI(id);
      await dispatch(getAllProducts());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
