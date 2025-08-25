const toNumber = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

export const addToCart = (state, action) => {
  const newItem = action.payload;
  const existingItemIndex = state.Carts.findIndex((item) => item.id === newItem.id);
  const itemPrice = toNumber(newItem.sellPrice);
  const itemGst = (toNumber(itemPrice) * toNumber(newItem.taxRate)) / 100;
  console.log("itemPrice is ", itemGst,newItem);
  if (existingItemIndex !== -1) {
    let inCartItemTemp = state.Carts[existingItemIndex];
    inCartItemTemp.quantity++;
    inCartItemTemp.totalPrice += itemPrice;
    inCartItemTemp.gstAmount = (inCartItemTemp.gstAmount || 0) + itemGst;
    state.Carts[existingItemIndex] = inCartItemTemp;

    state.totalPrice += itemPrice;
    console.log("itemGst is ", itemGst);
    state.gstAmount += itemGst;
    state.totalQuantity++;
  } else {
    state.Carts.push({
      ...newItem,
      sellPrice: itemPrice,
      costPrice: toNumber(newItem.costPrice),
      totalPrice: itemPrice,
      quantity: 1,
      gstAmount: itemGst,
    });
    state.totalPrice += itemPrice;
    state.gstAmount += itemGst;
    state.totalQuantity++;
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const removeFromCart = (state, action) => {
  const itemId = action.payload;
  const itemToRemove = state.Carts.find((item) => item.id === itemId);

  if (itemToRemove) {
    state.totalPrice -= itemToRemove.totalPrice;
    state.gstAmount -= toNumber(itemToRemove.gstAmount);
    state.totalQuantity -= itemToRemove.quantity;
    state.Carts = state.Carts.filter((item) => item.id !== itemId);
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const applyDiscount = (state, action) => {
  const discountAmount = toNumber(action.payload);
  state.discount = discountAmount;

  if (discountAmount >= 0 && discountAmount <= state.totalPrice) {
    state.afterdiscount = state.totalPrice - discountAmount;
    state.error = false;
  } else {
    state.discount = 0;
    state.error = true;
    state.afterdiscount = state.totalPrice;
  }

  if (state.PartiallyAmount > 0 && state.PartiallyAmount <= state.totalPrice) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const applyPartiallyAmount = (state, action) => {
  const Partiallyvalue = toNumber(action.payload);
  state.PartiallyAmount = Partiallyvalue;

  if (Partiallyvalue > 0 && Partiallyvalue <= state.totalPrice) {
    if (state.discount > 0) {
      state.afterdiscount = Math.max(
        state.totalPrice - state.discount - Partiallyvalue,
        0
      );
    } else {
      state.afterdiscount = Math.max(state.totalPrice - Partiallyvalue, 0);
    }
  } else if (Partiallyvalue === 0 || Partiallyvalue == null) {
    state.afterdiscount = state.discount > 0
      ? state.totalPrice - state.discount
      : state.totalPrice;
  } else {
    if (state.PartiallyAmount < state.totalPrice) {
      state.afterdiscount = state.totalPrice;
    }
  }
  state.afterdiscount = Math.max(state.afterdiscount, 0);
};

export const incrementQuantity = (state, action) => {
  const item = action.payload;
  const existingItemIndex = state.Carts.findIndex((cartItem) => cartItem?.id === item?.id);

  if (existingItemIndex !== -1) {
    const itemPrice = toNumber(item.sellPrice);
    const itemGst = (itemPrice * toNumber(item.taxRate)) / 100;

    const newItem = {
      ...item,
      quantity: item.quantity + 1,
      totalPrice: item.totalPrice + itemPrice,
      gstAmount: (item.gstAmount || 0) + itemGst
    };

    state.totalPrice += itemPrice;
    state.gstAmount += itemGst;
    state.totalQuantity++;
    state.Carts[existingItemIndex] = newItem;
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const decreaseQuantity = (state, action) => {
  const cartItem = action.payload;
  const founditemIndex = state.Carts.findIndex((item) => item.id === cartItem.id);

  if (founditemIndex !== -1 && cartItem.quantity > 0) {
    const itemPrice = toNumber(cartItem.sellPrice);
    const itemGst = (itemPrice * toNumber(cartItem.taxRate)) / 100;

    const newItem = {
      ...cartItem,
      quantity: cartItem.quantity - 1,
      totalPrice: cartItem.totalPrice - itemPrice,
      gstAmount: (cartItem.gstAmount || 0) - itemGst
    };

    state.totalQuantity--;
    state.totalPrice -= itemPrice;
    state.gstAmount -= itemGst;
    state.Carts[founditemIndex] = newItem;
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const clearCart = (state) => {
  state.Carts = [];
  state.totalPrice = 0;
  state.totalQuantity = 0;
  state.discount = 0;
  state.afterdiscount = 0;
  state.PartiallyAmount = 0;
  state.PartiallyAmountValue = 0;
  state.gstAmount = 0;
};
