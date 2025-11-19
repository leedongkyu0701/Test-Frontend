import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItem: [],
    isAllSelected: true,
  },
  reducers: {
    setCartItem(state, action) {
      state.cartItem = action.payload.map(({productId : item, quantity}) => ({
        ...item,
        quantity: quantity,
        isSelected: true,
      }));
      state.isAllSelected = true;
    },

    toggleItem(state, action) {
      const id = action.payload;
      const toggleItem = state.cartItem.find((item) => item._id.toString() === id.toString());
      toggleItem.isSelected = !toggleItem.isSelected;
    },

    toggleAllItem(state) {
      const isAllSelect = !state.isAllSelected;
      state.cartItem.map((item) => (item.isSelected = isAllSelect));
      state.isAllSelected = isAllSelect;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
