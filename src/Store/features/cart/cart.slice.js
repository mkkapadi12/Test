import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  cart: [],
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
        existingItem.itemNumber += 1;
      } else {
        state.cart.push({ ...item, itemNumber: 1 });
        toast.success("Item added to cart successfully!");
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
        state.totalAmount -= existingItem.price * existingItem.itemNumber;
      }
    },
    updateCart: (state, action) => {
      const { itemId, quantity } = action.payload;
      const existingItem = state.cart.find(
        (cartItem) => cartItem._id === itemId,
      );
      if (existingItem) {
        state.totalAmount -= existingItem.price * existingItem.itemNumber;
        existingItem.itemNumber = quantity;
        state.totalAmount += existingItem.price * existingItem.itemNumber;
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;
