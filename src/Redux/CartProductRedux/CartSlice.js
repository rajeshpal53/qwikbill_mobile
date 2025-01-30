import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Carts: [],
  totalPrice: 0,
  totalQuantity: 0,

  discount: 0,
  afterdiscount: 0,

  PartiallyAmount: 0,
  PartiallyAmountValue: 0,
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
      if (state.PartiallyAmount > 0) {
        state.afterdiscount -= state.PartiallyAmount;
        state.afterdiscount = Math.max(state.afterdiscount, 0);
      }
    },

    removeFromCart(state, action) {
      const itemId = action.payload;
      const finditem = state.Carts.find((item) => item.id === itemId);
      if (finditem) {
        state.totalPrice -= finditem.totalPrice;
        state.totalQuantity -= finditem.quantity;
        state.Carts = state.Carts.filter((item) => item.id !== itemId);
      }

      state.afterdiscount = state.totalPrice - state.discount;
      if (state.PartiallyAmount > 0) {
        state.afterdiscount -= state.PartiallyAmount;
        state.afterdiscount = Math.max(state.afterdiscount, 0);
      }
    },

    applyDiscount(state, action) {
      const discountAmount = action.payload;
      state.discount = discountAmount;
      if (discountAmount > 0 && discountAmount <= state.totalPrice) {
        state.afterdiscount = state.totalPrice - discountAmount;
      } else {
        state.afterdiscount = state.totalPrice;
      }
      if (
        state.PartiallyAmount > 0 &&
        state.PartiallyAmount <= state.totalPrice
      ) {
        state.afterdiscount -= state.PartiallyAmount;
        state.afterdiscount = Math.max(state.afterdiscount, 0);
      }
    },

    applyPartiallyAmount(state, action) {
      const Partiallyvalue = action.payload;
      state.PartiallyAmount = Partiallyvalue;
      if (Partiallyvalue > 0 && Partiallyvalue <= state.totalPrice) {
        if (state.discount > 0) {
          // state.afterdiscount = Math.max(state.afterdiscount - Partiallyvalue, 0);
          state.afterdiscount =
            state.afterdiscount - (state.discount + Partiallyvalue);
        } else {
          state.afterdiscount = Math.max(state.totalPrice - Partiallyvalue, 0);
        }
      } else if (Partiallyvalue === 0 || Partiallyvalue == "null") {
        if (state.discount > 0) {
          state.afterdiscount = state.totalPrice - state.discount;
        } else {
          state.afterdiscount = state.totalPrice;
        }
      } else {
        if (state.PartiallyAmount < state.totalPrice) {
          state.afterdiscount = state.totalPrice;
        }
      }
      state.afterdiscount = Math.max(state.afterdiscount, 0);
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
      if (state.PartiallyAmount > 0) {
        state.afterdiscount -= state.PartiallyAmount;
        state.afterdiscount = Math.max(state.afterdiscount, 0);
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

      // Recalculate afterdiscount
      state.afterdiscount = state.totalPrice - state.discount;
      if (state.PartiallyAmount > 0) {
        state.afterdiscount -= state.PartiallyAmount;
        state.afterdiscount = Math.max(state.afterdiscount, 0);
      }
    },

    clearCart: (state) => {
      state.Carts = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
      state.discount = 0;
      state.afterdiscount = 0;
      state.PartiallyAmount = 0;
      state.PartiallyAmountValue = 0;
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
  applyPartiallyAmount,
} = CartSlice.actions;

export default CartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   Carts: [],
//   totalPrice: 0,
//   totalQuantity: 0,

//   discount: 0,
//   afterdiscount: 0,

//   PartiallyAmount: 0,
//   PartiallyAmountValue: 0,
// };

// const CartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action) {
//       const newItem = action.payload;
//       const itemIndex = state.Carts.find((item) => item.id === newItem.id);

//       if (itemIndex) {
//         itemIndex.quantity++;
//         itemIndex.totalPrice += newItem.Price;
//         state.totalPrice += newItem.Price;
//         state.totalQuantity++;
//       } else {
//         state.Carts.push({
//           id: newItem.id,
//           Name: newItem.Name,
//           Price: newItem.Price,
//           quantity: 1,
//           totalPrice: newItem.Price,
//         });
//         state.totalPrice += newItem.Price;
//         state.totalQuantity++;
//       }
//       state.afterdiscount = state.totalPrice - state.discount;
//     },
//     removeFromCart(state, action) {
//       const itemId = action.payload;
//       const finditem = state.Carts.find((item) => item.id === itemId);
//       if (finditem) {
//         state.totalPrice -= finditem.totalPrice;
//         state.totalQuantity -= finditem.totalQuantity;
//         state.Carts = state.Carts.filter((item) => item.id !== itemId);
//       }
//       state.afterdiscount = state.totalPrice - state.discount;
//     },

//     applyDiscount(state, action) {
//       const discountAmount = action.payload;
//       state.discount = discountAmount;
//       if (discountAmount > 0 && discountAmount <= state.totalPrice) {
//         state.afterdiscount = state.totalPrice - discountAmount;
//       } else {
//         state.afterdiscount = state.totalPrice;
//       }
//       if (state.PartiallyAmount > 0 && state.PartiallyAmount <= state.totalPrice) {
//         state.afterdiscount -= state.PartiallyAmount;
//         state.afterdiscount = Math.max(state.afterdiscount, 0);
//       }else {
//         state.afterdiscount = state.totalPrice;
//       }
//     },

//     applyPartiallyAmount(state, action) {
//       const Partiallyvalue = action.payload;
//       state.PartiallyAmount = Partiallyvalue;
//       if (Partiallyvalue > 0 && Partiallyvalue <= state.totalPrice) {
//         if (state.discount > 0) {
//           state.afterdiscount = Math.max(state.afterdiscount - Partiallyvalue, 0);
//         } else {
//           state.afterdiscount = Math.max(state.totalPrice - Partiallyvalue, 0);
//         }
//       } else if (Partiallyvalue === 0) {
//         if (state.discount > 0) {
//           state.afterdiscount = state.totalPrice - state.discount;
//         } else {
//           state.afterdiscount = state.totalPrice;
//         }
//       } else {
//         if (Partiallyvalue > state.totalPrice) {
//           state.afterdiscount = state.totalPrice;
//         }
//       }

//       state.afterdiscount = Math.max(state.afterdiscount, 0);
//     },

//     incrementQuantity(state, action) {
//       const itemId = action.payload;
//       const finditem = state.Carts.find((item) => item.id === itemId);
//       if (finditem) {
//         finditem.quantity++;
//         finditem.totalPrice += finditem.Price;
//         state.totalQuantity++;
//         state.totalPrice += finditem.Price;
//       }
//       state.afterdiscount = state.totalPrice - state.discount;
//     },
//     decreaseQuantity(state, action) {
//       const itemId = action.payload;
//       const finditem = state.Carts.find((item) => item.id === itemId);
//       if (finditem) {
//         finditem.quantity--;
//         finditem.totalPrice -= finditem.Price;
//         state.totalQuantity--;
//         state.totalPrice -= finditem.Price;
//       }
//       state.afterdiscount = state.totalPrice - state.discount;
//     },

//     clearCart: (state) => {
//       state.Carts = [];
//       state.totalPrice = 0;
//       state.totalQuantity = 0;
//       state.discount = 0;
//       state.afterdiscount = 0;
//       state.PartiallyAmount = 0;
//       state.PartiallyAmountValue = 0;
//     },
//   },
// });
// export const {
//   addToCart,
//   removeFromCart,
//   incrementQuantity,
//   decreaseQuantity,
//   clearCart,
//   applyDiscount,
//   applyPartiallyAmount,
// } = CartSlice.actions;
// export default CartSlice.reducer;
