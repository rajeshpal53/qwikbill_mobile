import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Carts: [],
  totalPrice: 0,
  totalQuantity: 0,
  discount: 0,
  afterdiscount: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const itemIndex = state.Carts.find((item) => item.id === newItem.id);

      if (itemIndex) {
        itemIndex.quantity++;
        itemIndex.totalPrice += newItem.Price;
        state.totalPrice += newItem.Price;
        state.totalQuantity++;
      } else {
        state.Carts.push({
          id: newItem.id,
          Name: newItem.Name,
          Price: newItem.Price,
          quantity: 1,
          totalPrice: newItem.Price,
        });
        state.totalPrice += newItem.Price;
        state.totalQuantity++;
      }
      state.afterdiscount = state.totalPrice - state.discount;
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      const finditem = state.Carts.find((item) => item.id === itemId);
      if (finditem) {
        state.totalPrice -= finditem.totalPrice;
        state.totalQuantity -= finditem.totalQuantity;
        state.Carts = state.Carts.filter((item) => item.id !== itemId);
      }
      state.afterdiscount = state.totalPrice - state.discount;
    },
    applyDiscount(state, action) {
      const discountAmount = action.payload;
      state.discount = discountAmount;
      state.afterdiscount = state.totalPrice - discountAmount;
      if (discountAmount <= 0) {
        state.afterdiscount = state.totalPrice;
      } else if (discountAmount > state.totalPrice) {
        state.afterdiscount = state.totalPrice;
      } else {
        const discountedPrice = state.totalPrice - discountAmount;
        state.afterdiscount = discountedPrice >= 0 ? discountedPrice : 0;
      }
    },

    incrementQuantity(state, action) {
      const itemId = action.payload;
      const finditem = state.Carts.find((item) => item.id === itemId);
      if (finditem) {
        finditem.quantity++;
        finditem.totalPrice += finditem.Price;
        state.totalQuantity++;
        state.totalPrice += finditem.Price;
      }
      state.afterdiscount = state.totalPrice - state.discount;
    },
    decreaseQuantity(state, action) {
      const itemId = action.payload;
      const finditem = state.Carts.find((item) => item.id === itemId);
      if (finditem) {
        finditem.quantity--;
        finditem.totalPrice -= finditem.Price;
        state.totalQuantity--;
        state.totalPrice -= finditem.Price;
      }
      state.afterdiscount = state.totalPrice - state.discount;
    },

    clearCart: (state) => {
      state.Carts = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decreaseQuantity,
  clearCart,
  applyDiscount,
} = CartSlice.actions;
export default CartSlice.reducer;
