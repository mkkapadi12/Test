import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./features/admin/admin.auth.slice";
import userSlice from "./features/user/user.auth.slice";
import productSlice from "./features/product/admin.product.slice";
import cartSlice from "./features/cart/cart.slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
    products: productSlice,
    cart: cartSlice,
  },
});
