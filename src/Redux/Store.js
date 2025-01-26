import { configureStore } from '@reduxjs/toolkit'

import CartSlice from "../Redux/CartProductRedux/CartSlice"
import ProductSlice from "../Redux/CartProductRedux/ProductSlice"

export const Store = configureStore({
  reducer:{
    cart :CartSlice,
    product :ProductSlice
  }

})