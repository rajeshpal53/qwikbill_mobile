import { createSlice } from "@reduxjs/toolkit";
import { setProduct as setProductReducer, setProductitem as setProductItemReducer } from "../reducers/productReducers";

const initialState = {
  products: [],
};

const ProductSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    setProduct: setProductReducer,
    setProductitem: setProductItemReducer,
  },
});

export const { setProduct, setProductitem } = ProductSlice.actions;
export default ProductSlice.reducer;
