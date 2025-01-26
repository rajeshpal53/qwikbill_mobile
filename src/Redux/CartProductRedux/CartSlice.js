import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Carts: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const itemIndex = state.Carts.find((item) => item.id === newItem.id);

      if (itemIndex) {
        // If item is already in the cart, update its quantity and totalPrice
        itemIndex.quantity++;
        itemIndex.totalPrice += newItem.Price;

        // Update total price and quantity
        state.totalPrice += newItem.Price;
        state.totalQuantity++;
      } else {
        // If item is not in the cart, add it
        state.Carts.push({
          id: newItem.id,
          Name: newItem.Name,
          Price: newItem.Price,
          quantity: 1,
          totalPrice: newItem.Price,
        });

        // Update total price and quantity
        state.totalPrice += newItem.Price;
        state.totalQuantity++;
      }
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      const finditem = state.Carts.find((item) => item.id === itemId);
      if (finditem) {
        state.totalPrice -= finditem.totalPrice;
        state.totalQuantity -= finditem.totalQuantity;
        state.Carts = state.Carts.filter((item) => item.id !== itemId);
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
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decreaseQuantity } = CartSlice.actions;
export default CartSlice.reducer;
