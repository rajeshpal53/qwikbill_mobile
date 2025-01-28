import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const ProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state, action) {
      state.products = action.payload;
    },
    setProductitem(state, action) {
      state.products = action.payload;
    },
  },
});

export const { setProduct, setProductitem } = ProductSlice.actions;
export default ProductSlice.reducer;
