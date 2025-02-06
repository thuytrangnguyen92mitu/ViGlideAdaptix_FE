import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  products: [],
  cartCount: 0, // Added cartCount to the initial state
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    incrementCartCount: (state) => {
      state.cartCount += 1;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item.productId === action.payload.productId // Match by productId
      );
      if (item) {
        item.quantity += action.payload.quantity; // Update quantity if item exists
      } else {
        state.products.push(action.payload); // Add the new item
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.cartItemId === action.payload.cartItemId // Match by cartItemId
      );
      if (item) {
        item.quantity += 1; // Increase quantity by 1
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item.cartItemId === action.payload.cartItemId // Match by cartItemId
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1; // Decrease quantity by 1 if greater than 1
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.cartItemId !== action.payload.cartItemId // Remove item by cartItemId
      );
    },
    resetCart: (state) => {
      state.products = []; // Clear the cart
    },
  },
});

// Export the actions
export const {
  incrementCartCount,
  setCartCount,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  resetCart,
} = orebiSlice.actions;

// Export the reducer
export default orebiSlice.reducer;
