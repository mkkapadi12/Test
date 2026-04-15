import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  cart: localStorage.getItem("testcart")
    ? JSON.parse(localStorage.getItem("testcart"))
    : [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find(
        (cartItem) => cartItem._id === item._id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
        toast.success("Item quantity increased successfully!");
        localStorage.setItem("testcart", JSON.stringify(state.cart));
      } else {
        state.cart.push({ ...item, quantity: 1 });
        toast.success("Item added to cart successfully!");
        localStorage.setItem("testcart", JSON.stringify(state.cart));
      }
      state.totalAmount += item.price;
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.cart.find(
        (cartItem) => cartItem._id === itemId,
      );
      if (existingItem) {
        toast.success("Item removed from cart successfully!");
        state.cart = state.cart.filter((cartItem) => cartItem._id !== itemId);
        state.totalAmount -= existingItem.price * existingItem.quantity;
        localStorage.setItem("testcart", JSON.stringify(state.cart));
      }
    },
    updateCart: (state, action) => {
      const { itemId, quantity } = action.payload;
      const existingItem = state.cart.find(
        (cartItem) => cartItem._id === itemId,
      );
      if (existingItem) {
        state.totalAmount -= existingItem.price * existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalAmount += existingItem.price * existingItem.quantity;
        localStorage.setItem("testcart", JSON.stringify(state.cart));
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
