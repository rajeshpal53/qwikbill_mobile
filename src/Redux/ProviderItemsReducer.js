import {
  ADD_PROVIDER_ITEM,
  REMOVE_PROVIDER_ITEM,
  RESET_NUMBERS,
  UPDATE_PROVIDER_ITEMLIST,
  UPDATE_SINGLE_ITEM,
} from "./Constants";

const initialState = {
  providerItems: [],
  numberOfEditedItems: 0,
  numberOfAddedItems: 0,
  numberOfRemovedItems: 0,
};

export const ProviderItemsReducer = (state = initialState, action) => {
  return 0;
};
