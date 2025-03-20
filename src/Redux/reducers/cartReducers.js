export const addToCart = (state, action) => {
  const newItem = action.payload;
  const existingItemIndex = state.Carts.findIndex(
    (item) => item.id === newItem.id
  );

  console.log("newI Item in redes is , ", newItem);
  if (existingItemIndex !== -1) {
    let inCartItemTemp = state.Carts[existingItemIndex];
    inCartItemTemp.quantity++;
    inCartItemTemp.totalPrice += parseInt(newItem.sellPrice);

    state.Carts[existingItemIndex] = inCartItemTemp;
    console.log("newItem is , ", newItem);
    state.totalPrice += parseInt(newItem.sellPrice);
    state.totalQuantity++;
  } else {
    state.Carts.push({
      ...newItem,
      sellPrice: parseInt(newItem.sellPrice),
      costPrice: parseInt(newItem.costPrice),
      totalPrice: parseInt(newItem.sellPrice),
      quantity: 1,
      // id: newItem.id,
      // Name: newItem.name,
      // Price: newItem.sellPrice,
      // quantity: 1,
      // totalPrice: newItem.Price,
    });
    state.totalPrice += parseInt(newItem.sellPrice);
    state.totalQuantity++;
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const removeFromCart = (state, action) => {
  const cartItem = action.payload;
  console.log("remove payload , ", cartItem);
  state.Carts = state.Carts.filter((item) => item.id !== cartItem.id);
  if (cartItem) {
    state.totalPrice -= cartItem.totalPrice;
    state.totalQuantity -= cartItem.quantity;
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const applyDiscount = (state, action) => {
  const discountAmount = action.payload;
  state.discount = discountAmount;
  if (discountAmount > 0 && discountAmount <= state.totalPrice) {
    state.afterdiscount = state.totalPrice - discountAmount;
  } else {
    state.afterdiscount = state.totalPrice;
  }
  if (state.PartiallyAmount > 0 && state.PartiallyAmount <= state.totalPrice) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const applyPartiallyAmount = (state, action) => {
  const Partiallyvalue = action.payload;
  state.PartiallyAmount = Partiallyvalue;
  console.log("partially value in redux is , ", Partiallyvalue);
  if (Partiallyvalue > 0 && Partiallyvalue <= state.totalPrice) {
    console.log("under if");
    if (state.discount > 0) {
      state.afterdiscount = Math.max(
        state.totalPrice - state.discount - Partiallyvalue,
        0
      );
    } else {
      state.afterdiscount = Math.max(state.totalPrice - Partiallyvalue, 0);
    }
  } else if (Partiallyvalue === 0 || Partiallyvalue == null) {
    console.log("under if else");
    console.log("redux 12");
    if (state.discount > 0) {
      console.log("redux 13");
      state.afterdiscount = state.totalPrice - state.discount;
    } else {
      console.log("redux 14");
      state.afterdiscount = state.totalPrice;
      console.log("under else ", state.afterdiscount);
    }
  } else {
    if (state.PartiallyAmount < state.totalPrice) {
      state.afterdiscount = state.totalPrice;
    }
  }
  state.afterdiscount = Math.max(state.afterdiscount, 0);
};

export const incrementQuantity = (state, action) => {
  let item = action.payload;

  console.log("payload is , ", item);

  const existingItemIndex = state.Carts.findIndex(
    (cartItem) => cartItem?.id === item?.id
  );

  // const finditem = state.Carts.find((item) => item.id === itemId);
  if (item) {
    const newItem = {
      ...item,
      quantity: item.quantity + 1,
      totalPrice: item.totalPrice + item.sellPrice,
    };
    // item.quantity++;
    // item.totalPrice += item.sellPrice;
    state.totalPrice += item.sellPrice;
    state.totalQuantity++;

    state.Carts[existingItemIndex] = newItem;
    // inCartItemTemp.quantity++;
    // inCartItemTemp.totalPrice += parseInt(newItem.sellPrice);

    // state.Carts[existingItemIndex] = inCartItemTemp;
    // console.log("newItem is , ", newItem)
    // state.totalPrice += parseInt(newItem.sellPrice);
    // state.totalQuantity++;
  }

  state.afterdiscount = state.totalPrice - state.discount;
  if (state.PartiallyAmount > 0) {
    state.afterdiscount -= state.PartiallyAmount;
    state.afterdiscount = Math.max(state.afterdiscount, 0);
  }
};

export const decreaseQuantity = (state, action) => {
  const cartItem = action.payload;
  const founditemIndex = state.Carts.findIndex(
    (item) => item.id === cartItem.id
  );

  if (founditemIndex !== -1) {
    const newItem = {
      ...cartItem,
      quantity: cartItem.quantity - 1,
      totalPrice: cartItem.totalPrice - cartItem.sellPrice,
    };

    state.totalQuantity--;
    state.totalPrice -= cartItem.sellPrice;

    state.Carts[founditemIndex] = newItem;
  }

  // Recalculate afterdiscount
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
};
