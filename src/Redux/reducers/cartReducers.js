export const addToCart = (state, action) => {
    const newItem = action.payload;
    const existingItemIndex = state.Carts.findIndex((item) => item.id === newItem.id);
    if (existingItemIndex !== -1) {
      let inCartItemTemp = state.Carts[existingItem];
      inCartItemTemp.quantity++;
      inCartItemTemp.totalPrice += newItem.sellPrice;
      state.totalPrice += newItem.sellPrice;
      state.totalQuantity++;
    } else {

      state.Carts.push({
        ...newItem,
        totalPrice : newItem.sellPrice,
        quantity: 1,
        // id: newItem.id,
        // Name: newItem.name,
        // Price: newItem.sellPrice,
        // quantity: 1,
        // totalPrice: newItem.Price,
      });
      state.totalPrice += newItem.sellPrice;
      state.totalQuantity++;
    }

    state.afterdiscount = state.totalPrice - state.discount;
    if (state.PartiallyAmount > 0) {
      state.afterdiscount -= state.PartiallyAmount;
      state.afterdiscount = Math.max(state.afterdiscount, 0);
    }
  }

  export const removeFromCart = (state, action) => {
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
  }

  export const applyDiscount = (state, action) => {
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
  }

  export const applyPartiallyAmount = (state, action) => {
    const Partiallyvalue = action.payload;
    state.PartiallyAmount = Partiallyvalue;
    if (Partiallyvalue > 0 && Partiallyvalue <= state.totalPrice) {
      if (state.discount > 0) {
        state.afterdiscount = Math.max(state.totalPrice - state.discount - Partiallyvalue, 0);
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
  }

  export const incrementQuantity = (state, action) => {
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
  }

  export const decreaseQuantity = (state, action) => {
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
  }

  export const clearCart = (state) => {
    state.Carts = [];
    state.totalPrice = 0;
    state.totalQuantity = 0;
    state.discount = 0;
    state.afterdiscount = 0;
    state.PartiallyAmount = 0;
    state.PartiallyAmountValue = 0;
  }