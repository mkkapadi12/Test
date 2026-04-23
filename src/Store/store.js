import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./features/admin/admin.auth.slice";
import userSlice from "./features/user/user.auth.slice";
import productSlice from "./features/product/admin.product.slice";
import cartSlice from "./features/cart/cart.slice";
import courseSlice from "./features/course/course.slice";
import enrollmentSlice from "./features/enrollment/enrollment.slice";
import instructorSlice from "./features/instructor/instructor.auth.slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    instructor: instructorSlice,
    admin: adminSlice,
    products: productSlice,
    cart: cartSlice,
    course: courseSlice,
    enrollment: enrollmentSlice,
  },
});
